/**
 * Cliente API para comunicación con backend NestJS REST API
 * 
 * Configuración:
 * - El backend NestJS debe estar corriendo en el puerto especificado en NEXT_PUBLIC_API_URL
 * - Por defecto: http://localhost:3000/api/v1
 * - Si usas un global prefix en NestJS (ej: app.setGlobalPrefix('api/v1')), 
 *   actualiza la variable de entorno: NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
 * 
 * CORS:
 * - Asegúrate de habilitar CORS en main.ts de NestJS:
 *   app.enableCors({ origin: 'http://localhost:3000' })
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export interface ApiError {
  message: string
  status: number
  statusCode?: number // NestJS usa 'statusCode' en respuestas de error
  error?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Normaliza la URL para evitar dobles barras
   */
  private normalizeUrl(endpoint: string): string {
    const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${base}${path}`
  }

  /**
   * Realiza una petición HTTP al backend NestJS
   * 
   * NestJS devuelve:
   * - 200/201: Objeto o array directamente
   * - 204: Sin contenido (para DELETE exitoso)
   * - 4xx/5xx: { statusCode, message, error }
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.normalizeUrl(endpoint)
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Header para ngrok
        // Si implementas autenticación JWT, agrega el token aquí:
        // 'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      // Obtener el tipo de contenido de la respuesta
      const contentType = response.headers.get('content-type') || ''
      const isHTML = contentType.includes('text/html')
      const isJSON = contentType.includes('application/json')

      // Si la respuesta no es exitosa, manejar el error
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        
        // Si recibimos HTML, no intentar parsear como JSON
        if (isHTML) {
          const text = await response.text()
          
          // Detectar errores específicos
          if (text.includes('ngrok') || text.toLowerCase().includes('cors')) {
            const origin = typeof window !== 'undefined' ? window.location.origin : 'tu-frontend'
            errorMessage = `Error CORS: El servidor ngrok está bloqueando la petición. Verifica la configuración de CORS en el backend para permitir el origen: ${origin}. URL: ${url}`
          } else if (response.status === 404) {
            errorMessage = `Endpoint no encontrado (404): ${url}. Verifica que la URL del API sea correcta.`
          } else if (response.status === 403) {
            errorMessage = `Acceso denegado (403). Posible problema de CORS o autenticación. URL: ${url}`
          } else {
            errorMessage = `El servidor devolvió HTML en lugar de JSON. Status: ${response.status}. Esto indica un problema de CORS o configuración. URL: ${url}`
          }
        } else if (isJSON) {
          // Si es JSON, intentar parsearlo
          try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorData.error || errorMessage
          } catch {
            // Si falla el parseo, usar el mensaje por defecto
          }
        } else {
          // Tipo de contenido desconocido
          errorMessage = `Tipo de contenido inesperado: ${contentType}. Status: ${response.status}. URL: ${url}`
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
        }
        throw error
      }

      // Si la respuesta es exitosa pero recibimos HTML, algo está mal
      if (isHTML) {
        const text = await response.text()
        throw {
          message: `El servidor devolvió HTML en lugar de JSON. Posible problema de CORS o URL incorrecta. URL: ${url}. Respuesta: ${text.substring(0, 200)}...`,
          status: response.status,
        } as ApiError
      }

      // NestJS DELETE con @HttpCode(204) no devuelve contenido
      if (response.status === 204) {
        return undefined as T
      }

      // Verificar que sea JSON antes de parsear
      if (!isJSON) {
        throw {
          message: `Se esperaba JSON pero se recibió: ${contentType}. URL: ${url}`,
          status: response.status,
        } as ApiError
      }

      const json = await response.json()
      // Desanidar respuestas paginadas del backend { data, meta }
      if (json && typeof json === 'object' && 'data' in json && 'meta' in json) {
        return (json as { data: T }).data
      }
      return json as T
    } catch (error) {
      // Si ya es un ApiError, relanzarlo
      if ((error as ApiError).status !== undefined) {
        throw error
      }
      
      // Si es un error de parsing JSON (SyntaxError)
      if (error instanceof SyntaxError) {
        throw {
          message: `Error al parsear JSON: El servidor devolvió una respuesta que no es JSON válido. Esto usualmente significa que el servidor está devolviendo HTML (probablemente por un problema de CORS) o XML. Error original: ${error.message}. URL: ${url}`,
          status: 0,
        } as ApiError
      }
      
      // Si es un error de red (TypeError: Failed to fetch)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: `Error de red: No se pudo conectar con el servidor. Verifica que el backend esté corriendo y accesible en: ${url}. Error: ${error.message}`,
          status: 0,
        } as ApiError
      }
      
      // Error desconocido
      throw {
        message: `Error desconocido al realizar la petición a ${url}. Error: ${error instanceof Error ? error.message : String(error)}`,
        status: 0,
      } as ApiError
    }
  }

  // Solicitud sin desanidar para conservar { data, meta }
  private async requestRaw<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.normalizeUrl(endpoint)
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
    }
    
    try {
      const response = await fetch(url, config)
      const contentType = response.headers.get('content-type') || ''
      const isHTML = contentType.includes('text/html')
      const isJSON = contentType.includes('application/json')
      
      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`
        if (isHTML) {
          const text = await response.text()
          if (text.includes('ngrok') || text.toLowerCase().includes('cors')) {
            message = `Error CORS: El servidor está bloqueando la petición. URL: ${url}`
          } else {
            message = `El servidor devolvió HTML en lugar de JSON. Status: ${response.status}. URL: ${url}`
          }
        } else if (isJSON) {
          try {
            const err = await response.json()
            message = err.message || message
          } catch {}
        }
        throw { message, status: response.status } as ApiError
      }
      
      if (isHTML) {
        throw {
          message: `El servidor devolvió HTML en lugar de JSON. URL: ${url}`,
          status: response.status,
        } as ApiError
      }
      
      if (response.status === 204) return undefined as T
      
      if (!isJSON) {
        throw {
          message: `Tipo de contenido inesperado: ${contentType}. URL: ${url}`,
          status: response.status,
        } as ApiError
      }
      
      return (await response.json()) as T
    } catch (error) {
      if ((error as ApiError).status !== undefined) {
        throw error
      }
      if (error instanceof SyntaxError) {
        throw {
          message: `Error al parsear JSON. El servidor devolvió HTML en lugar de JSON. URL: ${url}`,
          status: 0,
        } as ApiError
      }
      throw {
        message: `Error de red: ${error instanceof Error ? error.message : String(error)}. URL: ${url}`,
        status: 0,
      } as ApiError
    }
  }

  async getWithMeta<T>(endpoint: string): Promise<T> {
    return this.requestRaw<T>(endpoint, { method: 'GET' })
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_URL)

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
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Si implementas autenticación JWT, agrega el token aquí:
        // 'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        // NestJS devuelve errores en formato: { statusCode, message, error }
        let errorMessage = `HTTP error! status: ${response.status}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // Si no se puede parsear el error, usa el mensaje por defecto
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
        }
        throw error
      }

      // NestJS DELETE con @HttpCode(204) no devuelve contenido
      if (response.status === 204) {
        return undefined as T
      }

      const json = await response.json()
      // Desanidar respuestas paginadas del backend { data, meta }
      if (json && typeof json === 'object' && 'data' in json && 'meta' in json) {
        return (json as { data: T }).data
      }
      return json as T
    } catch (error) {
      if ((error as ApiError).status) {
        throw error
      }
      // Error de red o servidor no accesible
      throw {
        message: 'Network error or NestJS server is not reachable. Check if backend is running on ' + this.baseURL,
        status: 0,
      } as ApiError
    }
  }

  // Solicitud sin desanidar para conservar { data, meta }
  private async requestRaw<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
    const response = await fetch(url, config)
    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`
      try {
        const err = await response.json()
        message = err.message || message
      } catch {}
      throw { message, status: response.status } as ApiError
    }
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
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

import { apiClient } from './client'
import type { Pago, Paginated } from './types'

export const pagosApi = {
  getPaginated: async (
    params: {
      page?: number
      limit?: number
      personaId?: number | string
      estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ANULADO' | string
      proveedor?: string
      referencia?: string
      moneda?: string
      search?: string
      sortBy?: string
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Pago[]>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.personaId) q.set('personaId', String(params.personaId))
    if (params.estado) q.set('estado', params.estado)
    if (params.proveedor) q.set('proveedor', params.proveedor)
    if (params.referencia) q.set('referencia', params.referencia)
    if (params.moneda) q.set('moneda', params.moneda)
    if (params.search) q.set('search', params.search)
    if (params.sortBy) q.set('sortBy', params.sortBy)
    if (params.sortDir) q.set('sortDir', params.sortDir)
    const qs = q.toString()
    return apiClient.getWithMeta<Paginated<Pago[]>>(`/pagos${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Pago> => {
    return apiClient.get<Pago>(`/pagos/${id}`)
  },

  create: async (data: Partial<Pago> & { personaId: string; monto: number }): Promise<Pago> => {
    return apiClient.post<Pago>('/pagos', data)
  },

  update: async (id: number | string, data: Partial<Pago>): Promise<Pago> => {
    return apiClient.put<Pago>(`/pagos/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/pagos/${id}`)
  },
}

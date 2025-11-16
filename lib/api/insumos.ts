import { apiClient } from './client'
import type { Insumo, Paginated } from './types'

export const insumosApi = {
  getAll: async (): Promise<Insumo[]> => {
    return apiClient.get<Insumo[]>('/insumos')
  },

  getPaginated: async (
    params: {
      page?: number
      limit?: number
      unidad?: string
      vidaUtilDias?: number
      sortBy?: 'nombre' | 'sku' | 'unidad' | 'vidaUtilDias'
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Insumo[]>> => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.unidad) query.set('unidad', params.unidad)
    if (typeof params.vidaUtilDias === 'number') query.set('vidaUtilDias', String(params.vidaUtilDias))
    if (params.sortBy) query.set('sortBy', params.sortBy)
    if (params.sortDir) query.set('sortDir', params.sortDir)
    const qs = query.toString()
    return apiClient.getWithMeta<Paginated<Insumo[]>>(`/insumos${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Insumo> => {
    return apiClient.get<Insumo>(`/insumos/${id}`)
  },

  create: async (data: Omit<Insumo, 'id'>): Promise<Insumo> => {
    return apiClient.post<Insumo>('/insumos', data)
  },

  update: async (id: number | string, data: Partial<Insumo>): Promise<Insumo> => {
    return apiClient.put<Insumo>(`/insumos/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/insumos/${id}`)
  },

  getBajoStock: async (): Promise<Insumo[]> => {
    return apiClient.get<Insumo[]>('/insumos/bajo-stock')
  },
}

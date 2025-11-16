import { apiClient } from './client'
import type { Plato, Paginated } from './types'

export const platosApi = {
  getAll: async (): Promise<Plato[]> => {
    return apiClient.get<Plato[]>('/platos')
  },

  getPaginated: async (
    params: {
      page?: number
      limit?: number
      search?: string
      categoria?: string
      sortBy?: string
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Plato[]>> => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.categoria) query.set('categoria', params.categoria)
    if (params.sortBy) query.set('sortBy', params.sortBy)
    if (params.sortDir) query.set('sortDir', params.sortDir)
    const qs = query.toString()
    return apiClient.getWithMeta<Paginated<Plato[]>>(`/platos${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Plato> => {
    return apiClient.get<Plato>(`/platos/${id}`)
  },

  create: async (data: Omit<Plato, 'id'>): Promise<Plato> => {
    return apiClient.post<Plato>('/platos', data)
  },

  update: async (id: number | string, data: Partial<Plato>): Promise<Plato> => {
    return apiClient.put<Plato>(`/platos/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/platos/${id}`)
  },
}

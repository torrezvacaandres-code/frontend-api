import { apiClient } from './client'
import type { Menu, Paginated } from './types'

export const menusApi = {
  getAll: async (): Promise<Menu[]> => {
    return apiClient.get<Menu[]>('/menus')
  },

  getPaginated: async (
    params: {
      page?: number
      limit?: number
      fecha?: string
      comida?: 'DESAYUNO' | 'ALMUERZO' | 'CENA'
      sortBy?: string
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Menu[]>> => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.fecha) query.set('fecha', params.fecha)
    if (params.comida) query.set('comida', params.comida)
    if (params.sortBy) query.set('sortBy', params.sortBy)
    if (params.sortDir) query.set('sortDir', params.sortDir)
    const qs = query.toString()
    return apiClient.getWithMeta<Paginated<Menu[]>>(`/menus${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Menu> => {
    return apiClient.get<Menu>(`/menus/${id}`)
  },

  getSemanal: async (): Promise<Menu[]> => {
    return apiClient.get<Menu[]>('/menus/semanal')
  },

  create: async (data: Omit<Menu, 'id'>): Promise<Menu> => {
    return apiClient.post<Menu>('/menus', data)
  },

  update: async (id: number | string, data: Partial<Menu>): Promise<Menu> => {
    return apiClient.put<Menu>(`/menus/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/menus/${id}`)
  },
}

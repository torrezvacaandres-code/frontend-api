import { apiClient } from './client'
import type { ItemMenu, Paginated } from './types'

export const itemsMenuApi = {
  getPaginated: async (params: {
    page?: number
    limit?: number
    menuId?: string | number
    search?: string
    sortBy?: string
    sortDir?: 'ASC' | 'DESC'
  }): Promise<Paginated<ItemMenu[]>> => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.menuId) query.set('menuId', String(params.menuId))
    if (params.search) query.set('search', params.search)
    if (params.sortBy) query.set('sortBy', params.sortBy)
    if (params.sortDir) query.set('sortDir', params.sortDir)
    const qs = query.toString()
    return apiClient.getWithMeta<Paginated<ItemMenu[]>>(`/items-menu${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<ItemMenu> => {
    return apiClient.get<ItemMenu>(`/items-menu/${id}`)
  },

  create: async (data: Omit<ItemMenu, 'id'>): Promise<ItemMenu> => {
    return apiClient.post<ItemMenu>('/items-menu', data)
  },

  update: async (id: number | string, data: Partial<ItemMenu>): Promise<ItemMenu> => {
    return apiClient.put<ItemMenu>(`/items-menu/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete(`/items-menu/${id}`)
  },
}

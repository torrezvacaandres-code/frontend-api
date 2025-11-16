import { apiClient } from './client'
import type { Proveedor, Paginated } from './types'

export const proveedoresApi = {
  getPaginated: async (
    params: {
      page?: number
      limit?: number
      search?: string
      nombre?: string
      nit?: string
      contacto?: string
      sortBy?: string
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Proveedor[]>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.search) q.set('search', params.search)
    if (params.nombre) q.set('nombre', params.nombre)
    if (params.nit) q.set('nit', params.nit)
    if (params.contacto) q.set('contacto', params.contacto)
    if (params.sortBy) q.set('sortBy', params.sortBy)
    if (params.sortDir) q.set('sortDir', params.sortDir)
    const qs = q.toString()
    return apiClient.getWithMeta<Paginated<Proveedor[]>>(`/proveedores${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Proveedor> => {
    return apiClient.get<Proveedor>(`/proveedores/${id}`)
  },

  create: async (data: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
    return apiClient.post<Proveedor>('/proveedores', data)
  },

  update: async (id: number | string, data: Partial<Proveedor>): Promise<Proveedor> => {
    return apiClient.put<Proveedor>(`/proveedores/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/proveedores/${id}`)
  },
}

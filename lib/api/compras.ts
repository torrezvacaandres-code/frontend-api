import { apiClient } from './client'
import type { Compra, Paginated } from './types'

export const comprasApi = {
  getPaginated: async (
    params: {
      page?: number
      limit?: number
      proveedorId?: number | string
      fechaCompra?: string
      nroFactura?: string
      search?: string
      sortBy?: string
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Compra[]>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.proveedorId) q.set('proveedorId', String(params.proveedorId))
    if (params.fechaCompra) q.set('fechaCompra', params.fechaCompra)
    if (params.nroFactura) q.set('nroFactura', params.nroFactura)
    if (params.search) q.set('search', params.search)
    if (params.sortBy) q.set('sortBy', params.sortBy)
    if (params.sortDir) q.set('sortDir', params.sortDir)
    const qs = q.toString()
    return apiClient.getWithMeta<Paginated<Compra[]>>(`/compras${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Compra> => {
    return apiClient.get<Compra>(`/compras/${id}`)
  },

  create: async (data: Partial<Compra> & { proveedorId?: string; fechaCompra?: string; total?: number }): Promise<Compra> => {
    return apiClient.post<Compra>('/compras', data)
  },

  update: async (id: number | string, data: Partial<Compra>): Promise<Compra> => {
    return apiClient.put<Compra>(`/compras/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/compras/${id}`)
  },
}

import { apiClient } from './client'
import type { Reserva, Paginated } from './types'

export const reservasApi = {
  getAll: async (): Promise<Reserva[]> => {
    return apiClient.get<Reserva[]>('/reservas')
  },

  getPaginated: async (
    params: {
      page?: number
      limit?: number
      personaId?: number | string
      itemMenuId?: number | string
      estado?: string
      creadoEn?: string
      sortBy?: string
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Reserva[]>> => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.personaId) query.set('personaId', String(params.personaId))
    if (params.itemMenuId) query.set('itemMenuId', String(params.itemMenuId))
    if (params.estado) query.set('estado', params.estado)
    if (params.creadoEn) query.set('creadoEn', params.creadoEn)
    if (params.sortBy) query.set('sortBy', params.sortBy)
    if (params.sortDir) query.set('sortDir', params.sortDir)
    const qs = query.toString()
    return apiClient.getWithMeta<Paginated<Reserva[]>>(`/reservas${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Reserva> => {
    return apiClient.get<Reserva>(`/reservas/${id}`)
  },

  getByUsuario: async (usuarioId: number | string): Promise<Reserva[]> => {
    return apiClient.get<Reserva[]>(`/reservas/usuario/${usuarioId}`)
  },

  create: async (data: Omit<Reserva, 'id'>): Promise<Reserva> => {
    return apiClient.post<Reserva>('/reservas', data)
  },

  update: async (id: number | string, data: Partial<Reserva>): Promise<Reserva> => {
    return apiClient.put<Reserva>(`/reservas/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/reservas/${id}`)
  },

  confirmar: async (id: number | string): Promise<Reserva> => {
    return apiClient.post<Reserva>(`/reservas/${id}/confirmar`)
  },

  cancelar: async (id: number | string): Promise<Reserva> => {
    return apiClient.post<Reserva>(`/reservas/${id}/cancelar`)
  },
}

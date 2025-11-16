import { apiClient } from './client'
import type { Beca, Paginated } from './types'

export const becasApi = {
  getPaginated: async (
    params: {
      page?: number
      limit?: number
      personaId?: number | string
      estado?: string
      tipo?: string
      vigenteDesde?: string
      vigenteHasta?: string
      search?: string
      sortBy?: string
      sortDir?: 'ASC' | 'DESC'
    } = {}
  ): Promise<Paginated<Beca[]>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.personaId) q.set('personaId', String(params.personaId))
    if (params.estado) q.set('estado', params.estado)
    if (params.tipo) q.set('tipo', params.tipo)
    if (params.vigenteDesde) q.set('vigenteDesde', params.vigenteDesde)
    if (params.vigenteHasta) q.set('vigenteHasta', params.vigenteHasta)
    if (params.search) q.set('search', params.search)
    if (params.sortBy) q.set('sortBy', params.sortBy)
    if (params.sortDir) q.set('sortDir', params.sortDir)
    const qs = q.toString()
    return apiClient.getWithMeta<Paginated<Beca[]>>(`/becas${qs ? `?${qs}` : ''}`)
  },

  getById: async (id: number | string): Promise<Beca> => {
    return apiClient.get<Beca>(`/becas/${id}`)
  },

  create: async (data: Partial<Beca> & { personaId: string; tipo: string; estado: string; vigenteDesde: string; cuotaDiaria: number }): Promise<Beca> => {
    return apiClient.post<Beca>('/becas', data)
  },

  update: async (id: number | string, data: Partial<Beca>): Promise<Beca> => {
    return apiClient.put<Beca>(`/becas/${id}`, data)
  },

  delete: async (id: number | string): Promise<void> => {
    return apiClient.delete<void>(`/becas/${id}`)
  },
}

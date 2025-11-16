'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { reservasApi, type Reserva, type Paginated } from '@/lib/api'
import { useState } from 'react'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'

export function ReservasModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(9)
  const [estado, setEstado] = useState('')

  const { data, loading, error, refetch } = useApi<Paginated<Reserva[]>>(
    () => reservasApi.getPaginated({ page, limit, estado: estado || undefined }),
    [page, limit, estado]
  )

  if (loading) {
    return <Loading message="Cargando reservas..." />
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Reservas</h2>
          <p className="text-muted-foreground">Gestión de reservas</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={estado}
            onChange={(e) => { setPage(1); setEstado(e.target.value) }}
          >
            <option value="">Todas</option>
            <option value="RESERVADA">RESERVADA</option>
            <option value="CONFIRMADA">CONFIRMADA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
          <Button className="gap-2">
            <Plus size={18} />
            Nueva Reserva
          </Button>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay reservas registradas</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.data.map(reserva => (
            <Card key={reserva.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{reserva.usuario ?? 'Reserva'}</h3>
                  <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {reserva.fecha ?? (reserva.creadoEn ? new Date(reserva.creadoEn).toLocaleString() : '—')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {typeof reserva.cantidad === 'number' ? `${reserva.cantidad} personas` : '—'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    reserva.estado?.toUpperCase() === 'CONFIRMADA'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {reserva.estado}
                  </span>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-muted-foreground">
          Página {data?.meta.page ?? page} de {data?.meta.totalPages ?? 1} — {data?.meta.totalRecords ?? 0} resultados
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data?.meta.hasPreviousPage}
          >
            <ChevronLeft size={16} /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => (data?.meta.hasNextPage ? p + 1 : p))}
            disabled={!data?.meta.hasNextPage}
          >
            Siguiente <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

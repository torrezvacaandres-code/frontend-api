'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { insumosApi, type Insumo, type Paginated } from '@/lib/api'
import { useState } from 'react'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'

export function InsumosModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [unidad, setUnidad] = useState('')

  const { data, loading, error, refetch } = useApi<Paginated<Insumo[]>>(
    () => insumosApi.getPaginated({ page, limit, unidad: unidad || undefined }),
    [page, limit, unidad]
  )

  if (loading) {
    return <Loading message="Cargando insumos..." />
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Insumos</h2>
          <p className="text-muted-foreground">Inventario de ingredientes</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={unidad}
            onChange={(e) => { setPage(1); setUnidad(e.target.value) }}
            placeholder="Filtrar por unidad (ej: Unidad)"
            className="pl-3 pr-3 py-2 border rounded-md text-sm bg-background"
          />
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <Button className="gap-2">
            <Plus size={18} />
            Nuevo Insumo
          </Button>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay insumos registrados</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Unidad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Vida útil (días)</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map(insumo => (
                  <tr key={insumo.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm">{insumo.nombre}</td>
                    <td className="px-6 py-4 text-sm">{insumo.sku ?? '—'}</td>
                    <td className="px-6 py-4 text-sm">{insumo.unidad}</td>
                    <td className="px-6 py-4 text-sm">{typeof insumo.vidaUtilDias === 'number' ? insumo.vidaUtilDias : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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

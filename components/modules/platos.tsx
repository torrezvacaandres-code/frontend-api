'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { platosApi, type Plato, type Paginated } from '@/lib/api'
import { useState } from 'react'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'

export function PlatosModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(9)
  const [search, setSearch] = useState('')

  const { data, loading, error, refetch } = useApi<Paginated<Plato[]>>(
    () => platosApi.getPaginated({ page, limit, search: search || undefined }),
    [page, limit, search]
  )

  const handleDelete = async (id: number | string) => {
    try {
      await platosApi.delete(id)
      refetch()
    } catch (error) {
      console.error('Error al eliminar plato:', error)
    }
  }

  if (loading) {
    return <Loading message="Cargando platos..." />
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Platos</h2>
          <p className="text-muted-foreground">Gestión de platos disponibles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-muted-foreground" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="pl-8 pr-3 py-2 border rounded-md text-sm bg-background"
            />
          </div>
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
          Nuevo Plato
          </Button>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay platos registrados</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map(plato => (
            <Card key={plato.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plato.nombre}</h3>
                <p className="text-sm text-muted-foreground">{plato.descripcion}</p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs bg-muted px-2 py-1 rounded">{plato.categoria ?? 'Sin categoría'}</span>
                <span className="text-lg font-bold">
                  {typeof plato.precio === 'number' ? `$${plato.precio.toFixed(2)}` : '—'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Edit size={16} />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-2" 
                  onClick={() => handleDelete(plato.id)}
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
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

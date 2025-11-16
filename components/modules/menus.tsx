'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { menusApi, type Menu, type Paginated } from '@/lib/api'
import { useState } from 'react'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'

export function MenusModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(9)
  const [comida, setComida] = useState('')
  const [fecha, setFecha] = useState('')

  const { data, loading, error, refetch } = useApi<Paginated<Menu[]>>(
    () => menusApi.getPaginated({ page, limit, comida: (comida as any) || undefined, fecha: fecha || undefined }),
    [page, limit, comida, fecha]
  )

  if (loading) {
    return <Loading message="Cargando menús..." />
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Menús</h2>
          <p className="text-muted-foreground">Gestión de menús semanales</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={comida}
            onChange={(e) => { setPage(1); setComida(e.target.value) }}
          >
            <option value="">Todas</option>
            <option value="DESAYUNO">DESAYUNO</option>
            <option value="ALMUERZO">ALMUERZO</option>
            <option value="CENA">CENA</option>
          </select>
          <input
            type="date"
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={fecha}
            onChange={(e) => { setPage(1); setFecha(e.target.value) }}
          />
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
            Nuevo Menú
          </Button>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay menús registrados</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map(menu => (
            <Card key={menu.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">{menu.comida} — {menu.fecha}</h3>
                {menu.descripcion && (
                  <p className="text-sm text-muted-foreground mt-1">{menu.descripcion}</p>
                )}
              </div>
              <div className="space-y-2 mb-4">
                {(menu.items ?? []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">Editar Menú</Button>
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

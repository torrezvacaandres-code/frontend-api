'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Download, ChevronLeft, ChevronRight, Edit } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { comprasApi } from '@/lib/api/compras'
import type { Compra, Paginated } from '@/lib/api/types'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'

export function ComprasModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, loading, error, refetch } = useApi<Paginated<Compra[]>>(
    () => comprasApi.getPaginated({ page, limit }),
    [page, limit]
  )

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)
  const [form, setForm] = useState<{ proveedorId?: string; nroFactura?: string; fechaCompra?: string; total?: number }>({})

  const handleSave = async () => {
    if (editId) {
      await comprasApi.update(editId, form)
    } else {
      await comprasApi.create(form)
    }
    setOpen(false)
    setEditId(null)
    setForm({})
    refetch()
  }

  if (loading) return <Loading message="Cargando compras..." />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Compras</h2>
          <p className="text-muted-foreground">Registro de compras</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <Dialog open={open} onOpenChange={(v)=>{ if(!v){ setEditId(null); setForm({}); } setOpen(v) }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                {editId ? 'Editar Compra' : 'Nueva Compra'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? 'Editar Compra' : 'Crear Compra'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Proveedor ID</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.proveedorId||''} onChange={(e)=>setForm(f=>({...f, proveedorId:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Nro. Factura</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.nroFactura||''} onChange={(e)=>setForm(f=>({...f, nroFactura:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Fecha compra</label>
                  <input type="date" className="w-full mt-1 border rounded-md px-3 py-2" value={form.fechaCompra||''} onChange={(e)=>setForm(f=>({...f, fechaCompra:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Total</label>
                  <input type="number" step="0.01" className="w-full mt-1 border rounded-md px-3 py-2" value={form.total?.toString()||''} onChange={(e)=>setForm(f=>({...f, total: Number(e.target.value)}))} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay compras registradas</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Proveedor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nro. Factura</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((compra: Compra) => (
                  <tr key={compra.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm font-medium">#{compra.id}</td>
                    <td className="px-6 py-4 text-sm">{typeof compra.proveedor === 'string' ? compra.proveedor : (compra.proveedor?.nombre ?? '—')}</td>
                    <td className="px-6 py-4 text-sm">{compra.fechaCompra}</td>
                    <td className="px-6 py-4 text-sm">{compra.nroFactura ?? '—'}</td>
                    <td className="px-6 py-4 text-sm font-bold">{typeof compra.total === 'string' ? `$${Number(compra.total).toFixed(2)}` : `$${(compra.total ?? 0).toFixed(2)}`}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download size={16} />
                        Recibo
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1" onClick={()=>{ setEditId(compra.id); setForm({ proveedorId: (typeof compra.proveedor === 'string' ? '' : String(compra.proveedor?.id || '')), nroFactura: compra.nroFactura ?? '', fechaCompra: compra.fechaCompra, total: typeof compra.total === 'string' ? Number(compra.total) : (compra.total as number|undefined)}); setOpen(true) }}>
                        <Edit size={16} />
                        Editar
                      </Button>
                    </td>
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
          <Button variant="outline" size="sm" onClick={() => setPage(p=>Math.max(1,p-1))} disabled={!data?.meta.hasPreviousPage}>
            <ChevronLeft size={16} /> Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(p=>data?.meta.hasNextPage? p+1 : p)} disabled={!data?.meta.hasNextPage}>
            Siguiente <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}


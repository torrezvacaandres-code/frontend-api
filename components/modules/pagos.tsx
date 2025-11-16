'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Paginated, Pago, pagosApi } from '@/lib/api'

export function PagosModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [estado, setEstado] = useState('')

  const { data, loading, error, refetch } = useApi<Paginated<Pago[]>>(
    () => pagosApi.getPaginated({ page, limit, estado: estado || undefined }),
    [page, limit, estado]
  )

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)
  const [form, setForm] = useState<{ personaId: string; monto?: number; moneda?: string; proveedor?: string; referencia?: string; estado?: Pago['estado'] }>({ personaId: '' })

  const handleSave = async () => {
    if (!form.personaId || !form.monto) return
    if (editId) {
      await pagosApi.update(editId, form)
    } else {
      await pagosApi.create({ ...form, monto: form.monto })
    }
    setOpen(false)
    setEditId(null)
    setForm({ personaId: '' })
    refetch()
  }

  if (loading) return <Loading message="Cargando pagos..." />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Pagos</h2>
          <p className="text-muted-foreground">Registro de pagos</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={estado}
            onChange={(e) => { setPage(1); setEstado(e.target.value) }}
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="APROBADO">APROBADO</option>
            <option value="RECHAZADO">RECHAZADO</option>
            <option value="ANULADO">ANULADO</option>
          </select>
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <Dialog open={open} onOpenChange={(v)=>{ if(!v){ setEditId(null); setForm({ personaId: '' }); } setOpen(v) }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                {editId ? 'Editar Pago' : 'Nuevo Pago'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? 'Editar Pago' : 'Registrar Pago'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Persona ID</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.personaId} onChange={(e)=>setForm(f=>({...f, personaId:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Monto</label>
                  <input type="number" step="0.01" className="w-full mt-1 border rounded-md px-3 py-2" value={form.monto?.toString()||''} onChange={(e)=>setForm(f=>({...f, monto: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-sm">Moneda</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.moneda||''} onChange={(e)=>setForm(f=>({...f, moneda:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Proveedor</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.proveedor||''} onChange={(e)=>setForm(f=>({...f, proveedor:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Referencia</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.referencia||''} onChange={(e)=>setForm(f=>({...f, referencia:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Estado</label>
                  <select className="w-full mt-1 border rounded-md px-3 py-2" value={form.estado||''} onChange={(e)=>setForm(f=>({...f, estado:e.target.value as any}))}>
                    <option value="">PENDIENTE (default)</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="APROBADO">APROBADO</option>
                    <option value="RECHAZADO">RECHAZADO</option>
                    <option value="ANULADO">ANULADO</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} disabled={!form.personaId || !form.monto}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay pagos registrados</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Persona</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Monto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Moneda</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Referencia</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Creado</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((pago: Pago) => (
                  <tr key={pago.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm font-medium">{pago.personaId}</td>
                    <td className="px-6 py-4 text-sm font-bold">{typeof pago.monto === 'string' ? `$${Number(pago.monto).toFixed(2)}` : `$${(pago.monto ?? 0).toFixed(2)}`}</td>
                    <td className="px-6 py-4 text-sm">{pago.moneda ?? 'BOB'}</td>
                    <td className="px-6 py-4 text-sm">{pago.estado}</td>
                    <td className="px-6 py-4 text-sm">{pago.referencia ?? '—'}</td>
                    <td className="px-6 py-4 text-sm">{pago.creadoEn ? new Date(pago.creadoEn).toLocaleString() : '—'}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={()=>{
                          setEditId(pago.id)
                          setForm({
                            personaId: String(pago.personaId),
                            monto: typeof pago.monto === 'string' ? Number(pago.monto) : (pago.monto as number | undefined),
                            moneda: pago.moneda,
                            proveedor: pago.proveedor ?? undefined,
                            referencia: pago.referencia ?? undefined,
                            estado: pago.estado,
                          })
                          setOpen(true)
                        }}
                      >
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

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Phone, ChevronLeft, ChevronRight, Search, Edit } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Paginated, Proveedor, proveedoresApi } from '@/lib/api'

export function ProveedoresModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [search, setSearch] = useState('')

  const { data, loading, error, refetch } = useApi<Paginated<Proveedor[]>>(
    () => proveedoresApi.getPaginated({ page, limit, search: search || undefined }),
    [page, limit, search]
  )

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ nombre: string; nit?: string | null; contacto?: string | null }>({ nombre: '' })
  const [editId, setEditId] = useState<string | number | null>(null)

  const handleSave = async () => {
    if (editId) {
      await proveedoresApi.update(editId, form)
    } else {
      await proveedoresApi.create(form)
    }
    setOpen(false)
    setEditId(null)
    setForm({ nombre: '' })
    refetch()
  }

  if (loading) return <Loading message="Cargando proveedores..." />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Proveedores</h2>
          <p className="text-muted-foreground">Gestión de proveedores</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-muted-foreground" size={16} />
            <input
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value) }}
              placeholder="Buscar nombre/NIT/contacto"
              className="pl-8 pr-3 py-2 border rounded-md text-sm bg-background"
            />
          </div>
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
          <Dialog open={open} onOpenChange={(v)=>{ if(!v){ setEditId(null); setForm({ nombre: '' }); } setOpen(v) }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Nuevo Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? 'Editar Proveedor' : 'Crear Proveedor'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Nombre</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.nombre} onChange={(e)=>setForm(f=>({...f,nombre:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">NIT</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.nit||''} onChange={(e)=>setForm(f=>({...f,nit:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Contacto</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.contacto||''} onChange={(e)=>setForm(f=>({...f,contacto:e.target.value}))} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} disabled={!form.nombre.trim()}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay proveedores registrados</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.data.map(proveedor => (
            <Card key={proveedor.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold">{proveedor.nombre}</h3>
                {proveedor.contacto && <p className="text-sm text-muted-foreground">{proveedor.contacto}</p>}
              </div>
              <div className="space-y-2 mb-2 text-sm">
                {proveedor.contacto && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    {proveedor.contacto}
                  </div>
                )}
                {proveedor.nit && (
                  <div className="text-muted-foreground">NIT: <span className="font-medium text-foreground">{proveedor.nit}</span></div>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2" onClick={()=>{ setEditId(proveedor.id); setForm({ nombre: proveedor.nombre, nit: (proveedor as any).nit ?? null, contacto: proveedor.contacto ?? null }); setOpen(true); }}>
                  <Edit size={16} /> Editar
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


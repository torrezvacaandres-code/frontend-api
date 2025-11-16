'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Beca, becasApi, Paginated } from '@/lib/api'

export function BecasModule() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(9)
  const [estado, setEstado] = useState('')

  const { data, loading, error, refetch } = useApi<Paginated<Beca[]>>(
    () => becasApi.getPaginated({ page, limit, estado: estado || undefined }),
    [page, limit, estado]
  )

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)
  const [form, setForm] = useState<{ personaId: string; tipo: string; estado: string; vigenteDesde: string; vigenteHasta?: string; cuotaDiaria?: number }>({ personaId: '', tipo: '', estado: 'ACTIVA', vigenteDesde: '' })

  const handleSave = async () => {
    if (!form.personaId || !form.tipo || !form.estado || !form.vigenteDesde || !form.cuotaDiaria) return
    if (editId) {
      await becasApi.update(editId, form)
    } else {
      await becasApi.create({ ...form, cuotaDiaria: form.cuotaDiaria })
    }
    setOpen(false)
    setEditId(null)
    setForm({ personaId: '', tipo: '', estado: 'ACTIVA', vigenteDesde: '' })
    refetch()
  }

  if (loading) return <Loading message="Cargando becas..." />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Becas</h2>
          <p className="text-muted-foreground">Gestión de becas y documentos</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-2 py-2 text-sm bg-background"
            value={estado}
            onChange={(e) => { setPage(1); setEstado(e.target.value) }}
          >
            <option value="">Todas</option>
            <option value="ACTIVA">ACTIVA</option>
            <option value="INACTIVA">INACTIVA</option>
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
          <Dialog open={open} onOpenChange={(v)=>{ if(!v){ setEditId(null); setForm({ personaId: '', tipo: '', estado: 'ACTIVA', vigenteDesde: '' }); } setOpen(v) }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                {editId ? 'Editar Beca' : 'Nueva Beca'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? 'Editar Beca' : 'Crear Beca'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Persona ID</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.personaId} onChange={(e)=>setForm(f=>({...f, personaId:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Tipo</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.tipo} onChange={(e)=>setForm(f=>({...f, tipo:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Estado</label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2" value={form.estado} onChange={(e)=>setForm(f=>({...f, estado:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Vigente desde</label>
                  <input type="date" className="w-full mt-1 border rounded-md px-3 py-2" value={form.vigenteDesde} onChange={(e)=>setForm(f=>({...f, vigenteDesde:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Vigente hasta</label>
                  <input type="date" className="w-full mt-1 border rounded-md px-3 py-2" value={form.vigenteHasta||''} onChange={(e)=>setForm(f=>({...f, vigenteHasta:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm">Cuota diaria</label>
                  <input type="number" min={1} className="w-full mt-1 border rounded-md px-3 py-2" value={form.cuotaDiaria?.toString()||''} onChange={(e)=>setForm(f=>({...f, cuotaDiaria:Number(e.target.value)}))} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} disabled={!form.personaId || !form.tipo || !form.estado || !form.vigenteDesde || !form.cuotaDiaria}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!data || data.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay becas registradas</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((beca: Beca) => (
            <Card key={beca.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold">Beca #{beca.id}</h3>
              </div>
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-semibold">{beca.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <span className="font-semibold">{beca.estado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vigencia</span>
                  <span className="font-semibold">{beca.vigenteDesde} {beca.vigenteHasta ? `→ ${beca.vigenteHasta}` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuota diaria</span>
                  <span className="font-semibold">{beca.cuotaDiaria}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1">Ver Documentos</Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={()=>{
                    setEditId(beca.id)
                    setForm({
                      personaId: (beca as any).personaId ?? '',
                      tipo: beca.tipo,
                      estado: beca.estado,
                      vigenteDesde: beca.vigenteDesde,
                      vigenteHasta: beca.vigenteHasta ?? undefined,
                      cuotaDiaria: beca.cuotaDiaria,
                    })
                    setOpen(true)
                  }}
                >
                  Editar
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


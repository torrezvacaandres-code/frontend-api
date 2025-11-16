'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, CreditCard, Menu } from 'lucide-react'
import { useState } from 'react'
import { useApi } from '@/hooks/use-api'
import { menusApi, reservasApi, pagosApi } from '@/lib/api'
import type { Menu as MenuType, Reserva, Pago, Paginated } from '@/lib/api/types'
import { Loading } from '@/components/ui/loading'

interface StudentViewProps {
  onChangeRole: () => void
}

export function StudentView({ onChangeRole }: StudentViewProps) {
  const [activeTab, setActiveTab] = useState<'menus' | 'reservas' | 'pagos'>('menus')
  
  // Fetch data from API - assuming student ID is 1 for now
  const { data: menus, loading: menusLoading } = useApi<MenuType[]>(
    () => menusApi.getSemanal(),
    []
  )
  
  const { data: reservasData, loading: reservasLoading } = useApi<Paginated<Reserva[]>>(
    () => reservasApi.getByUsuario(1, { page: 1, limit: 20 }),
    []
  )
  
  const reservas = reservasData?.data || []

  const { data: pagosData, loading: pagosLoading } = useApi<Paginated<Pago[]>>(
    () => pagosApi.getPaginated({ personaId: '1', page: 1, limit: 10 }),
    []
  )

  const pagos = pagosData?.data || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mi Portal de Estudiante</h1>
            <p className="text-sm text-muted-foreground">Gestiona tus menús y reservas</p>
          </div>
          <Button
            onClick={onChangeRole}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Cambiar rol
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex gap-6 px-4">
          <button
            onClick={() => setActiveTab('menus')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'menus'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Menu size={18} />
              Menús disponibles
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'reservas'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              Mis reservas
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pagos')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'pagos'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              Mis pagos
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'menus' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Menús disponibles esta semana</h2>
            {menusLoading ? (
              <Loading message="Cargando menús..." />
            ) : !menus || menus.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No hay menús disponibles</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {menus.map((menu) => {
                  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                  const fechaDate = new Date(menu.fecha + 'T00:00:00')
                  const diaNombre = diasSemana[fechaDate.getDay()]
                  const platos = menu.itemsMenus?.map(item => item.plato?.nombre).filter(Boolean) || []
                  const precioTotal = menu.itemsMenus?.reduce((sum, item) => sum + Number(item.precio || 0), 0) || 0
                  
                  return (
                    <Card key={menu.id} className="p-4 hover:shadow-lg transition-shadow">
                      <h3 className="font-bold text-lg mb-1">{diaNombre}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{menu.comida} - {menu.fecha}</p>
                      <ul className="space-y-2 mb-4">
                        {platos.length > 0 ? (
                          platos.map((plato, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-foreground mt-1">•</span>
                              {plato}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground italic">Sin platos asignados</li>
                        )}
                      </ul>
                      <div className="border-t border-border pt-4 flex justify-between items-center">
                        <span className="font-bold">${precioTotal.toFixed(2)}</span>
                        <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                          Reservar
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservas' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Mis reservas</h2>
            {reservasLoading ? (
              <Loading message="Cargando reservas..." />
            ) : !reservas || reservas.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No tienes reservas registradas</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold">Usuario</th>
                      <th className="text-left py-3 px-4 font-semibold">Menú</th>
                      <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r) => {
                      const fecha = r.itemMenu?.menu?.fecha || r.creadoEn ? new Date(r.creadoEn as any).toLocaleDateString() : '—'
                      const usuario = r.persona?.nombreCompleto || r.usuario || '—'
                      const menuInfo = r.itemMenu?.menu ? `${r.itemMenu.menu.comida}` : 'Menú no disponible'
                      
                      return (
                        <tr key={r.id} className="border-b border-border hover:bg-muted">
                          <td className="py-3 px-4">{fecha}</td>
                          <td className="py-3 px-4">{usuario}</td>
                          <td className="py-3 px-4">{menuInfo}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              r.estado === 'CONFIRMADA' || r.estado === 'Confirmada'
                                ? 'bg-green-100 text-green-800'
                                : r.estado === 'CANCELADA' || r.estado === 'Cancelada'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {r.estado}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pagos' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Historial de pagos</h2>
            {pagosLoading ? (
              <Loading message="Cargando pagos..." />
            ) : !pagos || pagos.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No hay pagos registrados</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pagos.map((pago) => {
                  const monto = typeof pago.monto === 'string' ? Number(pago.monto) : (pago.monto ?? 0)
                  return (
                    <Card key={pago.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">${monto.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {pago.creadoEn ? new Date(pago.creadoEn).toLocaleDateString() : '—'} - {pago.moneda || 'BOB'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pago.estado === 'APROBADO'
                            ? 'bg-green-100 text-green-800'
                            : pago.estado === 'PENDIENTE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pago.estado}
                        </span>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

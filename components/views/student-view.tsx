'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, CreditCard, Menu } from 'lucide-react'
import { useState } from 'react'
import { useApi } from '@/hooks/use-api'
import { menusApi, reservasApi } from '@/lib/api'
import type { Menu as MenuType, Reserva, Pago } from '@/lib/api/types'
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
  
  const { data: reservas, loading: reservasLoading } = useApi<Reserva[]>(
    () => reservasApi.getByUsuario(1),
    []
  )

  // Mock pagos data for now (add API later if needed)
  const pagos: Pago[] = [
    { id: 1, usuario: 'Estudiante', fecha: '14/11/2025', monto: 25.00, estado: 'Pagado', metodo: 'Tarjeta crédito' },
    { id: 2, usuario: 'Estudiante', fecha: '10/11/2025', monto: 50.00, estado: 'Pagado', metodo: 'Transferencia' },
  ]

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
                {menus.map((menu) => (
                  <Card key={menu.id} className="p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-lg mb-3">{menu.dia}</h3>
                    <ul className="space-y-2 mb-4">
                      {menu.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-foreground mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-border pt-4 flex justify-between items-center">
                      <span className="font-bold">${menu.precio_total?.toFixed(2) || '5.00'}</span>
                      <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                        Reservar
                      </Button>
                    </div>
                  </Card>
                ))}
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
                      <th className="text-left py-3 px-4 font-semibold">Cantidad</th>
                      <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r) => (
                      <tr key={r.id} className="border-b border-border hover:bg-muted">
                        <td className="py-3 px-4">{r.fecha}</td>
                        <td className="py-3 px-4">{r.usuario}</td>
                        <td className="py-3 px-4">{r.cantidad}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            r.estado === 'Confirmada'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pagos' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Historial de pagos</h2>
            <div className="space-y-4">
              {pagos.map((pago) => (
                <Card key={pago.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">${pago.monto.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{pago.fecha} - {pago.metodo}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {pago.estado}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

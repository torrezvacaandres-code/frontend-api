'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, UtensilsCrossed, ShoppingCart, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { useApi } from '@/hooks/use-api'
import { menusApi, reservasApi, insumosApi, pagosApi, itemsMenuApi } from '@/lib/api'
import type { Menu as MenuType, Reserva, Insumo, Paginated, Pago, ItemMenu } from '@/lib/api/types'
import { Loading } from '@/components/ui/loading'

interface StaffViewProps {
  activeModule: string
  onModuleChange: (module: any) => void
  onChangeRole: () => void
}

export function StaffView({ onModuleChange, onChangeRole }: StaffViewProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'pos' | 'sales'>('dashboard')
  const [cart, setCart] = useState<any[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  // Fetch real data
  const { data: reservasData, loading: reservasLoading } = useApi<Paginated<Reserva[]>>(
    () => reservasApi.getPaginated({ page: 1, limit: 20 }),
    []
  )
  const { data: insumosData, loading: insumosLoading } = useApi<Paginated<Insumo[]>>(
    () => insumosApi.getPaginated({ page: 1, limit: 10 }),
    []
  )
  const { data: menusData, loading: menusLoading } = useApi<MenuType[]>(
    () => menusApi.getSemanal(),
    []
  )

  const todayReservations = reservasData?.data || []
  const inventory = insumosData?.data || []
  const menusCount = menusData?.length || 0
  const reservasCount = todayReservations.filter(r => r.estado === 'Confirmada' || r.estado === 'CONFIRMADA').length
  const insumoCritico = inventory.filter(i => Number(i.vidaUtilDias || 0) < 7).length

  const dailySchedule = [
    { time: '12:00 PM', activity: 'Servicio principal', count: `${todayReservations.length} reservas` },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Panel de Personal del Comedor</h1>
            <p className="text-sm text-muted-foreground">Gestión del servicio diario - Punto de Venta</p>
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
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto flex gap-4 px-6">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`py-4 px-4 border-b-2 font-medium transition ${
              activeSection === 'dashboard'
                ? 'border-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => setActiveSection('pos')}
            className={`py-4 px-4 border-b-2 font-medium transition ${
              activeSection === 'pos'
                ? 'border-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              Punto de Venta
            </div>
          </button>
          <button
            onClick={() => setActiveSection('sales')}
            className={`py-4 px-4 border-b-2 font-medium transition ${
              activeSection === 'sales'
                ? 'border-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              Ventas
            </div>
          </button>
          
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {reservasLoading || insumosLoading || menusLoading ? (
              <Loading message="Cargando dashboard..." />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-1">Estudiantes hoy</p>
                    <p className="text-3xl font-bold">{todayReservations.length}</p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-1">Reservas confirmadas</p>
                    <p className="text-3xl font-bold">{reservasCount}</p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-1">Menús disponibles</p>
                    <p className="text-3xl font-bold">{menusCount}</p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-1">Insumos críticos</p>
                    <p className="text-3xl font-bold text-red-600">{insumoCritico}</p>
                  </Card>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Horario de hoy
                </h2>
                <div className="space-y-3">
                  {dailySchedule.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start pb-3 border-b border-border last:border-b-0">
                      <div>
                        <p className="font-semibold text-sm">{item.activity}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <UtensilsCrossed size={20} />
                  Estado de insumos
                </h2>
                <div className="space-y-3">
                  {inventory.slice(0, 6).map((item) => {
                    const vidaUtil = Number(item.vidaUtilDias || 999)
                    const status = vidaUtil < 7 ? 'Crítico' : vidaUtil < 30 ? 'Bajo' : 'Suficiente'
                    return (
                      <div key={item.id} className="flex justify-between items-center pb-3 border-b border-border last:border-b-0">
                        <div>
                          <p className="font-medium text-sm">{item.nombre}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku || '—'}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          status === 'Crítico' || status === 'Bajo'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Ventas recientes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Estudiante</th>
                      <th className="text-left py-3 px-4 font-semibold">Menú</th>
                      <th className="text-left py-3 px-4 font-semibold">Hora</th>
                      <th className="text-left py-3 px-4 font-semibold">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayReservations.slice(0, 10).map((r) => {
                      const usuario = r.persona?.nombreCompleto || r.usuario || '—'
                      const menuInfo = r.itemMenu?.menu ? `${r.itemMenu.menu.fecha} - ${r.itemMenu.menu.comida}` : '—'
                      const fecha = r.itemMenu?.menu?.fecha || (r.creadoEn ? new Date(r.creadoEn).toLocaleDateString() : '—')
                      
                      return (
                        <tr key={r.id} className="border-b border-border hover:bg-muted">
                          <td className="py-3 px-4">{usuario}</td>
                          <td className="py-3 px-4">{menuInfo}</td>
                          <td className="py-3 px-4">{fecha}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            r.estado === 'Confirmada' || r.estado === 'CONFIRMADA'
                              ? 'bg-green-100 text-green-800'
                              : r.estado === 'Pendiente' || r.estado === 'PENDIENTE'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {r.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* POS Section */}
        {activeSection === 'pos' && (
          <PointOfSaleSection cart={cart} setCart={setCart} cartTotal={cartTotal} setCartTotal={setCartTotal} />
        )}

        {/* Sales Section */}
        {activeSection === 'sales' && (
          <SalesSection />
        )}

        
      </div>
    </div>
  )
}

function PointOfSaleSection({ cart, setCart, cartTotal, setCartTotal }: any) {
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null)
  
  // Obtener menús disponibles (hoy o semana actual)
  const { data: menusData, loading: menusLoading } = useApi<MenuType[]>(
    () => menusApi.getSemanal(),
    []
  )

  // Obtener items del menú seleccionado
  const { data: itemsMenuData, loading: itemsLoading } = useApi<Paginated<ItemMenu[]>>(
    () => selectedMenuId ? itemsMenuApi.getPaginated({ menuId: selectedMenuId, page: 1, limit: 50 }) : Promise.resolve({ 
      data: [], 
      meta: { 
        total: 0, 
        totalRecords: 0,
        page: 1, 
        limit: 50, 
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      } 
    }),
    [selectedMenuId]
  )

  const menus = menusData || []
  const itemsMenu = itemsMenuData?.data || []

  const handleAddItem = (item: ItemMenu) => {
    const existingItem = cart.find((i: any) => i.id === item.id)
    const price = Number(item.precio || 0)
    
    if (existingItem) {
      setCart(cart.map((i: any) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.plato?.nombre || 'Sin nombre',
        price: price,
        qty: 1,
        itemMenuId: item.id
      }])
    }
    setCartTotal(cartTotal + price)
  }

  const handleRemoveItem = (id: number | string) => {
    const item = cart.find((i: any) => i.id === id)
    if (item) {
      setCartTotal(cartTotal - item.price * item.qty)
    }
    setCart(cart.filter((i: any) => i.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Selector de Menú */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">1. Seleccionar Menú</h2>
          {menusLoading ? (
            <Loading message="Cargando menús..." />
          ) : menus.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No hay menús disponibles</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {menus.map((menu) => {
                const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                const fechaDate = new Date(menu.fecha + 'T00:00:00')
                const diaNombre = diasSemana[fechaDate.getDay()]
                const isSelected = selectedMenuId === String(menu.id)
                
                return (
                  <button
                    key={menu.id}
                    onClick={() => setSelectedMenuId(String(menu.id))}
                    className={`border rounded-lg p-3 text-left transition ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold text-sm">{diaNombre}</p>
                    <p className="text-xs text-muted-foreground">{menu.comida}</p>
                    <p className="text-xs text-muted-foreground">{menu.fecha}</p>
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        {/* Items del Menú seleccionado */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">2. Seleccionar Platos</h2>
          {!selectedMenuId ? (
            <p className="text-center text-muted-foreground py-8">Primero selecciona un menú</p>
          ) : itemsLoading ? (
            <Loading message="Cargando platos..." />
          ) : itemsMenu.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Este menú no tiene platos configurados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itemsMenu.map((item) => (
                <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-muted transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold">{item.plato?.nombre || 'Sin nombre'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Disponibles: {item.racionesDisponibles} / {item.racionesPlaneadas}
                      </p>
                    </div>
                    <p className="text-lg font-bold">${Number(item.precio || 0).toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => handleAddItem(item)}
                    className="w-full"
                    size="sm"
                    disabled={item.racionesDisponibles <= 0}
                  >
                    {item.racionesDisponibles > 0 ? 'Agregar al carrito' : 'Sin stock'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div>
        <Card className="p-6 sticky top-6">
          <h2 className="text-xl font-bold mb-4">Carrito</h2>
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Carrito vacío</p>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.qty} x ${item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => handleRemoveItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">
                  Completar venta
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => {
                    setCart([])
                    setCartTotal(0)
                  }}
                >
                  Limpiar carrito
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

function SalesSection() {
  const { data: pagosData, loading: pagosLoading } = useApi<Paginated<Pago[]>>(
    () => pagosApi.getPaginated({ page: 1, limit: 20 }),
    []
  )

  const sales = pagosData?.data || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Registro de ventas</h2>
          {pagosLoading ? (
            <Loading message="Cargando ventas..." />
          ) : sales.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay ventas registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold">Monto</th>
                    <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-border hover:bg-muted">
                      <td className="py-3 px-4">{sale.id}</td>
                      <td className="py-3 px-4">Cliente #{sale.personaId || '—'}</td>
                      <td className="py-3 px-4">${Number(sale.monto || 0).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sale.estado === 'APROBADO'
                            ? 'bg-green-100 text-green-800'
                            : sale.estado === 'PENDIENTE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sale.estado || 'PENDIENTE'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{sale.creadoEn ? new Date(sale.creadoEn).toLocaleDateString() : '—'}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">Ver detalles</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

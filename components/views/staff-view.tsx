'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, UtensilsCrossed, ShoppingCart, Package, ChefHat } from 'lucide-react'
import { useState } from 'react'

interface StaffViewProps {
  activeModule: string
  onModuleChange: (module: any) => void
  onChangeRole: () => void
}

export function StaffView({ onModuleChange, onChangeRole }: StaffViewProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'pos' | 'purchases' | 'preparation'>('dashboard')
  const [cart, setCart] = useState<any[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  const dailySchedule = [
    { time: '11:00 AM', activity: 'Preparación de ensaladas', count: '50 porciones' },
    { time: '12:00 PM', activity: 'Servicio principal', count: '120 estudiantes' },
    { time: '1:30 PM', activity: 'Limpieza de áreas', count: 'Completa' },
    { time: '2:00 PM', activity: 'Preparación para merienda', count: '40 porciones' },
  ]

  const todayReservations = [
    { id: 1, student: 'Juan Pérez', menu: 'Arroz con pollo', time: '12:00 PM', status: 'Confirmada' },
    { id: 2, student: 'María García', menu: 'Pasta a la boloñesa', time: '12:15 PM', status: 'Confirmada' },
    { id: 3, student: 'Carlos López', menu: 'Pechuga a la mostaza', time: '12:30 PM', status: 'Cancelada' },
    { id: 4, student: 'Ana Rodríguez', menu: 'Arroz con pollo', time: '12:45 PM', status: 'Confirmada' },
    { id: 5, student: 'Luis Martínez', menu: 'Pasta a la boloñesa', time: '1:00 PM', status: 'Pendiente' },
  ]

  const inventory = [
    { item: 'Pollo fresco', quantity: '25 kg', status: 'Suficiente' },
    { item: 'Arroz blanco', quantity: '50 kg', status: 'Suficiente' },
    { item: 'Pasta', quantity: '15 kg', status: 'Bajo' },
    { item: 'Verduras variadas', quantity: '30 kg', status: 'Suficiente' },
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
            onClick={() => setActiveSection('purchases')}
            className={`py-4 px-4 border-b-2 font-medium transition ${
              activeSection === 'purchases'
                ? 'border-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={18} />
              Compras
            </div>
          </button>
          <button
            onClick={() => setActiveSection('preparation')}
            className={`py-4 px-4 border-b-2 font-medium transition ${
              activeSection === 'preparation'
                ? 'border-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <ChefHat size={18} />
              Preparación
            </div>
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Estudiantes hoy</p>
                <p className="text-3xl font-bold">120</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Reservas confirmadas</p>
                <p className="text-3xl font-bold">115</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Menús disponibles</p>
                <p className="text-3xl font-bold">5</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Insumos críticos</p>
                <p className="text-3xl font-bold text-red-600">1</p>
              </Card>
            </div>

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
                  {inventory.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{item.item}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        item.status === 'Bajo'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Reservas de hoy</h2>
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
                    {todayReservations.map((r) => (
                      <tr key={r.id} className="border-b border-border hover:bg-muted">
                        <td className="py-3 px-4">{r.student}</td>
                        <td className="py-3 px-4">{r.menu}</td>
                        <td className="py-3 px-4">{r.time}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            r.status === 'Confirmada'
                              ? 'bg-green-100 text-green-800'
                              : r.status === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
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

        {/* Purchases Section */}
        {activeSection === 'purchases' && (
          <PurchasesSection />
        )}

        {/* Preparation Section */}
        {activeSection === 'preparation' && (
          <PreparationSection />
        )}
      </div>
    </div>
  )
}

function PointOfSaleSection({ cart, setCart, cartTotal, setCartTotal }: any) {
  const availableItems = [
    { id: 1, name: 'Arroz con pollo', price: 8.50, quantity: 0 },
    { id: 2, name: 'Pasta a la boloñesa', price: 7.50, quantity: 0 },
    { id: 3, name: 'Pechuga a la mostaza', price: 9.00, quantity: 0 },
    { id: 4, name: 'Ensalada fresca', price: 5.00, quantity: 0 },
    { id: 5, name: 'Jugo natural', price: 2.50, quantity: 0 },
    { id: 6, name: 'Postre del día', price: 3.00, quantity: 0 },
  ]

  const handleAddItem = (item: any) => {
    const existingItem = cart.find((i: any) => i.id === item.id)
    if (existingItem) {
      setCart(cart.map((i: any) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
    setCartTotal(cartTotal + item.price)
  }

  const handleRemoveItem = (id: number) => {
    const item = cart.find((i: any) => i.id === id)
    if (item) {
      setCartTotal(cartTotal - item.price * item.qty)
    }
    setCart(cart.filter((i: any) => i.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Menú disponible</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableItems.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-muted transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Stock: 50 porciones</p>
                  </div>
                  <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                </div>
                <Button
                  onClick={() => handleAddItem(item)}
                  className="w-full"
                  size="sm"
                >
                  Agregar al carrito
                </Button>
              </div>
            ))}
          </div>
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
                <Button variant="outline" className="w-full" size="sm">
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

function PurchasesSection() {
  const [newPurchase, setNewPurchase] = useState({ supplier: '', items: '', quantity: '', date: '' })
  
  const purchases = [
    { id: 1, supplier: 'Proveedor ABC', items: 'Pollo fresco', quantity: '50 kg', date: '2024-01-15', status: 'Entregado' },
    { id: 2, supplier: 'Proveedor XYZ', items: 'Arroz y granos', quantity: '100 kg', date: '2024-01-14', status: 'En tránsito' },
    { id: 3, supplier: 'Verduras del campo', items: 'Verduras variadas', quantity: '75 kg', date: '2024-01-13', status: 'Pendiente' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Registro de compras</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Proveedor</th>
                  <th className="text-left py-3 px-4 font-semibold">Artículos</th>
                  <th className="text-left py-3 px-4 font-semibold">Cantidad</th>
                  <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-4">{p.supplier}</td>
                    <td className="py-3 px-4">{p.items}</td>
                    <td className="py-3 px-4">{p.quantity}</td>
                    <td className="py-3 px-4">{p.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        p.status === 'Entregado'
                          ? 'bg-green-100 text-green-800'
                          : p.status === 'En tránsito'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">
                        Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6 sticky top-6">
          <h2 className="text-lg font-bold mb-4">Nueva compra</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Proveedor</label>
              <input
                type="text"
                placeholder="Seleccionar proveedor"
                className="w-full border border-border rounded px-3 py-2 mt-1"
                value={newPurchase.supplier}
                onChange={(e) => setNewPurchase({ ...newPurchase, supplier: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Artículos</label>
              <input
                type="text"
                placeholder="Descripción de artículos"
                className="w-full border border-border rounded px-3 py-2 mt-1"
                value={newPurchase.items}
                onChange={(e) => setNewPurchase({ ...newPurchase, items: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cantidad</label>
              <input
                type="text"
                placeholder="Ej: 50 kg"
                className="w-full border border-border rounded px-3 py-2 mt-1"
                value={newPurchase.quantity}
                onChange={(e) => setNewPurchase({ ...newPurchase, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha</label>
              <input
                type="date"
                className="w-full border border-border rounded px-3 py-2 mt-1"
                value={newPurchase.date}
                onChange={(e) => setNewPurchase({ ...newPurchase, date: e.target.value })}
              />
            </div>
            <Button className="w-full mt-4">
              Registrar compra
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function PreparationSection() {
  const ordersToPrep = [
    { id: 1, menu: 'Arroz con pollo', quantity: 45, time: '11:30 AM', priority: 'Alta', status: 'En preparación' },
    { id: 2, menu: 'Pasta a la boloñesa', quantity: 30, time: '12:00 PM', priority: 'Media', status: 'Pendiente' },
    { id: 3, menu: 'Pechuga a la mostaza', quantity: 25, time: '12:15 PM', priority: 'Media', status: 'Pendiente' },
    { id: 4, menu: 'Ensalada fresca', quantity: 50, time: '11:45 AM', priority: 'Baja', status: 'Completado' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-amber-50 border-amber-200">
        <h2 className="text-xl font-bold mb-2">Preparación en tiempo real</h2>
        <p className="text-sm text-muted-foreground">Gestiona el orden y estado de preparación de platos</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Pendientes', count: 2, color: 'bg-red-50 border-red-200' },
          { title: 'En preparación', count: 1, color: 'bg-yellow-50 border-yellow-200' },
          { title: 'Listos', count: 1, color: 'bg-green-50 border-green-200' },
          { title: 'Completados', count: 1, color: 'bg-blue-50 border-blue-200' },
        ].map((stat, idx) => (
          <Card key={idx} className={`p-6 border ${stat.color}`}>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-3xl font-bold mt-2">{stat.count}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {ordersToPrep.map((order) => (
            <div key={order.id} className={`border rounded-lg p-4 ${
              order.status === 'Completado' ? 'bg-green-50 border-green-200' : 'border-border'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-bold text-lg">{order.menu}</p>
                  <p className="text-sm text-muted-foreground">Cantidad: {order.quantity} porciones • Hora: {order.time}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${
                    order.priority === 'Alta'
                      ? 'bg-red-100 text-red-800'
                      : order.priority === 'Media'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.priority}
                  </span>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${
                    order.status === 'Pendiente'
                      ? 'bg-gray-100 text-gray-800'
                      : order.status === 'En preparación'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {order.status === 'Pendiente' && (
                  <Button size="sm">Comenzar preparación</Button>
                )}
                {order.status === 'En preparación' && (
                  <Button size="sm">Marcar como listo</Button>
                )}
                {order.status === 'Completado' && (
                  <Button size="sm" disabled variant="outline">
                    Completado ✓
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

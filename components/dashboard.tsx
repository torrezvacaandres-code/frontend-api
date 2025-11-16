import { Card } from '@/components/ui/card'
import { UtensilsCrossed, Package, Menu, ShoppingCart, Users, Calendar, CreditCard, BookOpen } from 'lucide-react'

interface StatCard {
  label: string
  value: string
  icon: any
  color: string
}

const stats: StatCard[] = [
  { label: 'Platos', value: '24', icon: UtensilsCrossed, color: 'text-slate-600' },
  { label: 'Insumos', value: '156', icon: Package, color: 'text-slate-600' },
  { label: 'Menús', value: '8', icon: Menu, color: 'text-slate-600' },
  { label: 'Compras', value: '42', icon: ShoppingCart, color: 'text-slate-600' },
  { label: 'Proveedores', value: '15', icon: Users, color: 'text-slate-600' },
  { label: 'Reservas', value: '128', icon: Calendar, color: 'text-slate-600' },
  { label: 'Pagos', value: '$45,320', icon: CreditCard, color: 'text-slate-600' },
  { label: 'Becas', value: '32', icon: BookOpen, color: 'text-slate-600' },
]

export function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-muted rounded-lg`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad reciente</h3>
          <div className="space-y-4">
            {[
              { title: 'Nuevo plato agregado', time: 'Hace 2 horas' },
              { title: 'Compra confirmada', time: 'Hace 5 horas' },
              { title: 'Reserva registrada', time: 'Hace 1 día' },
              { title: 'Pago procesado', time: 'Hace 2 días' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                <span className="text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Información del sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Estado</span>
              <span className="text-sm font-semibold text-green-600">Operativo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Última sincronización</span>
              <span className="text-sm font-semibold">Hace 5 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Usuarios activos</span>
              <span className="text-sm font-semibold">4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Base de datos</span>
              <span className="text-sm font-semibold">Conectada</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

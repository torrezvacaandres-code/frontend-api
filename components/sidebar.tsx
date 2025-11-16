import { Type as type, LucideIcon, LayoutDashboard, UtensilsCrossed, Package, Menu, ShoppingCart, Users, Calendar, CreditCard, BookOpen, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'platos', label: 'Platos', icon: UtensilsCrossed },
  { id: 'insumos', label: 'Insumos', icon: Package },
  { id: 'menus', label: 'Menús', icon: Menu },
  { id: 'compras', label: 'Compra de Insumos', icon: ShoppingCart },
  { id: 'proveedores', label: 'Proveedores', icon: Users },
  { id: 'reservas', label: 'Reservas', icon: Calendar },
  { id: 'pagos', label: 'Ventas', icon: CreditCard },
  { id: 'becas', label: 'Becas', icon: BookOpen },
]

interface SidebarProps {
  activeModule: string
  onModuleChange: (module: any) => void
  userRole?: string
  onChangeRole?: () => void
}

export function Sidebar({ activeModule, onModuleChange, userRole, onChangeRole }: SidebarProps) {
  return (
    <div className="w-64 bg-foreground text-background border-r border-border flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Comedor</h1>
        <p className="text-sm opacity-75">Gestión</p>
        {userRole && (
          <p className="text-xs opacity-60 mt-2 capitalize">Rol: {userRole}</p>
        )}
      </div>

      <nav className="space-y-2 px-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-background text-foreground'
                  : 'text-background hover:bg-background/10'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-background/20">
        <Button
          onClick={onChangeRole}
          variant="outline"
          className="w-full justify-center gap-2 bg-background text-foreground hover:bg-background/90 border-0"
        >
          <LogOut size={18} />
          Cambiar rol
        </Button>
      </div>
    </div>
  )
}

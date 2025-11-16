'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Dashboard } from '@/components/dashboard'
import { PlatosModule } from '@/components/modules/platos'
import { InsumosModule } from '@/components/modules/insumos'
import { MenusModule } from '@/components/modules/menus'
import { ComprasModule } from '@/components/modules/compras'
import { ProveedoresModule } from '@/components/modules/proveedores'
import { ReservasModule } from '@/components/modules/reservas'
import { PagosModule } from '@/components/modules/pagos'
import { BecasModule } from '@/components/modules/becas'

type Module = 'dashboard' | 'platos' | 'insumos' | 'menus' | 'compras' | 'proveedores' | 'reservas' | 'pagos' | 'becas'

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard')

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />
      case 'platos':
        return <PlatosModule />
      case 'insumos':
        return <InsumosModule />
      case 'menus':
        return <MenusModule />
      case 'compras':
        return <ComprasModule />
      case 'proveedores':
        return <ProveedoresModule />
      case 'reservas':
        return <ReservasModule />
      case 'pagos':
        return <PagosModule />
      case 'becas':
        return <BecasModule />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} userRole="admin" onChangeRole={() => window.location.href = '/'} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderModule()}
        </div>
      </main>
    </div>
  )
}

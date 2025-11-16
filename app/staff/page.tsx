'use client'

import { useState } from 'react'
import { StaffView } from '@/components/views/staff-view'

type Module = 'reservas' | 'menus' | 'insumos'

export default function StaffPage() {
  const [activeModule, setActiveModule] = useState<Module>('reservas')

  return (
    <StaffView 
      activeModule={activeModule} 
      onModuleChange={setActiveModule} 
      onChangeRole={() => window.location.href = '/'} 
    />
  )
}

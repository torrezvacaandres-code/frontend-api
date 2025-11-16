'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, BookOpen } from 'lucide-react'

interface RoleSelectorProps {
  onSelectRole: (role: 'admin' | 'staff' | 'student') => void
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Sistema de Gestión del Comedor</h1>
          <p className="text-muted-foreground text-lg">Selecciona tu rol para continuar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin */}
          <Card className="p-8 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <LayoutDashboard size={40} className="text-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Administrativo</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Acceso completo a todos los módulos del sistema
              </p>
              <Button
                onClick={() => onSelectRole('admin')}
                className="w-full bg-foreground text-background hover:bg-foreground/90"
              >
                Entrar como Admin
              </Button>
            </div>
          </Card>

          {/* Staff */}
          <Card className="p-8 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <Users size={40} className="text-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Personal del Comedor</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Gestiona menús, reservas y servicio diario
              </p>
              <Button
                onClick={() => onSelectRole('staff')}
                className="w-full bg-foreground text-background hover:bg-foreground/90"
              >
                Entrar como Personal
              </Button>
            </div>
          </Card>

          {/* Student */}
          <Card className="p-8 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <BookOpen size={40} className="text-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Estudiante</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Consulta menús, realiza reservas y pagos
              </p>
              <Button
                onClick={() => onSelectRole('student')}
                className="w-full bg-foreground text-background hover:bg-foreground/90"
              >
                Entrar como Estudiante
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

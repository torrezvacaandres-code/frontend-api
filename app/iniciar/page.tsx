'use client'

import { useRouter } from 'next/navigation'
import { RoleSelector } from '@/components/role-selector'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'

type UserRole = 'admin' | 'staff' | 'student'

export default function IniciarPage() {
  const router = useRouter()

  const handleSelectRole = (role: UserRole) => {
    router.push(`/${role}`)
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Dashboard BI
        </Button>
      </div>
      <RoleSelector onSelectRole={handleSelectRole} />
    </div>
  )
}

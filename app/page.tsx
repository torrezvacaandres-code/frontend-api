'use client'

import { useRouter } from 'next/navigation'
import { RoleSelector } from '@/components/role-selector'

type UserRole = 'admin' | 'staff' | 'student'

export default function Home() {
  const router = useRouter()

  const handleSelectRole = (role: UserRole) => {
    router.push(`/${role}`)
  }

  return <RoleSelector onSelectRole={handleSelectRole} />
}

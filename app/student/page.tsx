'use client'

import { StudentView } from '@/components/views/student-view'

export default function StudentPage() {
  return <StudentView onChangeRole={() => window.location.href = '/'} />
}


'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session && session.user.role === 'admin') {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {session.user.name}!</p>
      </div>
    )
  }

  return null
}

'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function SessionTokenSync() {
  const { data } = useSession()
  useEffect(() => {
    const token = (data as any)?.accessToken
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('access_token', token)
    }
  }, [data])
  return null
}



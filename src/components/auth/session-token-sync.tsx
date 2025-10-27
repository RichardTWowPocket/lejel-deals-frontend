'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function SessionTokenSync() {
  const { data, status } = useSession()
  
  useEffect(() => {
    const token = (data as any)?.accessToken
    if (typeof window !== 'undefined') {
      // Only sync token if we have a valid session
      if (status === 'authenticated' && token) {
        const currentToken = localStorage.getItem('access_token')
        // Only update if token has changed to prevent unnecessary updates
        if (currentToken !== token) {
          localStorage.setItem('access_token', token)
        }
      } else if (status === 'unauthenticated') {
        // Clear token if session is unauthenticated
        localStorage.removeItem('access_token')
      }
    }
  }, [data, status])
  
  return null
}



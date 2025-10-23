import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/api'

export function useAuth() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const user = session?.user
  const isAuthenticated = !!session
  const isLoadingSession = status === 'loading'

  const register = async (userData: {
    name: string
    email: string
    password: string
  }) => {
    setIsLoading(true)
    try {
      // Create the user in backend first
      await api.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      })

      // Then sign in via NextAuth
      const signInResult = await signIn('credentials', {
        email: userData.email,
        password: userData.password,
        redirect: false,
        callbackUrl: '/customer',
      })
      if (signInResult?.ok) {
        router.push(signInResult.url || '/customer')
      }
      return signInResult
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/customer',
      })
      if (result?.ok) {
        router.push(result.url || '/customer')
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  return {
    user,
    session,
    isAuthenticated,
    isLoading: isLoading || isLoadingSession,
    register,
    login,
    logout,
  }
}


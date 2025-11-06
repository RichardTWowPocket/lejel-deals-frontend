import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut, getSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import { UserRole } from '@/lib/constants'

export function useAuth() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const register = async (userData: { name?: string; email: string; password: string }) => {
    setIsLoading(true)
    try {
      await apiClient.post(ENDPOINTS.auth.register, {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      })

      toast.success('Registration successful! You can now log in.')

      setTimeout(() => {
        router.push('/login')
      }, 1500)

      return { ok: true }
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
        // Wait a bit for session to update, then get the session to check user role
        await new Promise(resolve => setTimeout(resolve, 100))
        const updatedSession = await getSession()
        
        // Determine redirect path based on user role
        let redirectPath = '/customer' // Default for CUSTOMER
        const userRole = updatedSession?.user?.role as UserRole | undefined
        
        if (userRole === UserRole.MERCHANT || userRole === UserRole.SUPER_ADMIN) {
          redirectPath = '/merchant/dashboard'
        } else if (userRole === UserRole.CUSTOMER) {
          redirectPath = '/customer'
        }
        
        // Use Next.js router which will navigate within the same frontend app
        router.push(redirectPath)
        router.refresh() // Refresh to ensure session is updated
      }

      return result
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  const user = session?.user as any
  const isAuthenticated = status === 'authenticated'

  return {
    user,
    session,
    isAuthenticated,
    isLoading: isLoading || status === 'loading',
    register,
    login,
    logout,
  }
}


import { DefaultSession } from 'next-auth'
import type { UserRole } from '@/lib/constants'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: UserRole
      avatar?: string | null
      merchantIds?: string[]
      customerId?: string | null
    }
    accessToken?: string
    merchantIds?: string[]
    merchantMemberships?: Array<{
      id: string
      merchantId: string
      merchantRole: string
      isOwner: boolean
    }>
    customerId?: string | null
  }

  interface User {
    id: string
    email: string
    role: UserRole
    avatar?: string | null
    merchantIds?: string[]
    merchantMemberships?: Array<{
      id: string
      merchantId: string
      merchantRole: string
      isOwner: boolean
    }>
    customerId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub?: string
    email?: string
    role?: string
    avatar?: string | null
    merchantIds?: string[]
    merchantMemberships?: Array<{
      id: string
      merchantId: string
      merchantRole: string
      isOwner: boolean
    }>
    customerId?: string | null
    accessToken?: string
    iss?: string
    aud?: string
  }
}













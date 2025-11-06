import { UserRole } from '@/lib/constants'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  role: 'customer' | 'merchant'
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export interface AppMerchantMembership {
  id: string
  merchantId: string
  merchantRole: string
  isOwner: boolean
  permissions?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  createdAt: string
  merchant?: {
    id: string
    name: string
    email: string
    isActive: boolean
  } | null
}

export interface AppCustomerProfile {
  id: string
  userId: string
  email: string
  firstName: string | null
  lastName: string | null
  phone?: string | null
  isActive: boolean
  preferences?: Record<string, unknown> | null
}

export interface AppUserProfile {
  id: string
  email: string
  role: string
  isActive: boolean
  merchantIds: string[]
  merchantMemberships: AppMerchantMembership[]
  customer: AppCustomerProfile | null
}


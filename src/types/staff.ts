/**
 * Staff Types
 * 
 * Types for merchant staff management
 */

import { StaffRole } from '@/lib/constants'

export { StaffRole } from '@/lib/constants'

export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: StaffRole
  merchantId: string
  merchant?: {
    id: string
    name: string
    email: string
  }
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface StaffListResponse {
  staff: Staff[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateStaffDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
  pin: string
  role?: StaffRole
  merchantId?: string
}

export interface UpdateStaffDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  pin?: string
  role?: StaffRole
  isActive?: boolean
}

export interface ResetPinResponse {
  staffId: string
  newPin: string
  message: string
}

export interface StaffStats {
  totalStaff: number
  activeStaff: number
  inactiveStaff: number
  staffByRole: {
    [key in StaffRole]: number
  }
}


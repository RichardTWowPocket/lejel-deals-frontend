/**
 * Settings Types
 * 
 * Types for merchant settings management
 */

export interface OperatingHours {
  monday?: DayHours
  tuesday?: DayHours
  wednesday?: DayHours
  thursday?: DayHours
  friday?: DayHours
  saturday?: DayHours
  sunday?: DayHours
}

export interface DayHours {
  openTime: string // "09:00"
  closeTime: string // "17:00"
  isOpen: boolean
}

// Alternative format from backend (array format)
export interface OperatingHoursDto {
  day: string // 'monday', 'tuesday', etc.
  openTime: string
  closeTime: string
  isOpen: boolean
}

export interface NotificationSettings {
  emailNewOrders: boolean
  emailLowInventory: boolean
  emailExpiringDeals: boolean
  emailNewRedemptions: boolean
}

export interface MerchantProfile {
  name: string
  email: string
  phone?: string
  logo?: string
}

export interface MerchantBusiness {
  name: string
  description?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  website?: string
}

export interface MerchantSettings {
  profile: MerchantProfile
  business: MerchantBusiness
  operatingHours: OperatingHours
  notifications: NotificationSettings
}

export interface UpdateProfileDto {
  name?: string
  email?: string
  phone?: string
  logo?: string
  description?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  website?: string
}

export interface UpdateBusinessDto {
  name?: string
  description?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  website?: string
}

export interface UpdateOperatingHoursDto {
  operatingHours: OperatingHoursDto[]
}

export interface UpdateNotificationsDto {
  emailNewOrders?: boolean
  emailLowInventory?: boolean
  emailExpiringDeals?: boolean
  emailNewRedemptions?: boolean
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}


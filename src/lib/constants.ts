// API URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

// App Configuration
export const APP_NAME = 'Lejel Deals';
export const APP_DESCRIPTION = 'Best deals from your favorite restaurants and merchants';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Date & Time
export const DEFAULT_TIMEZONE = 'Asia/Jakarta';
export const DATE_FORMAT = 'dd MMM yyyy';
export const DATETIME_FORMAT = 'dd MMM yyyy HH:mm';

// Currency
export const DEFAULT_CURRENCY = 'IDR';
export const CURRENCY_SYMBOL = 'Rp';

// User Roles
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

// Deal Status
export enum DealStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  SOLD_OUT = 'SOLD_OUT',
}

// Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Coupon Status
export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

// Payment Methods
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  E_WALLET = 'e_wallet',
}

// Pricing Types
export enum PricingType {
  FIXED_PRICE = 'FIXED_PRICE',
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
  FIXED_DISCOUNT = 'FIXED_DISCOUNT',
}

// Customer Tiers
export enum CustomerTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

// Staff Roles
export enum StaffRole {
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
}

// Verification Status
export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

// Redemption Status
export enum RedemptionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  CART: 'cart',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  DEALS: 'deals',
  DEAL: 'deal',
  MERCHANTS: 'merchants',
  MERCHANT: 'merchant',
  CUSTOMERS: 'customers',
  CUSTOMER: 'customer',
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  ORDERS: 'orders',
  ORDER: 'order',
  COUPONS: 'coupons',
  COUPON: 'coupon',
  ANALYTICS: 'analytics',
  STAFF: 'staff',
  AUTH_USER: 'auth_user',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  DEALS: '/deals',
  DEAL_DETAIL: (slug: string) => `/deals/${slug}`,
  MERCHANTS: '/merchants',
  MERCHANT_DETAIL: (slug: string) => `/merchants/${slug}`,
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (slug: string) => `/categories/${slug}`,
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Customer Dashboard
  CUSTOMER_DASHBOARD: '/customer',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_ORDER_DETAIL: (id: string) => `/customer/orders/${id}`,
  CUSTOMER_COUPONS: '/customer/coupons',
  CUSTOMER_COUPON_DETAIL: (id: string) => `/customer/coupons/${id}`,
  CUSTOMER_PROFILE: '/customer/profile',
  
  // Merchant Dashboard
  MERCHANT_DASHBOARD: '/merchant',
  MERCHANT_DEALS: '/merchant/deals',
  MERCHANT_DEAL_CREATE: '/merchant/deals/create',
  MERCHANT_DEAL_EDIT: (id: string) => `/merchant/deals/${id}/edit`,
  MERCHANT_STAFF: '/merchant/staff',
  MERCHANT_SCANNER: '/merchant/scanner',
  MERCHANT_ANALYTICS: '/merchant/analytics',
  MERCHANT_PROFILE: '/merchant/profile',
  
  // Admin Dashboard
  ADMIN_DASHBOARD: '/admin',
  ADMIN_MERCHANTS: '/admin/merchants',
  ADMIN_DEALS: '/admin/deals',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
  LOGIN: 'Welcome back!',
  LOGOUT: 'Successfully logged out!',
  REGISTER: 'Account created successfully!',
} as const;


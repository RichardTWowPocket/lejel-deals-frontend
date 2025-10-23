import { DealStatus, OrderStatus, CouponStatus, UserRole, CustomerTier, StaffRole } from '@/lib/constants';

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Common entity types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

// Deal types
export interface Deal extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  originalPrice: number;
  discountPrice: number;
  pricingType: string;
  discountPercentage?: number;
  discountAmount?: number;
  savings: number;
  finalPrice: number;
  validFrom: string;
  validUntil: string;
  status: DealStatus;
  maxQuantity?: number;
  soldQuantity: number;
  images: string[];
  terms?: string;
  merchantId: string;
  merchant?: Merchant;
  categoryId: string;
  category?: Category;
}

// Merchant types
export interface Merchant extends BaseEntity {
  businessName: string;
  slug: string;
  businessType: string;
  description?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  verificationStatus: string;
  isActive: boolean;
  images?: string[];
  operatingHours?: OperatingHours;
}

export interface OperatingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

// Category types
export interface Category extends BaseEntity {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  color?: string;
  parentId?: string;
  level: number;
  path?: string;
  sortOrder?: number;
  isActive: boolean;
  children?: Category[];
}

// Customer types
export interface Customer extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
  tier?: CustomerTier;
  loyaltyPoints?: number;
  totalSpentAmount?: number;
  totalOrders?: number;
  isActive: boolean;
}

// Order types
export interface Order extends BaseEntity {
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  dealId: string;
  deal?: Deal;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: string;
  paymentReference?: string;
  coupons?: Coupon[];
}

// Coupon types
export interface Coupon extends BaseEntity {
  orderId: string;
  order?: Order;
  dealId: string;
  deal?: Deal;
  qrCode: string;
  status: CouponStatus;
  usedAt?: string;
  expiresAt: string;
}

// Staff types
export interface Staff extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  merchantId: string;
  merchant?: Merchant;
  isActive: boolean;
}

// Analytics types
export interface DashboardAnalytics {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalMerchants: number;
    totalDeals: number;
    activeCoupons: number;
  };
  revenue: RevenueAnalytics;
  customers: CustomerAnalytics;
  merchants: MerchantAnalytics;
  deals: DealAnalytics;
  orders: OrderAnalytics;
  lastUpdated: string;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  averageOrderValue: number;
  revenueGrowth: number;
  topPerformingDeals: Array<{
    dealId: string;
    dealTitle: string;
    revenue: number;
    orders: number;
    merchantName: string;
  }>;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  customerGrowth: number;
  averageSpendingPerCustomer: number;
  customerRetentionRate: number;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalSpent: number;
    orders: number;
    lastOrderDate: string;
  }>;
}

export interface MerchantAnalytics {
  totalMerchants: number;
  activeMerchants: number;
  topPerformingMerchants: Array<{
    merchantId: string;
    merchantName: string;
    revenue: number;
    orders: number;
    deals: number;
  }>;
  merchantGrowth: number;
  averageRevenuePerMerchant: number;
}

export interface DealAnalytics {
  totalDeals: number;
  activeDeals: number;
  expiredDeals: number;
  dealPerformance: Array<{
    dealId: string;
    dealTitle: string;
    merchantName: string;
    category: string;
    orders: number;
    revenue: number;
  }>;
  categoryPerformance: Array<{
    categoryId: string;
    categoryName: string;
    deals: number;
    revenue: number;
    orders: number;
  }>;
}

export interface OrderAnalytics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  orderTrends: Array<{
    period: string;
    orders: number;
    revenue: number;
    averageOrderValue: number;
  }>;
  orderStatusDistribution: Record<string, number>;
  averageOrderProcessingTime: number;
  orderCompletionRate: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface CreateDealForm {
  title: string;
  description: string;
  shortDescription?: string;
  originalPrice: number;
  discountPrice: number;
  pricingType: string;
  validFrom: string;
  validUntil: string;
  maxQuantity?: number;
  images: File[];
  terms?: string;
  merchantId: string;
  categoryId: string;
}

// UI types
export interface SelectOption {
  label: string;
  value: string;
}

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Search & Filter types
export interface SearchParams {
  q?: string;
  status?: string;
  category?: string;
  merchant?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}


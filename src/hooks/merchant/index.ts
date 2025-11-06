/**
 * Merchant Hooks
 * 
 * All hooks related to merchant dashboard functionality
 */

export { useMerchantDeals, useMerchantDeal } from './use-merchant-deals'
export { useCreateDeal } from './use-create-deal'
export type { CreateDealDto } from './use-create-deal'
export { useUpdateDeal } from './use-update-deal'
export type { UpdateDealDto } from './use-update-deal'
export { useDeleteDeal } from './use-delete-deal'
export {
  useToggleDealStatus,
  usePauseDeal,
  useResumeDeal,
} from './use-toggle-deal-status'
export type { DealStatus } from './use-toggle-deal-status'
export { useValidateQR } from './use-validate-qr'
export { useProcessRedemption } from './use-process-redemption'
export { useMerchantRedemptions } from './use-merchant-redemptions'
export { useRedemptionStats } from './use-redemption-stats'
export { useExportRedemptions } from './use-export-redemptions'
export { useMerchantOrders, useMerchantOrder } from './use-merchant-orders'
export { useOrderStats } from './use-order-stats'
export { useUpdateOrderStatus } from './use-update-order-status'
export type { UpdateOrderStatusDto } from './use-update-order-status'
export { useMerchantPayouts } from './use-merchant-payouts'
export { usePayoutStats } from './use-payout-stats'
export { useExportPayouts } from './use-export-payouts'
export { useMerchantStaff } from './use-merchant-staff'
export { useCreateStaff } from './use-create-staff'
export { useUpdateStaff } from './use-update-staff'
export { useDeleteStaff } from './use-delete-staff'
export { useResetPin } from './use-reset-pin'
export {
  useToggleStaffStatus,
  useActivateStaff,
  useDeactivateStaff,
} from './use-toggle-staff-status'
export { useMerchantMedia, useMedia } from './use-merchant-media'
export { useUploadMedia, useUploadMultipleMedia } from './use-upload-media'
export { useDeleteMedia, useBulkDeleteMedia } from './use-delete-media'
export { useMerchantSettings, useOperatingHours } from './use-merchant-settings'
export { useUpdateProfile } from './use-update-profile'
export { useUpdateHours } from './use-update-hours'
export { useUpdateNotifications } from './use-update-notifications'
export { useChangePassword } from './use-change-password'
export { useMerchantOverview } from '../use-merchant'
export type { MerchantOverview } from '../use-merchant'


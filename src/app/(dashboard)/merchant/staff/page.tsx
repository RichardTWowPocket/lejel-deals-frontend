'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { StaffList } from '@/components/merchant/staff/staff-list'
import { useMerchantStaff } from '@/hooks/merchant/use-merchant-staff'
import { useDeleteStaff } from '@/hooks/merchant/use-delete-staff'
import { useUIStore } from '@/store/ui-store'
import { ErrorDisplay, PageHeaderSkeleton, StaffListSkeleton } from '@/components/merchant/shared'
import { MerchantRoleProtectedRoute } from '@/components/auth/merchant-role-protected-route'
import { useCanPerformAction } from '@/hooks/use-can-perform-action'
import { MerchantRole } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Staff } from '@/types/staff'

// Lazy load modals (only load when opened)
const StaffModal = dynamic(
  () => import('@/components/merchant/staff/staff-modal').then((mod) => ({ default: mod.StaffModal })),
  { ssr: false }
)

const StaffPinReset = dynamic(
  () => import('@/components/merchant/staff/staff-pin-reset').then((mod) => ({ default: mod.StaffPinReset })),
  { ssr: false }
)

export default function StaffPage() {
  const { data: staffData, isLoading, isFetching, error, refetch } = useMerchantStaff()
  const { openStaffModal } = useUIStore()
  const deleteStaff = useDeleteStaff()
  const { canCreateStaff, canViewStaff } = useCanPerformAction()

  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null)
  const [staffToResetPin, setStaffToResetPin] = useState<Staff | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isResetPinDialogOpen, setIsResetPinDialogOpen] = useState(false)

  const handleEdit = (staff: Staff) => {
    openStaffModal(staff)
  }

  const handleDelete = (staff: Staff) => {
    setStaffToDelete(staff)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (staffToDelete) {
      await deleteStaff.mutateAsync(staffToDelete.id)
      setIsDeleteDialogOpen(false)
      setStaffToDelete(null)
    }
  }

  const handleResetPin = (staff: Staff) => {
    setStaffToResetPin(staff)
    setIsResetPinDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeaderSkeleton />
        </div>
        <StaffListSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => {
          refetch().catch(console.error)
        }}
        title="Failed to load staff"
        description="We couldn't retrieve your staff members. Please try again."
      />
    )
  }

  // If user can't view staff, show access denied
  if (!canViewStaff) {
    return (
      <MerchantRoleProtectedRoute
        requiredRoles={[MerchantRole.OWNER, MerchantRole.ADMIN, MerchantRole.MANAGER]}
      >
        <div />
      </MerchantRoleProtectedRoute>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your staff members and their access
          </p>
        </div>
        {canCreateStaff && (
          <Button onClick={() => openStaffModal(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        )}
      </div>

      {/* Background Refetch Indicator */}
      {!isLoading && isFetching && staffData && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Refreshing staff list...</span>
        </div>
      )}

      {/* Staff List */}
      <StaffList
        data={staffData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResetPin={handleResetPin}
      />

      {/* Staff Modal */}
      <StaffModal />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>
                {staffToDelete?.firstName} {staffToDelete?.lastName}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteStaff.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteStaff.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PIN Reset Dialog */}
      <StaffPinReset
        staff={staffToResetPin}
        open={isResetPinDialogOpen}
        onOpenChange={setIsResetPinDialogOpen}
      />
    </div>
  )
}



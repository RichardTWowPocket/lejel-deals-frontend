'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUIStore } from '@/store/ui-store'
import { StaffForm } from './staff-form'

export function StaffModal() {
  const { isStaffModalOpen, editingStaff, closeStaffModal } = useUIStore()

  return (
    <Dialog open={isStaffModalOpen} onOpenChange={closeStaffModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </DialogTitle>
          <DialogDescription>
            {editingStaff
              ? 'Update staff member information below.'
              : 'Fill in the details to create a new staff member.'}
          </DialogDescription>
        </DialogHeader>
        <StaffForm staff={editingStaff} onSuccess={closeStaffModal} />
      </DialogContent>
    </Dialog>
  )
}




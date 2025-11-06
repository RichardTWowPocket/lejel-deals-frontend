'use client'

import { useRouter } from 'next/navigation'
import { MoreVertical, Edit, Pause, Play, Trash2, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useToggleDealStatus } from '@/hooks/merchant/use-toggle-deal-status'
import { useDeleteDeal } from '@/hooks/merchant'
import { useCanPerformAction } from '@/hooks/use-can-perform-action'
import { DealStatus } from '@/types/deal'
import type { Deal } from '@/types/deal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

interface DealActionsProps {
  deal: Deal
  onEdit?: () => void
}

/**
 * Deal Actions Component
 * 
 * Dropdown menu with actions for a deal (Edit, Pause/Resume, Delete).
 * 
 * @example
 * ```tsx
 * <DealActions deal={deal} />
 * ```
 */
export function DealActions({ deal, onEdit }: DealActionsProps) {
  const router = useRouter()
  const toggleStatus = useToggleDealStatus()
  const deleteDeal = useDeleteDeal()
  const { canEditDeal, canPublishDeal } = useCanPerformAction()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/merchant/deals/${deal.id}?mode=edit`)
    }
  }

  const handlePause = () => {
    toggleStatus.mutate({ id: deal.id, status: 'PAUSED' })
  }

  const handleResume = () => {
    toggleStatus.mutate({ id: deal.id, status: 'ACTIVE' })
  }

  const handleDelete = () => {
    deleteDeal.mutate(deal.id)
    setIsDeleteOpen(false)
  }

  const canPause = deal.status === DealStatus.ACTIVE
  const canResume = deal.status === DealStatus.PAUSED || deal.status === DealStatus.DRAFT
  const isDeleting = deleteDeal.isPending
  const isToggling = toggleStatus.isPending

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            disabled={isToggling || isDeleting}
          >
            {isToggling || isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canEditDeal && (
            <>
              <DropdownMenuItem onClick={handleEdit} disabled={isToggling || isDeleting}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {canPublishDeal && (
            <>
              {canPause && (
                <DropdownMenuItem
                  onClick={handlePause}
                  disabled={isToggling || isDeleting}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  {isToggling ? 'Pausing...' : 'Pause'}
                </DropdownMenuItem>
              )}
              {canResume && (
                <DropdownMenuItem
                  onClick={handleResume}
                  disabled={isToggling || isDeleting}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isToggling 
                    ? (deal.status === DealStatus.DRAFT ? 'Publishing...' : 'Resuming...')
                    : (deal.status === DealStatus.DRAFT ? 'Publish' : 'Resume')
                  }
                </DropdownMenuItem>
              )}
              {canPause || canResume ? <DropdownMenuSeparator /> : null}
            </>
          )}
          {canEditDeal && (
            <DropdownMenuItem
              onClick={() => setIsDeleteOpen(true)}
              disabled={isToggling || isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the deal &quot;{deal.title}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDeal.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}



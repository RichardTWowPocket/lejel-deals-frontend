'use client'

import { Staff } from '@/types/staff'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MoreVertical, Edit, Trash2, Key, UserCheck, UserX, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StaffRole } from '@/lib/constants'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToggleStaffStatus } from '@/hooks/merchant'

interface StaffCardProps {
  staff: Staff
  onEdit?: (staff: Staff) => void
  onDelete?: (staff: Staff) => void
  onResetPin?: (staff: Staff) => void
  className?: string
}

export function StaffCard({ staff, onEdit, onDelete, onResetPin, className }: StaffCardProps) {
  const fullName = `${staff.firstName} ${staff.lastName}`
  const initials = getInitials(fullName)
  const toggleStatus = useToggleStaffStatus()

  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case StaffRole.MANAGER:
        return <Badge variant="default">Manager</Badge>
      case StaffRole.SUPERVISOR:
        return <Badge variant="secondary">Supervisor</Badge>
      case StaffRole.ADMIN:
        return <Badge variant="outline">Admin</Badge>
      case StaffRole.CASHIER:
      default:
        return <Badge variant="outline">Cashier</Badge>
    }
  }

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{fullName}</h3>
                {!staff.isActive && (
                  <Badge variant="destructive" className="text-xs">Inactive</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground truncate">{staff.email}</p>
              </div>
              {staff.phone && (
                <p className="text-xs text-muted-foreground">{staff.phone}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {getRoleBadge(staff.role)}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={toggleStatus.isPending}
              >
                {toggleStatus.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem 
                  onClick={() => onEdit(staff)}
                  disabled={toggleStatus.isPending}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {/* Status Toggle */}
              {staff.isActive ? (
                <DropdownMenuItem
                  onClick={() => toggleStatus.mutate({ id: staff.id, isActive: false })}
                  disabled={toggleStatus.isPending}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {toggleStatus.isPending ? 'Deactivating...' : 'Deactivate'}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => toggleStatus.mutate({ id: staff.id, isActive: true })}
                  disabled={toggleStatus.isPending}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  {toggleStatus.isPending ? 'Activating...' : 'Activate'}
                </DropdownMenuItem>
              )}
              {onResetPin && (
                <DropdownMenuItem 
                  onClick={() => onResetPin(staff)}
                  disabled={toggleStatus.isPending}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Reset PIN
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(staff)}
                  className="text-destructive"
                  disabled={toggleStatus.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}




'use client'

import { Staff } from '@/types/staff'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StaffCard } from './staff-card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit, Trash2, Key, UserCheck, UserX, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StaffRole } from '@/lib/constants'
import { getInitials } from '@/lib/utils'
import { StaffListResponse } from '@/types/staff'
import { EmptyState } from '@/components/merchant/shared/empty-state'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToggleStaffStatus } from '@/hooks/merchant'

interface StaffListProps {
  data?: StaffListResponse
  onEdit?: (staff: Staff) => void
  onDelete?: (staff: Staff) => void
  onResetPin?: (staff: Staff) => void
}

export function StaffList({
  data,
  onEdit,
  onDelete,
  onResetPin,
}: StaffListProps) {
  const staffMembers = data?.staff || []
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

  if (staffMembers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No staff members found"
        description="Get started by adding your first staff member."
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => {
                const fullName = `${staff.firstName} ${staff.lastName}`
                const initials = getInitials(fullName)

                return (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{fullName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{staff.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {staff.phone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(staff.role)}</TableCell>
                    <TableCell>
                      {staff.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {staffMembers.map((staff) => (
          <StaffCard
            key={staff.id}
            staff={staff}
            onEdit={onEdit}
            onDelete={onDelete}
            onResetPin={onResetPin}
          />
        ))}
      </div>
    </div>
  )
}




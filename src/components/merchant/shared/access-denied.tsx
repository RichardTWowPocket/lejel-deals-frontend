'use client'

import { ShieldX, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MerchantRole } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AccessDeniedProps {
  requiredRoles: MerchantRole[]
  currentRole?: MerchantRole | null
  className?: string
}

/**
 * Access Denied Component
 * 
 * Displays an access denied message when a user doesn't have
 * the required merchant role permissions.
 * 
 * @example
 * ```tsx
 * <AccessDenied
 *   requiredRoles={[MerchantRole.OWNER, MerchantRole.ADMIN]}
 *   currentRole={MerchantRole.CASHIER}
 * />
 * ```
 */
export function AccessDenied({
  requiredRoles,
  currentRole,
  className,
}: AccessDeniedProps) {
  const router = useRouter()

  const formatRoleName = (role: MerchantRole): string => {
    return role.charAt(0) + role.slice(1).toLowerCase()
  }

  const formatRolesList = (roles: MerchantRole[]): string => {
    if (roles.length === 0) return ''
    if (roles.length === 1) return formatRoleName(roles[0])
    if (roles.length === 2) {
      return `${formatRoleName(roles[0])} or ${formatRoleName(roles[1])}`
    }
    // For 3+ roles: "Role1, Role2, or Role3"
    const formatted = roles.map(formatRoleName)
    const last = formatted.pop()
    return `${formatted.join(', ')}, or ${last}`
  }

  const requiredRolesText = formatRolesList(requiredRoles)

  const currentRoleText = currentRole ? formatRoleName(currentRole) : 'your current role'

  return (
    <Card className={cn('border-destructive/50 bg-destructive/5', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">Access Denied</h3>
        <p className="mb-2 max-w-md text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <div className="mb-6 space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Required role:</span> {requiredRolesText}
          </p>
          {currentRole && (
            <p>
              <span className="font-medium">Your role:</span> {currentRoleText}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="min-w-[120px]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </CardContent>
    </Card>
  )
}

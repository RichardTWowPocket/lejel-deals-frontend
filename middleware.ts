import { withAuth } from 'next-auth/middleware'
import type { NextRequest } from 'next/server'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (!token) return false

      const path = req.nextUrl.pathname
      const role = String(token.role || '').toUpperCase()

      if (path.startsWith('/admin')) {
        return role === 'SUPER_ADMIN'
      }

      if (path.startsWith('/merchant')) {
        return role === 'MERCHANT' || role === 'SUPER_ADMIN'
      }

      return true
    },
  },
})

export const config = {
  matcher: ['/admin/:path*', '/merchant/:path*'],
}


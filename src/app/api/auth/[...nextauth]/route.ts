import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { SignJWT } from 'jose'

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'

export const authOptions: any = {
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          const res = await fetch(`${BACKEND_BASE}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          })
          if (!res.ok) return null
          const json = await res.json()
          const payload = (json?.data?.data) ?? (json?.data) ?? json
          if (!payload?.id || !payload?.email) return null
          return {
            id: payload.id,
            email: payload.email,
            name: credentials.name || payload.email,
            role: payload.role || 'customer',
            customerId: payload.customerId,
            merchantIds: payload.merchantIds || [],
          } as any
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        // Keep a lowercase role in token for backend
        token.role = (user.role || 'customer').toLowerCase()
        if (token.role === 'merchant') {
          token.merchantIds = user.merchantIds || []
        }
        if (token.role === 'customer' && user.customerId) {
          token.customerId = user.customerId
        }
        // Create backend-ready JWT signed with NEXTAUTH_SECRET using jose
        const secret = process.env.NEXTAUTH_SECRET
        if (secret) {
          const secretKey = new TextEncoder().encode(secret)
          token.accessToken = await new SignJWT({
            sub: token.sub,
            email: token.email,
            role: token.role,
            customerId: token.customerId,
            merchantIds: token.merchantIds,
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(secretKey)
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = session.user || {}
        ;(session.user as any).id = token.sub
        // Map to uppercase for frontend types while keeping backend token lowercase
        ;(session.user as any).role = String(token.role || 'customer').toUpperCase()
        ;(session.user as any).name = token.name
        ;(session.user as any).email = token.email
        ;(session as any).accessToken = token.accessToken
        ;(session as any).merchantIds = token.merchantIds || []
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
} as const

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }



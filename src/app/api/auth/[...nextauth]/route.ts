import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { SignJWT } from 'jose'

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'
const TOKEN_ISSUER = 'lejel-auth'
const TOKEN_AUDIENCE = 'lejel-api'
// NextAuth specifically looks for NEXTAUTH_URL env var
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

const authOptions: any = {
  // NextAuth will use NEXTAUTH_URL from env, but we can also set it here
  url: NEXTAUTH_URL,
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60, // 1 hour
    updateAge: 15 * 60, // rotate every 15 minutes of activity
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const response = await fetch(`${BACKEND_BASE}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!response.ok) {
          throw new Error('InvalidCredentials')
        }

        const json = await response.json()
        const payload = json?.data?.data ?? json?.data ?? json

        if (!payload?.id || !payload?.email) {
          return null
        }

        const userData = {
          id: payload.id,
          email: payload.email,
          role: payload.role || 'customer',
          avatar: payload.avatar || null,
          merchantIds: payload.merchantIds || [],
          merchantMemberships: payload.merchantMemberships || [],
          customerId: payload.customerId || payload.customer?.id,
        }
        
        // Debug: Log merchantMemberships for troubleshooting
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Credentials Auth - merchantMemberships:', payload.merchantMemberships)
        }
        
        return userData
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        try {
          // Extract user data from Google profile
          const googleId = account.providerAccountId
          const email = user.email || profile?.email
          const name = user.name || profile?.name
          const image = user.image || profile?.picture

          if (!email || !googleId) {
            return false
          }

          // Parse name into first/last
          const nameParts = name ? name.trim().split(/\s+/).filter(Boolean) : []
          const firstName = nameParts[0] || null
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null

          // Call backend to find or create user
          const response = await fetch(`${BACKEND_BASE}/auth/oauth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              providerId: googleId,
              name,
              firstName,
              lastName,
              avatar: image,
            }),
          })

          if (!response.ok) {
            console.error('Failed to create/link Google user:', await response.text())
            return false
          }

          const json = await response.json()
          const payload = json?.data?.data ?? json?.data ?? json

          if (!payload?.id || !payload?.email) {
            return false
          }

          // Update user object with backend data
          user.id = payload.id
          user.email = payload.email
          user.role = payload.role || 'customer'
          user.avatar = payload.avatar || image || null
          user.merchantIds = payload.merchantIds || []
          user.merchantMemberships = payload.merchantMemberships || []
          user.customerId = payload.customerId || payload.customer?.id
          
          // Debug: Log merchantMemberships for troubleshooting
          if (process.env.NODE_ENV === 'development') {
            console.log('🔐 Google OAuth - merchantMemberships:', payload.merchantMemberships)
          }

          return true
        } catch (error) {
          console.error('Error in Google OAuth sign-in:', error)
          return false
        }
      }

      // Credentials provider flow (existing)
      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.role = (user.role || 'customer').toLowerCase()
        token.avatar = user.avatar || null
        token.merchantIds = user.merchantIds || []
        token.merchantMemberships = user.merchantMemberships || []
        if (user.customerId) {
          token.customerId = user.customerId
        }
      }

      const secret = process.env.NEXTAUTH_SECRET
      if (secret && token.sub && token.email) {
        token.role = token.role || 'customer'
        const secretKey = new TextEncoder().encode(secret)
        token.accessToken = await new SignJWT({
          sub: token.sub,
          email: token.email,
          role: token.role,
          merchantIds: token.merchantIds,
          customerId: token.customerId,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuer(TOKEN_ISSUER)
          .setAudience(TOKEN_AUDIENCE)
          .setIssuedAt()
          .setExpirationTime('15m')
          .sign(secretKey)
      }

      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = session.user || {}
        session.user.id = token.sub
        session.user.email = token.email
        session.user.role = String(token.role || 'customer').toUpperCase()
        session.user.avatar = token.avatar || null
        session.user.image = token.avatar || null // NextAuth uses 'image' field
        session.accessToken = token.accessToken
        session.merchantIds = token.merchantIds || []
        session.merchantMemberships = token.merchantMemberships || []
        session.customerId = token.customerId || null
      }
      return session
    },
    async redirect({ url, baseUrl }: any) {
      // If url is a relative path, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // If url is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url
      }
      // Default redirect to home
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

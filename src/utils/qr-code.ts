import { SignJWT, jwtVerify } from 'jose'

/**
 * Interface for QR Code JWT Payload
 */
export interface QRCodePayload {
  customerId: string
  couponId: string
  orderId: string
  qrCode: string
  iat?: number
  exp?: number
}

/**
 * Sign a JWT token for QR code display (browser-compatible using jose)
 * @param payload - The QR code payload containing customerId, couponId, orderId, and qrCode
 * @returns Signed JWT token
 */
export async function signQRCodeJWT(payload: Omit<QRCodePayload, 'iat' | 'exp'>): Promise<string> {
  const secret = process.env.NEXT_PUBLIC_QR_COUPON_SECRET

  if (!secret) {
    throw new Error('QR_COUPON_SECRET is not defined in environment variables')
  }

  // Convert secret string to Uint8Array for jose
  const secretKey = new TextEncoder().encode(secret)

  // Sign the JWT with a 90-second expiration (30s buffer after 60s regeneration)
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('lejel-deals-customer')
    .setAudience('coupon-redemption')
    .setExpirationTime('90s')
    .sign(secretKey)

  return token
}

/**
 * Verify a QR code JWT token (for future use on merchant/staff side)
 * @param token - The JWT token to verify
 * @returns Decoded payload if valid, null if invalid
 */
export async function verifyQRCodeJWT(token: string): Promise<QRCodePayload | null> {
  const secret = process.env.NEXT_PUBLIC_QR_COUPON_SECRET

  if (!secret) {
    throw new Error('QR_COUPON_SECRET is not defined in environment variables')
  }

  // Convert secret string to Uint8Array for jose
  const secretKey = new TextEncoder().encode(secret)

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: 'lejel-deals-customer',
      audience: 'coupon-redemption',
    })

    return payload as unknown as QRCodePayload
  } catch (error) {
    console.error('QR Code JWT verification failed:', error)
    return null
  }
}


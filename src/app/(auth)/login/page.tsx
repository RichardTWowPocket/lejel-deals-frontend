"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password. Please try again.',
  AccessDenied: 'You do not have permission to access that area.',
  InvalidCredentials: 'Invalid email or password. Please try again.',
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const errorKey = searchParams?.get('error') ?? undefined
  const feedback = errorKey ? ERROR_MESSAGES[errorKey] ?? 'Unable to sign you in. Please try again.' : null

  return (
    <Card>
      <CardHeader className='space-y-1'>
        <Link href='/' className='mb-4 flex justify-center'>
          <div className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
              <span className='text-xl font-bold text-white'>L</span>
            </div>
            <span className='text-2xl font-bold'>Lejel Deals</span>
          </div>
        </Link>
        <CardTitle className='text-2xl'>Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        {feedback ? (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
        ) : null}
        <LoginForm />
      </CardContent>
    </Card>
  )
}


import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
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
        <LoginForm />
      </CardContent>
    </Card>
  )
}


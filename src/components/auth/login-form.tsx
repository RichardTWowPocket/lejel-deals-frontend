'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'

const loginSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      // Redirect will be handled by NextAuth
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='your@email.com'
          {...register('email')}
          error={errors.email?.message}
          disabled={isLoading}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Masukkan kata sandi'
            {...register('password')}
            error={errors.password?.message}
            disabled={isLoading}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-2.5 text-muted-foreground hover:text-foreground'
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
          </button>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='remember'
            className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
          />
          <label htmlFor='remember' className='text-sm text-muted-foreground'>
            Ingat saya
          </label>
        </div>
        <Link href='/forgot-password' className='text-sm text-primary hover:underline'>
          Lupa kata sandi?
        </Link>
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Memproses...' : 'Masuk'}
      </Button>

      <p className='text-center text-sm text-muted-foreground'>
        Belum punya akun?{' '}
        <Link href='/register' className='text-primary hover:underline'>
          Daftar
        </Link>
      </p>
    </form>
  )
}


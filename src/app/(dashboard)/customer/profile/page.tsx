'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-6'>
        <header className='space-y-2'>
          <h1 className='text-2xl font-bold'>Profil</h1>
          <p className='text-muted-foreground'>Perbarui informasi pribadi Anda.</p>
        </header>

        <Card>
          <CardContent className='p-6 space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nama Lengkap</Label>
                <Input id='name' placeholder='Nama lengkap Anda' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Nomor Telepon</Label>
                <Input id='phone' placeholder='08xxxxxxxxxx' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='nama@contoh.com' disabled />
            </div>
            <Button className='mt-2'>Simpan Perubahan</Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}



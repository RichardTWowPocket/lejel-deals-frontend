'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { UserRole } from '@/lib/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Lock, 
  Shield, 
  CreditCard, 
  MapPin,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  Edit,
  Camera
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)
  
  // Form states - initialize without blocking on user
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    postalCode: ''
  })

  // Update form state when user loads (non-blocking)
  useEffect(() => {
    if (user && !isLoading) {
      setPersonalInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }))
    }
  }, [user, isLoading])

  const [preferences, setPreferences] = useState({
    language: 'id',
    currency: 'IDR',
    emailNotifications: true,
    whatsappNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSavePersonalInfo = async () => {
    setIsSaving(true)
    try {
      // TODO: API call to save personal info
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Informasi pribadi berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal menyimpan informasi pribadi')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      // TODO: API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Preferensi berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal menyimpan preferensi')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Kata sandi baru tidak cocok')
      return
    }
    if (security.newPassword.length < 8) {
      toast.error('Kata sandi minimal 8 karakter')
      return
    }

    setIsSaving(true)
    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Kata sandi berhasil diubah')
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Gagal mengubah kata sandi')
    } finally {
      setIsSaving(false)
    }
  }

  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return names[0].substring(0, 2).toUpperCase()
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U'
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className='space-y-6'>
        {/* Header - Hidden on mobile for Jenny Wilson style */}
        <div className='hidden md:block space-y-2'>
          <h1 className='text-3xl font-bold'>Profil</h1>
          <p className='text-muted-foreground'>Kelola informasi akun dan preferensi Anda</p>
        </div>

        {/* Profile Header Card - Jenny Wilson Style on Mobile */}
        <Card className='relative overflow-hidden border-0 bg-gradient-to-b from-card via-card/95 to-card shadow-elegant-xl md:border-primary/20 md:bg-gradient-to-br md:from-primary/5 md:via-secondary/5 md:to-accent/5'>
          {/* Background gradient overlay for mobile */}
          <div className='hidden md:block absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5' />
          
          <CardContent className='relative p-6 md:p-6'>
            {isLoading && !user ? (
              <>
                {/* Mobile Skeleton (< md) - Jenny Wilson Style */}
                <div className='flex flex-col items-center space-y-6 md:hidden'>
                  <div className='relative'>
                    <Skeleton className='h-32 w-32 rounded-full' />
                    <Skeleton className='absolute top-0 right-0 h-8 w-8 rounded-full border-4 border-card' />
                  </div>
                  <Skeleton className='h-8 w-48' />
                  <div className='flex gap-3'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-6 w-40' />
                  </div>
                  <Skeleton className='h-4 w-64' />
                </div>
                {/* Desktop Skeleton (>= md) - Horizontal Layout */}
                <div className='hidden md:flex items-center gap-6'>
                  <div className='relative flex-shrink-0'>
                    <Skeleton className='h-24 w-24 rounded-full' />
                    <Skeleton className='absolute bottom-0 right-0 h-8 w-8 rounded-full' />
                  </div>
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-7 w-48' />
                    <Skeleton className='h-4 w-64' />
                    <Skeleton className='h-4 w-56' />
                  </div>
                  <div className='flex gap-6 flex-shrink-0'>
                    <div className='text-center space-y-1'>
                      <Skeleton className='h-8 w-12' />
                      <Skeleton className='h-4 w-20' />
                    </div>
                    <div className='text-center space-y-1'>
                      <Skeleton className='h-8 w-12' />
                      <Skeleton className='h-4 w-24' />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Mobile Layout (< md) - Jenny Wilson Style */}
                <div className='flex flex-col items-center space-y-4 md:hidden'>
                  {/* Avatar with verification badge */}
                  <div className='relative'>
                    <div className='h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-background shadow-elegant-lg bg-gradient-primary flex items-center justify-center'>
                      <span className='text-3xl sm:text-4xl font-bold text-white'>
                        {getUserInitials()}
                      </span>
                    </div>
                    {/* Verification Badge */}
                    <div className='absolute top-0 right-0 h-8 w-8 rounded-full bg-green-500 border-4 border-card flex items-center justify-center shadow-md'>
                      <CheckCircle className='h-4 w-4 text-white' />
                    </div>
                    {/* Camera Button */}
                    <Button
                      size='sm'
                      variant='secondary'
                      className='absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 shadow-md'
                      onClick={() => toast('Fitur upload foto akan segera tersedia', { icon: '📷' })}
                    >
                      <Camera className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* Name */}
                  <div className='text-center'>
                    <h2 className='text-2xl sm:text-3xl font-bold mb-2'>{user?.name || 'User'}</h2>
                  </div>

                  {/* Tags/Badges */}
                  <div className='flex flex-wrap items-center justify-center gap-2'>
                    <Badge variant='default' className='px-3 py-1 text-sm bg-yellow-500/20 text-yellow-200 border-yellow-500/30'>
                      <Mail className='mr-1.5 h-3 w-3' />
                      {user?.email || 'email@example.com'}
                    </Badge>
                    <Badge variant='outline' className='px-3 py-1 text-sm bg-card/50'>
                      <CreditCard className='mr-1.5 h-3 w-3' />
                      Customer Account
                    </Badge>
                  </div>

                  {/* Stats - Mobile */}
                  <div className='flex gap-8 pt-2'>
                    <div className='text-center'>
                      <p className='text-xl font-bold text-primary'>0</p>
                      <p className='text-xs text-muted-foreground mt-1'>Orders</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-xl font-bold text-secondary'>0</p>
                      <p className='text-xs text-muted-foreground mt-1'>Coupons</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout (>= md) - Horizontal */}
                <div className='hidden md:flex items-center gap-6'>
                  {/* Avatar */}
                  <div className='relative'>
                    <div className='h-24 w-24 rounded-full border-4 border-background shadow-lg bg-gradient-primary flex items-center justify-center'>
                      <span className='text-2xl font-bold text-white'>
                        {getUserInitials()}
                      </span>
                    </div>
                    <Button
                      size='sm'
                      variant='secondary'
                      className='absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 shadow-md'
                      onClick={() => toast('Fitur upload foto akan segera tersedia', { icon: '📷' })}
                    >
                      <Camera className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h2 className='text-2xl font-bold'>{user?.name || 'User'}</h2>
                      <Badge variant='default' className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                        <CheckCircle className='mr-1 h-3 w-3' />
                        Verified
                      </Badge>
                    </div>
                    <p className='text-muted-foreground flex items-center gap-2 mb-1'>
                      <Mail className='h-4 w-4' />
                      {user?.email || 'Loading...'}
                    </p>
                    <p className='text-muted-foreground flex items-center gap-2'>
                      <CreditCard className='h-4 w-4' />
                      Customer Account
                    </p>
                  </div>

                  {/* Stats */}
                  <div className='flex gap-6'>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-primary'>0</p>
                      <p className='text-sm text-muted-foreground'>Total Orders</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-secondary'>0</p>
                      <p className='text-sm text-muted-foreground'>Active Coupons</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <TabsList className='grid w-full grid-cols-4 lg:w-[600px]'>
            <TabsTrigger value='personal' className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              <span className='hidden sm:inline'>Personal</span>
            </TabsTrigger>
            <TabsTrigger value='preferences' className='flex items-center gap-2'>
              <Bell className='h-4 w-4' />
              <span className='hidden sm:inline'>Preferensi</span>
            </TabsTrigger>
            <TabsTrigger value='security' className='flex items-center gap-2'>
              <Shield className='h-4 w-4' />
              <span className='hidden sm:inline'>Keamanan</span>
            </TabsTrigger>
            <TabsTrigger value='notifications' className='flex items-center gap-2'>
              <AlertCircle className='h-4 w-4' />
              <span className='hidden sm:inline'>Notifikasi</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value='personal' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Informasi Pribadi
                </CardTitle>
                <CardDescription>
                  Perbarui informasi pribadi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nama Lengkap *</Label>
                    {isLoading && !user ? (
                      <Skeleton className='h-10 w-full' />
                    ) : (
                      <Input
                        id='name'
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        placeholder='Masukkan nama lengkap'
                      />
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Nomor Telepon</Label>
                    <Input
                      id='phone'
                      type='tel'
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder='08xxxxxxxxxx'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  {isLoading && !user ? (
                    <Skeleton className='h-10 w-full' />
                  ) : (
                    <Input
                      id='email'
                      type='email'
                      value={personalInfo.email}
                      disabled
                      className='bg-muted'
                      placeholder={isLoading ? 'Memuat...' : 'Email'}
                    />
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Email tidak dapat diubah
                  </p>
                </div>

                <Separator />

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='dateOfBirth'>Tanggal Lahir</Label>
                    <Input
                      id='dateOfBirth'
                      type='date'
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='gender'>Jenis Kelamin</Label>
                    <select
                      id='gender'
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                      className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <option value=''>Pilih jenis kelamin</option>
                      <option value='male'>Laki-laki</option>
                      <option value='female'>Perempuan</option>
                      <option value='other'>Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='address'>Alamat Lengkap</Label>
                  <Input
                    id='address'
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                    placeholder='Jl. Contoh No. 123'
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='city'>Kota</Label>
                    <Input
                      id='city'
                      value={personalInfo.city}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                      placeholder='Jakarta'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='postalCode'>Kode Pos</Label>
                    <Input
                      id='postalCode'
                      value={personalInfo.postalCode}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, postalCode: e.target.value })}
                      placeholder='12345'
                      maxLength={5}
                    />
                  </div>
                </div>

                <div className='pt-4'>
                  <Button 
                    onClick={handleSavePersonalInfo}
                    disabled={isSaving}
                    className='w-full sm:w-auto'
                  >
                    <Save className='mr-2 h-4 w-4' />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value='preferences' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MapPin className='h-5 w-5' />
                  Preferensi Umum
                </CardTitle>
                <CardDescription>
                  Sesuaikan pengalaman Anda
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='language'>Bahasa</Label>
                    <select
                      id='language'
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <option value='id'>Bahasa Indonesia</option>
                      <option value='en'>English</option>
                    </select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='currency'>Mata Uang</Label>
                    <select
                      id='currency'
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <option value='IDR'>IDR (Rupiah)</option>
                    </select>
                  </div>
                </div>

                <div className='pt-4'>
                  <Button 
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className='w-full sm:w-auto'
                  >
                    <Save className='mr-2 h-4 w-4' />
                    {isSaving ? 'Menyimpan...' : 'Simpan Preferensi'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value='security' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Lock className='h-5 w-5' />
                  Keamanan
                </CardTitle>
                <CardDescription>
                  Kelola kata sandi dan keamanan akun
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='currentPassword'>Kata Sandi Saat Ini</Label>
                  <Input
                    id='currentPassword'
                    type='password'
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    placeholder='Masukkan kata sandi saat ini'
                  />
                </div>

                <Separator />

                <div className='space-y-2'>
                  <Label htmlFor='newPassword'>Kata Sandi Baru</Label>
                  <Input
                    id='newPassword'
                    type='password'
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    placeholder='Minimal 8 karakter'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Minimal 8 karakter, disarankan kombinasi huruf dan angka
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>Konfirmasi Kata Sandi Baru</Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    placeholder='Masukkan ulang kata sandi baru'
                  />
                </div>

                <div className='pt-4'>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={isSaving}
                    className='w-full sm:w-auto'
                  >
                    <Shield className='mr-2 h-4 w-4' />
                    {isSaving ? 'Memproses...' : 'Ubah Kata Sandi'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sesi Aktif</CardTitle>
                <CardDescription>
                  Kelola perangkat yang telah login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between p-4 rounded-lg border border-border bg-card'>
                  <div className='flex items-center gap-4'>
                    <div className='h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center'>
                      <Phone className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <p className='font-medium'>Perangkat Ini</p>
                      <p className='text-sm text-muted-foreground'>
                        {new Date().toLocaleDateString('id-ID')} • {new Date().toLocaleTimeString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <Badge variant='default' className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                    Aktif
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value='notifications' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Bell className='h-5 w-5' />
                  Notifikasi
                </CardTitle>
                <CardDescription>
                  Kelola preferensi notifikasi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 rounded-lg border border-border bg-card'>
                    <div className='flex items-center gap-3'>
                      <Mail className='h-5 w-5 text-primary' />
                      <div>
                        <p className='font-medium'>Email Notifikasi</p>
                        <p className='text-sm text-muted-foreground'>Notifikasi via email tentang pesanan dan kupon</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                    />
                  </div>

                  <div className='flex items-center justify-between p-4 rounded-lg border border-border bg-card'>
                    <div className='flex items-center gap-3'>
                      <Phone className='h-5 w-5 text-green-600' />
                      <div>
                        <p className='font-medium'>WhatsApp Notifikasi</p>
                        <p className='text-sm text-muted-foreground'>Notifikasi pesanan dan promo via WhatsApp</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.whatsappNotifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, whatsappNotifications: checked })}
                    />
                  </div>

                  <div className='flex items-center justify-between p-4 rounded-lg border border-border bg-card'>
                    <div className='flex items-center gap-3'>
                      <AlertCircle className='h-5 w-5 text-blue-600' />
                      <div>
                        <p className='font-medium'>SMS Notifikasi</p>
                        <p className='text-sm text-muted-foreground'>Notifikasi penting via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, smsNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between p-4 rounded-lg border border-border bg-card'>
                    <div className='flex items-center gap-3'>
                      <Calendar className='h-5 w-5 text-purple-600' />
                      <div>
                        <p className='font-medium'>Email Marketing</p>
                        <p className='text-sm text-muted-foreground'>Terima promo dan newsletter via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, marketingEmails: checked })}
                    />
                  </div>
                </div>

                <div className='pt-4'>
                  <Button 
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className='w-full sm:w-auto'
                  >
                    <Save className='mr-2 h-4 w-4' />
                    {isSaving ? 'Menyimpan...' : 'Simpan Preferensi'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

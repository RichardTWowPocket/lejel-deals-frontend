'use client'

import { useState } from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/lib/constants';
import { HeroRecommendations } from '../components/deal/hero-recommendations'

export default function HomePage() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic here
    console.log('Subscribing with email:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl md:-top-40 md:-right-40 md:h-80 md:w-80" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 blur-3xl md:-bottom-40 md:-left-40 md:h-80 md:w-80" />
        
        <div className="container relative mx-auto px-4 py-8 sm:py-12 md:py-16 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center w-full">
            <div className="space-y-3 sm:space-y-4 animate-fade-in">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight px-2">
                Temukan Promo Terbaik
                <span className="block text-gradient-primary"> di Sekitar Anda</span>
              </h1>
              <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground px-4">
                Kupon makan berjangka waktu dari restoran terverifikasi. Tebus cepat dengan QR. Garansi uang kembali.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row animate-slide-in w-full max-w-sm sm:max-w-none px-4 items-center justify-center">
              <Button size="lg" asChild className="h-10 sm:h-11 md:h-12 px-5 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300 w-full sm:w-auto">
                <Link href={ROUTES.DEALS}>Lihat Promo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-10 sm:h-11 md:h-12 px-5 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto shadow-elegant-lg hover:shadow-elegant-xl">
                <Link href="#how-it-works">Cara Kerja</Link>
              </Button>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-foreground">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified Merchants</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-foreground">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-foreground">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-foreground">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>QR Redeem</span>
              </div>
            </div>

            {/* Hero Recommendations */}
            <div className="w-full pt-6 sm:pt-8 md:pt-12">
              <HeroRecommendations />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              Cara Kerja
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-4">
              Dapatkan promo favorit Anda dalam tiga langkah sederhana
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center group">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl group-hover:bg-gradient-primary/20 transition-colors duration-300" />
                <svg className="relative w-full h-full p-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="80" cy="80" r="40" stroke="hsl(var(--primary))" strokeWidth="8" fill="none" className="group-hover:stroke-[12] transition-all duration-300" />
                  <line x1="120" y1="120" x2="160" y2="160" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" />
                  <rect x="50" y="140" width="60" height="30" rx="4" fill="hsl(var(--primary))" className="group-hover:scale-110 transition-transform duration-300" />
                  <line x1="60" y1="150" x2="100" y2="150" stroke="white" strokeWidth="2" />
                  <line x1="60" y1="160" x2="100" y2="160" stroke="white" strokeWidth="2" />
                </svg>
                <div className="absolute -inset-4 rounded-2xl bg-gradient-primary opacity-0 blur-2xl group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Jelajahi & Pilih</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-4">
                  Temukan promo eksklusif dari restoran dan merchant terbaik di sekitar Anda
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center group">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-secondary/10 rounded-2xl group-hover:bg-gradient-secondary/20 transition-colors duration-300" />
                <svg className="relative w-full h-full p-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="40" y="60" width="120" height="80" rx="8" fill="hsl(var(--secondary))" className="group-hover:scale-105 transition-transform duration-300" />
                  <rect x="55" y="75" width="25" height="18" rx="2" fill="white" />
                  <line x1="55" y1="100" x2="130" y2="100" stroke="white" strokeWidth="3" className="group-hover:opacity-80 transition-opacity duration-300" />
                  <line x1="55" y1="110" x2="100" y2="110" stroke="white" strokeWidth="3" className="group-hover:opacity-80 transition-opacity duration-300" />
                  <circle cx="140" cy="130" r="25" fill="hsl(var(--secondary))" className="group-hover:scale-110 transition-transform duration-300" />
                  <path d="M132 130 L138 136 L148 124" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="absolute -inset-4 rounded-2xl bg-gradient-secondary opacity-0 blur-2xl group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Beli & Bayar</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-4">
                  Pembayaran aman melalui Midtrans dengan beragam metode
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center group">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl group-hover:bg-gradient-primary/20 transition-colors duration-300" />
                <svg className="relative w-full h-full p-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="50" y="50" width="100" height="100" rx="4" fill="hsl(var(--primary))" stroke="white" strokeWidth="3" className="group-hover:rotate-3 transition-transform duration-300" />
                  <rect x="55" y="55" width="20" height="20" fill="white" />
                  <rect x="125" y="55" width="20" height="20" fill="white" />
                  <rect x="55" y="125" width="20" height="20" fill="white" />
                  <rect x="80" y="80" width="8" height="8" fill="white" />
                  <rect x="100" y="80" width="8" height="8" fill="white" />
                  <rect x="120" y="80" width="8" height="8" fill="white" />
                  <rect x="80" y="100" width="8" height="8" fill="white" />
                  <rect x="120" y="100" width="8" height="8" fill="white" />
                  <rect x="80" y="120" width="8" height="8" fill="white" />
                  <rect x="50" y="80" width="100" height="2" fill="white" opacity="0.8" />
                  <circle cx="100" cy="160" r="25" fill="hsl(var(--primary))" className="group-hover:scale-110 transition-transform duration-300" />
                  <path d="M92 160 L98 166 L108 154" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="absolute -inset-4 rounded-2xl bg-gradient-primary opacity-0 blur-2xl group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Tebus & Nikmati</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-4">
                  Tunjukkan kode QR Anda di merchant untuk menebus promo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mitra Kami Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Mitra Kami
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Berkolaborasi dengan merchant terbaik untuk memberikan promo eksklusif untuk Anda
            </p>
          </div>

          {/* Infinite Carousel - Top Row (Scroll Right) */}
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-4 sm:gap-6 md:gap-8 animate-scroll-right">
              {[
                { name: 'KFC', color: 'bg-red-500' },
                { name: 'McD', color: 'bg-yellow-400' },
                { name: 'Pizza', color: 'bg-orange-500' },
                { name: 'Starbucks', color: 'bg-green-600' },
                { name: 'Domino', color: 'bg-blue-600' },
                { name: 'Burger', color: 'bg-red-600' },
                { name: 'JCO', color: 'bg-purple-500' },
                { name: 'Es', color: 'bg-blue-400' },
                { name: 'Bakery', color: 'bg-amber-500' },
                { name: 'Cafe', color: 'bg-amber-600' },
                { name: 'Resto', color: 'bg-indigo-500' },
                { name: 'Food', color: 'bg-pink-500' },
              ]
                .concat([
                  { name: 'KFC', color: 'bg-red-500' },
                  { name: 'McD', color: 'bg-yellow-400' },
                  { name: 'Pizza', color: 'bg-orange-500' },
                  { name: 'Starbucks', color: 'bg-green-600' },
                  { name: 'Domino', color: 'bg-blue-600' },
                  { name: 'Burger', color: 'bg-red-600' },
                  { name: 'JCO', color: 'bg-purple-500' },
                  { name: 'Es', color: 'bg-blue-400' },
                  { name: 'Bakery', color: 'bg-amber-500' },
                  { name: 'Cafe', color: 'bg-amber-600' },
                  { name: 'Resto', color: 'bg-indigo-500' },
                  { name: 'Food', color: 'bg-pink-500' },
                ])
                .map((merchant, index) => (
                  <div
                    key={`top-${index}`}
                    className="flex-shrink-0 group relative w-32 sm:w-40 h-32 sm:h-40 aspect-square bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 flex items-center justify-center hover:shadow-elegant-lg transition-all duration-300 hover:scale-105 hover:border-primary"
                  >
                    <div className={`${merchant.color} w-full h-full rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                      <span className="text-white font-bold text-xs sm:text-sm md:text-base text-center">
                        {merchant.name}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Infinite Carousel - Bottom Row (Scroll Left) */}
          <div>
            <div className="flex gap-4 sm:gap-6 md:gap-8 animate-scroll-left">
              {[
                { name: 'Food', color: 'bg-pink-500' },
                { name: 'Resto', color: 'bg-indigo-500' },
                { name: 'Cafe', color: 'bg-amber-600' },
                { name: 'Bakery', color: 'bg-amber-500' },
                { name: 'Es', color: 'bg-blue-400' },
                { name: 'JCO', color: 'bg-purple-500' },
                { name: 'Burger', color: 'bg-red-600' },
                { name: 'Domino', color: 'bg-blue-600' },
                { name: 'Starbucks', color: 'bg-green-600' },
                { name: 'Pizza', color: 'bg-orange-500' },
                { name: 'McD', color: 'bg-yellow-400' },
                { name: 'KFC', color: 'bg-red-500' },
              ]
                .concat([
                  { name: 'Food', color: 'bg-pink-500' },
                  { name: 'Resto', color: 'bg-indigo-500' },
                  { name: 'Cafe', color: 'bg-amber-600' },
                  { name: 'Bakery', color: 'bg-amber-500' },
                  { name: 'Es', color: 'bg-blue-400' },
                  { name: 'JCO', color: 'bg-purple-500' },
                  { name: 'Burger', color: 'bg-red-600' },
                  { name: 'Domino', color: 'bg-blue-600' },
                  { name: 'Starbucks', color: 'bg-green-600' },
                  { name: 'Pizza', color: 'bg-orange-500' },
                  { name: 'McD', color: 'bg-yellow-400' },
                  { name: 'KFC', color: 'bg-red-500' },
                ])
                .map((merchant, index) => (
                  <div
                    key={`bottom-${index}`}
                    className="flex-shrink-0 group relative w-32 sm:w-40 h-32 sm:h-40 aspect-square bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 flex items-center justify-center hover:shadow-elegant-lg transition-all duration-300 hover:scale-105 hover:border-primary"
                  >
                    <div className={`${merchant.color} w-full h-full rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                      <span className="text-white font-bold text-xs sm:text-sm md:text-base text-center">
                        {merchant.name}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 sm:p-12 md:p-16 text-center text-primary-foreground shadow-elegant-xl">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            
            <div className="relative space-y-6 sm:space-y-8 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                Dapatkan informasi tentang promo dan voucher menarik hampir setiap hari!
              </h2>
              
              {/* Email Subscription Form */}
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Masukkan email anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                  required
                />
                <Button 
                  type="submit"
                  size="lg"
                  className="h-12 px-6 sm:px-8 text-base bg-white text-primary hover:bg-white/90 shadow-elegant-lg"
                >
                  Subscribe
                </Button>
              </form>

              {/* Divider with "atau" */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-sm text-white/80">atau</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              {/* Register Button */}
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="h-12 px-8 text-base bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300"
              >
                <Link href={ROUTES.REGISTER}>Daftar sekarang!</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

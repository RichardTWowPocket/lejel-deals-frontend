import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Temukan Promo Terbaik
                <span className="block text-gradient-primary"> di Sekitar Anda</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-muted-foreground sm:text-2xl">
                Nikmati diskon eksklusif dari restoran dan merchant favorit Anda. Berlaku terbatas,
                tebus instan dengan kode QR.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row animate-slide-in">
              <Button size="lg" asChild className="h-14 px-8 text-lg shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300">
                <Link href={ROUTES.DEALS}>Lihat Promo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Link href="#how-it-works">Cara Kerja</Link>
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 gap-8 pt-16 sm:grid-cols-3 animate-fade-in">
              <div className="space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                <div className="text-5xl font-bold text-gradient-primary">500+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Promo Aktif</div>
              </div>
              <div className="space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                <div className="text-5xl font-bold text-gradient-secondary">100+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Merchant Mitra</div>
              </div>
              <div className="space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
                <div className="text-5xl font-bold text-gradient-primary">10K+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pelanggan Puas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Cara Kerja
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Dapatkan promo favorit Anda dalam tiga langkah sederhana
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-3xl font-bold text-white shadow-elegant-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-primary opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Jelajahi & Pilih</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Temukan promo eksklusif dari restoran dan merchant terbaik di sekitar Anda
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-secondary text-3xl font-bold text-white shadow-elegant-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-secondary opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Beli & Bayar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pembayaran aman melalui Midtrans dengan beragam metode
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-3xl font-bold text-white shadow-elegant-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-primary opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Tebus & Nikmati</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tunjukkan kode QR Anda di merchant untuk menebus promo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-16 text-center text-white shadow-elegant-xl">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            
            <div className="relative space-y-8">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Siap Hemat Mulai Hari Ini?
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-white/90">
                Bergabunglah dengan ribuan pelanggan yang sudah menikmati promo eksklusif
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" variant="secondary" asChild className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-elegant-lg">
                  <Link href={ROUTES.REGISTER}>Buat Akun</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                  <Link href={ROUTES.DEALS}>Lihat Semua Promo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

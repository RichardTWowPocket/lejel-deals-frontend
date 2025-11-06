import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-gradient-to-br from-muted/20 to-muted/40">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant-lg group-hover:shadow-elegant-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-lg sm:text-xl font-bold text-white">L</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gradient-primary group-hover:text-gradient-secondary transition-all duration-300">{APP_NAME}</span>
            </Link>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
              Temukan promo terbaik dari restoran dan merchant favorit Anda di Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-gradient-primary">Tautan Cepat</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href={ROUTES.DEALS} className="text-sm sm:text-base text-muted-foreground hover:text-gradient-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Telusuri Promo
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.MERCHANTS}
                  className="text-sm sm:text-base text-muted-foreground hover:text-gradient-secondary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Merchant
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CATEGORIES}
                  className="text-sm sm:text-base text-muted-foreground hover:text-gradient-primary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Kategori
                </Link>
              </li>
            </ul>
          </div>

          {/* For Merchants */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-gradient-secondary">Untuk Merchant</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href={ROUTES.MERCHANT_DASHBOARD}
                  className="text-sm sm:text-base text-muted-foreground hover:text-gradient-secondary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Dasbor Merchant
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm sm:text-base text-muted-foreground hover:text-gradient-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Jadi Mitra
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm sm:text-base text-muted-foreground hover:text-gradient-secondary transition-all duration-300 hover:translate-x-1 inline-block">
                  Cara Kerja
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-bold text-gradient-primary">Bantuan</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="#" className="text-sm sm:text-base text-muted-foreground hover:text-gradient-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm sm:text-base text-muted-foreground hover:text-gradient-secondary transition-all duration-300 hover:translate-x-1 inline-block">
                  Syarat Layanan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm sm:text-base text-muted-foreground hover:text-gradient-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm sm:text-base text-muted-foreground hover:text-gradient-secondary transition-all duration-300 hover:translate-x-1 inline-block">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-10 md:mt-12 border-t border-border/50 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            © {currentYear} <span className="font-semibold text-gradient-primary">{APP_NAME}</span>. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}


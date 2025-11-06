import type { NextConfig } from "next";

// Bundle analyzer (optional)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to succeed even if there are type errors
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: "/Users/richardtandean/Documents/work/lejel-deals-new",
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'date-fns',
      'html5-qrcode',
    ],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for large libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Recharts chunk (large library)
            recharts: {
              name: 'recharts',
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // QR Scanner chunk
            qrcode: {
              name: 'qrcode',
              test: /[\\/]node_modules[\\/]html5-qrcode[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);

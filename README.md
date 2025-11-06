# Lejel Deals Frontend

A modern, responsive frontend application for the Lejel Deals platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: Radix UI primitives
- **State Management**: 
  - React Query (TanStack Query) for server state
  - Zustand for client state
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Utilities**: date-fns

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (no auth)
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── customer/      # Customer dashboard
│   │   ├── merchant/      # Merchant dashboard
│   │   └── admin/         # Admin panel
│   ├── api/               # API routes
│   ├── globals.css        # Global styles with Tailwind v4
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Base UI components (Radix UI)
│   ├── layout/            # Layout components (Header, Footer)
│   ├── deal/              # Deal-specific components
│   ├── order/             # Order components
│   ├── coupon/            # Coupon components
│   ├── merchant/          # Merchant components
│   ├── payment/           # Payment components
│   ├── scanner/           # QR scanner components
│   └── common/            # Common components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── api.ts            # API client with Axios
│   ├── utils.ts          # Utility functions
│   └── constants.ts      # App constants and enums
├── types/                # TypeScript type definitions
├── utils/                # Additional utilities
└── styles/               # Additional styles
```

## 🎨 Design System

### Colors
- **Primary**: #ff6b6b (Brand red)
- **Secondary**: #4ecdc4 (Teal)
- **Accent**: #45b7d1 (Light blue)
- **Success**: #96ceb4 (Green)
- **Warning**: #ffeaa7 (Yellow)
- **Error**: #d63031 (Red)

### Typography
- **Font**: Inter (Google Fonts)
- Responsive font sizes and spacing

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn
- Backend API running on port 3000

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your configuration
```

Required environment variables:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3001
```

### Development

```bash
# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## 📦 Key Features Implemented

### ✅ Completed
- [x] Next.js 15 project with TypeScript and App Router
- [x] Tailwind CSS v4 with custom design tokens
- [x] Complete project structure
- [x] Core dependencies installed (Radix UI, React Query, etc.)
- [x] Environment configuration
- [x] ESLint and Prettier setup
- [x] Basic layout components (Header, Footer)
- [x] TypeScript path aliases configured
- [x] API client with Axios
- [x] Utility functions (currency, date formatting, etc.)
- [x] Constants and type definitions
- [x] Button component with variants
- [x] Homepage with hero section

### 🔄 In Progress
- [ ] Authentication flow (Login, Register)
- [ ] Deal listing and detail pages
- [ ] Merchant pages
- [ ] Category navigation
- [ ] Customer dashboard
- [ ] Merchant dashboard
- [ ] Admin panel
- [ ] Payment integration
- [ ] QR code scanner
- [ ] Notification system

## 🔌 API Integration

The frontend connects to the backend API running at `http://localhost:3000/api/v1`.

### API Client Features
- **Automatic token injection**: JWT tokens automatically added to requests
- **Response interceptors**: Standardized error handling
- **Type-safe requests**: TypeScript interfaces for all API responses
- **Retry logic**: Automatic retry for failed requests

Example usage:
```typescript
import { apiClient } from '@/lib/api';

// GET request
const deals = await apiClient.get('/deals');

// POST request
const order = await apiClient.post('/orders', orderData);
```

## 🎨 UI Components

### Available Components
- **Button**: Primary, secondary, outline, ghost, link variants
- **Layout**: Header with navigation, Footer with links
- More components coming soon...

### Creating New Components
```bash
# Create a new UI component
touch src/components/ui/card.tsx

# Create a feature-specific component
touch src/components/deal/deal-card.tsx
```

## 📝 Code Style

This project uses:
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **TypeScript**: For type safety

Configuration files:
- `.prettierrc`: Prettier configuration
- `eslint.config.mjs`: ESLint configuration
- `tsconfig.json`: TypeScript configuration

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment
```bash
# Build the project
npm run build

# Start production server
npm run start
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ by the Lejel Deals Team**

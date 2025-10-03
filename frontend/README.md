# Frontend - Next.js Virtual Try-On Application

A modern, responsive frontend for the virtual try-on platform built with Next.js 14, TypeScript, and advanced UI components.

## 🏗️ Architecture

### Technology Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Framer Motion** for animations
- **TanStack Query** for data fetching
- **next-themes** for theme management
- **next-seo** for SEO optimization

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Route group for main app
│   ├── (shop)/            # Route group for shopping
│   │   ├── products/      # Product catalog & details
│   │   └── try-on/        # Virtual try-on flow
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui base components
│   ├── navbar.tsx        # Navigation
│   ├── footer.tsx        # Footer
│   └── ...               # Feature components
├── lib/                  # Utilities & configurations
│   ├── api.ts           # API client
│   ├── products.ts      # Product API functions
│   ├── tryon.ts         # Try-on API functions
│   └── utils.ts         # Helper utilities
├── types/               # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+ or yarn
- Backend API running on port 8080

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

### Environment Setup
Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_ENABLE_INFINITE_SCROLL=true
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

## 📱 Features

### Core Pages
- **Homepage** - Hero section with features and how-it-works
- **Products** - Responsive product grid with loading states
- **Product Detail** - Individual product view with try-on CTA
- **Try-On** - Complete virtual try-on workflow

### UI Components
- **Responsive Design** - Mobile-first approach
- **Dark/Light Themes** - System preference + manual toggle
- **Loading States** - Skeleton components and progress indicators
- **Error Boundaries** - Graceful error handling
- **Toast Notifications** - User feedback system

### Advanced Features
- **Image Upload** - Drag & drop with validation
- **Real-time Polling** - Job status updates
- **Optimized Images** - Next.js Image component with lazy loading
- **SEO Optimization** - Dynamic metadata and Open Graph
- **Animations** - Smooth transitions with Framer Motion

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
npm run format       # Format code with Prettier
```

### Code Quality
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting with Next.js config
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates

### Performance
- **Next.js Image** - Automatic optimization and lazy loading
- **Code Splitting** - Automatic route-based splitting
- **Bundle Analysis** - `npm run analyze` to check bundle size
- **Server Components** - SSR for initial page loads

## 🎨 Styling

### Tailwind CSS
- Custom design system with CSS variables
- Dark mode support via `next-themes`
- Responsive breakpoints
- Custom animations and utilities

### Component Library
shadcn/ui components with full customization:
- Button, Card, Input, Toast
- Skeleton loaders
- Progress indicators
- Theme-aware styling

### Theming
```tsx
// Theme toggle component
import { ThemeToggle } from '@/components/theme-toggle'

// Usage
<ThemeToggle />
```

## 🔌 API Integration

### API Client
Type-safe API client with error handling:
```typescript
// Products
import { productApi } from '@/lib/products'
const products = await productApi.getProducts()

// Try-on
import { tryOnApi } from '@/lib/tryon'
const job = await tryOnApi.submitTryOnJob(productId, userImage, prompt)
```

### Data Fetching
TanStack Query for server state management:
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: productKeys.lists(),
  queryFn: productApi.getProducts,
})
```

### Error Handling
- Network error recovery
- API error messages
- Loading states
- Retry mechanisms

## 🔍 SEO & Metadata

### Next.js SEO
```tsx
import { NextSeo } from 'next-seo'

<NextSeo
  title="Product Name"
  description="Product description"
  openGraph={{
    images: [{ url: product.imageUrl }]
  }}
/>
```

### Features
- Dynamic page titles
- Meta descriptions
- Open Graph tags
- Twitter cards
- Canonical URLs
- Structured data

## 📊 Performance Monitoring

### Core Web Vitals
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### Optimization
- Image optimization with `next/image`
- Code splitting and lazy loading
- Preloading critical resources
- Bundle size monitoring

### Development Tools
- React Query DevTools
- Next.js built-in analytics
- Browser Performance tab

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Test production build locally
npm start
```

### Environment Variables
```bash
# Production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_DEBUG=false

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Deployment Platforms
- **Vercel** (recommended) - Zero config deployment
- **Netlify** - Static site deployment
- **AWS/GCP/Azure** - Custom server deployment

## 🔧 Troubleshooting

### Common Issues

**Module Resolution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Type Errors:**
```bash
# Check TypeScript
npm run type-check
```

**Build Errors:**
```bash
# Verbose build output
npm run build -- --debug
```

### Performance Issues
- Check bundle size with `npm run build`
- Use React DevTools Profiler
- Monitor Network tab in browser

### API Connection
- Verify backend is running
- Check CORS configuration
- Validate environment variables

## 🔒 Security

### Best Practices
- No sensitive data in client-side code
- API URL validation
- File upload restrictions
- XSS protection via React
- CSRF protection on API calls

### Environment Variables
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Keep sensitive data server-side only
- Validate all user inputs

## 📚 Documentation

### Component Usage
```tsx
// Product card with animations
<ProductCard 
  product={product}
  className="hover:scale-105"
/>

// Image upload with validation
<ImageUpload
  onImageChange={setImage}
  maxSize={10}
  label="Upload Photo"
/>
```

### Custom Hooks
```tsx
// Use try-on job polling
const { job, isPolling } = useTryOnJob(jobId)

// Use theme
const { theme, setTheme } = useTheme()
```

## 🎯 Future Enhancements

### Planned Features
- Infinite scroll for products
- Advanced filtering and search
- User accounts and wishlists
- Social sharing
- Product reviews

### Technical Improvements
- PWA capabilities
- Offline support
- Enhanced animations
- A/B testing framework
- Performance monitoring

---

**Built with ❤️ using modern web technologies**

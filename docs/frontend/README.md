# Frontend Documentation

## Overview

The Virtual Try-On Frontend is a modern Next.js application that provides an intuitive user interface for AI-powered virtual try-on experiences. Built with React, TypeScript, and Tailwind CSS, it offers a seamless workflow for users to try on products virtually.

## Architecture

### Technologies Used
- **Next.js 14**: React framework with app router and server-side rendering
- **React 18**: Component-based UI library with hooks and modern patterns
- **TypeScript**: Type-safe JavaScript with enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful icon library for UI components
- **React Dropzone**: Drag-and-drop file upload component

### Project Structure
```
src/
├── app/                           # Next.js app router
│   ├── globals.css               # Global styles and Tailwind imports
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Homepage
│   ├── product/                  # Product pages
│   │   └── [id]/
│   │       └── page.tsx          # Dynamic product page
│   └── try-on/                   # Try-on pages
│       └── [id]/
│           └── page.tsx          # Try-on interface
├── components/                    # Reusable UI components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx            # Button component with variants
│   │   ├── card.tsx              # Card component for content sections
│   │   ├── input.tsx             # Input field component
│   │   └── toast.tsx             # Toast notification component
│   ├── image-upload.tsx          # File upload with drag-and-drop
│   ├── product-card.tsx          # Product display card
│   └── try-on-interface.tsx      # Virtual try-on UI
├── lib/                          # Utility functions and API clients
│   ├── api.ts                    # HTTP client and API configuration
│   ├── tryon.ts                  # Try-on API integration
│   └── utils.ts                  # Common utility functions
├── types/                        # TypeScript type definitions
│   └── api.ts                    # API response and request types
└── hooks/                        # Custom React hooks
    └── use-products.ts           # Product data fetching hook
```

### Styling Architecture
- **Tailwind CSS**: Primary styling system with custom configuration
- **CSS Variables**: Theme-aware color system for light/dark modes
- **Component Variants**: Type-safe component styling with `class-variance-authority`
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Pages and Routing

### Homepage (`/`)
**File**: `src/app/page.tsx`

The main landing page showcasing available products.

**Features:**
- Product grid display
- Product filtering and search
- Responsive layout for all devices
- Direct navigation to product details

**Key Components:**
- Product listing grid
- Navigation header
- Call-to-action sections

### Product Page (`/product/[id]`)
**File**: `src/app/product/[id]/page.tsx`

Individual product detail pages with try-on initiation.

**Features:**
- Product information display
- High-quality product images
- "Try Yourself" button for virtual try-on
- Product specifications and pricing

**Dynamic Routing:**
- Uses Next.js dynamic segments `[id]`
- Fetches product data based on URL parameter
- SEO-optimized with dynamic metadata

### Try-On Interface (`/try-on/[id]`)
**File**: `src/app/try-on/[id]/page.tsx`

Interactive virtual try-on experience.

**Features:**
- Image upload interface
- Real-time processing feedback
- Result display and sharing
- Error handling and retry options

## Components

### ImageUpload Component
**File**: `src/components/image-upload.tsx`

Handles user image uploads with drag-and-drop functionality.

**Features:**
- Drag-and-drop file upload
- File type validation (JPEG, PNG)
- File size validation (max 10MB)
- Preview functionality
- Progress indicators

**Props:**
```typescript
interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  maxSize?: number;
  accept?: string[];
  className?: string;
}
```

### ProductCard Component  
**File**: `src/components/product-card.tsx`

Displays product information in a card format.

**Features:**
- Product image display
- Product name and description
- Price formatting
- Navigation to product details
- Responsive design

**Props:**
```typescript
interface ProductCardProps {
  product: Product;
  className?: string;
}
```

### TryOnInterface Component
**File**: `src/components/try-on-interface.tsx`

Main interface for the virtual try-on process.

**Features:**
- Image upload integration
- Processing status display
- Result image presentation
- Error handling and user feedback
- Retry functionality

### UI Components
**Directory**: `src/components/ui/`

Base UI components built with Tailwind CSS and accessibility in mind.

**Available Components:**
- `Button`: Multiple variants (primary, secondary, outline, ghost)
- `Card`: Content containers with header, body, and footer
- `Input`: Form input fields with validation states
- `Toast`: Notification system for user feedback

## API Integration

### API Client
**File**: `src/lib/api.ts`

Centralized HTTP client for backend communication.

**Features:**
- Base URL configuration
- Request/response interceptors
- Error handling
- Type-safe API calls

**Configuration:**
```typescript
const API_BASE_URL = 'http://localhost:8080';

export const apiClient = {
  get: <T>(url: string): Promise<T> => { /* ... */ },
  post: <T>(url: string, data: any): Promise<T> => { /* ... */ },
  postFormData: <T>(url: string, formData: FormData): Promise<T> => { /* ... */ }
};
```

### Try-On API
**File**: `src/lib/tryon.ts`

Specialized API functions for virtual try-on operations.

**Features:**
- Try-on job submission
- Result polling
- Error handling
- Type-safe responses

**Main Functions:**
```typescript
export const tryOnApi = {
  submitTryOnJobWithProduct: (productId: string, userImage: File, prompt: string): Promise<TryOnJob>,
  submitTryOnJobWithImage: (productImage: File, userImage: File, prompt: string): Promise<TryOnJob>
};
```

## State Management

### Local State
- **React useState**: Component-level state for UI interactions
- **React useEffect**: Side effects and lifecycle management
- **Custom Hooks**: Reusable state logic for common patterns

### Data Fetching
- **Server Components**: Fetch data at build/request time where possible
- **Client Components**: Interactive components with state management
- **Error Boundaries**: Graceful error handling for failed requests

## Type System

### API Types
**File**: `src/types/api.ts`

TypeScript definitions for all API interactions.

**Key Types:**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: string;
  price: number;
}

interface TryOnJob {
  jobId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  resultImageUrl: string | null;
  processingTimeMs: number;
  prompt: string;
}

interface TryOnRequest {
  productId: string;
  userImage: File;
  prompt?: string;
}
```

## User Experience

### Navigation Flow
1. **Homepage** → Browse available products
2. **Product Page** → View product details and initiate try-on
3. **Try-On Interface** → Upload image and process virtual try-on
4. **Results** → View generated try-on result

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for medium screens
- **Desktop Experience**: Full-featured interface for large screens

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Clear focus indicators and logical tab order

## Performance Optimization

### Image Optimization
- **Next.js Image Component**: Automatic optimization and lazy loading
- **Responsive Images**: Multiple sizes for different devices
- **Format Selection**: WebP/AVIF with fallbacks

### Code Splitting
- **Route-Based**: Automatic code splitting by Next.js pages
- **Component-Based**: Dynamic imports for large components
- **Tree Shaking**: Unused code elimination

### Caching Strategy
- **Static Generation**: Pre-render pages at build time where possible
- **API Caching**: Cache API responses for better performance
- **Browser Caching**: Optimized cache headers for static assets

## Development

### Getting Started

1. **Prerequisites:**
   ```bash
   node --version  # Should be 18+ 
   npm --version   # Should be 9+
   ```

2. **Installation:**
   ```bash
   cd frontend
   npm install
   ```

3. **Development Server:**
   ```bash
   npm run dev
   ```

4. **Access Application:**
   - Local: http://localhost:3000
   - Network: http://[your-ip]:3000

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

### Environment Configuration

Create `.env.local` for local development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Testing

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and user flows
- **E2E Tests**: Complete user journey testing
- **Visual Regression**: UI consistency testing

### Test Structure
```
__tests__/
├── components/          # Component unit tests
├── pages/              # Page integration tests
├── lib/                # Utility function tests
└── e2e/                # End-to-end tests
```

## Build and Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm run start
```

### Static Export (if needed)
```bash
# Configure next.config.js for static export
npm run build && npm run export
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ANALYTICS_ID=production_analytics_id
```

## Security

### Content Security Policy
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; img-src 'self' data: https:; script-src 'self'"
  }
];
```

### Input Validation
- **File Upload**: Type and size validation
- **Form Inputs**: Client-side validation with server-side verification
- **API Requests**: Type-safe API calls with error handling

### HTTPS Enforcement
- **Production**: Always use HTTPS in production
- **Development**: HTTP acceptable for local development
- **Mixed Content**: Avoid mixing HTTP and HTTPS resources

## Browser Support

### Supported Browsers
- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

### Progressive Enhancement
- **Core Functionality**: Works in all supported browsers
- **Enhanced Features**: Modern browser features with fallbacks
- **Graceful Degradation**: Maintains usability in older browsers

## Troubleshooting

### Common Issues

1. **Build Errors:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Type Errors:**
   ```bash
   # Run type checking
   npm run type-check
   ```

3. **API Connection Issues:**
   ```bash
   # Check backend server status
   curl http://localhost:8080/actuator/health
   ```

4. **File Upload Issues:**
   - Verify file size limits
   - Check supported file types
   - Confirm network connectivity

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Type checking in watch mode
npm run type-check -- --watch
```

## Best Practices

### Code Organization
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Prefer composition over inheritance
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Type Safety**: Use TypeScript for all code

### Performance
- **Lazy Loading**: Load components and images as needed
- **Memoization**: Use React.memo for expensive components
- **Bundle Analysis**: Regularly analyze bundle size
- **Core Web Vitals**: Monitor and optimize performance metrics

### Accessibility
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Add accessibility attributes where needed
- **Keyboard Navigation**: Ensure all functionality is keyboard accessible
- **Color Independence**: Don't rely solely on color for information

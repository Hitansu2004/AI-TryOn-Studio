# Development Guide

## Getting Started

### Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended editor with extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to http://localhost:3000

---

## Development Workflow

### Daily Development Process

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Make changes and test:**
   - Write code
   - Test in browser
   - Run type checking: `npm run type-check`
   - Run linting: `npm run lint`

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Quality Checks

Run these commands before committing:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build test
npm run build
```

---

## Project Structure Deep Dive

### App Router Structure

```
src/app/
├── globals.css           # Global styles and Tailwind imports
├── layout.tsx           # Root layout with providers
├── page.tsx             # Homepage (product listing)
├── loading.tsx          # Global loading UI
├── error.tsx            # Global error UI
├── not-found.tsx        # 404 page
├── product/             # Product routes
│   └── [id]/
│       ├── page.tsx     # Product detail page
│       ├── loading.tsx  # Product loading UI
│       └── error.tsx    # Product error UI
└── try-on/              # Try-on routes
    └── [id]/
        ├── page.tsx     # Try-on interface
        ├── loading.tsx  # Try-on loading UI
        └── error.tsx    # Try-on error UI
```

### Component Architecture

```
src/components/
├── ui/                  # Base UI components (reusable)
│   ├── button.tsx       # Button with variants
│   ├── card.tsx         # Card components
│   ├── input.tsx        # Input field
│   └── toast.tsx        # Toast notifications
├── layout/              # Layout components
│   ├── header.tsx       # Navigation header
│   ├── footer.tsx       # Page footer
│   └── sidebar.tsx      # Sidebar (if needed)
├── forms/               # Form-specific components
│   ├── image-upload.tsx # File upload component
│   └── contact-form.tsx # Contact form
└── features/            # Feature-specific components
    ├── product-card.tsx # Product display
    ├── product-grid.tsx # Product listing
    └── try-on-interface.tsx # Try-on UI
```

---

## Styling System

### Tailwind CSS Configuration

**File**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### CSS Variables

**File**: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Component Styling Patterns

1. **Base Styles**: Use Tailwind utilities
2. **Variants**: Use `class-variance-authority` for component variants
3. **Responsive**: Mobile-first responsive design
4. **Dark Mode**: CSS variables for theme switching

```tsx
// Good styling pattern
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
```

---

## State Management

### Local Component State

Use `useState` for simple component state:

```tsx
function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Component logic...
}
```

### Custom Hooks for Complex State

Extract complex state logic into custom hooks:

```tsx
// hooks/use-try-on.ts
export function useTryOn(productId: string) {
  const [job, setJob] = useState<TryOnJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitTryOn = useCallback(async (userImage: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await tryOnApi.submitTryOnJobWithProduct(
        productId,
        userImage,
        ""
      );
      setJob(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  }, [productId]);

  return { job, isProcessing, error, submitTryOn };
}
```

### Global State (if needed)

For global state, consider React Context:

```tsx
// contexts/app-context.tsx
interface AppContextType {
  user: User | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <AppContext.Provider value={{ user, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

---

## API Integration

### API Client Setup

**File**: `src/lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### Error Handling

Implement consistent error handling:

```tsx
// utils/error-handling.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 404:
        return 'Resource not found.';
      case 413:
        return 'File too large. Please use a smaller image.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}
```

### Data Fetching Patterns

#### Server Components (Recommended)

```tsx
// app/products/page.tsx
async function ProductsPage() {
  const products = await fetchProducts();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    cache: 'force-cache', // or 'no-store' for dynamic data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}
```

#### Client Components (When Needed)

```tsx
// components/dynamic-product-list.tsx
'use client';

export function DynamicProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Testing

### Test Setup

**File**: `jest.config.js`

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

**File**: `jest.setup.js`

```javascript
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));
```

### Component Testing

```tsx
// __tests__/components/product-card.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/product-card';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  imageUrl: '/test-image.jpg',
  category: 'clothing',
  price: 99.99,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('handles missing image gracefully', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: null };
    render(<ProductCard product={productWithoutImage} />);
    
    // Should show placeholder or handle missing image
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });
});
```

### Integration Testing

```tsx
// __tests__/pages/product.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductPage from '@/app/product/[id]/page';

// Mock API calls
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('Product Page', () => {
  it('loads and displays product details', async () => {
    const mockProduct = {
      id: '1',
      name: 'Summer Dress',
      description: 'Beautiful summer dress',
      imageUrl: '/dress.jpg',
      category: 'clothing',
      price: 89.99,
    };

    (require('@/lib/api').apiClient.get as jest.Mock)
      .mockResolvedValue(mockProduct);

    render(<ProductPage params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText('Summer Dress')).toBeInTheDocument();
    });

    expect(screen.getByText('Beautiful summer dress')).toBeInTheDocument();
    expect(screen.getByText('$89.99')).toBeInTheDocument();
  });
});
```

### E2E Testing (Optional)

If you want to add E2E testing with Playwright:

```typescript
// e2e/try-on-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete try-on flow', async ({ page }) => {
  // Navigate to product page
  await page.goto('/product/1');
  
  // Click "Try Yourself" button
  await page.click('text=Try Yourself');
  
  // Upload image
  await page.setInputFiles('input[type="file"]', 'test-image.jpg');
  
  // Start processing
  await page.click('text=Visualize');
  
  // Wait for result
  await expect(page.locator('[data-testid="try-on-result"]')).toBeVisible({
    timeout: 30000,
  });
});
```

---

## Performance Optimization

### Bundle Analysis

Add bundle analyzer:

```bash
npm install --save-dev @next/bundle-analyzer
```

**File**: `next.config.js`

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});
```

Run analysis:

```bash
ANALYZE=true npm run build
```

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card">
      <Image
        src={product.imageUrl || '/placeholder.jpg'}
        alt={product.name}
        width={400}
        height={300}
        priority={false} // Set to true for above-the-fold images
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      />
      {/* Rest of component */}
    </div>
  );
}
```

### Code Splitting

Dynamic imports for large components:

```tsx
import dynamic from 'next/dynamic';

const TryOnInterface = dynamic(
  () => import('@/components/try-on-interface'),
  {
    loading: () => <TryOnInterfaceSkeleton />,
    ssr: false, // Disable SSR if component is client-only
  }
);
```

### Memoization

Use React.memo and useMemo appropriately:

```tsx
// Memoize expensive components
const ProductCard = React.memo(({ product }: ProductCardProps) => {
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
});

// Memoize expensive calculations
function ProductList({ products, filters }: ProductListProps) {
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      filters.category ? product.category === filters.category : true
    );
  }, [products, filters]);

  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Debugging

### Development Tools

1. **React Developer Tools**: Browser extension for React debugging
2. **Next.js DevTools**: Built-in Next.js debugging features
3. **Network Tab**: Monitor API calls and performance
4. **Lighthouse**: Performance and accessibility auditing

### Debugging Techniques

#### Console Debugging

```tsx
function TryOnInterface({ productId }: TryOnInterfaceProps) {
  const [job, setJob] = useState<TryOnJob | null>(null);
  
  // Debug state changes
  useEffect(() => {
    console.log('Job state changed:', job);
  }, [job]);
  
  // Debug render cycles
  console.log('TryOnInterface render', { productId, job });
  
  return (
    // Component JSX
  );
}
```

#### Error Boundaries

```tsx
// components/error-boundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

#### Debug Environment Variables

```bash
# .env.local
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```tsx
const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

if (isDebug) {
  console.log('Debug mode enabled');
}
```

---

## Deployment Preparation

### Production Build

```bash
# Create production build
npm run build

# Test production build locally
npm run start
```

### Environment Variables

**Production `.env.production`:**

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Build Optimization

**File**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployment
  images: {
    domains: ['api.yourdomain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;
```

---

## Best Practices Summary

1. **Code Organization**: Use consistent file structure and naming
2. **Type Safety**: Leverage TypeScript for better development experience
3. **Performance**: Optimize images, use code splitting, and memoization
4. **Accessibility**: Ensure keyboard navigation and screen reader support
5. **Testing**: Write tests for critical user flows
6. **Error Handling**: Implement comprehensive error boundaries and fallbacks
7. **Documentation**: Keep components documented and maintainable
8. **Version Control**: Use meaningful commit messages and proper branching

Remember to regularly update dependencies and follow React and Next.js best practices as they evolve.

# Component Reference

## Overview

This document provides detailed reference for all React components in the Virtual Try-On Frontend application.

---

## UI Components (`src/components/ui/`)

### Button Component
**File**: `src/components/ui/button.tsx`

A versatile button component with multiple variants and sizes.

#### Props
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

#### Variants
- **default**: Primary button style with brand colors
- **destructive**: Red button for dangerous actions
- **outline**: Bordered button with transparent background
- **secondary**: Subtle button with gray background
- **ghost**: Minimal button with hover effects
- **link**: Text-only button styled as a link

#### Sizes
- **default**: Standard button size (h-10 px-4 py-2)
- **sm**: Small button (h-9 px-3)
- **lg**: Large button (h-11 px-8)
- **icon**: Square button for icons (h-10 w-10)

#### Usage Examples
```tsx
// Primary button
<Button>Submit</Button>

// Outline variant
<Button variant="outline">Cancel</Button>

// Large destructive button
<Button variant="destructive" size="lg">Delete</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Search className="h-4 w-4" />
</Button>
```

---

### Card Component
**File**: `src/components/ui/card.tsx`

Container component for organizing content sections.

#### Components
- **Card**: Main container
- **CardHeader**: Top section for titles and actions
- **CardTitle**: Main heading
- **CardDescription**: Subtitle or description
- **CardContent**: Main content area
- **CardFooter**: Bottom section for actions

#### Props
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

#### Usage Example
```tsx
<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Brief product description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Try Now</Button>
  </CardFooter>
</Card>
```

---

### Input Component
**File**: `src/components/ui/input.tsx`

Form input field with consistent styling.

#### Props
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
}
```

#### Features
- **Validation States**: Visual feedback for valid/invalid states
- **Accessibility**: Proper ARIA attributes and focus management
- **Responsive**: Consistent sizing across devices

#### Usage Examples
```tsx
// Basic text input
<Input placeholder="Enter your name" />

// Email input with validation
<Input type="email" placeholder="your@email.com" required />

// Number input with constraints
<Input type="number" min={0} max={100} />
```

---

### Toast Component
**File**: `src/components/ui/toast.tsx`

Notification system for user feedback.

#### Components
- **ToastProvider**: Context provider for toast system
- **ToastViewport**: Container for rendered toasts
- **Toast**: Individual toast notification
- **ToastAction**: Action button within toast
- **ToastClose**: Close button
- **ToastTitle**: Toast heading
- **ToastDescription**: Toast content

#### Props
```typescript
interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  variant?: 'default' | 'destructive';
}

interface ToastActionProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {}
```

#### Usage Example
```tsx
// In your app layout
<ToastProvider>
  {/* Your app content */}
  <ToastViewport />
</ToastProvider>

// Triggering a toast
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();
  
  const showSuccess = () => {
    toast({
      title: "Success!",
      description: "Your image has been uploaded.",
    });
  };
  
  const showError = () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to upload image.",
    });
  };
}
```

---

## Feature Components (`src/components/`)

### ImageUpload Component
**File**: `src/components/image-upload.tsx`

Drag-and-drop file upload component for user images.

#### Props
```typescript
interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  maxSize?: number;
  accept?: string[];
  className?: string;
}
```

#### Features
- **Drag & Drop**: Visual feedback for drag operations
- **File Validation**: Type and size validation
- **Preview**: Image preview before upload
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation support

#### Validation
- **File Types**: JPEG, PNG (configurable)
- **File Size**: Default 10MB maximum (configurable)
- **Image Dimensions**: No specific limits (auto-resize)

#### Usage Example
```tsx
const [selectedFile, setSelectedFile] = useState<File | null>(null);

<ImageUpload
  onImageChange={setSelectedFile}
  maxSize={10 * 1024 * 1024} // 10MB
  accept={['image/jpeg', 'image/png']}
  className="w-full h-64"
/>
```

#### Error States
- **File too large**: Shows size limit message
- **Invalid type**: Shows supported formats
- **Upload failed**: Shows retry option

---

### ProductCard Component
**File**: `src/components/product-card.tsx`

Display component for product information in grid layouts.

#### Props
```typescript
interface ProductCardProps {
  product: Product;
  className?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: string;
  price: number;
}
```

#### Features
- **Image Display**: Optimized product images with fallbacks
- **Price Formatting**: Localized currency display
- **Navigation**: Click to view product details
- **Responsive**: Adapts to grid layouts
- **Loading States**: Skeleton loading animation

#### Usage Example
```tsx
const products = await fetchProducts();

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

#### Responsive Behavior
- **Mobile**: Single column, full width
- **Tablet**: Two columns
- **Desktop**: Three or four columns

---

### TryOnInterface Component
**File**: `src/components/try-on-interface.tsx`

Main interface for virtual try-on functionality.

#### Props
```typescript
interface TryOnInterfaceProps {
  productId: string;
  product?: Product;
  onResult?: (result: TryOnJob) => void;
}
```

#### Features
- **Image Upload**: Integrated ImageUpload component
- **Processing Status**: Real-time feedback during AI processing
- **Result Display**: Generated try-on image presentation
- **Error Handling**: Comprehensive error states and recovery
- **Retry Logic**: Allow users to retry failed requests

#### States
- **Initial**: Ready for image upload
- **Uploading**: File upload in progress
- **Processing**: AI generation in progress
- **Completed**: Showing results
- **Error**: Error state with retry option

#### Usage Example
```tsx
<TryOnInterface
  productId="1"
  product={product}
  onResult={(result) => {
    console.log('Try-on completed:', result);
    // Handle result (e.g., analytics, sharing)
  }}
/>
```

#### Processing Flow
1. User uploads image
2. Image validation and preview
3. Submit to backend API
4. Show processing indicator
5. Display result or error
6. Provide sharing options

---

## Custom Hooks (`src/hooks/`)

### useProducts Hook
**File**: `src/hooks/use-products.ts`

Custom hook for product data management.

#### Features
- **Data Fetching**: Automatic product loading
- **Caching**: Prevent unnecessary API calls
- **Loading States**: Loading and error state management
- **Type Safety**: Full TypeScript support

#### Return Value
```typescript
interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

#### Usage Example
```tsx
function ProductList() {
  const { products, loading, error, refetch } = useProducts();
  
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Component Patterns

### Composition Pattern

Components are designed for composition:

```tsx
// Good: Composable structure
<Card>
  <CardHeader>
    <CardTitle>Upload Your Photo</CardTitle>
  </CardHeader>
  <CardContent>
    <ImageUpload onImageChange={handleImageChange} />
  </CardContent>
  <CardFooter>
    <Button onClick={handleSubmit}>Process</Button>
  </CardFooter>
</Card>
```

### Conditional Rendering

Handle different states gracefully:

```tsx
function TryOnResult({ result }: { result: TryOnJob | null }) {
  if (!result) {
    return <div>No result available</div>;
  }
  
  if (result.status === 'PROCESSING') {
    return <ProcessingIndicator />;
  }
  
  if (result.status === 'FAILED') {
    return <ErrorMessage onRetry={handleRetry} />;
  }
  
  return <ResultImage src={result.resultImageUrl} />;
}
```

### Error Boundaries

Wrap components in error boundaries:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <TryOnInterface productId={productId} />
</ErrorBoundary>
```

---

## Styling Guidelines

### Tailwind Classes

Use consistent Tailwind utility classes:

```tsx
// Spacing
className="p-4 m-2 space-y-4"

// Layout
className="flex flex-col items-center justify-center"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Interactive states
className="hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
```

### Component Variants

Use `class-variance-authority` for component variants:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3"
      }
    }
  }
);
```

---

## Accessibility Guidelines

### Semantic HTML

Use proper HTML elements:

```tsx
// Good
<button onClick={handleClick}>Submit</button>
<nav aria-label="Main navigation">
<main role="main">

// Avoid
<div onClick={handleClick}>Submit</div>
```

### ARIA Attributes

Add ARIA labels where needed:

```tsx
<button 
  aria-label="Upload image"
  aria-describedby="upload-help"
>
  <Upload className="h-4 w-4" />
</button>
<div id="upload-help">
  Drag and drop an image or click to browse
</div>
```

### Focus Management

Ensure proper focus management:

```tsx
// Focus trapping in modals
<Dialog onOpenChange={setOpen}>
  <DialogContent>
    <DialogTitle>Upload Image</DialogTitle>
    <ImageUpload />
    <DialogClose>Cancel</DialogClose>
  </DialogContent>
</Dialog>
```

---

## Performance Optimization

### React.memo

Memoize expensive components:

```tsx
const ProductCard = React.memo(({ product }: ProductCardProps) => {
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
});
```

### useCallback

Memoize event handlers:

```tsx
const handleImageChange = useCallback((file: File | null) => {
  setSelectedFile(file);
  // Additional logic
}, []);
```

### Code Splitting

Dynamic imports for large components:

```tsx
const TryOnInterface = dynamic(
  () => import('./try-on-interface'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false 
  }
);
```

---

## Testing Components

### Unit Testing

Test component behavior:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('button handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Testing

Test component interactions:

```tsx
test('image upload component validates file size', async () => {
  const onImageChange = jest.fn();
  render(<ImageUpload onImageChange={onImageChange} maxSize={1024} />);
  
  const file = new File(['content'], 'large.jpg', { type: 'image/jpeg' });
  Object.defineProperty(file, 'size', { value: 2048 });
  
  const input = screen.getByLabelText(/upload/i);
  fireEvent.change(input, { target: { files: [file] } });
  
  expect(screen.getByText(/file too large/i)).toBeInTheDocument();
  expect(onImageChange).not.toHaveBeenCalled();
});
```

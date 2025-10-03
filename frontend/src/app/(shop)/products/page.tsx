'use client';

import React from 'react';
import { ProductGrid } from '@/components/product-grid';

export default function ProductsPage() {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  // Initialize component on client side
  React.useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">
            Failed to load products. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Prevent hydration mismatch by ensuring client-side rendering
  if (!mounted) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Discover our collection and try them on virtually
          </p>
        </div>
        
        {/* Show skeleton loading on server and initial client render */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Discover our collection and try them on virtually
          </p>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </>
  );
}

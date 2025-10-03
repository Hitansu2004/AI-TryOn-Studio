'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types/api';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn('group transition-transform hover:-translate-y-1', className)}>
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" asChild>
                <Link href={`/products/${product.id}`}>
                  View Details
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/try-on?productId=${product.id}`}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Try Yourself
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            SKU: {product.sku}
          </p>
          {product.color && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Color:</span>
              <span className="text-sm font-medium">{product.color}</span>
            </div>
          )}
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex w-full space-x-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/products/${product.id}`}>
                <ShoppingBag className="h-4 w-4 mr-1" />
                Details
              </Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/try-on?productId=${product.id}`}>
                <Sparkles className="h-4 w-4 mr-1" />
                Try Yourself
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

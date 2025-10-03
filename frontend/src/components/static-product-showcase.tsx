'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const products = [
  {
    id: 1,
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    image: '/products/product-1.jpg',
    category: 'T-Shirts',
    rating: 4.8,
    reviews: 234,
    isNew: true,
    isTrending: false,
  },
  {
    id: 2,
    name: 'Designer Denim Jacket',
    price: 89.99,
    originalPrice: 129.99,
    image: '/products/product-2.jpg',
    category: 'Jackets',
    rating: 4.9,
    reviews: 156,
    isNew: false,
    isTrending: true,
  },
  {
    id: 3,
    name: 'Elegant Summer Dress',
    price: 79.99,
    image: '/products/product-3.avif',
    category: 'Dresses',
    rating: 4.7,
    reviews: 189,
    isNew: true,
    isTrending: true,
  },
  {
    id: 4,
    name: 'Classic Polo Shirt',
    price: 45.99,
    originalPrice: 59.99,
    image: '/products/product-4.jpg',
    category: 'Polo',
    rating: 4.6,
    reviews: 298,
    isNew: false,
    isTrending: false,
  },
];

export function StaticProductShowcase() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Discover our handpicked collection of trendy clothes. Try them on virtually before making your purchase.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white">NEW</Badge>
                  )}
                  {product.isTrending && (
                    <Badge className="bg-orange-500 text-white">TRENDING</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge className="bg-red-500 text-white">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full bg-white/90">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full bg-white/90">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Try On overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-6 py-3"
                    asChild
                  >
                    <Link href="/try-on">
                      Try On Virtual
                    </Link>
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>★</span>
                      <span>{product.rating}</span>
                      <span>({product.reviews})</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-gray-100">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                    <Link href={`/products/${product.id}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-3 text-lg border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950"
            asChild
          >
            <Link href="/products">
              View All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

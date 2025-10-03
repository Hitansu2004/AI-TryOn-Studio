'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StaticHeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Simple background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:40px_40px] opacity-30" />
      
      <div className="container text-center text-white relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
            Transform Your Fashion Experience
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Try on clothes virtually with our revolutionary AI technology. See how you look before you buy, from the comfort of your home.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl rounded-full"
              asChild
            >
              <Link href="/try-on">
                <Sparkles className="h-5 w-5 mr-2" />
                Try On Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl rounded-full"
              asChild
            >
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100K+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-white/80">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">2M+</div>
              <div className="text-white/80">Try-Ons Done</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Shield, Palette, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Advanced AI technology for realistic virtual try-on experiences',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your images are processed securely and never stored permanently',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Palette,
    title: 'True Colors',
    description: 'Accurate color matching and realistic garment representation',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Users,
    title: 'For Everyone',
    description: 'Works with all body types and clothing styles',
    color: 'from-blue-400 to-cyan-500',
  },
];

const stats = [
  { value: '100K+', label: 'Happy Customers', color: 'from-purple-500 to-pink-500' },
  { value: '99.9%', label: 'Accuracy Rate', color: 'from-cyan-500 to-blue-500' },
  { value: '2M+', label: 'Try-Ons Done', color: 'from-green-500 to-emerald-500' },
  { value: '24/7', label: 'AI Support', color: 'from-orange-500 to-red-500' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative">
        <div className="container text-center text-white relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Transform Your Fashion Experience
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Try on clothes virtually with our revolutionary AI technology. See how you look before you buy, from the comfort of your home.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl rounded-full" asChild>
                <Link href="/try-on">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Try On Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl rounded-full" asChild>
                <Link href="/products">
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <p className="text-white/90 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose StyleSync?
            </h2>
                              <p className="text-gray-600 dark:text-gray-300">
                    Join thousands of satisfied customers who&apos;ve transformed their shopping experience with our AI virtual try-on technology.
                  </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="relative">
                <Card className="h-full border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`} />
                    
                    <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Ready to Transform Your Shopping?
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join millions of fashion enthusiasts who have discovered the perfect fit with StyleSync&apos;s revolutionary AI-powered virtual try-on technology
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl rounded-full" asChild>
                <Link href="/try-on">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl rounded-full" asChild>
                <Link href="/products">
                  Explore Collection
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>100K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

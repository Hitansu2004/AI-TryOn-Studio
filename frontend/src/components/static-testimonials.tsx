'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    company: '@fashionforward',
    avatar: '/testimonials/avatar1.jpg',
    rating: 5,
    text: 'StyleSync revolutionized my shopping experience! The AI try-on is incredibly accurate. I can now confidently buy clothes online without worrying about fit.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Stylist',
    company: 'Elite Fashion House',
    avatar: '/testimonials/avatar2.jpg',
    rating: 5,
    text: 'As a professional stylist, I am impressed by the technology. It helps my clients visualize looks before commitments. Game-changing for the industry!',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    role: 'Customer',
    company: 'Regular Shopper',
    avatar: '/testimonials/avatar3.jpg',
    rating: 5,
    text: 'StyleSync completely changed how I shop online! The AI is incredibly realistic and helps me visualize outfits perfectly. I love experimenting with different styles.',
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Tech Executive',
    company: 'TechWear Inc.',
    avatar: '/testimonials/avatar4.jpg',
    rating: 5,
    text: 'Being in tech, I appreciate innovation. StyleSync\'s AI accuracy is phenomenal - it saved me from countless returns. The virtual fitting is spot-on every time!',
  },
  {
    id: '5',
    name: 'Lisa Park',
    role: 'Mother of 3',
    company: 'Busy Parent',
    avatar: '/testimonials/avatar5.jpg',
    rating: 5,
    text: 'With three kids, shopping in-store is impossible. StyleSync lets me try clothes at home during naptime. The size recommendations are always perfect!',
  },
  {
    id: '6',
    name: 'Alex Thompson',
    role: 'College Student',
    company: 'UC Berkeley',
    avatar: '/testimonials/avatar6.jpg',
    rating: 5,
    text: 'As a student on a budget, I can\'t afford wrong purchases. StyleSync helps me see exactly how clothes will look before buying. It\'s a game-changer!',
  },
  {
    id: '7',
    name: 'Maria Garcia',
    role: 'Personal Shopper',
    company: 'Luxury Retail',
    avatar: '/testimonials/avatar7.jpg',
    rating: 5,
    text: 'I recommend StyleSync to all my clients. The virtual try-on feature helps them make confident decisions remotely. It\'s revolutionizing personal shopping!',
  },
  {
    id: '8',
    name: 'James Wilson',
    role: 'Fitness Coach',
    company: 'FitLife Gym',
    avatar: '/testimonials/avatar8.jpg',
    rating: 5,
    text: 'Finding athletic wear that fits my build was always challenging. StyleSync shows exactly how sportswear will look and move. No more guessing!',
  },
  {
    id: '9',
    name: 'Sophie Dubois',
    role: 'Fashion Designer',
    company: 'Atelier Sophie',
    avatar: '/testimonials/avatar9.jpg',
    rating: 5,
    text: 'The technology behind StyleSync is remarkable. As a designer, I\'m amazed by how accurately it represents fabric drape and fit. Truly impressive!',
  },
];

export function StaticTestimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Join thousands of satisfied customers who have transformed their online shopping experience with StyleSync
          </p>
        </div>

        {/* Featured testimonials in larger grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {testimonials.slice(0, 6).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="h-8 w-8 text-purple-500 opacity-60" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-800 dark:text-gray-200 mb-6 text-lg leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional testimonials in compact format */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            More Happy Customers
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(6).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-800 dark:text-gray-200 mb-4 text-sm leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">4.9★</div>
            <div className="text-gray-700 dark:text-gray-300">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">75K+</div>
            <div className="text-gray-700 dark:text-gray-300">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">98%</div>
            <div className="text-gray-700 dark:text-gray-300">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
            <div className="text-gray-700 dark:text-gray-300">Support</div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Trusted by fashion enthusiasts worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-xs">Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-xs">Real Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-xs">Authentic Experiences</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

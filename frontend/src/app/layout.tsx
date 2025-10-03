import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from './(app)/providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { WishlistProvider } from '@/components/wishlist-compare';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StyleSync - AI Fashion Virtual Try-On',
  description: 'Experience the future of fashion with our revolutionary AI-powered virtual try-on technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </Providers>
      </body>
    </html>
  );
}

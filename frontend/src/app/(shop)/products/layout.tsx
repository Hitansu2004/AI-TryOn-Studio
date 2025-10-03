import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our collection of virtual try-on enabled products',
  openGraph: {
    title: 'Products | TryOn Virtual Fashion',
    description: 'Browse our collection of virtual try-on enabled products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from 'next';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Product Details',
  description: 'View product details and try on virtually',
  openGraph: {
    title: 'Product Details | TryOn Virtual Fashion',
    description: 'View product details and try on virtually',
  },
};

export default function ProductDetailLayout({ children }: Props) {
  return children;
}

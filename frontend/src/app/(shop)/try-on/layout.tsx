import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Try-On',
  description: 'Experience AI-powered virtual try-on technology',
  openGraph: {
    title: 'Virtual Try-On | TryOn Virtual Fashion',
    description: 'Experience AI-powered virtual try-on technology',
  },
};

export default function TryOnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

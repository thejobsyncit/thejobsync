import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/employer/checkout',
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

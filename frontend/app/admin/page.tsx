import type { Metadata } from 'next';
import AdminOrders from '../../components/AdminOrders';

/**
 * Private orders dashboard. It is not linked anywhere in the site nav and is
 * marked noindex/nofollow so search engines leave it alone. This is
 * obscurity, not security — put real auth in front of it before production.
 */
export const metadata: Metadata = {
  title: 'Shrimp Room — Orders',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminOrders />;
}

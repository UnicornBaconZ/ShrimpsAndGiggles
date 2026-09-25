import { CreateOrderPayload, OrderStatus, OrderView, Product } from './types';
import * as mock from './mock/mockApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Demo mode: with no backend configured (e.g. a frontend-only Vercel deploy),
 * every call below is served by the in-browser mock instead. Force it on with
 * NEXT_PUBLIC_DEMO_MODE=true.
 */
export const DEMO_MODE =
  !API_URL || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * Thin API client — the single boundary between the UI and the backend.
 * Keeping all fetch logic here means components never touch URLs directly.
 */
export async function fetchProducts(): Promise<Product[]> {
  if (DEMO_MODE) return mock.fetchProducts();
  const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load the shrimp catalog');
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  if (DEMO_MODE) return mock.fetchProduct(id);
  const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load that shrimp');
  return res.json();
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderView> {
  if (DEMO_MODE) return mock.createOrder(payload);
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to place your order');
  }
  return res.json();
}

export async function fetchOrder(id: string): Promise<OrderView> {
  if (DEMO_MODE) return mock.fetchOrder(id);
  const res = await fetch(`${API_URL}/orders/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load that order');
  return res.json();
}

// --- Admin operations ---------------------------------------------------

export async function fetchOrders(): Promise<OrderView[]> {
  if (DEMO_MODE) return mock.fetchOrders();
  const res = await fetch(`${API_URL}/orders`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderView> {
  if (DEMO_MODE) return mock.updateOrderStatus(id, status);
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update the order status');
  return res.json();
}

export async function deleteOrder(id: string): Promise<void> {
  if (DEMO_MODE) return mock.deleteOrder(id);
  const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete the order');
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

import { CreateOrderPayload, OrderStatus, OrderView, Product } from '../types';
import { MOCK_CATALOG } from './catalog';

/**
 * In-browser stand-in for the NestJS API, used when no backend is configured.
 *
 * Products come from a static catalog. Orders are "fake": they are validated
 * and priced like the real backend does, then kept in this browser's
 * localStorage so checkout and the admin dashboard still work. Nothing is
 * sent anywhere, and stock is never decremented.
 */

const ORDERS_KEY = 'shrimp-demo-orders';

function readOrders(): OrderView[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeOrders(orders: OrderView[]): void {
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Storage unavailable (private mode, quota) — the order still "succeeds".
  }
}

export async function fetchProducts(): Promise<Product[]> {
  return MOCK_CATALOG;
}

export async function fetchProduct(id: string): Promise<Product> {
  const product = MOCK_CATALOG.find((p) => p.id === id);
  if (!product) throw new Error('Failed to load that shrimp');
  return product;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderView> {
  if (payload.items.length === 0) {
    throw new Error('An order must contain at least one item');
  }

  // Prices come from the catalog, never from the client — same as the backend.
  const items = payload.items.map((line) => {
    const product = MOCK_CATALOG.find((p) => p.id === line.productId);
    if (!product) throw new Error(`Product ${line.productId} not found`);
    if (line.quantity < 1 || line.quantity > product.stock) {
      throw new Error(
        `Not enough "${product.name}" in stock (requested ${line.quantity}, available ${product.stock})`,
      );
    }
    return {
      productId: product.id,
      productName: product.name,
      unitPriceCents: product.priceCents,
      quantity: line.quantity,
      subtotalCents: product.priceCents * line.quantity,
    };
  });

  const { country, city, street, houseNumber } = payload.shippingAddress;
  const order: OrderView = {
    id: crypto.randomUUID(),
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    status: 'pending',
    shippingAddress: {
      ...payload.shippingAddress,
      formatted: `${street} ${houseNumber}, ${city}, ${country}`,
    },
    totalCents: items.reduce((sum, i) => sum + i.subtotalCents, 0),
    createdAt: new Date().toISOString(),
    items,
  };

  writeOrders([order, ...readOrders()]);
  return order;
}

export async function fetchOrder(id: string): Promise<OrderView> {
  const order = readOrders().find((o) => o.id === id);
  if (!order) throw new Error('Failed to load that order');
  return order;
}

export async function fetchOrders(): Promise<OrderView[]> {
  return readOrders();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderView> {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) throw new Error('Failed to update the order status');
  orders[index] = { ...orders[index], status };
  writeOrders(orders);
  return orders[index];
}

export async function deleteOrder(id: string): Promise<void> {
  writeOrders(readOrders().filter((o) => o.id !== id));
}

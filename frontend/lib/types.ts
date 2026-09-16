export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  colorGroup: string;
  careLevel: string;
  isAvailable: boolean;
}

export interface OrderItemView {
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
  subtotalCents: number;
}

export interface ShippingAddress {
  country: string;
  city: string;
  street: string;
  houseNumber: string;
}

export type OrderStatus =
  | 'pending'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
];

export interface OrderView {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  shippingAddress: ShippingAddress & { formatted: string };
  totalCents: number;
  createdAt: string;
  items: OrderItemView[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: { productId: string; quantity: number }[];
}

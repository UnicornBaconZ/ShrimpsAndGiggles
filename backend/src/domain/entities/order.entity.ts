import { ShippingAddress } from '../value-objects/shipping-address';

/**
 * The lifecycle an order moves through, from placed to delivered.
 */
export type OrderStatus =
  | 'pending'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

/** The allowed statuses, as a runtime array (for validation & UIs). */
export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
];

/**
 * Domain entities: Order and OrderItem.
 *
 * These model the business rules of placing an order. The Order is
 * responsible for computing its own total — the total is never trusted
 * from the outside world.
 */
export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly unitPriceCents: number,
    public readonly quantity: number,
  ) {
    if (quantity <= 0) {
      throw new Error('OrderItem quantity must be positive');
    }
  }

  get subtotalCents(): number {
    return this.unitPriceCents * this.quantity;
  }
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly customerName: string,
    public readonly customerEmail: string,
    public readonly shippingAddress: ShippingAddress,
    public readonly items: OrderItem[],
    public readonly createdAt: Date,
    /** Where the order is in its lifecycle. New orders start as "pending". */
    public readonly status: OrderStatus = 'pending',
  ) {
    if (items.length === 0) {
      throw new Error('An order must contain at least one item');
    }
  }

  get totalCents(): number {
    return this.items.reduce((sum, item) => sum + item.subtotalCents, 0);
  }
}

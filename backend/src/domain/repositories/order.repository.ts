import { Order, OrderStatus } from '../entities/order.entity';

/**
 * Port (interface) for order persistence.
 */
export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
  delete(id: string): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('OrderRepository');

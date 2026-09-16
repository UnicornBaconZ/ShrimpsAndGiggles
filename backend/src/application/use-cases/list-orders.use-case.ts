import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';
import { Order } from '../../domain/entities/order.entity';

/**
 * Use case: list every order (for the private admin dashboard), newest first.
 */
@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
  ) {}

  execute(): Promise<Order[]> {
    return this.orders.findAll();
  }
}

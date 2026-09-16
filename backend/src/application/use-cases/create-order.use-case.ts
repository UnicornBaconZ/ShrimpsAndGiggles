import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UNIT_OF_WORK, UnitOfWork } from '../ports/unit-of-work';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { ShippingAddress } from '../../domain/value-objects/shipping-address';
import { CreateOrderDto } from '../dto/create-order.dto';

/**
 * Use case: place an order.
 *
 * Runs inside a single transaction so the whole thing is atomic. Orchestrates
 * domain rules: every referenced product must exist and have enough stock,
 * prices are read from the source of truth (never trusted from the client),
 * stock is decremented as it is sold, and the Order entity computes its own
 * total. If anything fails part-way, no stock is consumed and no order is
 * written.
 */
@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    return this.unitOfWork.runInTransaction(async ({ products, orders }) => {
      const items: OrderItem[] = [];

      for (const line of dto.items) {
        // Read fresh inside the transaction so the availability check acts on
        // committed stock, closing the check-then-act race where two orders
        // could both claim the last shrimp.
        const product = await products.findById(line.productId);
        if (!product) {
          throw new NotFoundException(`Product ${line.productId} not found`);
        }
        if (!product.canFulfill(line.quantity)) {
          throw new BadRequestException(
            `Not enough "${product.name}" in stock (requested ${line.quantity}, available ${product.stock})`,
          );
        }

        await products.save(product.reduceStock(line.quantity));
        items.push(
          new OrderItem(
            product.id,
            product.name,
            product.priceCents,
            line.quantity,
          ),
        );
      }

      const shippingAddress = new ShippingAddress(
        dto.shippingAddress.country,
        dto.shippingAddress.city,
        dto.shippingAddress.street,
        dto.shippingAddress.houseNumber,
      );

      const order = new Order(
        randomUUID(),
        dto.customerName,
        dto.customerEmail,
        shippingAddress,
        items,
        new Date(),
      );

      return orders.save(order);
    });
  }
}

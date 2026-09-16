import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Order,
  OrderItem,
  OrderStatus,
} from '../../../domain/entities/order.entity';
import { ShippingAddress } from '../../../domain/value-objects/shipping-address';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';

/** Legacy orders (placed before shipping existed) may have null address parts. */
function orPlaceholder(value: string | null | undefined): string {
  return value && value.trim().length > 0 ? value : '—';
}

/**
 * TypeORM-backed implementation of the OrderRepository port.
 */
@Injectable()
export class OrderTypeOrmRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repo: Repository<OrderOrmEntity>,
  ) {}

  async save(order: Order): Promise<Order> {
    const row = new OrderOrmEntity();
    row.id = order.id;
    row.customerName = order.customerName;
    row.customerEmail = order.customerEmail;
    row.totalCents = order.totalCents;
    row.status = order.status;
    row.shippingCountry = order.shippingAddress.country;
    row.shippingCity = order.shippingAddress.city;
    row.shippingStreet = order.shippingAddress.street;
    row.shippingHouseNumber = order.shippingAddress.houseNumber;
    row.createdAt = order.createdAt;
    row.items = order.items.map((item) => {
      const itemRow = new OrderItemOrmEntity();
      itemRow.productId = item.productId;
      itemRow.productName = item.productName;
      itemRow.unitPriceCents = item.unitPriceCents;
      itemRow.quantity = item.quantity;
      return itemRow;
    });

    const saved = await this.repo.save(row);
    return OrderTypeOrmRepository.toDomain(saved);
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? OrderTypeOrmRepository.toDomain(row) : null;
  }

  async findAll(): Promise<Order[]> {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' } });
    return rows.map(OrderTypeOrmRepository.toDomain);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await this.repo.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    // Remove line items first, then the order, in one transaction — robust
    // whether or not SQLite foreign-key cascade is enabled.
    await this.repo.manager.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .delete()
        .from(OrderItemOrmEntity)
        .where('orderId = :id', { id })
        .execute();
      await manager.delete(OrderOrmEntity, { id });
    });
  }

  private static toDomain(row: OrderOrmEntity): Order {
    const items = row.items.map(
      (i) =>
        new OrderItem(i.productId, i.productName, i.unitPriceCents, i.quantity),
    );
    // Coalesce legacy null/empty address parts so listing never crashes on
    // orders placed before the shipping-address feature existed.
    const address = new ShippingAddress(
      orPlaceholder(row.shippingCountry),
      orPlaceholder(row.shippingCity),
      orPlaceholder(row.shippingStreet),
      orPlaceholder(row.shippingHouseNumber),
    );
    return new Order(
      row.id,
      row.customerName,
      row.customerEmail,
      address,
      items,
      row.createdAt,
      (row.status as OrderStatus) ?? 'pending',
    );
  }
}

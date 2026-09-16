import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { OrderItemOrmEntity } from './order-item.orm-entity';

@Entity({ name: 'orders' })
export class OrderOrmEntity {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  customerName: string;

  @Column('text')
  customerEmail: string;

  @Column('integer')
  totalCents: number;

  // Lifecycle status. Defaults so pre-existing orders migrate cleanly.
  @Column('text', { default: 'pending' })
  status: string;

  // Shipping destination. Nullable so pre-existing orders migrate cleanly.
  @Column('text', { nullable: true })
  shippingCountry: string;

  @Column('text', { nullable: true })
  shippingCity: string;

  @Column('text', { nullable: true })
  shippingStreet: string;

  @Column('text', { nullable: true })
  shippingHouseNumber: string;

  @Column('datetime')
  createdAt: Date;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItemOrmEntity[];
}

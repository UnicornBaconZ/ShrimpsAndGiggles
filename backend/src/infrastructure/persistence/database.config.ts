import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductOrmEntity } from './entities/product.orm-entity';
import { OrderOrmEntity } from './entities/order.orm-entity';
import { OrderItemOrmEntity } from './entities/order-item.orm-entity';

/**
 * Central SQLite/TypeORM configuration, shared by the app and the seeder.
 * synchronize is fine for this demo; a real app would use migrations.
 */
export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'better-sqlite3',
  database: process.env.DATABASE_PATH || 'shrimp-shop.sqlite',
  entities: [ProductOrmEntity, OrderOrmEntity, OrderItemOrmEntity],
  synchronize: true,
});

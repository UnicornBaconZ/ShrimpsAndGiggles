import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './infrastructure/persistence/database.config';
import { ProductOrmEntity } from './infrastructure/persistence/entities/product.orm-entity';
import { OrderOrmEntity } from './infrastructure/persistence/entities/order.orm-entity';
import { OrderItemOrmEntity } from './infrastructure/persistence/entities/order-item.orm-entity';

import { ProductTypeOrmRepository } from './infrastructure/persistence/repositories/product.typeorm.repository';
import { OrderTypeOrmRepository } from './infrastructure/persistence/repositories/order.typeorm.repository';
import { TypeOrmUnitOfWork } from './infrastructure/persistence/typeorm.unit-of-work';

import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { UNIT_OF_WORK } from './application/ports/unit-of-work';

import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.use-case';

import { ProductsController } from './presentation/controllers/products.controller';
import { OrdersController } from './presentation/controllers/orders.controller';

/**
 * Composition root. This is the one place that knows about every layer:
 * it binds abstract ports (PRODUCT_REPOSITORY, ORDER_REPOSITORY, UNIT_OF_WORK)
 * to their concrete TypeORM implementations, keeping the dependency arrows
 * pointing inward toward the domain.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([
      ProductOrmEntity,
      OrderOrmEntity,
      OrderItemOrmEntity,
    ]),
  ],
  controllers: [ProductsController, OrdersController],
  providers: [
    ListProductsUseCase,
    GetProductUseCase,
    CreateOrderUseCase,
    GetOrderUseCase,
    ListOrdersUseCase,
    UpdateOrderStatusUseCase,
    DeleteOrderUseCase,
    { provide: PRODUCT_REPOSITORY, useClass: ProductTypeOrmRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderTypeOrmRepository },
    { provide: UNIT_OF_WORK, useClass: TypeOrmUnitOfWork },
  ],
})
export class AppModule {}

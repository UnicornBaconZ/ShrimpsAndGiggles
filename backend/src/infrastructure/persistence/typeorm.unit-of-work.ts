import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  TransactionalRepositories,
  UnitOfWork,
} from '../../application/ports/unit-of-work';
import { ProductOrmEntity } from './entities/product.orm-entity';
import { OrderOrmEntity } from './entities/order.orm-entity';
import { ProductTypeOrmRepository } from './repositories/product.typeorm.repository';
import { OrderTypeOrmRepository } from './repositories/order.typeorm.repository';

/**
 * TypeORM unit of work. Opens a single transaction and hands the caller a set
 * of repositories bound to that transaction's entity manager, so a stock
 * check, a stock decrement, and an order insert all commit atomically (and
 * roll back together if anything throws).
 */
@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  runInTransaction<T>(
    work: (repos: TransactionalRepositories) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction((manager) =>
      work({
        products: new ProductTypeOrmRepository(
          manager.getRepository(ProductOrmEntity),
        ),
        orders: new OrderTypeOrmRepository(
          manager.getRepository(OrderOrmEntity),
        ),
      }),
    );
  }
}

import { ProductRepository } from '../../domain/repositories/product.repository';
import { OrderRepository } from '../../domain/repositories/order.repository';

/**
 * The set of repositories bound to a single transaction. Every write made
 * through them commits together, or rolls back together.
 */
export interface TransactionalRepositories {
  products: ProductRepository;
  orders: OrderRepository;
}

/**
 * Port for a transactional scope (unit of work). The application layer uses
 * this to make multi-step writes atomic without knowing anything about the
 * underlying database or ORM.
 */
export interface UnitOfWork {
  runInTransaction<T>(
    work: (repos: TransactionalRepositories) => Promise<T>,
  ): Promise<T>;
}

export const UNIT_OF_WORK = Symbol('UnitOfWork');

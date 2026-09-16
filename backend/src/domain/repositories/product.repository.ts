import { Product } from '../entities/product.entity';

/**
 * Port (interface) for product persistence. The domain and application
 * layers depend on this abstraction, never on a concrete database.
 */
export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  /** Persist changes to an existing product (e.g. after a stock change). */
  save(product: Product): Promise<Product>;
}

/** Injection token — interfaces don't exist at runtime in TypeScript. */
export const PRODUCT_REPOSITORY = Symbol('ProductRepository');

import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

/**
 * Use case: list every shrimp on offer.
 * Depends only on the repository port — not on any database.
 */
@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  execute(): Promise<Product[]> {
    return this.products.findAll();
  }
}

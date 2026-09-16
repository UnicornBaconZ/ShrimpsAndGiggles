import { Controller, Get, Param } from '@nestjs/common';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case';
import { Product } from '../../domain/entities/product.entity';

/**
 * HTTP adapter for products. Controllers stay thin: they translate HTTP
 * into use-case calls and domain objects into JSON views.
 */
@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  @Get()
  async findAll() {
    const products = await this.listProducts.execute();
    return products.map(ProductsController.toView);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.getProduct.execute(id);
    return ProductsController.toView(product);
  }

  private static toView(product: Product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      stock: product.stock,
      colorGroup: product.colorGroup,
      careLevel: product.careLevel,
      isAvailable: product.isAvailable,
    };
  }
}

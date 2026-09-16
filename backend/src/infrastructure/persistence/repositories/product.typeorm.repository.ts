import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../domain/entities/product.entity';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductOrmEntity } from '../entities/product.orm-entity';

/**
 * TypeORM-backed implementation of the ProductRepository port.
 * Responsible for mapping between the persistence model and the domain model.
 */
@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const rows = await this.repo.find({ order: { name: 'ASC' } });
    return rows.map(ProductTypeOrmRepository.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? ProductTypeOrmRepository.toDomain(row) : null;
  }

  async save(product: Product): Promise<Product> {
    const saved = await this.repo.save(
      ProductTypeOrmRepository.fromDomain(product),
    );
    return ProductTypeOrmRepository.toDomain(saved);
  }

  private static fromDomain(product: Product): ProductOrmEntity {
    const row = new ProductOrmEntity();
    row.id = product.id;
    row.name = product.name;
    row.description = product.description;
    row.priceCents = product.priceCents;
    row.imageUrl = product.imageUrl;
    row.stock = product.stock;
    row.colorGroup = product.colorGroup;
    row.careLevel = product.careLevel;
    return row;
  }

  private static toDomain(row: ProductOrmEntity): Product {
    return new Product(
      row.id,
      row.name,
      row.description,
      row.priceCents,
      row.imageUrl,
      row.stock,
      row.colorGroup,
      row.careLevel,
    );
  }
}

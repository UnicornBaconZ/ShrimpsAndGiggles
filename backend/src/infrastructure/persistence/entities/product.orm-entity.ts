import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * TypeORM persistence model for a product. This lives entirely in the
 * infrastructure layer and is kept separate from the domain Product so the
 * database schema can change without touching business rules.
 */
@Entity({ name: 'products' })
export class ProductOrmEntity {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('integer')
  priceCents: number;

  @Column('text')
  imageUrl: string;

  @Column('integer')
  stock: number;

  @Column('text')
  colorGroup: string;

  @Column('text')
  careLevel: string;
}

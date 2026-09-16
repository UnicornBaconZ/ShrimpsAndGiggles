import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../database.config';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';

/**
 * Standalone seeder. Populates the catalog with live Neocaridina davidi
 * varieties so the store has stock to sell. Safe to run repeatedly
 * (idempotent per id).
 *
 * Images are served by the Next.js frontend from its /public/images folder,
 * so imageUrl is a root-relative path like "/images/red_cherry.png".
 */

const catalog: ProductOrmEntity[] = [
  Object.assign(new ProductOrmEntity(), {
    id: 'red-cherry',
    name: 'Red Cherry Shrimp',
    description:
      'The classic that started the hobby. Hardy, prolific, and a bright pop of red in any planted tank. Sakura grade.',
    priceCents: 350,
    imageUrl: '/images/red_cherry.png',
    stock: 200,
    colorGroup: 'red',
    careLevel: 'Beginner',
  }),
  Object.assign(new ProductOrmEntity(), {
    id: 'bloody-mary',
    name: 'Bloody Mary',
    description:
      'Deep, translucent blood-red that seems to glow. A stunning, stable strain that stays vivid generation after generation.',
    priceCents: 500,
    imageUrl: '/images/bloody_mary.png',
    stock: 120,
    colorGroup: 'red',
    careLevel: 'Beginner',
  }),
  Object.assign(new ProductOrmEntity(), {
    id: 'blue-dream',
    name: 'Blue Dream',
    description:
      'Rich, opaque cobalt blue from head to tail. One of the most eye-catching neos and an easy keeper.',
    priceCents: 450,
    imageUrl: '/images/blue_dream.png',
    stock: 140,
    colorGroup: 'blue',
    careLevel: 'Beginner',
  }),
  Object.assign(new ProductOrmEntity(), {
    id: 'blue-velvet',
    name: 'Blue Velvet',
    description:
      'A softer, brighter sky-blue than the Dream. Peaceful, active, and gorgeous against green plants.',
    priceCents: 400,
    imageUrl: '/images/blue_velvet.png',
    stock: 130,
    colorGroup: 'blue',
    careLevel: 'Beginner',
  }),
  Object.assign(new ProductOrmEntity(), {
    id: 'green-jade',
    name: 'Green Jade',
    description:
      'Deep emerald green — one of the rarer, harder-to-fix colours. A real centrepiece for a mature aquascape.',
    priceCents: 700,
    imageUrl: '/images/green_jade.png',
    stock: 60,
    colorGroup: 'green',
    careLevel: 'Intermediate',
  }),
  Object.assign(new ProductOrmEntity(), {
    id: 'yellow-neon',
    name: 'Yellow Neon (Golden Back)',
    description:
      'Electric lemon-yellow with a bright dorsal stripe. Grazes constantly and shows beautifully under white light.',
    priceCents: 400,
    imageUrl: '/images/yellow_neon.png',
    stock: 150,
    colorGroup: 'yellow',
    careLevel: 'Beginner',
  }),
  Object.assign(new ProductOrmEntity(), {
    id: 'orange-pumpkin',
    name: 'Orange Pumpkin',
    description:
      'Warm, saturated pumpkin-orange. Cheerful, hardy, and a favourite for first-time shrimp keepers.',
    priceCents: 450,
    imageUrl: '/images/orange_pumpkin.png',
    stock: 110,
    colorGroup: 'orange',
    careLevel: 'Beginner',
  }),
  Object.assign(new ProductOrmEntity(), {
    id: 'black-rose',
    name: 'Black Rose',
    description:
      'Deep, velvety near-black. Dramatic and elegant, especially over a light substrate. A stable, striking strain.',
    priceCents: 550,
    imageUrl: '/images/black_rose.png',
    stock: 80,
    colorGroup: 'black',
    careLevel: 'Beginner',
  }),
];

async function run() {
  const dataSource = new DataSource({
    ...(databaseConfig() as any),
    entities: [ProductOrmEntity, OrderOrmEntity, OrderItemOrmEntity],
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(ProductOrmEntity);
  await repo.save(catalog);

  // eslint-disable-next-line no-console
  console.log(`🌱 Seeded ${catalog.length} shrimp varieties into the tank.`);
  await dataSource.destroy();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seeding failed:', err);
  process.exit(1);
});

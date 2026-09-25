import { Product } from '../types';

/**
 * Static copy of the backend seed catalog (backend/src/infrastructure/
 * persistence/seed/seed.ts). Used by the demo API when no backend is
 * configured, e.g. on a frontend-only Vercel deployment.
 */
export const MOCK_CATALOG: Product[] = [
  {
    id: 'red-cherry',
    name: 'Red Cherry Shrimp',
    description:
      'The classic that started the hobby. Hardy, prolific, and a bright pop of red in any planted tank. Sakura grade.',
    priceCents: 350,
    imageUrl: '/images/red_cherry.png',
    stock: 200,
    colorGroup: 'red',
    careLevel: 'Beginner',
  },
  {
    id: 'bloody-mary',
    name: 'Bloody Mary',
    description:
      'Deep, translucent blood-red that seems to glow. A stunning, stable strain that stays vivid generation after generation.',
    priceCents: 500,
    imageUrl: '/images/bloody_mary.png',
    stock: 120,
    colorGroup: 'red',
    careLevel: 'Beginner',
  },
  {
    id: 'blue-dream',
    name: 'Blue Dream',
    description:
      'Rich, opaque cobalt blue from head to tail. One of the most eye-catching neos and an easy keeper.',
    priceCents: 450,
    imageUrl: '/images/blue_dream.png',
    stock: 140,
    colorGroup: 'blue',
    careLevel: 'Beginner',
  },
  {
    id: 'blue-velvet',
    name: 'Blue Velvet',
    description:
      'A softer, brighter sky-blue than the Dream. Peaceful, active, and gorgeous against green plants.',
    priceCents: 400,
    imageUrl: '/images/blue_velvet.png',
    stock: 130,
    colorGroup: 'blue',
    careLevel: 'Beginner',
  },
  {
    id: 'green-jade',
    name: 'Green Jade',
    description:
      'Deep emerald green — one of the rarer, harder-to-fix colours. A real centrepiece for a mature aquascape.',
    priceCents: 700,
    imageUrl: '/images/green_jade.png',
    stock: 60,
    colorGroup: 'green',
    careLevel: 'Intermediate',
  },
  {
    id: 'yellow-neon',
    name: 'Yellow Neon (Golden Back)',
    description:
      'Electric lemon-yellow with a bright dorsal stripe. Grazes constantly and shows beautifully under white light.',
    priceCents: 400,
    imageUrl: '/images/yellow_neon.png',
    stock: 150,
    colorGroup: 'yellow',
    careLevel: 'Beginner',
  },
  {
    id: 'orange-pumpkin',
    name: 'Orange Pumpkin',
    description:
      'Warm, saturated pumpkin-orange. Cheerful, hardy, and a favourite for first-time shrimp keepers.',
    priceCents: 450,
    imageUrl: '/images/orange_pumpkin.png',
    stock: 110,
    colorGroup: 'orange',
    careLevel: 'Beginner',
  },
  {
    id: 'black-rose',
    name: 'Black Rose',
    description:
      'Deep, velvety near-black. Dramatic and elegant, especially over a light substrate. A stable, striking strain.',
    priceCents: 550,
    imageUrl: '/images/black_rose.png',
    stock: 80,
    colorGroup: 'black',
    careLevel: 'Beginner',
  },
].map((p) => ({ ...p, isAvailable: p.stock > 0 }));

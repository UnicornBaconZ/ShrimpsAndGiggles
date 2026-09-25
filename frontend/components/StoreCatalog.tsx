'use client';

import { useMemo, useState } from 'react';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';
import SortMenu, { SortOption } from './SortMenu';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'care';

const SORT_OPTIONS: SortOption<SortKey>[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'care', label: 'Easiest care first' },
];

/** Swatch shown on each colour chip, keyed by product colorGroup. */
const SWATCHES: Record<string, string> = {
  red: '#d7263d',
  blue: '#2b59c3',
  green: '#2f8f5b',
  yellow: '#f2c230',
  orange: '#f28a30',
  black: '#2b2b2b',
};

const CARE_ORDER = ['Beginner', 'Intermediate', 'Advanced'];

/**
 * Client-side browsing controls for the catalog: filter by colour family
 * and sort. The product list itself is fetched on the server by the page.
 */
export default function StoreCatalog({ products }: { products: Product[] }) {
  const [color, setColor] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('featured');

  const colors = useMemo(
    () => Array.from(new Set(products.map((p) => p.colorGroup))),
    [products],
  );

  const visible = useMemo(() => {
    const filtered = color
      ? products.filter((p) => p.colorGroup === color)
      : products;
    const sorted = [...filtered];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'care':
        sorted.sort(
          (a, b) =>
            CARE_ORDER.indexOf(a.careLevel) - CARE_ORDER.indexOf(b.careLevel),
        );
        break;
    }
    return sorted;
  }, [products, color, sort]);

  const chipClass = (active: boolean) =>
    `flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium capitalize ring-1 transition-colors ${
      active
        ? 'bg-moss-500 text-sand-50 ring-moss-500'
        : 'bg-white text-moss-600 ring-sand-200 hover:ring-moss-400'
    }`;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by colour"
        >
          <button
            onClick={() => setColor(null)}
            aria-pressed={color === null}
            className={chipClass(color === null)}
          >
            All
          </button>
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-pressed={color === c}
              className={chipClass(color === c)}
            >
              <span
                className="h-3 w-3 rounded-full ring-1 ring-white/60"
                style={{ background: SWATCHES[c] ?? '#9cc4bd' }}
                aria-hidden="true"
              />
              {c}
            </button>
          ))}
        </div>

        <SortMenu
          label="Sort"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </>
  );
}

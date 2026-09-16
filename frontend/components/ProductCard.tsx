'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../lib/types';
import { formatPrice } from '../lib/api';
import { FALLBACK_IMAGE } from '../lib/constants';
import { useCart } from '../context/CartContext';

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { add } = useCart();
  // Fall back to the site logo when a product photo is missing or broken.
  const [imgSrc, setImgSrc] = useState(product.imageUrl || FALLBACK_IMAGE);
  const usingFallback = imgSrc === FALLBACK_IMAGE;

  return (
    <article
      className="group flex animate-fade-up flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-sand-200 transition-transform duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${Math.min(index, 8) * 0.07}s` }}
    >
      <div className="relative h-52 w-full overflow-hidden bg-sand-100">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className={`transition-transform duration-500 group-hover:scale-105 ${
            usingFallback ? 'object-contain p-10 opacity-70' : 'object-cover'
          }`}
        />
        <span className="absolute left-3 top-3 rounded-full bg-tide-100/90 px-3 py-1 text-xs font-semibold capitalize text-moss-600">
          {product.colorGroup}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-moss-700">
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-moss-500/10 px-2 py-1 font-medium text-moss-600">
            🌿 {product.careLevel}
          </span>
          <span className="rounded-full bg-moss-500/10 px-2 py-1 font-medium text-moss-600">
            {product.stock} in stock
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm text-moss-500">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-coral-500">
            {formatPrice(product.priceCents)}
            <span className="ml-1 text-xs font-normal text-moss-400">
              / shrimp
            </span>
          </span>
          <button
            disabled={!product.isAvailable}
            onClick={() => add(product)}
            className="rounded-full bg-coral-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-sand-300 disabled:text-moss-500"
          >
            {product.isAvailable ? 'Add to cart' : 'Sold out'}
          </button>
        </div>
      </div>
    </article>
  );
}

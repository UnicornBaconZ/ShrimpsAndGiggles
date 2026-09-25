'use client';

import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const TOAST_MS = 2800;

/**
 * Small "added to cart" confirmation in the corner of the screen. It
 * dismisses itself after a few seconds and offers a shortcut to the cart.
 */
export default function CartToast() {
  const { toast, dismissToast, open, isOpen } = useCart();

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(dismissToast, TOAST_MS);
    return () => window.clearTimeout(id);
  }, [toast, dismissToast]);

  if (!toast || isOpen) return null;

  const viewCart = () => {
    dismissToast();
    open();
  };

  return (
    // Outer div positions, inner div animates: the pop-in keyframes set
    // `transform`, which would otherwise wipe out the centring translate.
    <div className="fixed inset-x-4 bottom-6 z-40 flex justify-center sm:left-auto sm:right-6">
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="flex w-full max-w-sm animate-pop-in items-center gap-3 rounded-2xl bg-moss-600 px-4 py-3 text-sand-50 shadow-soft"
      >
        <span className="animate-bob text-2xl" aria-hidden="true">
          🦐
        </span>
        <p className="flex-1 text-sm">
          <span className="font-semibold">{toast.product.name}</span> added to
          your basket!
        </p>
        <button
          onClick={viewCart}
          className="rounded-full bg-coral-400 px-3 py-1 text-xs font-semibold text-white transition-transform hover:scale-105"
        >
          View cart
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder, formatPrice } from '../lib/api';
import { OrderView } from '../lib/types';
import { burstShrimp } from './ShrimpConfetti';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; order: OrderView }
  | { kind: 'error'; message: string };

export default function CartDrawer() {
  const { lines, totalCents, isOpen, close, setQuantity, remove, clear } =
    useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const panelRef = useRef<HTMLElement>(null);

  // While the drawer is open: close on Escape, lock background scroll, and
  // move focus into the panel for keyboard and screen-reader users.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  // Celebrate a confirmed order with a shrimp confetti burst.
  useEffect(() => {
    if (status.kind === 'success') burstShrimp();
  }, [status.kind]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setStatus({ kind: 'submitting' });
    try {
      const order = await createOrder({
        customerName: name,
        customerEmail: email,
        shippingAddress: {
          country: country.trim(),
          city: city.trim(),
          street: street.trim(),
          houseNumber: houseNumber.trim(),
        },
        items: lines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
      });
      setStatus({ kind: 'success', order });
      clear();
      setName('');
      setEmail('');
      setCountry('');
      setCity('');
      setStreet('');
      setHouseNumber('');
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  };

  const canCheckout =
    lines.length > 0 &&
    name.trim().length > 0 &&
    /.+@.+\..+/.test(email) &&
    country.trim().length > 0 &&
    city.trim().length > 0 &&
    street.trim().length > 0 &&
    houseNumber.trim().length > 0 &&
    status.kind !== 'submitting';

  const inputClass =
    'w-full rounded-xl border border-sand-200 bg-white px-3 py-2 text-sm outline-none focus:border-moss-400';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-moss-700/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        className="relative flex h-full w-full max-w-md flex-col bg-sand-50 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h2
            id="cart-heading"
            className="font-display text-xl font-bold text-moss-700"
          >
            Your basket
          </h2>
          <button
            onClick={close}
            className="text-2xl leading-none text-moss-500 hover:text-coral-500"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {status.kind === 'success' ? (
            <div className="rounded-2xl bg-tide-100 p-6 text-center">
              <p className="text-4xl">🦐</p>
              <h3 className="mt-2 font-display text-lg font-bold text-moss-700">
                Order confirmed!
              </h3>
              <p className="mt-1 text-sm text-moss-500">
                Thanks, {status.order.customerName}. Your order{' '}
                <span className="font-mono">
                  #{status.order.id.slice(0, 8)}
                </span>{' '}
                for {formatPrice(status.order.totalCents)} is swimming its way
                to {status.order.shippingAddress.formatted}.
              </p>
              <button
                onClick={() => setStatus({ kind: 'idle' })}
                className="mt-4 rounded-full bg-moss-500 px-4 py-2 text-sm font-semibold text-sand-50"
              >
                Keep shopping
              </button>
            </div>
          ) : lines.length === 0 ? (
            <p className="mt-10 text-center text-sm text-moss-500">
              Your tank awaits — add some shrimp! 🌿
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-sand-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-moss-700">
                      {line.product.name}
                    </p>
                    <p className="text-sm text-moss-500">
                      {formatPrice(line.product.priceCents)} each
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          setQuantity(line.product.id, line.quantity - 1)
                        }
                        className="h-7 w-7 rounded-full bg-sand-100 text-moss-600"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{line.quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(line.product.id, line.quantity + 1)
                        }
                        className="h-7 w-7 rounded-full bg-sand-100 text-moss-600"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(line.product.id)}
                        className="ml-auto text-xs text-coral-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="font-display font-bold text-coral-500">
                    {formatPrice(line.product.priceCents * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && status.kind !== 'success' && (
          <div className="border-t border-sand-200 px-6 py-4">
            <div className="mb-3 flex items-center justify-between font-display text-lg font-bold text-moss-700">
              <span>Total</span>
              <span>{formatPrice(totalCents)}</span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />

              <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-moss-400">
                Shipping address
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={`${inputClass} w-2/3`}
                />
                <input
                  type="text"
                  placeholder="No."
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className={`${inputClass} w-1/3`}
                />
              </div>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputClass}
              />
            </div>

            {status.kind === 'error' && (
              <p className="mt-2 text-sm text-coral-600">{status.message}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={!canCheckout}
              className="mt-3 w-full rounded-full bg-coral-500 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-sand-300 disabled:text-moss-500"
            >
              {status.kind === 'submitting' ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

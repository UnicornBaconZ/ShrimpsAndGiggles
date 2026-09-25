'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder, formatPrice } from '../lib/api';
import { FALLBACK_IMAGE } from '../lib/constants';
import { OrderView } from '../lib/types';
import { burstShrimp } from './ShrimpConfetti';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; order: OrderView }
  | { kind: 'error'; message: string };

const qtyButtonClass =
  'flex h-7 w-7 items-center justify-center rounded-full bg-sand-100 text-moss-600 transition-colors hover:bg-sand-200';

/**
 * Minus / plus drawn as SVG strokes: text glyphs sit on the font's baseline
 * and never look centred inside a round button.
 */
function QtyIcon({ plus = false }: { plus?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="2" y1="6" x2="10" y2="6" />
      {plus && <line x1="6" y1="2" x2="6" y2="10" />}
    </svg>
  );
}

type Field = 'name' | 'email' | 'street' | 'houseNumber' | 'city' | 'country';

/** Returns an error message per invalid field (an empty object when valid). */
function validate(
  values: Record<Field, string>,
): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = 'Tell us who the shrimp are for.';
  if (!values.email.trim()) errors.email = 'We need an email for your receipt.';
  else if (!/.+@.+\..+/.test(values.email))
    errors.email = 'That email looks a bit fishy. Check it?';
  if (!values.street.trim()) errors.street = 'Street is required.';
  if (!values.houseNumber.trim()) errors.houseNumber = 'Required.';
  if (!values.city.trim()) errors.city = 'City is required.';
  if (!values.country.trim()) errors.country = 'Country is required.';
  return errors;
}

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
  // Errors appear per field once it has been left, or all at once after a
  // checkout attempt, so nobody is scolded while typing their first entry.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
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

  const errors = validate({ name, email, street, houseNumber, city, country });
  const isValid = Object.keys(errors).length === 0;
  const errorFor = (field: Field) =>
    touched[field] || submitAttempted ? errors[field] : undefined;

  const handleCheckout = async () => {
    if (!isValid) {
      setSubmitAttempted(true);
      return;
    }
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
      setTouched({});
      setSubmitAttempted(false);
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  };

  // The button stays clickable while the form is invalid, so a click can
  // reveal what still needs filling in.
  const canCheckout = lines.length > 0 && status.kind !== 'submitting';

  /** Shared wiring for every checkout input: value, blur tracking, a11y. */
  const fieldProps = (
    field: Field,
    value: string,
    setValue: (v: string) => void,
  ) => ({
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value),
    onBlur: () => setTouched((t) => ({ ...t, [field]: true })),
    'aria-invalid': Boolean(errorFor(field)),
    'aria-describedby': errorFor(field) ? `${field}-error` : undefined,
    className: `w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ${
      errorFor(field)
        ? 'border-coral-500 focus:border-coral-600'
        : 'border-sand-200 focus:border-moss-400'
    }`,
  });

  const fieldError = (field: Field) =>
    errorFor(field) ? (
      <p id={`${field}-error`} className="mt-1 text-xs text-coral-600">
        {errorFor(field)}
      </p>
    ) : null;

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
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                    <Image
                      src={line.product.imageUrl || FALLBACK_IMAGE}
                      alt={line.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
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
                        className={qtyButtonClass}
                        aria-label="Decrease quantity"
                      >
                        <QtyIcon />
                      </button>
                      <span className="w-6 text-center">{line.quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(line.product.id, line.quantity + 1)
                        }
                        className={qtyButtonClass}
                        aria-label="Increase quantity"
                      >
                        <QtyIcon plus />
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
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  aria-label="Your name"
                  autoComplete="name"
                  {...fieldProps('name', name, setName)}
                />
                {fieldError('name')}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email"
                  autoComplete="email"
                  {...fieldProps('email', email, setEmail)}
                />
                {fieldError('email')}
              </div>

              <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-moss-400">
                Shipping address
              </p>
              <div className="flex gap-2">
                <div className="w-2/3">
                  <input
                    type="text"
                    placeholder="Street"
                    aria-label="Street"
                    autoComplete="address-line1"
                    {...fieldProps('street', street, setStreet)}
                  />
                  {fieldError('street')}
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    placeholder="No."
                    aria-label="House number"
                    {...fieldProps('houseNumber', houseNumber, setHouseNumber)}
                  />
                  {fieldError('houseNumber')}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  aria-label="City"
                  autoComplete="address-level2"
                  {...fieldProps('city', city, setCity)}
                />
                {fieldError('city')}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Country"
                  aria-label="Country"
                  autoComplete="country-name"
                  {...fieldProps('country', country, setCountry)}
                />
                {fieldError('country')}
              </div>
            </div>

            {submitAttempted && !isValid && (
              <p className="mt-2 text-sm text-coral-600">
                Almost there! Fill in the highlighted fields above.
              </p>
            )}

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

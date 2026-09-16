'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/store', label: 'Store' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const openCart = () => {
    setMenuOpen(false);
    open();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-sand-50/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="animate-bob text-2xl">🦐</span>
          <span className="font-display text-xl font-bold text-moss-700">
            Shrimps &amp; Giggles
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <ul className="flex gap-6">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-coral-500 ${
                      active ? 'text-coral-500' : 'text-moss-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            onClick={open}
            className="relative rounded-full bg-moss-500 px-4 py-2 text-sm font-semibold text-sand-50 shadow-soft transition-transform hover:scale-105"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-xs text-sand-50">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-moss-500 text-lg text-sand-50 shadow-soft sm:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? '✕' : '☰'}
          {itemCount > 0 && !menuOpen && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-xs text-sand-50">
              {itemCount}
            </span>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="animate-fade-up border-t border-sand-200 bg-sand-50 px-6 py-3 sm:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-coral-300/20 text-coral-600'
                        : 'text-moss-600 hover:bg-sand-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={openCart}
                className="mt-1 flex w-full items-center justify-between rounded-xl bg-moss-500 px-3 py-2 text-sm font-semibold text-sand-50"
              >
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-coral-500 px-1 text-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

import Link from 'next/link';
import ShrimpFacts from './ShrimpFacts';

export default function Footer() {
  return (
    <footer className="mt-24 bg-moss-700 text-sand-100">
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="rounded-2xl bg-moss-600/50 px-5 py-3 text-center">
          <ShrimpFacts />
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">🦐 Shrimps &amp; Giggles</p>
          <p className="mt-2 text-sm text-sand-200">
            Home-bred Neocaridina for planted tanks. Live arrival, guaranteed.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-tide-300">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-coral-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-coral-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/store" className="hover:text-coral-300">
                Store
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-tide-300">
            Say hello
          </p>
          <p className="mt-3 text-sm text-sand-200">zvansteelandt@gmail.com</p>
          <p className="mt-1 text-sm text-sand-200">Torhout</p>
        </div>
      </div>
      <div className="border-t border-moss-600 py-4 text-center text-xs text-sand-200">
        © {new Date().getFullYear()} Shrimps &amp; Giggles. Bred with care.
      </div>
    </footer>
  );
}

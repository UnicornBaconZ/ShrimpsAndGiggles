import Link from 'next/link';
import WaveDivider from '../components/WaveDivider';

export const metadata = {
  title: '404 — Algae not found | Shrimps & Giggles',
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-tide-100 to-sand-50">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <div className="flex h-56 w-56 items-center justify-center rounded-blob bg-coral-300/40 shadow-soft animate-bob">
          <span className="text-[7rem]">🦐</span>
        </div>

        <p className="mt-8 font-display text-6xl font-bold text-moss-700">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-coral-500">
          Algae not found
        </h1>
        <p className="mt-4 max-w-md text-lg text-moss-500">
          This little shrimp scavenged the whole tank and came up empty. The
          page you are after must have drifted off with the current.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-coral-500 px-6 py-3 font-semibold text-white shadow-soft transition-transform hover:scale-105"
          >
            Swim home
          </Link>
          <Link
            href="/store"
            className="rounded-full border-2 border-moss-400 px-6 py-3 font-semibold text-moss-600 transition-colors hover:bg-moss-400 hover:text-sand-50"
          >
            Scavenge the store
          </Link>
        </div>
      </div>
      <WaveDivider fill="#faf6ef" />
    </section>
  );
}

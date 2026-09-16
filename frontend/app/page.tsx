import Link from 'next/link';
import WaveDivider from '../components/WaveDivider';
import HeroShrimp from '../components/HeroShrimp';

const highlights = [
  {
    icon: '🌿',
    title: 'Tank-raised, not shipped-in',
    body: 'Every shrimp is bred and grown in our own planted tanks — never wild-caught, never drop-shipped.',
  },
  {
    icon: '🎨',
    title: 'Stable, vivid colour',
    body: 'Carefully culled lines so your Blue Dreams stay blue and your Bloody Marys stay deep red for generations.',
  },
  {
    icon: '📦',
    title: 'Live arrival guarantee',
    body: 'Insulated, heat- or cold-packed boxes with a full live arrival guarantee. Acclimation guide in every order.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-tide-100 to-sand-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <span className="inline-block animate-fade-up rounded-full bg-coral-300/30 px-4 py-1 text-sm font-semibold text-coral-600">
              Live Neocaridina shrimp for planted aquariums
            </span>
            <h1
              className="mt-4 animate-fade-up font-display text-5xl font-bold leading-tight text-moss-700"
              style={{ animationDelay: '0.08s' }}
            >
              Tiny tank-mates worth
              <span className="text-coral-500"> giggling</span> about.
            </h1>
            <p
              className="mt-4 max-w-md animate-fade-up text-lg text-moss-500"
              style={{ animationDelay: '0.16s' }}
            >
              Home-bred Neocaridina in every colour of the rainbow — hardy,
              peaceful, and endlessly fun to watch graze. Perfect for beginners
              and aquascapers alike.
            </p>
            <div
              className="mt-8 flex animate-fade-up gap-4"
              style={{ animationDelay: '0.24s' }}
            >
              <Link
                href="/store"
                className="rounded-full bg-coral-500 px-6 py-3 font-semibold text-white shadow-soft transition-transform hover:scale-105"
              >
                Browse the colony
              </Link>
              <Link
                href="/about"
                className="rounded-full border-2 border-moss-400 px-6 py-3 font-semibold text-moss-600 transition-colors hover:bg-moss-400 hover:text-sand-50"
              >
                Our story
              </Link>
            </div>
          </div>

          <HeroShrimp />
        </div>
        <WaveDivider fill="#faf6ef" />
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {highlights.map((h, i) => (
            <div
              key={h.title}
              className="animate-fade-up rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-sand-200 transition-transform duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="text-4xl">{h.icon}</div>
              <h3 className="mt-4 font-display text-xl font-bold text-moss-700">
                {h.title}
              </h3>
              <p className="mt-2 text-sm text-moss-500">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beginner-friendly band */}
      <section className="bg-moss-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center text-sand-50">
          <h2 className="font-display text-3xl font-bold">
            New to shrimp keeping? You picked the right pet.
          </h2>
          <p className="max-w-xl text-sand-200">
            Neocaridina are famously forgiving — a stable, cycled tank, a stack
            of plants, and steady parameters are all they ask. Start a colony
            with as few as ten and watch it grow.
          </p>
          <Link
            href="/store"
            className="mt-2 rounded-full bg-coral-400 px-6 py-3 font-semibold text-white shadow-soft transition-transform hover:scale-105"
          >
            Start your colony
          </Link>
        </div>
      </section>
    </>
  );
}

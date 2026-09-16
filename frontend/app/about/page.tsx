import Link from 'next/link';
import WaveDivider from '../../components/WaveDivider';

export const metadata = {
  title: 'About — Shrimps & Giggles',
};

/** Story milestones, oldest first. */
const timeline = [
  {
    marker: '🫙',
    title: 'One tank on the counter',
    body: 'It started with a single 10-gallon of Red Cherries next to the toaster. We meant to keep ten. We kept counting past two hundred.',
  },
  {
    marker: '🔎',
    title: 'The patient culls',
    body: 'To keep colour true you have to choose. Season after season we bred only the boldest, deepest, most even shrimp back into each line.',
  },
  {
    marker: '🌿',
    title: 'A whole planted wall',
    body: 'One tank became a rack, then a wall of low-tech planted colonies — moss, botanicals, and a lot of very content Neocaridina.',
  },
  {
    marker: '📦',
    title: 'To your tank today',
    body: 'Now we pack them warm or cool, guarantee live arrival, and slip a real acclimation guide into every box that leaves the shrimp room.',
  },
];

/** What we won't compromise on. */
const values = [
  {
    icon: '🌱',
    title: 'Bred, never caught',
    body: 'Every shrimp is born and raised in our tanks. Nothing is wild-collected, so wild populations stay exactly where they belong.',
  },
  {
    icon: '🎨',
    title: 'Colour you can count on',
    body: 'Careful line-breeding means the Blue Dream you buy today throws deep-blue babies tomorrow. Stable strains, generation after generation.',
  },
  {
    icon: '💚',
    title: 'Healthy stock, honest advice',
    body: 'Quarantined shrimp, steady parameters, and straight answers. We would rather lose a sale than send a shrimp that is not ready.',
  },
];

/** Care at a glance — the quick-reference parameters. */
const careParams = [
  { icon: '🌡️', label: 'Temperature', value: '18–26 °C' },
  { icon: '💧', label: 'pH', value: '6.5–7.5' },
  { icon: '🫧', label: 'Filtration', value: 'Gentle sponge' },
  { icon: '🚫', label: 'Copper', value: 'Never' },
  { icon: '🍃', label: 'Feeding', value: 'Light & varied' },
  { icon: '🦴', label: 'Minerals', value: 'Cuttlebone' },
];

/** A ribbon of the colours we keep, using the shop palette. */
const strains = [
  { name: 'Red Cherry', color: '#e2603a' },
  { name: 'Bloody Mary', color: '#c44b2c' },
  { name: 'Orange Sakura', color: '#ef7d54' },
  { name: 'Green Jade', color: '#5f7d52' },
  { name: 'Blue Dream', color: '#5f948b' },
  { name: 'Sea Green', color: '#9cc4bd' },
  { name: 'Golden Back', color: '#d6bd93' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — asymmetric split with rising bubbles and a floating mascot. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tide-100 via-sand-50 to-sand-100">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute left-[12%] bottom-10 h-4 w-4 rounded-full bg-tide-300/50 animate-rise" />
          <span
            className="absolute left-[22%] bottom-4 h-2.5 w-2.5 rounded-full bg-white/60 animate-rise"
            style={{ animationDelay: '1.2s' }}
          />
          <span
            className="absolute left-[78%] bottom-8 h-5 w-5 rounded-full bg-coral-300/40 animate-rise"
            style={{ animationDelay: '0.6s' }}
          />
          <span
            className="absolute left-[64%] bottom-2 h-3 w-3 rounded-full bg-tide-300/50 animate-rise"
            style={{ animationDelay: '2.1s' }}
          />
          <span
            className="absolute left-[45%] bottom-6 h-2 w-2 rounded-full bg-white/60 animate-rise"
            style={{ animationDelay: '1.7s' }}
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-block animate-fade-up rounded-full bg-moss-500/15 px-4 py-1 text-sm font-semibold text-moss-600">
              Our story
            </span>
            <h1
              className="mt-4 animate-fade-up font-display text-5xl font-bold leading-tight text-moss-700"
              style={{ animationDelay: '0.08s' }}
            >
              From one countertop tank to a
              <span className="text-coral-500"> wall of colour</span>.
            </h1>
            <p
              className="mt-5 max-w-md animate-fade-up text-lg text-moss-500"
              style={{ animationDelay: '0.16s' }}
            >
              Shrimps &amp; Giggles is a small home shrimp room with a stubborn
              soft spot for vivid, healthy Neocaridina — and for the people
              setting up their very first colony.
            </p>
            <div
              className="mt-8 flex animate-fade-up flex-wrap gap-6 text-sm font-semibold text-moss-600"
              style={{ animationDelay: '0.24s' }}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🎨</span> 7 signature strains
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">🏠</span> 1 planted shrimp room
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">🌊</span> 0 wild-caught
              </span>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="flex h-64 w-64 animate-float items-center justify-center rounded-blob bg-coral-300/40 shadow-soft">
              <span className="text-[8rem]">🦐</span>
            </div>
            <div className="absolute -left-2 top-4 flex h-16 w-16 animate-sway items-center justify-center rounded-blob bg-tide-300/50 text-3xl">
              🌿
            </div>
            <div
              className="absolute -right-1 bottom-6 flex h-14 w-14 animate-sway items-center justify-center rounded-blob bg-moss-400/40 text-2xl"
              style={{ animationDelay: '1s' }}
            >
              🫧
            </div>
          </div>
        </div>
        <WaveDivider fill="#faf6ef" />
      </section>

      {/* Story timeline */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold text-moss-700">
          How a countertop hobby got happily out of hand
        </h2>

        <ol className="relative mt-12 space-y-10 border-l-2 border-dashed border-tide-300 pl-8">
          {timeline.map((step, i) => (
            <li
              key={step.title}
              className="relative animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="absolute -left-[2.85rem] flex h-10 w-10 items-center justify-center rounded-full bg-sand-50 text-xl ring-2 ring-tide-300">
                {step.marker}
              </span>
              <h3 className="font-display text-xl font-bold text-moss-700">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-moss-500">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Values */}
      <section className="bg-tide-100/60">
        <WaveDivider className="rotate-180" fill="#dcebe8" />
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-display text-3xl font-bold text-moss-700">
            What we won&apos;t compromise on
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="group animate-fade-up rounded-3xl bg-white p-8 shadow-soft ring-1 ring-sand-200 transition-transform duration-300 hover:-translate-y-2 hover:rotate-1"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-blob bg-coral-300/30 text-3xl transition-transform duration-300 group-hover:scale-110">
                  {v.icon}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-moss-700">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-moss-500">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider fill="#faf6ef" />
      </section>

      {/* Care at a glance */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-moss-700">
            Care at a glance
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-moss-500">
            Neocaridina are famously forgiving. Give them a cycled, planted tank
            and steady water, and they will graze, breed, and giggle along
            happily. Every order ships with a full acclimation and care sheet.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careParams.map((p, i) => (
            <div
              key={p.label}
              className="flex animate-pop-in items-center gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-sand-200 transition-transform duration-200 hover:scale-[1.03]"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tide-100 text-2xl">
                {p.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-moss-400">
                  {p.label}
                </p>
                <p className="font-display text-lg font-bold text-moss-700">
                  {p.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Colour ribbon */}
        <div className="mt-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-moss-400">
            Colours we keep
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {strains.map((s, i) => (
              <span
                key={s.name}
                className="flex animate-fade-up items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 text-sm font-medium text-moss-600 shadow-sm ring-1 ring-sand-200 transition-transform duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span
                  className="h-5 w-5 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Signature CTA */}
      <section className="bg-moss-600">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center text-sand-50">
          <span className="animate-float text-5xl">🦐</span>
          <h2 className="font-display text-3xl font-bold">
            Come meet the colony
          </h2>
          <p className="max-w-xl text-sand-200">
            Pick your colours, start with as few as ten, and watch a whole
            little world take shape in your tank. We will get them to you safe.
          </p>
          <Link
            href="/store"
            className="mt-2 rounded-full bg-coral-400 px-6 py-3 font-semibold text-white shadow-soft transition-transform hover:scale-105"
          >
            Browse the colony
          </Link>
          <p className="mt-4 font-display text-lg">— Tetiana &amp; Zarin 🦐</p>
        </div>
      </section>
    </>
  );
}

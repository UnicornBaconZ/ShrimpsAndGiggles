'use client';

import { useRef } from 'react';
import { burstShrimp } from './ShrimpConfetti';

const POKES_TO_FLIP = 5;

/**
 * The big hero shrimp — but pokeable. Each press gives it a quick squish, and
 * every fifth poke it does a spinning backflip and sets off a shrimp confetti
 * burst. A hidden little easter egg. Honours reduced-motion.
 */
export default function HeroShrimp() {
  const shrimpRef = useRef<HTMLSpanElement>(null);
  const pokes = useRef(0);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const handlePoke = () => {
    pokes.current += 1;
    const el = shrimpRef.current;

    if (pokes.current >= POKES_TO_FLIP) {
      pokes.current = 0;
      burstShrimp();
      if (el && !prefersReducedMotion()) {
        el.animate(
          [
            { transform: 'rotate(0deg) scale(1)' },
            { transform: 'rotate(360deg) scale(1.3)' },
            { transform: 'rotate(720deg) scale(1)' },
          ],
          { duration: 900, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
        );
      }
      return;
    }

    if (el && !prefersReducedMotion()) {
      el.animate(
        [
          { transform: 'scale(1) rotate(0deg)' },
          { transform: 'scale(0.82) rotate(-8deg)' },
          { transform: 'scale(1) rotate(0deg)' },
        ],
        { duration: 260, easing: 'ease-out' },
      );
    }
  };

  return (
    <div className="relative flex justify-center">
      <button
        type="button"
        onClick={handlePoke}
        aria-label="Poke the shrimp"
        title="psst… poke me"
        className="flex h-72 w-72 animate-float cursor-pointer items-center justify-center rounded-blob bg-coral-300/40 shadow-soft outline-none focus-visible:ring-4 focus-visible:ring-coral-300"
      >
        <span ref={shrimpRef} className="select-none text-[9rem]">
          🦐
        </span>
      </button>
    </div>
  );
}

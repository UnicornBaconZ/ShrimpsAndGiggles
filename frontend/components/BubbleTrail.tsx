'use client';

import { useEffect, useRef } from 'react';

/**
 * A trail of tiny bubbles that rise from wherever the cursor moves.
 * Purely decorative, and silent for anyone who prefers reduced motion.
 * Bubbles are created imperatively (not via React state) so rapid mouse
 * movement never triggers a re-render storm.
 */
export default function BubbleTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const container = containerRef.current;
    if (!container) return;

    let lastSpawn = 0;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn < 55) return; // throttle
      lastSpawn = now;

      const bubble = document.createElement('span');
      const size = 6 + Math.random() * 12;
      bubble.style.cssText = [
        'position:fixed',
        `left:${e.clientX}px`,
        `top:${e.clientY}px`,
        `width:${size}px`,
        `height:${size}px`,
        'border-radius:9999px',
        'pointer-events:none',
        'transform:translate(-50%,-50%)',
        'background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(156,196,189,0.45))',
        'box-shadow:0 0 6px rgba(156,196,189,0.5)',
      ].join(';');
      container.appendChild(bubble);

      const drift = (Math.random() - 0.5) * 44;
      const anim = bubble.animate(
        [
          { transform: 'translate(-50%,-50%) scale(0.6)', opacity: 0.9 },
          {
            transform: `translate(calc(-50% + ${drift}px), -150%) scale(1)`,
            opacity: 0,
          },
        ],
        { duration: 900 + Math.random() * 700, easing: 'ease-out' },
      );
      anim.onfinish = () => bubble.remove();
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}

/**
 * Fires a one-shot burst of shrimp (and a few plants/bubbles) that rain down
 * the screen. Imperative and dependency-free — call burstShrimp() from an
 * event handler or effect. Silent when the user prefers reduced motion.
 */
export function burstShrimp(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:100;overflow:hidden';
  document.body.appendChild(container);

  const emojis = ['🦐', '🦐', '🦐', '🦐', '🌿', '🫧'];
  const count = 34;

  for (let k = 0; k < count; k++) {
    const piece = document.createElement('span');
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const startX = 10 + Math.random() * 80;
    const size = 16 + Math.random() * 24;
    piece.style.cssText = [
      'position:absolute',
      `left:${startX}vw`,
      'top:-10vh',
      `font-size:${size}px`,
      'will-change:transform,opacity',
    ].join(';');
    container.appendChild(piece);

    const drift = (Math.random() - 0.5) * 34;
    const spin = (Math.random() - 0.5) * 720;
    const duration = 1800 + Math.random() * 1500;
    const anim = piece.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        {
          transform: `translate(${drift}vw, 115vh) rotate(${spin}deg)`,
          opacity: 0.85,
        },
      ],
      { duration, easing: 'cubic-bezier(0.3,0.7,0.4,1)', delay: Math.random() * 250 },
    );
    anim.onfinish = () => piece.remove();
  }

  window.setTimeout(() => container.remove(), 3800);
}

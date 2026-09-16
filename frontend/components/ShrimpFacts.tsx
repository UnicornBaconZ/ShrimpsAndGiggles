'use client';

import { useEffect, useState } from 'react';

/** Delightful, occasionally-useless facts about shrimp. */
const FACTS = [
  "a shrimp's heart is in its head.",
  'a single Neocaridina clutch can carry 20–30 eggs.',
  'cherry shrimp graze almost constantly — the tank cleanup crew.',
  'shrimp grow by molting, wriggling right out of their old shell.',
  'a berried female fans her eggs to keep them oxygenated.',
  'shrimp taste their food with tiny sensors on their legs.',
  'freshwater Neocaridina hatch as miniature adults — no larval stage.',
  'copper is toxic to shrimp, so skip copper-based medications.',
  'a stable, cycled tank matters more to shrimp than an expensive one.',
  'a happy colony can double in size in just a couple of months.',
];

/**
 * A quietly rotating ticker of shrimp trivia. Starts on a deterministic index
 * to avoid a hydration mismatch, then randomises and cycles on the client.
 */
export default function ShrimpFacts() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * FACTS.length));
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % FACTS.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      className={`text-sm text-sand-200 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      🦐 Did you know? Fun fact: {FACTS[index]}
    </p>
  );
}

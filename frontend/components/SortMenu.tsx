'use client';

import { useEffect, useId, useRef, useState } from 'react';

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

/**
 * A themed replacement for a native <select>, whose open list can't be styled
 * (it renders with the OS look on Windows). Follows the listbox pattern:
 * arrow keys move, Enter/Space picks, Escape or an outside click closes.
 */
export default function SortMenu<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  // Close when clicking anywhere outside the menu.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  // On open, highlight the current choice and move focus into the list.
  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex(selectedIndex);
    listRef.current?.focus();
  }, [isOpen, selectedIndex]);

  const choose = (index: number) => {
    onChange(options[index].value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((i) => Math.min(i + 1, last)),
      ArrowUp: () => setActiveIndex((i) => Math.max(i - 1, 0)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(activeIndex),
      ' ': () => choose(activeIndex),
      Escape: () => {
        setIsOpen(false);
        buttonRef.current?.focus();
      },
      Tab: () => setIsOpen(false),
    };
    const action = keys[e.key];
    if (!action) return;
    if (e.key !== 'Tab') e.preventDefault();
    action();
  };

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <span id={`${id}-label`} className="text-sm text-moss-500">
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}-button`}
        id={`${id}-button`}
        className={`flex min-w-[11.5rem] items-center justify-between gap-3 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-moss-600 ring-1 transition-colors ${
          isOpen ? 'ring-moss-400' : 'ring-sand-200 hover:ring-moss-400'
        }`}
      >
        {options[selectedIndex].label}
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="2.5,4.5 6,8 9.5,4.5" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${activeIndex}`}
          onKeyDown={onListKeyDown}
          className="absolute right-0 top-full z-20 mt-2 min-w-[11.5rem] animate-pop-in overflow-hidden rounded-2xl bg-white p-1.5 shadow-soft outline-none ring-1 ring-sand-200"
        >
          {options.map((option, i) => {
            const selected = i === selectedIndex;
            const active = i === activeIndex;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onClick={() => choose(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-sand-100' : ''
                } ${selected ? 'font-semibold text-coral-500' : 'text-moss-600'}`}
              >
                {option.label}
                {selected && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="2,6.5 5,9 10,3" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

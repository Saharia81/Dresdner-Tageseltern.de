"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "./Card";

type Testimonial = {
  initials: string;
  name: string;
  quote: string;
  avatar?: string;
};

const DUPES = 3;

export function TestimonialCarousel({
  items,
  intervalMs = 5000,
}: {
  items: Testimonial[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = window.setInterval(
      () => setIndex((i) => i + 1),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [paused, items.length, intervalMs]);

  // Nahtlose Schleife in beide Richtungen: nach dem Slide in den Duplikat-Bereich
  // springt der Index ohne Animation in den gültigen Bereich zurück.
  useEffect(() => {
    if (index >= 0 && index < items.length) return;
    const t = window.setTimeout(() => {
      const wrapped = ((index % items.length) + items.length) % items.length;
      setAnimate(false);
      setIndex(wrapped);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimate(true)),
      );
    }, 700);
    return () => window.clearTimeout(t);
  }, [index, items.length]);

  const rendered = [
    ...items.slice(-DUPES),
    ...items,
    ...items.slice(0, DUPES),
  ];
  const translateIndex = index + DUPES;
  const activeDot = ((index % items.length) + items.length) % items.length;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label="Vorherige Stimme"
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center text-text-soft hover:text-korallenrot transition-colors"
        >
          <ChevronLeft />
        </button>

        <div className="overflow-hidden flex-1 min-w-0 -mx-3">
          <div
            className={`flex w-full [--card-w:100%] md:[--card-w:33.3333%] ${
              animate ? "transition-transform duration-700 ease-out" : ""
            }`}
            style={{
              transform: `translateX(calc(var(--card-w) * -${translateIndex}))`,
            }}
            aria-live="polite"
          >
            {rendered.map((item, i) => (
              <div key={i} className="shrink-0 w-[var(--card-w)] px-3">
                <Card className="flex flex-col gap-4 h-full">
                  {item.avatar ? (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-text-soft/15">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-text-soft/15 flex items-center justify-center font-bold text-text-soft">
                      {item.initials}
                    </div>
                  )}
                  <p className="text-text-soft italic">
                    &bdquo;{item.quote}&ldquo;
                  </p>
                  <p className="font-semibold">{item.name}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label="Nächste Stimme"
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center text-text-soft hover:text-korallenrot transition-colors"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="flex gap-2 justify-center mt-8">
        {items.map((_, i) => {
          const active = i === activeDot;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1} anzeigen`}
              aria-current={active}
              className={`w-2 h-2 rounded-full transition-colors ${
                active
                  ? "bg-korallenrot"
                  : "bg-text-soft/30 hover:bg-text-soft/50"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

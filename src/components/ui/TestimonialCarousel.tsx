"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const [animate, setAnimate] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchHandled = useRef(false);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(
      () => setIndex((i) => i + 1),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [items.length, intervalMs]);

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
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label="Vorherige Stimme"
          className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-text-soft hover:text-korallenrot transition-colors touch-manipulation [&>*]:pointer-events-none"
        >
          <ChevronLeft />
        </button>

        <div
          className="overflow-hidden flex-1 min-w-0 touch-pan-y"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStartX.current = t.clientX;
            touchStartY.current = t.clientY;
            touchHandled.current = false;
          }}
          onTouchMove={(e) => {
            if (
              touchHandled.current ||
              touchStartX.current === null ||
              touchStartY.current === null
            )
              return;
            const t = e.touches[0];
            const dx = t.clientX - touchStartX.current;
            const dy = t.clientY - touchStartY.current;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
              setIndex((i) => i + (dx < 0 ? 1 : -1));
              touchHandled.current = true;
            }
          }}
          onTouchEnd={() => {
            touchStartX.current = null;
            touchStartY.current = null;
          }}
        >
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
          className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-text-soft hover:text-korallenrot transition-colors touch-manipulation [&>*]:pointer-events-none"
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

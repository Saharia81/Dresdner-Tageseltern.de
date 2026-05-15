"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";

type Testimonial = {
  initials: string;
  name: string;
  quote: string;
};

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

  // Nahtlose Schleife: nach dem Slide in den Duplikat-Bereich
  // springt der Index ohne Animation auf 0 zurück.
  useEffect(() => {
    if (index < items.length) return;
    const t = window.setTimeout(() => {
      setAnimate(false);
      setIndex(0);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimate(true)),
      );
    }, 700);
    return () => window.clearTimeout(t);
  }, [index, items.length]);

  const dupes = Math.min(3, items.length);
  const rendered = [...items, ...items.slice(0, dupes)];
  const activeDot = ((index % items.length) + items.length) % items.length;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden -mx-3">
        <div
          className={`flex w-full [--card-w:100%] md:[--card-w:33.3333%] ${
            animate ? "transition-transform duration-700 ease-out" : ""
          }`}
          style={{
            transform: `translateX(calc(var(--card-w) * -${index}))`,
          }}
          aria-live="polite"
        >
          {rendered.map((item, i) => (
            <div key={i} className="shrink-0 w-[var(--card-w)] px-3">
              <Card className="flex flex-col gap-4 h-full">
                <div className="w-14 h-14 rounded-full bg-text-soft/15 flex items-center justify-center font-bold text-text-soft">
                  {item.initials}
                </div>
                <p className="text-text-soft italic">
                  &bdquo;{item.quote}&ldquo;
                </p>
                <p className="font-semibold">{item.name}</p>
              </Card>
            </div>
          ))}
        </div>
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

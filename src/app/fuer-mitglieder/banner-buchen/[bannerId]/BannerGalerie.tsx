"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DUPES = 3;

export function BannerGalerie({
  fotos,
  bezeichnung,
  intervalMs = 5000,
}: {
  fotos: string[];
  bezeichnung: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchHandled = useRef(false);

  // Bei höchstens 3 Bildern reicht ein statisches Raster.
  const carousel = fotos.length > 3;

  useEffect(() => {
    if (!carousel) return;
    const id = window.setInterval(() => setIndex((i) => i + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [carousel, intervalMs]);

  // Nahtlose Endlosschleife: nach dem Slide in den Duplikat-Bereich springt
  // der Index ohne Animation zurück.
  useEffect(() => {
    if (!carousel) return;
    if (index >= 0 && index < fotos.length) return;
    const t = window.setTimeout(() => {
      const wrapped = ((index % fotos.length) + fotos.length) % fotos.length;
      setAnimate(false);
      setIndex(wrapped);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimate(true)),
      );
    }, 700);
    return () => window.clearTimeout(t);
  }, [index, fotos.length, carousel]);

  function Bild({ src, i }: { src: string; i: number }) {
    return (
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-korallenrot/20">
        <Image
          src={src}
          alt={`${bezeichnung} – Beispiel ${i + 1}`}
          fill
          quality={90}
          className="object-cover"
          sizes="(max-width: 768px) 95vw, 33vw"
        />
      </div>
    );
  }

  if (!carousel) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fotos.map((src, i) => (
          <Bild key={i} src={src} i={i} />
        ))}
      </div>
    );
  }

  const rendered = [
    ...fotos.slice(-DUPES),
    ...fotos,
    ...fotos.slice(0, DUPES),
  ];
  const translateIndex = index + DUPES;
  const activeDot = ((index % fotos.length) + fotos.length) % fotos.length;

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label="Vorheriges Bild"
          className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-text-soft hover:text-korallenrot transition-colors touch-manipulation [&>*]:pointer-events-none"
        >
          <Chevron dir="left" />
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
            {rendered.map((src, i) => (
              <div key={i} className="shrink-0 w-[var(--card-w)] px-1.5">
                <Bild src={src} i={i % fotos.length} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label="Nächstes Bild"
          className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-text-soft hover:text-korallenrot transition-colors touch-manipulation [&>*]:pointer-events-none"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <div className="flex gap-2 justify-center mt-5">
        {fotos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Bild ${i + 1} anzeigen`}
            aria-current={i === activeDot}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeDot
                ? "bg-korallenrot"
                : "bg-text-soft/30 hover:bg-text-soft/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

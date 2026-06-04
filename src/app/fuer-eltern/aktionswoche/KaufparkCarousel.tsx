"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

const BASE = [
  { src: "/images/aktionswoche/kaufpark-2.png", alt: "Familienaktion am Kaufpark" },
  { src: "/images/aktionswoche/kaufpark3.jpg",  alt: "Familienaktion am Kaufpark" },
  { src: "/images/aktionswoche/kaufpark-4.jpg", alt: "Familienaktion am Kaufpark" },
];

/**
 * Render-Array: [C, A, B, C, A, B]
 *   idx=1 → A+B   idx=2 → B+C   idx=3 → C+A
 *   idx=4 → A+B (Klon) → nach Übergang: sofort zu idx=1
 *   idx=0 → C+A (Klon) → nach Übergang: sofort zu idx=3
 */
const ITEMS = [BASE[2], ...BASE, BASE[0], BASE[1]];
const START = 1;
const GAP = 12; // px (gap-3)

export function KaufparkCarousel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(START);
  const busy   = useRef(false);
  const [idx,        setIdx]       = useState(START);
  const [animated,   setAnimated]  = useState(false);
  const [itemW,      setItemW]     = useState(0);

  /* ── Breite messen ── */
  useEffect(() => {
    const measure = () => {
      if (wrapRef.current)
        setItemW((wrapRef.current.getBoundingClientRect().width - GAP) / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ── Zu Index navigieren ── */
  const moveTo = useCallback((i: number, animate: boolean) => {
    idxRef.current = i;
    setAnimated(animate);
    setIdx(i);
  }, []);

  /* ── Pfeil / externe Navigation ── */
  const go = useCallback((dir: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    moveTo(idxRef.current + dir, true);
  }, [moveTo]);

  /* ── Nach Übergang: ggf. unsichtbar zurückspringen ── */
  const onTransitionEnd = useCallback(() => {
    busy.current = false;
    if      (idxRef.current >= ITEMS.length - 1) moveTo(START,     false);
    else if (idxRef.current <= 0)                moveTo(ITEMS.length - 2, false);
  }, [moveTo]);

  /* ── Auto-play (Intervall läuft stabil, kein Reset bei idx-Änderung) ── */
  useEffect(() => {
    const t = setInterval(() => {
      if (busy.current) return;
      busy.current = true;
      moveTo(idxRef.current + 1, true);
    }, 3500);
    return () => clearInterval(t);
  }, [moveTo]);

  const offset  = itemW > 0 ? -(idx * (itemW + GAP)) : 0;
  const dotIdx  = ((idx - 1) % BASE.length + BASE.length) % BASE.length;

  return (
    <>
      {/* ── Desktop: 3 Fotos statisch nebeneinander ── */}
      <div className="hidden md:flex gap-4">
        {BASE.map((img, i) => (
          <div key={i} className="relative w-[165px] h-48 rounded-xl overflow-hidden shadow-sm shrink-0">
            <Image src={img.src} alt={img.alt} fill sizes="165px" className="object-cover" />
          </div>
        ))}
      </div>

      {/* ── Mobil: Infinite Carousel ── */}
      <div className="md:hidden w-full max-w-full">
        {/* Viewport – isolate erzwingt korrektes Clipping auf iOS Safari */}
        <div ref={wrapRef} className="relative w-full max-w-full overflow-hidden rounded-xl" style={{ isolation: "isolate" }}>
          {/* Track */}
          <div
            className="flex will-change-transform"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(${offset}px)`,
              transition: animated ? "transform 0.42s ease" : "none",
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {ITEMS.map((img, i) => (
              <div
                key={i}
                style={{ width: itemW > 0 ? itemW : "calc(50% - 6px)", flexShrink: 0 }}
                className="relative h-52 rounded-xl overflow-hidden shadow-sm max-w-full"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="calc(50vw - 22px)"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Pfeil links */}
          <button
            onClick={() => go(-1)}
            aria-label="Vorheriges Bild"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-text text-xl leading-none"
          >
            ‹
          </button>

          {/* Pfeil rechts */}
          <button
            onClick={() => go(1)}
            aria-label="Nächstes Bild"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-text text-xl leading-none"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3">
          {BASE.map((_, d) => (
            <button
              key={d}
              onClick={() => { if (!busy.current) { busy.current = true; moveTo(d + 1, true); } }}
              aria-label={`Foto ${d + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                dotIdx === d ? "bg-korallenrot" : "bg-text/20"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

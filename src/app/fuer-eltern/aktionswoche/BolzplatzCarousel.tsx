"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

const PHOTOS = [
  { src: "/images/aktionswoche/bolzplatz1.jpg", alt: "Aktion am Bolzplatz in Löbtau", pos: "object-[center_70%]" },
  { src: "/images/aktionswoche/bolzplatz2.jpg", alt: "Aktion am Bolzplatz in Löbtau" },
  { src: "/images/aktionswoche/bolzplatz3.jpg", alt: "Aktion am Bolzplatz in Löbtau" },
  { src: "/images/aktionswoche/bolzplatz4.jpg", alt: "Aktion am Bolzplatz in Löbtau" },
];

export function BolzplatzCarousel() {
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const item = el.children[i] as HTMLElement;
    if (item) el.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
  }, []);

  const go = useCallback(
    (i: number) => {
      const next = ((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length;
      idxRef.current = next;
      setIdx(next);
      scrollTo(next);
    },
    [scrollTo],
  );

  // Automatischer Vorschub
  useEffect(() => {
    const t = setInterval(() => go(idxRef.current + 1), 3500);
    return () => clearInterval(t);
  }, [go]);

  return (
    <div className="relative overflow-hidden">
      {/* Scroll-Track: ein Foto füllt die volle Breite */}
      <div
        ref={ref}
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {PHOTOS.map((img, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm shrink-0 snap-start w-full"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover ${img.pos ?? "object-center"}`}
            />
          </div>
        ))}
      </div>

      {/* Pfeil links */}
      <button
        onClick={() => go(idx - 1)}
        aria-label="Vorheriges Bild"
        className="absolute left-2 top-[calc(50%-20px)] -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-text text-xl leading-none transition-opacity"
      >
        ‹
      </button>

      {/* Pfeil rechts */}
      <button
        onClick={() => go(idx + 1)}
        aria-label="Nächstes Bild"
        className="absolute right-2 top-[calc(50%-20px)] -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-text text-xl leading-none transition-opacity"
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Bild ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === idx ? "bg-korallenrot" : "bg-text/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

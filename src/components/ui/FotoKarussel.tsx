"use client";

// Foto-Galerie mit Endlos-Carousel. Bei bis zu 3 Bildern werden sie
// nebeneinander gezeigt; ab 4 Bildern automatisches Weiterschieben,
// Wischen auf Mobil und Pfeil-Navigation. Wird in den Steckbriefen und
// auf der Ersatztagespflege-Seite verwendet.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function FotoKarussel({ fotos }: { fotos: string[] }) {
  const N = fotos.length;

  // Dreifache Liste → nahtloser Endlos-Slide, 1 Bild pro Schritt, immer 3 sichtbar.
  // Track-Breite = T/3 × Containerbreite → jedes Bild belegt genau 1/3 des Containers.
  // translateX-Formel: -(aktiv × 100 / T) % des Tracks  (identisch zum 1-Bild-Modus).
  const klone = [...fotos, ...fotos, ...fotos];
  const T = klone.length; // = 3 × N

  const [aktiv, setAktiv] = useState(N); // Start: erstes Bild im mittleren Drittel
  const [mitAnimation, setMitAnimation] = useState(true);

  // Auto-Advance alle 3 s (nur wenn mehr Bilder als sichtbar)
  useEffect(() => {
    if (N <= 3) return;
    const id = setInterval(() => {
      setMitAnimation(true);
      setAktiv((a) => a + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [N]);

  const navigate = (delta: number) => {
    setMitAnimation(true);
    setAktiv((a) => a + delta);
  };

  // Wischen auf Mobilgeräten
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return; // zu kurz → kein Wisch
    navigate(dx < 0 ? 1 : -1);
  };

  // Nach Transition: unsichtbar zurück ins mittlere Drittel springen
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== "transform") return;
    if (aktiv >= 2 * N) {
      setMitAnimation(false);
      setAktiv(aktiv - N);
    } else if (aktiv < N) {
      setMitAnimation(false);
      setAktiv(aktiv + N);
    }
  };

  const translatePct = (aktiv * 100) / T;

  // 3 oder weniger Bilder: alle nebeneinander, kein Scrollen/Wischen/Pfeile
  if (N <= 3) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {fotos.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square bg-text-soft/10 overflow-hidden rounded-xl"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-2xl touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex${mitAnimation ? " transition-transform duration-500 ease-in-out" : ""}`}
          style={{
            width: `${(T / 3) * 100}%`,
            transform: `translateX(-${translatePct}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {klone.map((url, i) => (
            <div key={i} className="px-0.5" style={{ width: `${100 / T}%` }}>
              <div className="relative aspect-square bg-text-soft/10 overflow-hidden rounded-xl">
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="150px"
                  className="object-cover"
                  priority={i === N}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigations-Pfeile */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md hidden sm:flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Vorheriges Bild"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => navigate(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md hidden sm:flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Nächstes Bild"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

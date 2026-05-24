"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Startseite" },
  { href: "/fuer-eltern/kindertagespflege", label: "Was ist Kindertagespflege?" },
  { href: "/kindertagespflege-finden", label: "Tageseltern finden" },
  { href: "/fuer-eltern", label: "Für Eltern" },
  { href: "/fuer-tageseltern", label: "Für Tageseltern" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Burger-Button */}
      <button
        type="button"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col justify-center items-center w-12 h-12 gap-1.5"
        style={{ touchAction: "manipulation" }}
      >
        <span
          className="block w-6 h-0.5 bg-text transition-transform duration-300"
          style={open ? { transform: "translateY(8px) rotate(45deg)" } : {}}
        />
        <span
          className="block w-6 h-0.5 bg-text transition-opacity duration-300"
          style={open ? { opacity: 0 } : {}}
        />
        <span
          className="block w-6 h-0.5 bg-text transition-transform duration-300"
          style={open ? { transform: "translateY(-8px) rotate(-45deg)" } : {}}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <nav
          className="fixed left-0 right-0 bg-sonnengelb shadow-lg"
          style={{ top: "64px", zIndex: 9999 }}
          aria-label="Hauptnavigation"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-black/5 last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-base font-semibold hover:bg-creme active:bg-creme transition-colors"
                  style={{ touchAction: "manipulation" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

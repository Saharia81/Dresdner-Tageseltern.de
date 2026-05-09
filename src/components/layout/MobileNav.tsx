"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Startseite" },
  { href: "/fuer-eltern", label: "Für Eltern" },
  { href: "/fuer-mitglieder", label: "Für Mitglieder" },
  { href: "/mitglied-werden", label: "Mitglied werden" },
  { href: "/ueber-uns", label: "Über uns" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Menü öffnen"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 gap-1.5"
      >
        <span className={`block w-6 h-0.5 bg-text transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`block w-6 h-0.5 bg-text transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-text transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {open && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-sonnengelb shadow-md">
          <ul className="flex flex-col py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 hover:bg-creme transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

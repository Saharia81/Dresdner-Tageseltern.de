"use client";

import Link from "next/link";
import { useState } from "react";

const NAV: Array<
  | { href: string; label: string; children?: undefined }
  | { label: string; href?: undefined; children: { href: string; label: string }[] }
> = [
  { href: "/", label: "Startseite" },
  { href: "/fuer-eltern/kindertagespflege", label: "Was ist Kindertagespflege?" },
  { href: "/kindertagespflege-finden", label: "Tageseltern finden" },
  {
    label: "Für Eltern",
    children: [
{ href: "/fuer-eltern/eingewoehnung-und-ersatzbetreuung", label: "Eingewöhnung & Ersatzbetreuung" },
      { href: "/fuer-eltern/aktionswoche", label: "Aktionswoche Kindertagespflege" },
    ],
  },
  {
    label: "Für Tageseltern",
    children: [
      { href: "/fuer-mitglieder/banner-buchen", label: "Banner buchen" },
    ],
  },
  { href: "/ueber-uns", label: "Über uns" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setExpandedLabel(null);
  }

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
            {NAV.map((item) => {
              if (item.children) {
                const isExpanded = expandedLabel === item.label;
                return (
                  <li key={item.label} className="border-b border-black/5">
                    {/* Akkordeon-Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedLabel(isExpanded ? null : item.label)}
                      className="flex items-center justify-between w-full px-6 py-4 text-base font-semibold hover:bg-creme active:bg-creme transition-colors"
                      style={{ touchAction: "manipulation" }}
                    >
                      {item.label}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className="transition-transform duration-200"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Untermenü */}
                    {isExpanded && (
                      <ul className="bg-creme">
                        {item.children.map((child) => (
                          <li key={child.href} className="border-t border-black/5">
                            <Link
                              href={child.href}
                              onClick={close}
                              className="block px-8 py-3 text-sm font-medium hover:bg-sonnengelb/60 active:bg-sonnengelb/60 transition-colors"
                              style={{ touchAction: "manipulation" }}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href} className="border-b border-black/5 last:border-0">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block px-6 py-4 text-base font-semibold hover:bg-creme active:bg-creme transition-colors"
                    style={{ touchAction: "manipulation" }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

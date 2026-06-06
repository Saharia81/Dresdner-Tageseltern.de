// ============================================================
// Banner-Nummern (1–4) – verknüpft mit den festen URLs /banner1–4.
// ============================================================
//
// Welche Tagesmutter/welcher Inhalt auf einer Banner-Seite erscheint, ergibt
// sich ausschließlich aus der laufenden Buchung (siehe BannerSeite.tsx).
// Ist ein Banner gerade nicht ausgeliehen, leitet die Seite auf den Finder
// (/kindertagespflege-finden) weiter.

export const BANNER_NUMMERN = ["1", "2", "3", "4"] as const;
export type BannerNummer = (typeof BANNER_NUMMERN)[number];

// ============================================================
// Banner-Zuordnung (Sofortlösung)
// ============================================================
//
// Die gedruckten, ausgeliehenen Werbebanner zeigen per QR-Code auf die festen
// URLs /banner1, /banner2 und /banner3. Wer einen Banner gerade ausleiht, wird
// hier von Hand eingetragen: Banner-Nummer → Slug der Tagesmutter.
//
// Slug = der Teil aus der Profil-URL, z. B. "vicki-mueller". Eine vollständige
// Liste aller Slugs steht im Finder bzw. in der Datenbank.
//
// • Ist ein Banner gerade NICHT ausgeliehen → null eintragen.
//   Dann zeigt /bannerX eine neutrale Landingpage statt eines Steckbriefs.
//
// Hinweis: Dies ist die Übergangslösung. Das richtige Buchungssystem
// (Models Banner/Buchung in prisma/schema.prisma, Phase 2) ersetzt diese
// Tabelle später durch eine datenbankgestützte Zuordnung.

export const BANNER_NUMMERN = ["1", "2", "3"] as const;
export type BannerNummer = (typeof BANNER_NUMMERN)[number];

export const BANNER_ZUORDNUNG: Record<BannerNummer, string | null> = {
  "1": "silke-hauptmann",
  "2": "jeannette-puhlmann",
  "3": null, // Banner 3 leitet direkt auf den Finder weiter (siehe banner3/page.tsx)
};

export function getBannerSlug(nr: BannerNummer): string | null {
  return BANNER_ZUORDNUNG[nr];
}

// Sortierung der Mitglieder-Tabelle unter /admin/steckbriefe.
// Reine Logik ohne React, damit sie sowohl im Server- als auch im
// Browser-Teil genutzt und einzeln getestet werden kann.

export type MitgliedZeile = {
  id: string;
  mitgliedsnummer: string | null;
  vorname: string;
  nachname: string;
  einrichtungsname: string;
  stadtteil: string;
  istAktiv: boolean;
  mitgliedSeit: string | null; // YYYY-MM-DD
};

export type SortFeld =
  | "mitgliedsnummer"
  | "name"
  | "stadtteil"
  | "status"
  | "mitgliedSeit";

export type SortRichtung = "auf" | "ab";

export const SPALTEN: { feld: SortFeld; label: string; hinweis: string }[] = [
  {
    feld: "mitgliedsnummer",
    label: "Nr.",
    hinweis: "Nach Mitgliedsnummer sortieren",
  },
  {
    feld: "name",
    label: "Name",
    hinweis: "Alphabetisch nach Nachname sortieren",
  },
  {
    feld: "stadtteil",
    label: "Stadtteil",
    hinweis: "Alphabetisch nach Stadtteil sortieren",
  },
  {
    feld: "mitgliedSeit",
    label: "Mitglied seit",
    hinweis: "Nach Eintrittsdatum sortieren",
  },
  {
    feld: "status",
    label: "Status",
    hinweis: "Aktive und inaktive Mitglieder gruppieren",
  },
];

export const SORT_FELDER: SortFeld[] = SPALTEN.map((s) => s.feld);

export const STANDARD_FELD: SortFeld = "mitgliedsnummer";
export const STANDARD_RICHTUNG: SortRichtung = "auf";

/** Sortierfeld aus einem URL-Parameter, mit Rückfall auf den Standard. */
export function leseSortFeld(wert: unknown): SortFeld {
  return SORT_FELDER.find((f) => f === wert) ?? STANDARD_FELD;
}

/** Richtung aus einem URL-Parameter, mit Rückfall auf aufsteigend. */
export function leseSortRichtung(wert: unknown): SortRichtung {
  return wert === "ab" ? "ab" : STANDARD_RICHTUNG;
}

// Mitgliedsnummern sind Text, sollen aber wie Zahlen sortieren:
// 99 kommt vor 1063, nicht danach.
function nummerWert(wert: string | null): number | null {
  if (!wert) return null;
  const ziffern = wert.replace(/\D/g, "");
  if (!ziffern) return null;
  return Number.parseInt(ziffern, 10);
}

// Leere Werte stehen immer unten, egal in welcher Richtung sortiert wird.
function istLeer(zeile: MitgliedZeile, feld: SortFeld): boolean {
  switch (feld) {
    case "mitgliedsnummer":
      return nummerWert(zeile.mitgliedsnummer) === null;
    case "stadtteil":
      return zeile.stadtteil.trim() === "";
    case "mitgliedSeit":
      return zeile.mitgliedSeit === null;
    default:
      return false;
  }
}

function nameSchluessel(zeile: MitgliedZeile): string {
  return `${zeile.nachname} ${zeile.vorname}`.trim();
}

function vergleiche(a: MitgliedZeile, b: MitgliedZeile, feld: SortFeld): number {
  switch (feld) {
    case "mitgliedsnummer":
      return (nummerWert(a.mitgliedsnummer) ?? 0) -
        (nummerWert(b.mitgliedsnummer) ?? 0);
    case "name":
      return nameSchluessel(a).localeCompare(nameSchluessel(b), "de");
    case "stadtteil":
      return a.stadtteil.localeCompare(b.stadtteil, "de");
    case "mitgliedSeit":
      return (a.mitgliedSeit ?? "").localeCompare(b.mitgliedSeit ?? "");
    case "status":
      // aufsteigend = aktive zuerst
      return Number(b.istAktiv) - Number(a.istAktiv);
  }
}

export function sortiereMitglieder(
  zeilen: MitgliedZeile[],
  feld: SortFeld,
  richtung: SortRichtung,
): MitgliedZeile[] {
  return [...zeilen].sort((a, b) => {
    const leerA = istLeer(a, feld);
    const leerB = istLeer(b, feld);
    if (leerA !== leerB) return leerA ? 1 : -1;

    const wert = vergleiche(a, b, feld);
    const gerichtet = richtung === "auf" ? wert : -wert;
    if (gerichtet !== 0) return gerichtet;

    // Zweitschlüssel, damit die Reihenfolge bei Gleichstand stabil bleibt
    return nameSchluessel(a).localeCompare(nameSchluessel(b), "de");
  });
}

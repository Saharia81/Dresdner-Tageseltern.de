"use client";

// Mitglieder-Tabelle mit Sortierung über alle Spalten.
// Sortiert wird im Browser (die Liste ist klein); die gewählte Sortierung
// landet zusätzlich in der URL, damit sie beim Zurück-Button und beim
// Neuladen erhalten bleibt.

import Link from "next/link";
import { useState } from "react";
import {
  SPALTEN,
  sortiereMitglieder,
  type MitgliedZeile,
  type SortFeld,
  type SortRichtung,
} from "@/lib/mitglieder-sortierung";

function datum(iso: string | null): string {
  if (!iso) return "–";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("de-DE");
}

export function SteckbriefeTabelle({
  zeilen,
  startFeld,
  startRichtung,
}: {
  zeilen: MitgliedZeile[];
  startFeld: SortFeld;
  startRichtung: SortRichtung;
}) {
  const [feld, setFeld] = useState<SortFeld>(startFeld);
  const [richtung, setRichtung] = useState<SortRichtung>(startRichtung);

  function spalteKlick(neuesFeld: SortFeld) {
    // Gleiche Spalte erneut angeklickt: Richtung umdrehen.
    // Neue Spalte: aufsteigend anfangen.
    const neueRichtung: SortRichtung =
      neuesFeld === feld ? (richtung === "auf" ? "ab" : "auf") : "auf";
    setFeld(neuesFeld);
    setRichtung(neueRichtung);

    // URL mitziehen, ohne die Seite neu zu laden.
    const params = new URLSearchParams({
      sortieren: neuesFeld,
      richtung: neueRichtung,
    });
    window.history.replaceState(null, "", `?${params.toString()}`);
  }

  const sortiert = sortiereMitglieder(zeilen, feld, richtung);

  return (
    <div className="overflow-x-auto rounded-2xl border border-text-soft/15 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase text-text-soft border-b border-text-soft/15">
          <tr>
            {SPALTEN.map((spalte) => {
              const aktiv = spalte.feld === feld;
              return (
                <th
                  key={spalte.feld}
                  className="px-4 py-3"
                  aria-sort={
                    aktiv
                      ? richtung === "auf"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={() => spalteKlick(spalte.feld)}
                    title={spalte.hinweis}
                    className={`inline-flex items-center gap-1 whitespace-nowrap uppercase hover:text-korallenrot ${
                      aktiv ? "font-bold text-korallenrot" : "font-semibold"
                    }`}
                  >
                    {spalte.label}
                    <span aria-hidden className={aktiv ? "" : "opacity-30"}>
                      {aktiv ? (richtung === "auf" ? "▲" : "▼") : "▾"}
                    </span>
                  </button>
                </th>
              );
            })}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {sortiert.map((tm) => (
            <tr
              key={tm.id}
              className="border-b border-text-soft/10 last:border-0"
            >
              <td className="px-4 py-3 tabular-nums">
                {tm.mitgliedsnummer ?? "–"}
              </td>
              <td className="px-4 py-3 font-semibold">
                {tm.vorname} {tm.nachname}
                {tm.einrichtungsname && (
                  <span className="block text-xs font-normal text-text-soft">
                    {tm.einrichtungsname}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{tm.stadtteil}</td>
              <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                {datum(tm.mitgliedSeit)}
              </td>
              <td className="px-4 py-3">
                {tm.istAktiv ? (
                  <span className="inline-block rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-bold">
                    aktiv
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-text-soft/15 text-text-soft px-2 py-0.5 text-xs font-bold">
                    inaktiv
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/steckbriefe/${tm.id}`}
                  className="underline text-korallenrot font-semibold"
                >
                  Bearbeiten
                </Link>
              </td>
            </tr>
          ))}
          {sortiert.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-text-soft">
                Noch keine Mitglieder angelegt.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

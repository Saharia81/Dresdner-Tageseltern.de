import Link from "next/link";
import { getAlleTagesmuetterAdmin } from "@/lib/steckbriefe";
import {
  leseSortFeld,
  leseSortRichtung,
  type MitgliedZeile,
} from "@/lib/mitglieder-sortierung";
import { SteckbriefeTabelle } from "./SteckbriefeTabelle";

export const dynamic = "force-dynamic";

export default async function AdminSteckbriefePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [tagesmuetter, params] = await Promise.all([
    getAlleTagesmuetterAdmin(),
    searchParams,
  ]);

  // Standard: nach Mitgliedsnummer aufsteigend.
  const feld = leseSortFeld(params.sortieren);
  const richtung = leseSortRichtung(params.richtung);

  const zeilen: MitgliedZeile[] = tagesmuetter.map((tm) => ({
    id: tm.id,
    mitgliedsnummer: tm.mitgliedsnummer,
    vorname: tm.vorname,
    nachname: tm.nachname,
    einrichtungsname: tm.einrichtungsname,
    stadtteil: tm.stadtteil,
    istAktiv: tm.istAktiv,
    mitgliedSeit: tm.mitgliedSeit
      ? tm.mitgliedSeit.toISOString().slice(0, 10)
      : null,
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Steckbriefe verwalten</h1>
        <Link
          href="/admin/steckbriefe/neu"
          className="rounded-full bg-korallenrot text-white px-5 py-2 text-sm font-bold whitespace-nowrap"
        >
          + Neues Mitglied
        </Link>
      </div>

      <p className="text-sm text-text-soft mb-4">
        {zeilen.length} Mitglieder insgesamt. Die Datenbank ist die führende
        Datenquelle. Zum Sortieren auf eine Spaltenüberschrift klicken, für die
        umgekehrte Richtung noch einmal.
      </p>

      <SteckbriefeTabelle
        zeilen={zeilen}
        startFeld={feld}
        startRichtung={richtung}
      />
    </main>
  );
}

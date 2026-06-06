import Link from "next/link";
import { getAlleTagesmuetterAdmin } from "@/lib/steckbriefe";

export const dynamic = "force-dynamic";

export default async function AdminSteckbriefePage() {
  const tagesmuetter = await getAlleTagesmuetterAdmin();

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
        {tagesmuetter.length} Mitglieder insgesamt. Die Datenbank ist die
        führende Datenquelle.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-text-soft/15 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-text-soft border-b border-text-soft/15">
            <tr>
              <th className="px-4 py-3">Nr.</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Stadtteil</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tagesmuetter.map((tm) => (
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
            {tagesmuetter.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-text-soft"
                >
                  Noch keine Mitglieder angelegt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

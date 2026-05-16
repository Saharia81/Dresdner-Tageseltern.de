"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { FilterBar, type FilterState } from "./FilterBar";
import { ProfilePanel } from "./ProfilePanel";

// Leaflet darf nicht im SSR laufen → dynamisch laden.
const MapView = dynamic(() => import("./MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-creme">
      <p className="text-text-soft">Karte wird geladen…</p>
    </div>
  ),
});

const LEER_FILTER: FilterState = {
  beratungsgebiet: "ALLE",
  abDatum: "",
  nurFreiePlaetze: false,
};

export function FinderClient() {
  const [filter, setFilter] = useState<FilterState>(LEER_FILTER);
  const [tagesmuetter, setTagesmuetter] = useState<TagesmutterDto[]>([]);
  const [aktiveTm, setAktiveTm] = useState<TagesmutterDto | null>(null);
  const [laden, setLaden] = useState(true);

  // Daten beim Filtern neu laden
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.beratungsgebiet !== "ALLE")
      params.set("beratungsgebiet", filter.beratungsgebiet);
    if (filter.abDatum) params.set("ab_datum", filter.abDatum);
    if (filter.nurFreiePlaetze) params.set("nur_freie_plaetze", "true");

    setLaden(true);
    const controller = new AbortController();
    fetch(`/api/tagesmutters?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: TagesmutterDto[]) => {
        setTagesmuetter(data);
        setLaden(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Konnte Tagesmütter nicht laden:", err);
          setLaden(false);
        }
      });
    return () => controller.abort();
  }, [filter]);

  // Nur Tagesmütter mit Koordinaten auf der Karte zeigen
  const aufKarte = useMemo(
    () => tagesmuetter.filter((t) => t.latitude !== null && t.longitude !== null),
    [tagesmuetter],
  );

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-12 md:pb-16">
        <FilterBar value={filter} onChange={setFilter} />

        <div className="mt-6 rounded-3xl overflow-hidden border border-text-soft/15 bg-white shadow-sm">
          <div className="relative h-[70vh] min-h-[480px]">
            <MapView
              tagesmuetter={aufKarte}
              onSelect={setAktiveTm}
              ausgewaehlteId={aktiveTm?.id ?? null}
            />
            {laden && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white rounded-full px-4 py-2 shadow-md text-sm text-text-soft">
                Lade…
              </div>
            )}
            {!laden && aufKarte.length === 0 && (
              <div className="absolute inset-0 z-[400] flex items-center justify-center bg-creme/80 pointer-events-none">
                <div className="rounded-2xl bg-white px-6 py-4 shadow-md text-center pointer-events-auto">
                  <p className="font-semibold mb-1">Keine Tagesmütter gefunden</p>
                  <p className="text-sm text-text-soft">
                    Versuche die Filter zu ändern.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-text-soft">
          Kartendaten © OpenStreetMap-Mitwirkende
        </p>
      </div>

      <ProfilePanel
        tagesmutter={aktiveTm}
        onClose={() => setAktiveTm(null)}
      />
    </>
  );
}

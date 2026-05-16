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
  adresseQuery: "",
  radiusKm: 0,
  abDatum: "",
  bisDatum: "",
  nurFreiePlaetze: false,
};

// Haversine-Distanz in km zwischen zwei Lat/Lng-Punkten
function distanzKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function FinderClient() {
  const [filter, setFilter] = useState<FilterState>(LEER_FILTER);
  const [tagesmuetter, setTagesmuetter] = useState<TagesmutterDto[]>([]);
  const [aktiveTm, setAktiveTm] = useState<TagesmutterDto | null>(null);
  const [laden, setLaden] = useState(true);
  const [suchCoords, setSuchCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [suchFehler, setSuchFehler] = useState<string | null>(null);

  // Daten beim Filtern neu laden
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.beratungsgebiet !== "ALLE")
      params.set("beratungsgebiet", filter.beratungsgebiet);
    if (filter.abDatum) params.set("ab_datum", filter.abDatum);
    if (filter.bisDatum) params.set("bis_datum", filter.bisDatum);
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
  }, [
    filter.beratungsgebiet,
    filter.abDatum,
    filter.bisDatum,
    filter.nurFreiePlaetze,
  ]);

  // Adresse → Koordinaten via Nominatim (debounced)
  useEffect(() => {
    const query = filter.adresseQuery.trim();
    if (query.length < 3) {
      setSuchCoords(null);
      setSuchFehler(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: `${query}, Dresden, Deutschland`,
          format: "json",
          limit: "1",
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { signal: controller.signal },
        );
        const data = (await res.json()) as Array<{
          lat: string;
          lon: string;
        }>;
        if (data.length === 0) {
          setSuchCoords(null);
          setSuchFehler("Adresse nicht gefunden");
        } else {
          setSuchCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
          setSuchFehler(null);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuchFehler("Geocoding fehlgeschlagen");
        }
      }
    }, 600);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filter.adresseQuery]);

  // Nur Tagesmütter mit Koordinaten + ggf. Umkreisfilter
  const aufKarte = useMemo(() => {
    let liste = tagesmuetter.filter(
      (t) => t.latitude !== null && t.longitude !== null,
    );
    if (suchCoords && filter.radiusKm > 0) {
      liste = liste.filter(
        (t) =>
          distanzKm(
            suchCoords.lat,
            suchCoords.lng,
            t.latitude!,
            t.longitude!,
          ) <= filter.radiusKm,
      );
    }
    return liste;
  }, [tagesmuetter, suchCoords, filter.radiusKm]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-12 md:pb-16 flex flex-col">
        {/* Mobile: Karte zuerst, Filter danach. Desktop: Filter oben, Karte unten. */}
        <div className="order-2 md:order-1">
          <FilterBar value={filter} onChange={setFilter} />
          {suchFehler && (
            <p className="mt-3 text-sm text-korallenrot">{suchFehler}</p>
          )}
        </div>

        <div className="order-1 md:order-2 mt-0 md:mt-6 mb-6 md:mb-0">
          <div className="rounded-3xl overflow-hidden border border-text-soft/15 bg-white shadow-sm">
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
      </div>

      <ProfilePanel
        tagesmutter={aktiveTm}
        onClose={() => setAktiveTm(null)}
      />
    </>
  );
}

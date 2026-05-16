"use client";

import { useEffect, useRef, useState } from "react";

export type AdresseTreffer = {
  label: string;
  lat: number;
  lng: number;
};

type PhotonProperties = {
  osm_id?: number;
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  state?: string;
  country?: string;
  type?: string;
};

type PhotonFeature = {
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: PhotonProperties;
};

type Props = {
  value: string;
  onChange: (value: string, treffer: AdresseTreffer | null) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  /** Falls true: der initiale value gilt als gültiger Treffer (z. B. URL-Restore). */
  initiallyValid?: boolean;
};

const DRESDEN_LAT = 51.0504;
const DRESDEN_LON = 13.7373;

function formatLabel(p: PhotonProperties): string {
  const strasse = p.street ?? p.name;
  const linie1 = strasse
    ? p.housenumber
      ? `${strasse} ${p.housenumber}`
      : strasse
    : (p.name ?? "");
  const plzStadt = [p.postcode, p.city].filter(Boolean).join(" ");
  return [linie1, plzStadt].filter(Boolean).join(", ");
}

// Photon gibt ein paar grobe Resultat-Typen zurück (ganzer Ort, Bundesland,
// Land, ...). Für eine Umkreissuche brauchen wir mindestens Straßen-Ebene,
// sonst zentriert man auf eine ganze Stadt.
const ZU_UNGENAUE_TYPEN = new Set([
  "country",
  "state",
  "region",
  "county",
  "city",
  "town",
  "village",
]);

function istPraezise(p: PhotonProperties): boolean {
  return !ZU_UNGENAUE_TYPEN.has(p.type ?? "");
}

export function AdresseAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  id,
  initiallyValid = false,
}: Props) {
  const [query, setQuery] = useState(value);
  const [vorschlaege, setVorschlaege] = useState<AdresseTreffer[]>([]);
  // Anzahl der rohen Photon-Treffer (vor unserem Präzisions-Filter) — gebraucht,
  // um „zu unpräzise" von „nichts gefunden" zu unterscheiden.
  const [roheTrefferAnzahl, setRoheTrefferAnzahl] = useState(0);
  const [offen, setOffen] = useState(false);
  const [aktivIdx, setAktivIdx] = useState(-1);
  const [laden, setLaden] = useState(false);
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [pickedLabel, setPickedLabel] = useState<string | null>(
    initiallyValid ? value : null,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ignoreNextQuery = useRef(false);

  // Externer value-Wechsel → Query syncen ohne Fetch zu triggern.
  useEffect(() => {
    if (value !== query) {
      ignoreNextQuery.current = true;
      setQuery(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Debounced Fetch gegen Photon, gefiltert auf Dresden.
  useEffect(() => {
    if (ignoreNextQuery.current) {
      ignoreNextQuery.current = false;
      return;
    }
    const q = query.trim();
    if (q.length < 3) {
      setVorschlaege([]);
      setRoheTrefferAnzahl(0);
      setLaden(false);
      setFetchedFor(null);
      return;
    }
    const controller = new AbortController();
    setLaden(true);
    const timer = setTimeout(async () => {
      try {
        const url = new URL("https://photon.komoot.io/api");
        url.searchParams.set("q", q);
        url.searchParams.set("limit", "8");
        url.searchParams.set("lang", "de");
        url.searchParams.set("lat", String(DRESDEN_LAT));
        url.searchParams.set("lon", String(DRESDEN_LON));
        url.searchParams.set("location_bias_scale", "0.3");
        const res = await fetch(url.toString(), { signal: controller.signal });
        const data = (await res.json()) as { features?: PhotonFeature[] };
        const alle = data.features ?? [];
        const liste: AdresseTreffer[] = alle
          .filter((f) => istPraezise(f.properties))
          .map((f) => ({
            label: formatLabel(f.properties),
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
          }));
        setVorschlaege(liste);
        setRoheTrefferAnzahl(alle.length);
        setLaden(false);
        setFetchedFor(q);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setLaden(false);
        }
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Klick außerhalb → Dropdown schließen, als „touched" markieren.
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOffen(false);
        if (query.trim().length > 0) setTouched(true);
      }
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [query]);

  function pickVorschlag(v: AdresseTreffer) {
    ignoreNextQuery.current = true;
    setQuery(v.label);
    setVorschlaege([]);
    setOffen(false);
    setAktivIdx(-1);
    setPickedLabel(v.label);
    setTouched(false);
    onChange(v.label, v);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!offen) setOffen(true);
      setAktivIdx((i) => Math.min(i + 1, vorschlaege.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAktivIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (aktivIdx >= 0 && vorschlaege[aktivIdx]) {
        e.preventDefault();
        pickVorschlag(vorschlaege[aktivIdx]);
      }
    } else if (e.key === "Escape") {
      setOffen(false);
    }
  }

  const q = query.trim();
  const istUngueltig = q.length > 0 && pickedLabel !== query;
  const fetchFertig = fetchedFor === q && !laden;
  const keineRohenTreffer =
    fetchFertig && roheTrefferAnzahl === 0 && q.length >= 3;
  const nurZuUngenau =
    fetchFertig &&
    roheTrefferAnzahl > 0 &&
    vorschlaege.length === 0 &&
    q.length >= 3;
  const keineTreffer = keineRohenTreffer || nurZuUngenau;
  const fehlerAnzeigen = istUngueltig && (touched || keineTreffer);

  const fehlerText = keineRohenTreffer
    ? "Keine Adresse gefunden — bitte Schreibweise prüfen."
    : nurZuUngenau
      ? "Bitte eine konkrete Adresse oder Straße angeben, nicht nur den Ort."
      : "Bitte eine Adresse aus der Vorschlagsliste auswählen.";

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        value={query}
        onChange={(e) => {
          const next = e.target.value;
          setQuery(next);
          setOffen(true);
          setAktivIdx(-1);
          setTouched(false);
          if (next !== pickedLabel) {
            setPickedLabel(null);
            onChange(next, null);
          }
        }}
        onFocus={() => setOffen(true)}
        onBlur={() => {
          if (query.trim().length > 0) setTouched(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={offen && vorschlaege.length > 0}
        aria-invalid={fehlerAnzeigen}
        className={className}
      />
      {laden && (
        <span
          aria-hidden
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-soft"
        >
          …
        </span>
      )}
      {offen && vorschlaege.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 left-0 right-0 top-full mt-1 max-h-72 overflow-y-auto rounded-xl border border-text-soft/20 bg-white shadow-lg"
        >
          {vorschlaege.map((v, i) => (
            <li
              key={`${v.lat}-${v.lng}-${i}`}
              role="option"
              aria-selected={aktivIdx === i}
            >
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pickVorschlag(v);
                }}
                onMouseEnter={() => setAktivIdx(i)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  aktivIdx === i ? "bg-creme" : "hover:bg-creme"
                }`}
              >
                {v.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {offen && keineTreffer && (
        <div className="absolute z-30 left-0 right-0 top-full mt-1 rounded-xl border border-text-soft/20 bg-white shadow-lg px-4 py-3 text-sm text-text-soft">
          {keineRohenTreffer
            ? "Keine Adresse gefunden."
            : "Bitte präziser — z. B. Straße + Hausnummer."}
        </div>
      )}
      {fehlerAnzeigen && (
        <p className="mt-1.5 text-xs text-korallenrot">{fehlerText}</p>
      )}
    </div>
  );
}

// Gemeinsame Helfer für Tagesmütter-Steckbriefe: Slug, PLZ, Ordnernummer und
// Geocoding. Wird von der Admin-Mitgliederverwaltung genutzt.

const NOMINATIM_USER_AGENT =
  "DresdnerTageselternImport/1.0 (info@dresdner-tageseltern.de)";

export function slugify(...teile: string[]): string {
  return teile
    .join("-")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Bilder-Ordner einer Tagesmutter: public/images/tagesmuetter/<nr>.
// Die Mitgliedsnummer IST bereits die Ordnernummer (z. B. "1007" → Ordner 1007).
// Gibt die Ziffernfolge zurück, oder null bei leerem/nicht-numerischem Wert.
export function bilderOrdner(mitglied: unknown): string | null {
  const ziffern = String(mitglied ?? "").replace(/\D/g, "");
  return ziffern.length === 0 ? null : ziffern;
}

// PLZ auf 5 Stellen mit führender Null auffüllen (1277 → 01277).
export function plzPad(value: unknown): string {
  const ziffern = String(value ?? "").replace(/\D/g, "");
  return ziffern.padStart(5, "0");
}

// Entfernt Zusätze wie "HH" (Hinterhaus), "VH", "RH" usw., die Nominatim sonst
// als Teil der Hausnummer missdeutet und falsch verortet.
function bereinigeStrasse(strasse: string): string {
  return strasse
    .replace(/\b(HH|VH|RH|GH|SH|Hinterhaus|Vorderhaus|Gartenhaus)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Geocoding via Nominatim (OpenStreetMap). Über die PLZ statt einer festen
// Stadt geocoden – sonst landen Adressen außerhalb Dresdens falsch.
// Hinweis: max. 1 Request/Sekunde gemäß Nutzungsbedingungen.
export async function geocode(
  strasse: string,
  plz: string,
): Promise<{ latitude: number; longitude: number } | null> {
  const params = new URLSearchParams({
    street: bereinigeStrasse(strasse),
    postalcode: plz,
    country: "Germany",
    format: "json",
    limit: "1",
  });
  const url = `https://nominatim.openstreetmap.org/search?${params}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": NOMINATIM_USER_AGENT },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (data.length === 0) return null;
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}

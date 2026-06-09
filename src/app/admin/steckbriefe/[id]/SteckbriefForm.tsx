"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ordnerNummer } from "@/lib/tagesmutter-helpers";

// Felder, die das Formular bearbeitet. Spiegelt das Tagesmutter-Modell wider
// (ohne freiePlaetze – die laufen weiter über den monatlichen Bestätigungs-Flow).
export type SteckbriefFormData = {
  vorname: string;
  nachname: string;
  einrichtungsname: string;
  strasse: string;
  plz: string;
  stadtteil: string;
  latitude: string;
  longitude: string;
  telefon: string;
  email: string;
  websiteUrl: string;
  anmeldungUrl: string;
  oeffnungszeiten: string;
  ersatzbetreuung: string;
  verpflegung: "SELBST_GEKOCHT" | "CATERING";
  verpflegungHinweis: string;
  beratungsgebiet: "MALWINA" | "OUTLAW" | "KINDERLAND";
  schmetterling: boolean;
  schmetterlingPartner: string;
  mitgliedsnummer: string;
  mitgliedSeit: string; // yyyy-mm-dd
  istAktiv: boolean;
  reihenfolge: string;
};

const inputCls =
  "rounded-lg border border-text-soft/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-korallenrot/40";

function Feld({
  label,
  children,
  hinweis,
}: {
  label: string;
  children: React.ReactNode;
  hinweis?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold">{label}</span>
      {children}
      {hinweis && <span className="text-xs text-text-soft">{hinweis}</span>}
    </label>
  );
}

// Bilder werden nicht mehr gepflegt, sondern automatisch aus dem Ordner
// public/images/tagesmuetter/<nr>/ erkannt. Dieser Abschnitt zeigt nur, wo die
// Dateien abgelegt werden müssen – abgeleitet aus der Mitgliedsnummer.
function FotoHinweis({ mitgliedsnummer }: { mitgliedsnummer: string }) {
  const nr = ordnerNummer(mitgliedsnummer);
  const ordner = nr ? `public/images/tagesmuetter/${nr}/` : null;
  return (
    <section className="rounded-2xl border border-text-soft/15 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-extrabold mb-2">Fotos</h2>
      {ordner ? (
        <div className="text-sm text-text-soft space-y-1">
          <p>
            Bilder werden automatisch aus dem Ordner erkannt – keine Pfade nötig.
            Dateien hier ablegen:
          </p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>
              Profilbild: <code>{ordner}profilbild.jpg</code>{" "}
              <span className="text-text-soft/70">(auch .png/.jpeg/.webp)</span>
            </li>
            <li>
              Galerie: <code>{ordner}galerie/1.jpg</code>,{" "}
              <code>2.jpg</code> … (fortlaufend nummeriert)
            </li>
          </ul>
          <p className="text-text-soft/70">
            Fehlt das Profilbild, zeigt der Steckbrief den Platzhalter.
          </p>
        </div>
      ) : (
        <p className="text-sm text-text-soft">
          Erst eine <strong>Mitgliedsnummer</strong> eintragen – daraus ergibt
          sich der Bilder-Ordner <code>public/images/tagesmuetter/&lt;nr&gt;/</code>.
        </p>
      )}
    </section>
  );
}

export function SteckbriefForm({
  id,
  initial,
}: {
  id: string | null; // null = neues Mitglied
  initial: SteckbriefFormData;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SteckbriefFormData>(initial);
  const [busy, setBusy] = useState(false);
  const [geoBusy, setGeoBusy] = useState(false);
  const [fehler, setFehler] = useState("");
  const [ok, setOk] = useState(false);

  function set<K extends keyof SteckbriefFormData>(
    key: K,
    value: SteckbriefFormData[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function geocoden() {
    setFehler("");
    setGeoBusy(true);
    try {
      const res = await fetch("/api/admin/steckbriefe/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strasse: form.strasse, plz: form.plz }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.latitude) {
        setFehler(d.error ?? "Keine Koordinaten gefunden.");
      } else {
        set("latitude", String(d.latitude));
        set("longitude", String(d.longitude));
      }
    } catch {
      setFehler("Netzwerkfehler beim Geocoding.");
    } finally {
      setGeoBusy(false);
    }
  }

  async function speichern(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");
    setOk(false);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/steckbriefe", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFehler(d.error ?? "Konnte nicht gespeichert werden.");
      } else {
        setOk(true);
        router.refresh();
        if (!id && d.id) {
          router.push(`/admin/steckbriefe/${d.id}`);
        }
      }
    } catch {
      setFehler("Netzwerkfehler.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={speichern} className="space-y-8">
      {/* Person & Einrichtung */}
      <section className="rounded-2xl border border-text-soft/15 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">Person & Einrichtung</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Feld label="Vorname *">
            <input
              className={inputCls}
              value={form.vorname}
              onChange={(e) => set("vorname", e.target.value)}
              required
            />
          </Feld>
          <Feld label="Nachname *">
            <input
              className={inputCls}
              value={form.nachname}
              onChange={(e) => set("nachname", e.target.value)}
              required
            />
          </Feld>
          <Feld label="Einrichtungsname">
            <input
              className={inputCls}
              value={form.einrichtungsname}
              onChange={(e) => set("einrichtungsname", e.target.value)}
            />
          </Feld>
          <Feld
            label="Mitgliedsnummer"
            hinweis="z. B. 1001 – zugleich Bilder-Ordner public/images/tagesmuetter/<nr>"
          >
            <input
              className={inputCls}
              value={form.mitgliedsnummer}
              onChange={(e) => set("mitgliedsnummer", e.target.value)}
            />
          </Feld>
        </div>
      </section>

      {/* Fotos */}
      <FotoHinweis mitgliedsnummer={form.mitgliedsnummer} />

      {/* Adresse */}
      <section className="rounded-2xl border border-text-soft/15 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">Adresse</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Feld label="Straße & Hausnr.">
            <input
              className={inputCls}
              value={form.strasse}
              onChange={(e) => set("strasse", e.target.value)}
            />
          </Feld>
          <Feld label="PLZ" hinweis="wird auf 5 Stellen aufgefüllt">
            <input
              className={inputCls}
              value={form.plz}
              onChange={(e) => set("plz", e.target.value)}
            />
          </Feld>
          <Feld label="Stadtteil">
            <input
              className={inputCls}
              value={form.stadtteil}
              onChange={(e) => set("stadtteil", e.target.value)}
            />
          </Feld>
          <div />
          <Feld label="Latitude">
            <input
              className={inputCls}
              value={form.latitude}
              onChange={(e) => set("latitude", e.target.value)}
            />
          </Feld>
          <Feld label="Longitude">
            <input
              className={inputCls}
              value={form.longitude}
              onChange={(e) => set("longitude", e.target.value)}
            />
          </Feld>
        </div>
        <button
          type="button"
          onClick={geocoden}
          disabled={geoBusy}
          className="mt-4 rounded-full border border-korallenrot text-korallenrot px-4 py-2 text-sm font-bold disabled:opacity-60"
        >
          {geoBusy ? "Ermittle…" : "Koordinaten aus Adresse ermitteln"}
        </button>
      </section>

      {/* Kontakt */}
      <section className="rounded-2xl border border-text-soft/15 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">Kontakt</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Feld label="Telefon">
            <input
              className={inputCls}
              value={form.telefon}
              onChange={(e) => set("telefon", e.target.value)}
            />
          </Feld>
          <Feld label="E-Mail *" hinweis="muss eindeutig sein">
            <input
              type="email"
              className={inputCls}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </Feld>
          <Feld label="Website-URL">
            <input
              className={inputCls}
              value={form.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
            />
          </Feld>
          <Feld label="Anmeldung-URL" hinweis="falls keine eigene Website">
            <input
              className={inputCls}
              value={form.anmeldungUrl}
              onChange={(e) => set("anmeldungUrl", e.target.value)}
            />
          </Feld>
        </div>
      </section>

      {/* Betreuung */}
      <section className="rounded-2xl border border-text-soft/15 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">Betreuung</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Feld label="Öffnungszeiten">
            <textarea
              className={inputCls}
              rows={2}
              value={form.oeffnungszeiten}
              onChange={(e) => set("oeffnungszeiten", e.target.value)}
            />
          </Feld>
          <Feld label="Ersatzbetreuung">
            <textarea
              className={inputCls}
              rows={2}
              value={form.ersatzbetreuung}
              onChange={(e) => set("ersatzbetreuung", e.target.value)}
            />
          </Feld>
          <Feld label="Verpflegung">
            <select
              className={inputCls}
              value={form.verpflegung}
              onChange={(e) =>
                set(
                  "verpflegung",
                  e.target.value as SteckbriefFormData["verpflegung"],
                )
              }
            >
              <option value="SELBST_GEKOCHT">Ich koche selbst</option>
              <option value="CATERING">Catering</option>
            </select>
          </Feld>
          <Feld
            label="Verpflegung – abweichender Text"
            hinweis="überschreibt das Standard-Label, optional"
          >
            <input
              className={inputCls}
              value={form.verpflegungHinweis}
              onChange={(e) => set("verpflegungHinweis", e.target.value)}
            />
          </Feld>
          <Feld label="Beratungsstelle">
            <select
              className={inputCls}
              value={form.beratungsgebiet}
              onChange={(e) =>
                set(
                  "beratungsgebiet",
                  e.target.value as SteckbriefFormData["beratungsgebiet"],
                )
              }
            >
              <option value="MALWINA">Malwina e.V.</option>
              <option value="OUTLAW">Outlaw gGmbH</option>
              <option value="KINDERLAND">KINDERLAND-Sachsen e.V.</option>
            </select>
          </Feld>
        </div>
      </section>

      {/* Schmetterling & Mitgliedschaft */}
      <section className="rounded-2xl border border-text-soft/15 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">
          Schmetterling & Mitgliedschaft
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.schmetterling}
              onChange={(e) => set("schmetterling", e.target.checked)}
            />
            <span className="text-sm font-bold">
              Schmetterling-Partnerschaft
            </span>
          </label>
          <Feld label="Schmetterling-Partner">
            <input
              className={inputCls}
              value={form.schmetterlingPartner}
              onChange={(e) => set("schmetterlingPartner", e.target.value)}
            />
          </Feld>
          <Feld label="Mitglied seit">
            <input
              type="date"
              className={inputCls}
              value={form.mitgliedSeit}
              onChange={(e) => set("mitgliedSeit", e.target.value)}
            />
          </Feld>
          <Feld label="Reihenfolge" hinweis="kleinere Zahl = weiter vorne">
            <input
              type="number"
              className={inputCls}
              value={form.reihenfolge}
              onChange={(e) => set("reihenfolge", e.target.value)}
            />
          </Feld>
        </div>
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={form.istAktiv}
            onChange={(e) => set("istAktiv", e.target.checked)}
          />
          <span className="text-sm font-bold">
            Aktiv (auf Karte & in Suche sichtbar)
          </span>
        </label>
      </section>

      {/* Aktionen */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-korallenrot text-white px-6 py-2.5 text-sm font-bold disabled:opacity-60"
        >
          {busy ? "Speichere…" : id ? "Änderungen speichern" : "Anlegen"}
        </button>
        <Link
          href="/admin/steckbriefe"
          className="text-sm font-semibold text-text-soft underline"
        >
          Zurück zur Übersicht
        </Link>
        {fehler && (
          <span className="text-sm font-semibold text-korallenrot">
            {fehler}
          </span>
        )}
        {ok && (
          <span className="text-sm font-semibold text-green-700">
            Gespeichert.
          </span>
        )}
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";

type Props = {
  token: string;
  /** 5 Strings, jeweils im Format "YYYY-MM" oder leer. */
  initialDates: string[];
};

// "2026-08" → "08.2026" (Anzeige im Feld)
function zuAnzeige(ym: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  return m ? `${m[2]}.${m[1]}` : "";
}

// Tippt der Nutzer nur Ziffern, wird der Punkt automatisch gesetzt:
// "0"→"0", "08"→"08", "082"→"08.2", "082026"→"08.2026".
// So funktioniert die Eingabe auch auf der iPhone-Zahlentastatur ohne Punkt-Taste.
function formatiereEingabe(roh: string): string {
  const ziffern = roh.replace(/\D/g, "").slice(0, 6);
  if (ziffern.length <= 2) return ziffern;
  return `${ziffern.slice(0, 2)}.${ziffern.slice(2)}`;
}

// "08.2026" / "8/2026" → "2026-08"; ungültig → null
function zuIso(eingabe: string): string | null {
  const t = eingabe.trim();
  if (!t) return null;
  const m = /^(\d{1,2})[.\/-](\d{4})$/.exec(t);
  if (!m) return null;
  const monat = Number(m[1]);
  if (monat < 1 || monat > 12) return null;
  return `${m[2]}-${String(monat).padStart(2, "0")}`;
}

export function EditPlaetzeForm({ token, initialDates }: Props) {
  const [dates, setDates] = useState<string[]>(() =>
    initialDates.map(zuAnzeige),
  );
  const [status, setStatus] = useState<
    "idle" | "speichert" | "fertig" | "fehler"
  >("idle");
  const [fehlerText, setFehlerText] = useState<string>("");

  function aktualisiere(idx: number, wert: string) {
    setDates((prev) =>
      prev.map((d, i) => (i === idx ? formatiereEingabe(wert) : d)),
    );
  }

  async function speichern(e: React.FormEvent) {
    e.preventDefault();
    setFehlerText("");

    // Eingaben in ISO (YYYY-MM) umrechnen und dabei prüfen
    const plaetze: (string | null)[] = [];
    for (let i = 0; i < dates.length; i++) {
      const wert = dates[i].trim();
      if (!wert) {
        plaetze.push(null);
        continue;
      }
      const iso = zuIso(wert);
      if (!iso) {
        setStatus("fehler");
        setFehlerText(
          `Platz ${i + 1}: Bitte Monat und Jahr im Format mm.jjjj eingeben (z. B. 08.2026).`,
        );
        return;
      }
      plaetze.push(iso);
    }

    setStatus("speichert");
    try {
      const res = await fetch("/api/plaetze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, plaetze }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setStatus("fertig");
    } catch (err) {
      setStatus("fehler");
      setFehlerText(err instanceof Error ? err.message : String(err));
    }
  }

  if (status === "fertig") {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3" aria-hidden>
          ✅
        </div>
        <p className="text-xl font-bold mb-1">Gespeichert!</p>
        <p className="text-text-soft">
          Deine freien Plätze wurden aktualisiert.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={speichern} className="space-y-4">
      {dates.map((wert, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <label className="flex-1">
            <span className="block text-sm text-text-soft mb-1">
              Platz {idx + 1} frei ab:
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={wert}
              onChange={(e) => aktualisiere(idx, e.target.value)}
              placeholder="mm.jjjj"
              maxLength={7}
              className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 bg-white text-base placeholder:text-text-soft/40 focus:outline-none focus:border-korallenrot"
            />
          </label>
          {wert && (
            <button
              type="button"
              onClick={() => aktualisiere(idx, "")}
              className="mt-6 text-text-soft hover:text-korallenrot text-sm font-semibold"
              aria-label={`Platz ${idx + 1} leeren`}
            >
              Leeren
            </button>
          )}
        </div>
      ))}

      {status === "fehler" && (
        <p className="rounded-xl bg-red-50 text-red-800 px-4 py-3 text-sm">
          Speichern fehlgeschlagen: {fehlerText}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "speichert"}
          className="rounded-full bg-korallenrot hover:bg-korallenrot-dunkel disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 transition-colors"
        >
          {status === "speichert" ? "Speichert…" : "Bestätigen"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";

type Props = {
  token: string;
  /** 5 Strings, jeweils im Format "YYYY-MM-DD" oder leer. */
  initialDates: string[];
};

export function EditPlaetzeForm({ token, initialDates }: Props) {
  const [dates, setDates] = useState<string[]>(initialDates);
  const [status, setStatus] = useState<
    "idle" | "speichert" | "fertig" | "fehler"
  >("idle");
  const [fehlerText, setFehlerText] = useState<string>("");

  function aktualisiere(idx: number, wert: string) {
    setDates((prev) => prev.map((d, i) => (i === idx ? wert : d)));
  }

  async function speichern(e: React.FormEvent) {
    e.preventDefault();
    setStatus("speichert");
    setFehlerText("");

    try {
      const res = await fetch("/api/plaetze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          plaetze: dates.map((d) => (d ? d : null)),
        }),
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
              type="date"
              value={wert}
              onChange={(e) => aktualisiere(idx, e.target.value)}
              className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot"
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

"use client";

import { useState } from "react";
import { BuchungsKalender } from "./BuchungsKalender";

type Belegt = { start: string; ende: string };

function fmtDatum(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  bannerId: string;
  bannerBezeichnung: string;
  belegt: Belegt[];
};

// Überschneidet sich [start, ende] mit einem belegten Zeitraum?
function ueberschneidet(start: string, ende: string, belegt: Belegt[]): boolean {
  return belegt.some((b) => start <= b.ende && ende >= b.start);
}

export function BuchungsForm({ bannerId, bannerBezeichnung, belegt }: Props) {
  const [start, setStart] = useState("");
  const [ende, setEnde] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grundstueck, setGrundstueck] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "sendet" | "bestaetigt" | "anfrage" | "fehler"
  >("idle");
  const [fehler, setFehler] = useState("");

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");

    if (!start || !ende) {
      setStatus("fehler");
      setFehler("Bitte wähle Start- und Enddatum.");
      return;
    }
    if (ende < start) {
      setStatus("fehler");
      setFehler("Das Enddatum muss nach dem Startdatum liegen.");
      return;
    }
    if (ueberschneidet(start, ende, belegt)) {
      setStatus("fehler");
      setFehler("Der gewählte Zeitraum ist bereits belegt.");
      return;
    }
    if (!grundstueck) {
      setStatus("fehler");
      setFehler(
        "Bitte bestätige die Absprache mit dem Grundstückseigentümer.",
      );
      return;
    }

    setStatus("sendet");
    try {
      const res = await fetch("/api/buchungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bannerId,
          name,
          email,
          start,
          ende,
          grundstueckBestaetigt: grundstueck,
        }),
      });
      const daten = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("fehler");
        setFehler(daten.error ?? "Die Buchung konnte nicht gespeichert werden.");
        return;
      }
      setStatus(daten.status === "BESTAETIGT" ? "bestaetigt" : "anfrage");
    } catch {
      setStatus("fehler");
      setFehler("Netzwerkfehler. Bitte versuche es später erneut.");
    }
  }

  if (status === "bestaetigt") {
    return (
      <div className="rounded-3xl bg-white border border-text-soft/10 p-6 shadow-sm text-center">
        <h2 className="text-xl font-extrabold mb-2">Verbindlich gebucht ✅</h2>
        <p className="text-text-soft">
          Deine Buchung von <strong>{bannerBezeichnung}</strong> ist bestätigt.
          Eine Bestätigung haben wir dir per E-Mail geschickt. Etwa 5 Tage vor
          Beginn melden wir uns mit den Übergabe-Details.
        </p>
      </div>
    );
  }

  if (status === "anfrage") {
    return (
      <div className="rounded-3xl bg-white border border-text-soft/10 p-6 shadow-sm text-center">
        <h2 className="text-xl font-extrabold mb-2">Anfrage eingegangen</h2>
        <p className="text-text-soft">
          Danke! Wir konnten deine E-Mail noch keinem Profil zuordnen, daher
          prüfen wir deine Anfrage kurz und melden uns bei dir.
        </p>
      </div>
    );
  }

  const labelCls = "block text-sm font-bold mb-1.5";
  const inputCls =
    "w-full rounded-xl border border-text-soft/20 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-korallenrot/40";

  return (
    <form
      onSubmit={absenden}
      className="rounded-3xl bg-white border border-text-soft/10 p-6 shadow-sm space-y-5"
    >
      <h2 className="text-xl font-extrabold">Zeitraum buchen</h2>

      <div>
        <span className={labelCls}>Wähle deinen Zeitraum</span>
        <BuchungsKalender
          belegt={belegt}
          start={start}
          ende={ende}
          onSelect={(s, e) => {
            setStart(s);
            setEnde(e);
          }}
        />
        <p className="text-sm text-text-soft mt-2">
          {start
            ? `Gewählt: ${fmtDatum(start)} – ${fmtDatum(ende || start)}`
            : "Klicke ein Startdatum und dann ein Enddatum an."}
        </p>
      </div>

      <div>
        <label htmlFor="name" className={labelCls}>
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          E-Mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputCls}
        />
        <p className="text-xs text-text-soft mt-1.5">
          Bitte die E-Mail-Adresse angeben die auch auf deinem Steckbrief ist,
          damit wir dich korrekt zuordnen können.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={grundstueck}
          onChange={(e) => setGrundstueck(e.target.checked)}
          className="mt-1 h-5 w-5 flex-shrink-0 accent-korallenrot"
        />
        <span>
          Ich bestätige, dass ich <strong>vor dem Aufhängen</strong> mit dem
          Grundstückseigentümer abgesprochen habe, dass der Banner dort hängen
          darf.
        </span>
      </label>

      {status === "fehler" && (
        <p className="text-sm font-semibold text-korallenrot">{fehler}</p>
      )}

      <button
        type="submit"
        disabled={status === "sendet"}
        className="w-full rounded-full bg-korallenrot text-white px-6 py-3.5 text-base font-bold hover:bg-korallenrot-dunkel transition-colors disabled:opacity-60"
      >
        {status === "sendet" ? "Wird gesendet …" : "Verbindlich buchen"}
      </button>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";

type Belegt = { start: string; ende: string };

const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const t = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${t}`;
}

function vonIso(s: string): Date {
  return new Date(s + "T00:00:00");
}

export function BuchungsKalender({
  belegt,
  start,
  ende,
  onSelect,
}: {
  belegt: Belegt[];
  start: string;
  ende: string;
  onSelect: (start: string, ende: string) => void;
}) {
  const heute = iso(new Date());

  // Alle belegten Einzeltage als Set.
  const belegtSet = useMemo(() => {
    const set = new Set<string>();
    for (const b of belegt) {
      const d = vonIso(b.start);
      const end = vonIso(b.ende);
      while (d <= end) {
        set.add(iso(d));
        d.setDate(d.getDate() + 1);
      }
    }
    return set;
  }, [belegt]);

  const [ansicht, setAnsicht] = useState(() => {
    const d = new Date();
    return { jahr: d.getFullYear(), monat: d.getMonth() };
  });

  function rangeHatBelegt(a: string, b: string): boolean {
    const d = vonIso(a);
    const end = vonIso(b);
    while (d <= end) {
      if (belegtSet.has(iso(d))) return true;
      d.setDate(d.getDate() + 1);
    }
    return false;
  }

  function klick(tag: string) {
    // Neuer Start, wenn noch keiner gesetzt ist, bereits ein Bereich besteht
    // oder der Tag vor dem aktuellen Start liegt.
    if (!start || ende || tag < start) {
      onSelect(tag, "");
      return;
    }
    if (tag === start) {
      onSelect(start, start);
      return;
    }
    // tag > start: nur erlauben, wenn dazwischen nichts belegt ist
    if (rangeHatBelegt(start, tag)) {
      onSelect(tag, "");
      return;
    }
    onSelect(start, tag);
  }

  const erster = new Date(ansicht.jahr, ansicht.monat, 1);
  const startWochentag = (erster.getDay() + 6) % 7; // Mo = 0
  const tageImMonat = new Date(ansicht.jahr, ansicht.monat + 1, 0).getDate();
  const bisEffektiv = ende || start;

  const zellen: (string | null)[] = [];
  for (let i = 0; i < startWochentag; i++) zellen.push(null);
  for (let t = 1; t <= tageImMonat; t++) {
    zellen.push(iso(new Date(ansicht.jahr, ansicht.monat, t)));
  }

  function blaettern(richtung: number) {
    setAnsicht((a) => {
      const d = new Date(a.jahr, a.monat + richtung, 1);
      return { jahr: d.getFullYear(), monat: d.getMonth() };
    });
  }

  // Vorheriger Monat nur, wenn er nicht komplett in der Vergangenheit liegt.
  const heuteD = vonIso(heute);
  const letzterTagAnsicht = new Date(ansicht.jahr, ansicht.monat + 1, 0);
  const zurueckMoeglich = letzterTagAnsicht >= heuteD;

  return (
    <div className="rounded-2xl border border-text-soft/15 p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => blaettern(-1)}
          disabled={!zurueckMoeglich}
          aria-label="Vorheriger Monat"
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-soft hover:bg-korallenrot/10 hover:text-korallenrot disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          ‹
        </button>
        <span className="font-bold">
          {MONATE[ansicht.monat]} {ansicht.jahr}
        </span>
        <button
          type="button"
          onClick={() => blaettern(1)}
          aria-label="Nächster Monat"
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-soft hover:bg-korallenrot/10 hover:text-korallenrot transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-soft mb-1">
        {WOCHENTAGE.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {zellen.map((tag, i) => {
          if (!tag) return <div key={i} />;

          const tagNr = Number(tag.slice(-2));
          const istVergangen = tag < heute;
          const istBelegt = belegtSet.has(tag);
          const deaktiviert = istVergangen || istBelegt;
          const imBereich =
            !!start && tag >= start && tag <= bisEffektiv;
          const istEndpunkt = tag === start || tag === bisEffektiv;

          let cls =
            "relative h-10 rounded-lg text-sm flex items-center justify-center transition-colors ";
          if (istBelegt) {
            cls +=
              "bg-korallenrot/15 text-korallenrot/70 line-through cursor-not-allowed";
          } else if (istVergangen) {
            cls += "text-text-soft/30 cursor-not-allowed";
          } else if (imBereich && istEndpunkt) {
            cls += "bg-korallenrot text-white font-bold";
          } else if (imBereich) {
            cls += "bg-korallenrot/25 text-text";
          } else {
            cls += "hover:bg-korallenrot/10 cursor-pointer";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={deaktiviert}
              onClick={() => klick(tag)}
              aria-label={tag}
              className={cls}
            >
              {tagNr}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-text-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-korallenrot inline-block" />
          deine Auswahl
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-korallenrot/15 inline-block" />
          bereits belegt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border border-text-soft/30 inline-block" />
          frei
        </span>
      </div>
    </div>
  );
}

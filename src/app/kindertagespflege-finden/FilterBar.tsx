"use client";

import { BERATUNGSGEBIET_LABEL, type Beratungsgebiet } from "@/types";

export type FilterState = {
  beratungsgebiet: "ALLE" | Beratungsgebiet;
  abDatum: string; // ISO date (YYYY-MM-DD) oder ""
  nurFreiePlaetze: boolean;
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
};

export function FilterBar({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 md:p-5 shadow-sm border border-text-soft/10">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="block text-sm text-text-soft mb-1">
            Beratungsstelle
          </span>
          <select
            value={value.beratungsgebiet}
            onChange={(e) =>
              onChange({
                ...value,
                beratungsgebiet: e.target.value as FilterState["beratungsgebiet"],
              })
            }
            className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot"
          >
            <option value="ALLE">Alle</option>
            <option value="MALWINA">{BERATUNGSGEBIET_LABEL.MALWINA}</option>
            <option value="OUTLAW">{BERATUNGSGEBIET_LABEL.OUTLAW}</option>
            <option value="KINDERLAND">
              {BERATUNGSGEBIET_LABEL.KINDERLAND}
            </option>
          </select>
        </label>

        <label className="block">
          <span className="block text-sm text-text-soft mb-1">
            Ich suche einen Platz ab…
          </span>
          <input
            type="date"
            value={value.abDatum}
            onChange={(e) =>
              onChange({ ...value, abDatum: e.target.value })
            }
            className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 bg-white text-base focus:outline-none focus:border-korallenrot"
          />
        </label>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={value.nurFreiePlaetze}
              onChange={(e) =>
                onChange({ ...value, nurFreiePlaetze: e.target.checked })
              }
              className="h-5 w-5 rounded border-text-soft/30 text-korallenrot focus:ring-korallenrot"
            />
            <span>Nur mit freien Plätzen anzeigen</span>
          </label>
        </div>
      </div>
    </div>
  );
}

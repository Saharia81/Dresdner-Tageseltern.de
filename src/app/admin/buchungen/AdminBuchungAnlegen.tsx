"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BannerOption = { id: string; bezeichnung: string };
type ProfilOption = { id: string; label: string };

export function AdminBuchungAnlegen({
  banner,
  profile,
}: {
  banner: BannerOption[];
  profile: ProfilOption[];
}) {
  const router = useRouter();
  const [bannerId, setBannerId] = useState(banner[0]?.id ?? "");
  const [profilText, setProfilText] = useState("");
  // Eingetippter Name → passende ID (exakte Übereinstimmung mit der Liste)
  const tagesmutterId =
    profile.find((p) => p.label === profilText.trim())?.id ?? "";
  const [start, setStart] = useState("");
  const [ende, setEnde] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [fehler, setFehler] = useState("");
  const [ok, setOk] = useState(false);

  async function anlegen(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");
    setOk(false);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/buchungen/anlegen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerId, start, ende, name, tagesmutterId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFehler(d.error ?? "Konnte nicht gespeichert werden.");
      } else {
        setOk(true);
        setStart("");
        setEnde("");
        setName("");
        setProfilText("");
        router.refresh();
      }
    } catch {
      setFehler("Netzwerkfehler.");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "rounded-lg border border-text-soft/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-korallenrot/40";

  return (
    <div className="rounded-2xl border border-text-soft/15 bg-white p-5 mb-8 shadow-sm">
      <h2 className="text-lg font-extrabold mb-1">
        Bestehende Buchung manuell eintragen
      </h2>
      <p className="text-sm text-text-soft mb-4">
        Blockiert den Zeitraum im Kalender. Wählst du eine Tagesmutter, erscheint
        ihr <strong>Steckbrief</strong> im Mietzeitraum auf der Banner-Seite. Es
        wird <strong>keine E-Mail</strong> verschickt (auch keine Erinnerungen).
      </p>

      <form onSubmit={anlegen} className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Banner</span>
          <select
            value={bannerId}
            onChange={(e) => setBannerId(e.target.value)}
            className={inputCls}
          >
            {banner.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bezeichnung}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Tagesmutter (Steckbrief)</span>
          <input
            type="text"
            list="tm-profile"
            value={profilText}
            onChange={(e) => setProfilText(e.target.value)}
            placeholder="Name eintippen…"
            className={inputCls}
          />
          <datalist id="tm-profile">
            {profile.map((p) => (
              <option key={p.id} value={p.label} />
            ))}
          </datalist>
          {profilText.trim() && !tagesmutterId && (
            <span className="text-xs text-korallenrot">
              Kein passendes Profil – bitte aus der Liste wählen.
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Von</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Bis</span>
          <input
            type="date"
            value={ende}
            onChange={(e) => setEnde(e.target.value)}
            required
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Name (optional)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Frau Müller"
            className={inputCls}
          />
        </label>
        <button
          type="submit"
          disabled={busy || !bannerId}
          className="rounded-full bg-korallenrot text-white px-5 py-2 text-sm font-bold disabled:opacity-60"
        >
          {busy ? "…" : "Eintragen"}
        </button>
      </form>

      {fehler && (
        <p className="text-sm font-semibold text-korallenrot mt-3">{fehler}</p>
      )}
      {ok && (
        <p className="text-sm font-semibold text-green-700 mt-3">
          Buchung eingetragen.
        </p>
      )}
    </div>
  );
}

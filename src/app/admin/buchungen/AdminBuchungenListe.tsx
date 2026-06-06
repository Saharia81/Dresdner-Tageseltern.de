"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type BuchungZeile = {
  id: string;
  banner: string;
  name: string;
  email: string;
  start: string;
  ende: string;
  status: string;
  profilSlug: string | null;
};

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  ANFRAGE: { text: "Anfrage", cls: "bg-yellow-100 text-yellow-800" },
  BESTAETIGT: { text: "Bestätigt", cls: "bg-green-100 text-green-800" },
  ABGELEHNT: { text: "Abgelehnt", cls: "bg-red-100 text-red-700" },
  ABGELAUFEN: { text: "Abgelaufen", cls: "bg-gray-100 text-gray-600" },
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE");
}

export function AdminBuchungenListe({ zeilen }: { zeilen: BuchungZeile[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [fehler, setFehler] = useState("");
  const [slugs, setSlugs] = useState<Record<string, string>>({});

  async function aktion(id: string, art: "bestaetigen" | "ablehnen") {
    setBusy(id);
    setFehler("");
    try {
      const res = await fetch("/api/admin/buchungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          aktion: art,
          tagesmutterSlug: slugs[id]?.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setFehler(d.error ?? "Aktion fehlgeschlagen.");
      } else {
        router.refresh();
      }
    } catch {
      setFehler("Netzwerkfehler.");
    } finally {
      setBusy(null);
    }
  }

  if (zeilen.length === 0) {
    return <p className="text-text-soft">Noch keine Buchungen.</p>;
  }

  return (
    <div className="space-y-4">
      {fehler && (
        <p className="text-sm font-semibold text-korallenrot">{fehler}</p>
      )}
      {zeilen.map((z) => {
        const s = STATUS_LABEL[z.status] ?? {
          text: z.status,
          cls: "bg-gray-100",
        };
        return (
          <div
            key={z.id}
            className="rounded-2xl border border-text-soft/10 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-bold">{z.banner}</span>
              <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${s.cls}`}>
                {s.text}
              </span>
            </div>
            <p className="text-sm text-text-soft">
              {fmt(z.start)} – {fmt(z.ende)}
            </p>
            <p className="text-sm">
              {z.name} · {z.email}
            </p>
            <p className="text-sm text-text-soft mb-3">
              Profil: {z.profilSlug ?? "— (nicht zugeordnet)"}
            </p>

            {z.status === "ANFRAGE" && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Profil-Slug (optional)"
                  value={slugs[z.id] ?? ""}
                  onChange={(e) =>
                    setSlugs((p) => ({ ...p, [z.id]: e.target.value }))
                  }
                  className="rounded-lg border border-text-soft/20 px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => aktion(z.id, "bestaetigen")}
                  disabled={busy === z.id}
                  className="rounded-full bg-korallenrot text-white px-4 py-1.5 text-sm font-bold disabled:opacity-60"
                >
                  Bestätigen
                </button>
                <button
                  onClick={() => aktion(z.id, "ablehnen")}
                  disabled={busy === z.id}
                  className="rounded-full bg-text-soft/15 px-4 py-1.5 text-sm font-bold disabled:opacity-60"
                >
                  Ablehnen
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

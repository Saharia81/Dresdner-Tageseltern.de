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
  anzeigeTyp: "STECKBRIEF" | "INDIVIDUELL";
  wunsch: string | null;
  inhaltTitel: string | null;
  inhaltText: string | null;
  inhaltBildUrl: string | null;
  inhaltLinkUrl: string | null;
  inhaltLinkText: string | null;
};

type InhaltForm = {
  titel: string;
  text: string;
  bildUrl: string;
  linkUrl: string;
  linkText: string;
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
  // Welche Buchungen haben den Inhalts-Editor geöffnet + Entwurf je Buchung.
  const [editor, setEditor] = useState<Record<string, InhaltForm>>({});

  async function aktion(id: string, art: "bestaetigen" | "ablehnen" | "loeschen") {
    if (art === "loeschen" && !confirm("Diese Buchung wirklich löschen?")) {
      return;
    }
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

  function editorOeffnen(z: BuchungZeile) {
    setEditor((p) => ({
      ...p,
      [z.id]: {
        titel: z.inhaltTitel ?? "",
        text: z.inhaltText ?? "",
        bildUrl: z.inhaltBildUrl ?? "",
        linkUrl: z.inhaltLinkUrl ?? "",
        linkText: z.inhaltLinkText ?? "",
      },
    }));
  }

  function editorSchliessen(id: string) {
    setEditor((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  }

  async function inhaltSpeichern(id: string) {
    const form = editor[id];
    if (!form) return;
    setBusy(id);
    setFehler("");
    try {
      const res = await fetch("/api/admin/buchungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, aktion: "inhalt-speichern", inhalt: form }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setFehler(d.error ?? "Speichern fehlgeschlagen.");
      } else {
        editorSchliessen(id);
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
            <p className="text-sm text-text-soft">
              Anzeige:{" "}
              <strong>
                {z.anzeigeTyp === "INDIVIDUELL"
                  ? "Individueller Inhalt"
                  : "Steckbrief"}
              </strong>
              {z.anzeigeTyp === "STECKBRIEF" &&
                ` · Profil: ${z.profilSlug ?? "— (nicht zugeordnet)"}`}
              {z.anzeigeTyp === "INDIVIDUELL" &&
                ` · ${z.inhaltTitel ? `„${z.inhaltTitel}“` : "noch kein Inhalt gepflegt"}`}
            </p>
            {z.wunsch && (
              <p className="text-sm text-text-soft mb-1 mt-1">
                <span className="font-semibold">Wunsch:</span> {z.wunsch}
              </p>
            )}
            <div className="mb-3" />

            {editor[z.id] !== undefined && (
              <InhaltEditor
                form={editor[z.id]}
                busy={busy === z.id}
                onChange={(patch) =>
                  setEditor((p) => ({ ...p, [z.id]: { ...p[z.id], ...patch } }))
                }
                onSave={() => inhaltSpeichern(z.id)}
                onCancel={() => editorSchliessen(z.id)}
              />
            )}

            <div className="flex flex-wrap items-center gap-2">
              {z.status === "ANFRAGE" && (
                <>
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
                </>
              )}
              {editor[z.id] === undefined && (
                <button
                  onClick={() => editorOeffnen(z)}
                  disabled={busy === z.id}
                  className="rounded-full bg-text-soft/15 px-4 py-1.5 text-sm font-bold disabled:opacity-60"
                >
                  {z.anzeigeTyp === "INDIVIDUELL" && z.inhaltTitel
                    ? "Inhalt bearbeiten"
                    : "Individuellen Inhalt eintragen"}
                </button>
              )}
              <button
                onClick={() => aktion(z.id, "loeschen")}
                disabled={busy === z.id}
                className="rounded-full border border-red-300 text-red-700 px-4 py-1.5 text-sm font-bold hover:bg-red-50 disabled:opacity-60"
              >
                Löschen
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Editor für den individuellen Banner-Inhalt. Speichern setzt anzeigeTyp auf
// INDIVIDUELL – der Inhalt geht damit (während des gebuchten Zeitraums) live.
function InhaltEditor({
  form,
  busy,
  onChange,
  onSave,
  onCancel,
}: {
  form: InhaltForm;
  busy: boolean;
  onChange: (patch: Partial<InhaltForm>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const label = "block text-xs font-bold mb-1";
  const input =
    "w-full rounded-lg border border-text-soft/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-korallenrot/40";
  return (
    <div className="mb-3 rounded-xl border border-korallenrot/30 bg-korallenrot/5 p-4 space-y-3">
      <p className="text-sm font-bold">Individueller Banner-Inhalt</p>
      <div>
        <label className={label}>Titel *</label>
        <input
          type="text"
          value={form.titel}
          onChange={(e) => onChange({ titel: e.target.value })}
          placeholder="z. B. Tag der offenen Tür"
          className={input}
        />
      </div>
      <div>
        <label className={label}>Text</label>
        <textarea
          value={form.text}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={4}
          placeholder="Beschreibung, Datum, Uhrzeit, Ort …"
          className={`${input} resize-y`}
        />
      </div>
      <div>
        <label className={label}>Bild-URL (optional)</label>
        <input
          type="text"
          value={form.bildUrl}
          onChange={(e) => onChange({ bildUrl: e.target.value })}
          placeholder="https://… oder /images/…"
          className={input}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={label}>Button-Link (optional)</label>
          <input
            type="text"
            value={form.linkUrl}
            onChange={(e) => onChange({ linkUrl: e.target.value })}
            placeholder="https://…"
            className={input}
          />
        </div>
        <div>
          <label className={label}>Button-Text (optional)</label>
          <input
            type="text"
            value={form.linkText}
            onChange={(e) => onChange({ linkText: e.target.value })}
            placeholder="Mehr erfahren"
            className={input}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={busy}
          className="rounded-full bg-korallenrot text-white px-4 py-1.5 text-sm font-bold disabled:opacity-60"
        >
          {busy ? "Speichert …" : "Inhalt speichern"}
        </button>
        <button
          onClick={onCancel}
          disabled={busy}
          className="rounded-full bg-text-soft/15 px-4 py-1.5 text-sm font-bold disabled:opacity-60"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

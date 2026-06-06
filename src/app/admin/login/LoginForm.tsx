"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const weiter = params.get("weiter") || "/admin";

  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState("");
  const [sendet, setSendet] = useState(false);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");
    setSendet(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwort }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setFehler(d.error ?? "Login fehlgeschlagen.");
        setSendet(false);
        return;
      }
      router.push(weiter);
      router.refresh();
    } catch {
      setFehler("Netzwerkfehler.");
      setSendet(false);
    }
  }

  return (
    <form onSubmit={absenden} className="space-y-4">
      <div>
        <label htmlFor="pw" className="block text-sm font-bold mb-1.5">
          Passwort
        </label>
        <input
          id="pw"
          type="password"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-text-soft/20 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-korallenrot/40"
        />
      </div>
      {fehler && (
        <p className="text-sm font-semibold text-korallenrot">{fehler}</p>
      )}
      <button
        type="submit"
        disabled={sendet}
        className="w-full rounded-full bg-korallenrot text-white px-6 py-3 font-bold hover:bg-korallenrot-dunkel transition-colors disabled:opacity-60"
      >
        {sendet ? "…" : "Anmelden"}
      </button>
    </form>
  );
}

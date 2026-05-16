// Bestätigungsseite – wird über die monatlichen E-Mails verlinkt.
//
//   /plaetze-bestaetigen?token=XYZ&action=confirm   → setzt lastConfirmed und zeigt Erfolg
//   /plaetze-bestaetigen?token=XYZ&action=edit      → zeigt Formular zum Bearbeiten der Plätze
//   /plaetze-bestaetigen?token=XYZ                  → Auswahlseite

import Link from "next/link";
import { prisma } from "@/lib/db";
import { EditPlaetzeForm } from "./EditPlaetzeForm";

export const metadata = {
  title: "Freie Plätze bestätigen – Dresdner Tageseltern e.V.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ token?: string; action?: string }>;

export default async function PlaetzeBestaetigenPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token, action } = await searchParams;

  if (!token) {
    return (
      <Wrapper>
        <Fehler titel="Link unvollständig">
          In diesem Link fehlt der Bestätigungs-Token. Bitte öffne den Link
          direkt aus der E-Mail.
        </Fehler>
      </Wrapper>
    );
  }

  const tm = await prisma.tagesmutter.findUnique({
    where: { emailToken: token },
    include: { freiePlaetze: true },
  });

  if (!tm) {
    return (
      <Wrapper>
        <Fehler titel="Link ungültig">
          Dieser Bestätigungslink ist nicht (mehr) gültig. Falls du die Mail
          mehrfach erhalten hast, nutze bitte den aktuellsten Link.
        </Fehler>
      </Wrapper>
    );
  }

  // -------------------- action=confirm --------------------
  if (action === "confirm") {
    await prisma.tagesmutter.update({
      where: { id: tm.id },
      data: { lastConfirmed: new Date() },
    });

    return (
      <Wrapper>
        <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
          <div className="text-5xl mb-3" aria-hidden>
            ✅
          </div>
          <h1 className="text-2xl font-extrabold mb-2">
            Danke {tm.vorname}, deine Plätze wurden bestätigt!
          </h1>
          <p className="text-text-soft">
            Wir melden uns nächsten Monat wieder.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 rounded-full bg-korallenrot hover:bg-korallenrot-dunkel text-white font-semibold px-6 py-3 transition-colors"
          >
            Zur Startseite
          </Link>
        </div>
      </Wrapper>
    );
  }

  // -------------------- action=edit --------------------
  if (action === "edit") {
    const fp = tm.freiePlaetze;
    const initial = [
      fp?.platz1Ab ?? null,
      fp?.platz2Ab ?? null,
      fp?.platz3Ab ?? null,
      fp?.platz4Ab ?? null,
      fp?.platz5Ab ?? null,
    ].map((d) => (d ? d.toISOString().slice(0, 10) : ""));

    return (
      <Wrapper>
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold mb-2">
            Hallo {tm.vorname}!
          </h1>
          <p className="text-text-soft mb-6">
            Hier kannst du deine freien Plätze aktualisieren. Trage für jeden
            Platz das Datum ein, ab dem er frei wird – oder lass das Feld leer,
            wenn der Platz aktuell belegt ist.
          </p>
          <EditPlaetzeForm token={token} initialDates={initial} />
        </div>
      </Wrapper>
    );
  }

  // -------------------- keine action: Auswahl --------------------
  return (
    <Wrapper>
      <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold mb-2">
          Hallo {tm.vorname}!
        </h1>
        <p className="text-text-soft mb-6">
          Was möchtest du tun?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/plaetze-bestaetigen?token=${token}&action=confirm`}
            className="inline-flex items-center justify-center rounded-full bg-korallenrot hover:bg-korallenrot-dunkel text-white font-semibold px-6 py-3 transition-colors"
          >
            ✅ Alles stimmt so – bestätigen
          </Link>
          <Link
            href={`/plaetze-bestaetigen?token=${token}&action=edit`}
            className="inline-flex items-center justify-center rounded-full bg-white border border-text/15 hover:border-text/30 text-text font-semibold px-6 py-3 transition-colors"
          >
            ✏️ Ich möchte etwas ändern
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-creme">
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">{children}</div>
    </main>
  );
}

function Fehler({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm text-center">
      <div className="text-5xl mb-3" aria-hidden>
        ⚠️
      </div>
      <h1 className="text-2xl font-extrabold mb-2">{titel}</h1>
      <p className="text-text-soft">{children}</p>
    </div>
  );
}

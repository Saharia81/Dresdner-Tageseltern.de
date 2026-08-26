import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";
import { bilderFuer, PLATZHALTER } from "@/lib/tagesmutter-bilder";
import { getErsatztagespflege } from "@/lib/steckbriefe";
import { ErsatzListe, type Ersatzperson } from "./ErsatzListe";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Ersatztagespflege",
  description:
    "Ersatztagesmütter und Ersatztagesväter in Dresden stellen sich vor. Tagesmütter und Tagesväter finden hier verlässliche Kooperationspartner für die Vertretung bei Urlaub, Krankheit oder Fortbildung.",
});

/* ------------------------------------------------------------------ */
/* Daten aus der DB: aktive Mitglieder mit Ersatzmodell != KEINE.       */
/* Fotos kommen automatisch aus public/images/tagesmuetter/<nr>/.       */
/* Bei DB-Ausfall (z. B. lokal ohne Verbindung) wird leer gerendert.    */
/* ------------------------------------------------------------------ */

const MODELL_LABEL = {
  BASIS_ETP: "Basis-ETP",
  STUETZPUNKT: "Stützpunkt",
} as const;

async function ladePersonen(): Promise<Ersatzperson[]> {
  let datensaetze: Awaited<ReturnType<typeof getErsatztagespflege>>;
  try {
    datensaetze = await getErsatztagespflege();
  } catch {
    return [];
  }

  return Promise.all(
    datensaetze.map(async (tm): Promise<Ersatzperson> => {
      const bilder = await bilderFuer(tm.mitgliedsnummer);
      const modell =
        tm.ersatzmodell === "BASIS_ETP" || tm.ersatzmodell === "STUETZPUNKT"
          ? [MODELL_LABEL[tm.ersatzmodell]]
          : [];
      return {
        name: `${tm.vorname} ${tm.nachname}`.trim(),
        stadtteil: tm.stadtteil,
        freierPlatz: tm.ersatzFreierPlatz,
        modelle: modell,
        mitgliedsnummer: tm.mitgliedsnummer ?? undefined,
        foto: bilder.fotoUrl !== PLATZHALTER ? bilder.fotoUrl : undefined,
        galerie: bilder.galerie.length > 0 ? bilder.galerie : undefined,
        strasse: tm.strasse || undefined,
        plz: tm.plz || undefined,
        telefon: tm.telefon || undefined,
        email: tm.email || undefined,
        latitude: tm.latitude ?? undefined,
        longitude: tm.longitude ?? undefined,
      };
    }),
  );
}

/* ------------------------------------------------------------------ */
/* Seite                                                                */
/* ------------------------------------------------------------------ */

export default async function ErsatztagespflegePage() {
  const personen = await ladePersonen();
  return (
    <main>
      <HeroSection />
      <PersonenSection personen={personen} />
      <MitmachenCtaSection />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Hero                                                             */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pt-6 md:pt-12 pb-16 md:pb-20">
        <Breadcrumb />

        <div className="mt-12 md:mt-16 max-w-3xl">
          <p className="text-korallenrot font-semibold text-lg mb-3">
            Für Tagesmütter &amp; Tagesväter
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Verlässliche Vertretung in Dresden
          </h1>
          <p className="text-lg text-text-soft leading-relaxed">
            Urlaub, Krankheit oder Fortbildung: Wenn du als Tagesmutter oder
            Tagesvater ausfällst, springt eine Ersatztagespflegeperson ein. Hier
            stellen sich unsere Ersatztagesmütter und Ersatztagesväter vor. Mit
            ihnen sind die Kindergruppen auch in Ausfallzeiten bestens betreut.
          </p>
        </div>
      </div>
    </section>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Brotkrumen-Navigation" className="text-sm text-text-soft">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-korallenrot transition-colors">
            Startseite
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link
            href="/fuer-tageseltern"
            className="hover:text-korallenrot transition-colors"
          >
            Für Tageseltern
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li className="text-text font-medium" aria-current="page">
          Ersatztagespflege
        </li>
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Personen                                                         */
/* ------------------------------------------------------------------ */

function PersonenSection({ personen }: { personen: Ersatzperson[] }) {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Unsere Ersatztagespflegepersonen
          </h2>
          <p className="text-text-soft leading-relaxed mt-3 max-w-2xl">
            Diese Vereinsmitglieder sorgen für eine zuverlässige und reibungslose
            Ersatzbetreuung in Dresden. Klicke auf eine Karte für alle Infos und
            Kontaktmöglichkeiten.
          </p>
        </div>

        {personen.length > 0 ? (
          <ErsatzListe personen={personen} />
        ) : (
          <p className="rounded-2xl bg-white border border-text-soft/10 p-6 text-text-soft shadow-sm">
            Aktuell sind hier noch keine Ersatztagespflegepersonen hinterlegt.
            Schau bald wieder vorbei.
          </p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Mitmachen CTA                                                    */
/* ------------------------------------------------------------------ */

function MitmachenCtaSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-sm">
          <p className="text-korallenrot font-semibold mb-3">
            Du bist Ersatztagesmutter oder Ersatztagesvater?
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Lass dich hier vorstellen.
          </h2>
          <p className="text-text-soft mb-6 leading-relaxed max-w-2xl">
            Du bist Mitglied bei den Dresdner Tageseltern e.V. und möchtest mit
            deinem Profil hier erscheinen? Melde dich bei uns, dann nehmen wir
            dich in die Übersicht auf.
          </p>
          <LinkButton
            variant="primary"
            href="mailto:info@dresdner-tageseltern.de"
            className="w-full sm:w-auto"
          >
            Kontakt aufnehmen
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

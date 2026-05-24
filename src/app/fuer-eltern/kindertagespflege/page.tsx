import React from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Was ist Kindertagespflege? – Dresdner Tages Eltern e.V.",
  description:
    "Kindertagespflege erklärt: Alltag, Eingewöhnung, Ersatzbetreuung, Kosten und Unterschiede zur Kita – warm, persönlich und in kleinen Gruppen begleitet.",
};

/**
 * Bildpfade an einer Stelle gesammelt, damit sie später leicht
 * gegen finale Motive ausgetauscht werden können.
 * Aktuell verweisen sie auf bereits vorhandene Vereinsbilder.
 */
const IMAGES = {
  hero: "/images/kindertagespflege/kinderwagen.png",
  alltagEssen: "/images/kindertagespflege/gemeinsam-essen.png",
  alltagSpielen: "/images/kindertagespflege/naturentdecken1.png",
  alltagSchlaf: "/images/kindertagespflege/schlafen.png",
  alltagBegleitung: "/images/kindertagespflege/lesen.png",
  ersatzbetreuung: "/images/kindertagespflege/ersatzbetreuung.png",
  herzAccent: "/images/hero/herzapricot.png",
};

export default function KindertagespflegePage() {
  return (
    <main>
      <HeroSection />
      <AlltagSection />
      <ErsatzbetreuungSection />
      <InfoCardsSection />
      <VergleichSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Hero                                                            */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
          {/* Bild – oben bündig mit der Menüleiste (keine pt) */}
          <div className="md:order-2 -mx-4 md:mx-0">
            <div
              className="relative aspect-[3/4] md:aspect-[5/6] overflow-hidden md:rounded-b-3xl"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 20%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 20%)",
              }}
            >
              <Image
                src={IMAGES.hero}
                alt="Tagesmutter mit drei Kleinkindern in einem gelben Krippenwagen unter blühenden Kirschbäumen in Dresden"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Textspalte mit Breadcrumb oben */}
          <div className="md:order-1 pt-6 md:pt-12">
            <Breadcrumb />
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-12 md:mt-16 mb-6">
              Was ist
              <br />
              Kindertagespflege?
            </h1>
            <p className="text-lg text-text-soft mb-6 max-w-xl leading-relaxed">
              Kindertagespflege ist eine liebevolle und individuelle
              Betreuungsform für Kinder von 0 bis 3 Jahren, meist im
              Haushalt der Tagespflegeperson oder in geeigneten Räumen. In
              kleinen Gruppen werden Kinder individuell begleitet,
              gefördert und in ihrer Entwicklung gestärkt.
            </p>
            <p className="flex items-center gap-3 italic text-text-soft text-xl md:text-2xl">
              <Image
                src={IMAGES.herzAccent}
                alt=""
                width={1536}
                height={1024}
                aria-hidden
                className="w-32 md:w-36 h-auto select-none"
              />
              Persönlich. Familiär. Verlässlich.
            </p>
          </div>
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
        <li className="text-text font-medium" aria-current="page">
          Was ist Kindertagespflege?
        </li>
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Ein Tag in der Kindertagespflege                                */
/* ------------------------------------------------------------------ */

const ALLTAG_KARTEN = [
  {
    image: IMAGES.alltagEssen,
    title: "Gemeinsam essen",
    text: "Mahlzeiten finden in familiärer Atmosphäre statt. Die Kinder werden altersgerecht einbezogen und erleben Gemeinschaft.",
  },
  {
    image: IMAGES.alltagSpielen,
    title: "Spielen & Entdecken",
    text: "Kinder haben Zeit zum freien Spiel, zum Entdecken, Ausprobieren und Lernen, drinnen und draußen, passend zum Alter und zur Entwicklung.",
  },
  {
    image: IMAGES.alltagSchlaf,
    title: "Ruhe & Schlaf",
    text: "Jedes Kind hat seinen eigenen Rhythmus. Es gibt feste Zeiten für Ruhephasen und Schlaf in einer ruhigen und geborgenen Umgebung.",
  },
  {
    image: IMAGES.alltagBegleitung,
    title: "Individuelle Begleitung",
    text: "Kleine Gruppen ermöglichen viel Aufmerksamkeit, echte Beziehungen und eine liebevolle Begleitung in allen Alltagssituationen.",
  },
];

function AlltagSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Ein Tag in der Kindertagespflege
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ALLTAG_KARTEN.map((k) => (
            <AlltagKarte key={k.title} {...k} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AlltagKarte({
  image,
  title,
  text,
}: {
  image: string;
  title: string;
  text: string;
}) {
  return (
    <Card className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="relative aspect-[4/3] w-[calc(100%+3rem)] -mx-6 -mt-6 overflow-hidden rounded-t-2xl">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          aria-hidden
        />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-text-soft text-sm leading-relaxed">{text}</p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Ersatzbetreuung                                                 */
/* ------------------------------------------------------------------ */

function ErsatzbetreuungSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="rounded-3xl bg-white shadow-sm overflow-hidden">
          <div className="grid gap-8 md:grid-cols-[minmax(0,24rem)_1fr] items-center md:items-stretch p-6 md:p-10">
            <div className="md:self-center">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Was passiert bei Urlaub oder Krankheit?
              </h2>
              <p className="text-text-soft text-lg leading-relaxed mb-6">
                Kinder lernen ihre Ersatzbetreuung bereits vorab kennen und
                werden auch im Vertretungsfall in vertrauter Atmosphäre
                begleitet. So bleibt die Betreuung verlässlich und sicher.
              </p>
              <LinkButton variant="primary" href="/fuer-eltern/faq" className="w-full sm:w-auto">
                Mehr zur Ersatzbetreuung
              </LinkButton>
            </div>

            <div
              className="relative aspect-[4/3] w-full md:w-auto md:aspect-auto md:-my-10 md:-mr-10 rounded-2xl md:rounded-none overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 20%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 20%)",
              }}
            >
              <Image
                src={IMAGES.ersatzbetreuung}
                alt="Zwei Betreuungspersonen mit Kleinkindern in warmer Wohnatmosphäre"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Drei Infokarten                                                 */
/* ------------------------------------------------------------------ */

function InfoCardsSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-20 md:pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="flex flex-col gap-4">
            <h3 className="text-xl font-extrabold">
              Wo findet Kindertagespflege statt?
            </h3>
            <p className="text-text-soft leading-relaxed">
              In liebevoll gestalteten Räumen mit Geborgenheit, Sicherheit
              und familiärer Atmosphäre, damit sich Kinder jeden Tag wohl
              und willkommen fühlen.
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-3 text-center">
              <OrtItem
                icon={
                  <Image
                    src="/images/icons/wohnraum-tagespflegeperson.png"
                    alt=""
                    width={480}
                    height={320}
                    aria-hidden
                    className="h-12 w-auto object-contain"
                  />
                }
                label="Im Haushalt der Tagespflegeperson"
              />
              <OrtItem
                icon={
                  <Image
                    src="/images/icons/wohnraum-andere-raeume.png"
                    alt=""
                    width={480}
                    height={320}
                    aria-hidden
                    className="h-12 w-auto object-contain"
                  />
                }
                label={<>In separat<br />angemieteten Räumen</>}
              />
            </ul>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="text-xl font-extrabold">
              Wie läuft die Eingewöhnung ab?
            </h3>
            <p className="text-text-soft leading-relaxed flex-1">
              Jedes Kind bekommt die Zeit, die es braucht. Gemeinsam mit
              den Eltern gestalten wir die Eingewöhnung behutsam und
              individuell – für einen guten Start voller Vertrauen.
            </p>
            <div>
              <LinkButton variant="primary" href="/fuer-eltern/faq" className="w-full">
                Mehr zur Eingewöhnung
              </LinkButton>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="text-xl font-extrabold">
              Was kostet Kindertagespflege?
            </h3>
            <p className="text-text-soft leading-relaxed flex-1">
              Die Elternbeiträge sind identisch mit denen in Krippe und
              Kita. Die Kosten richten sich nach dem Einkommen und werden
              durch die Landeshauptstadt Dresden bezuschusst.
            </p>
            <div>
              <LinkButton
                variant="primary"
                href="https://www.dresden.de/de/leben/kinder/tagesbetreuung/anmeldung/elternbeitraege.php?pk_kwd=elternbeitraege"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                Mehr zu Kosten &amp; Beiträgen
              </LinkButton>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function OrtItem({ icon, label }: { icon: ReactNode; label: ReactNode }) {
  return (
    <li className="flex flex-col items-center gap-2">
      {icon}
      <span className="text-xs text-text-soft leading-tight">{label}</span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* 5 — Vergleich Kindertagespflege / Kita                              */
/* ------------------------------------------------------------------ */

/* Vergleich-Icons --------------------------------------------------- */

function VgHouseHeartIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 11L12 3l9 8v10H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path
        d="M12 19s-4-2.5-4-5.5a2.2 2.2 0 0 1 4-1.3 2.2 2.2 0 0 1 4 1.3c0 3-4 5.5-4 5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function VgBuildingIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 11h20" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="6" y="14" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="15" y="14" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M10 21v-4h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}

function VgUsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M2 19c1-3 4-4.5 6-4.5s5 1.5 6 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M15 19c.8-2.4 3-3.5 4.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function VgPersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M5 20c1.5-4 5-5.5 7-5.5s5.5 1.5 7 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function VgHeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
        stroke="currentColor" strokeWidth="1.7"
      />
    </svg>
  );
}

function VgHouseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 11L12 4l8 7v9H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function VgEuroIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17 6.5A7 7 0 1 0 17 17.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M5 10h9M5 14h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function VgFamilyIcon() {
  return (
    <svg width="72" height="56" viewBox="0 0 90 60" fill="none" aria-hidden>
      <circle cx="20" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13 30c0-5 3-9 7-9s7 4 7 9v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 38h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="52" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M45 30c0-5 3-9 7-9s7 4 7 9v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M45 38h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="36" cy="20" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M30 40c0-4 2.5-8 6-8s6 4 6 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 46h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* Zeilen-Konfiguration (Farben + Icons, kein JSX im module-scope) --- */

function buildRows() {
  return [
    {
      merkmal: "Gruppengröße",
      iconBg: "bg-korallenrot/15",
      iconColor: "text-korallenrot",
      IconComponent: VgUsersIcon,
      ktpContent: <>Maximal 5 Kinder</>,
      kitaContent: <>Bis zu 15 Kinder pro Gruppe</>,
    },
    {
      merkmal: "Bezugsperson",
      iconBg: "bg-sonnengelb/60",
      iconColor: "text-[#9a6a00]",
      IconComponent: VgPersonIcon,
      ktpContent: <>Eine feste Bezugsperson</>,
      kitaContent: <>Wechselndes Personal</>,
    },
    {
      merkmal: "Atmosphäre",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      IconComponent: VgHeartIcon,
      ktpContent: <>Familiär und individuell</>,
      kitaContent: <>Mehr Reize, unpersönlicher</>,
    },
    {
      merkmal: "Betreuungsort",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      IconComponent: VgHouseIcon,
      ktpContent: <>Häusliche Umgebung oder gemütliche Räume</>,
      kitaContent: <>Kita-Gebäude</>,
    },
    {
      merkmal: "Kosten für Eltern",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      IconComponent: VgEuroIcon,
      ktpContent: <>Gleiche Elternbeiträge wie in der Kita/Krippe</>,
      kitaContent: <>Gleiche Elternbeiträge</>,
    },
  ];
}

function VergleichSection() {
  const rows = buildRows();
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">

        {/* Kopf */}
        <div className="flex flex-col items-center text-center mb-12">
          <Image
            src={IMAGES.herzAccent}
            alt=""
            width={1536}
            height={1024}
            aria-hidden
            className="w-28 h-auto select-none mb-2"
          />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Kindertagespflege und Kita im Vergleich
          </h2>
          <p className="text-text-soft max-w-xl leading-relaxed">
            Zwei wertvolle Betreuungsformen mit unterschiedlichen Stärken.<br />
            Finden Sie das Beste für Ihr Kind und Ihre Familie.
          </p>
        </div>

        {/* Desktop: Tabelle */}
        <div className="hidden md:block rounded-3xl bg-white shadow-sm overflow-hidden mb-5">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-5 text-left font-extrabold bg-korallenrot text-white w-[28%]">
                  Kriterium
                </th>
                <th className="px-6 py-5 text-center font-extrabold bg-korallenrot text-white w-[36%]">
                  <div className="flex flex-col items-center gap-1.5">
                    <VgHouseHeartIcon />
                    Kindertagespflege
                  </div>
                </th>
                <th className="px-6 py-5 text-center font-extrabold bg-korallenrot text-white w-[36%]">
                  <div className="flex flex-col items-center gap-1.5">
                    <VgBuildingIcon />
                    Kita
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text/5">
              {rows.map((row) => (
                <tr key={row.merkmal} className="bg-white">
                  <th scope="row" className="px-6 py-5 font-semibold text-text text-left">
                    <span className="inline-flex items-center gap-3">
                      <span
                        className={`inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full ${row.iconBg} ${row.iconColor}`}
                      >
                        <row.IconComponent />
                      </span>
                      {row.merkmal}
                    </span>
                  </th>
                  <td className="px-6 py-5 text-center text-sm leading-relaxed">
                    {row.ktpContent}
                  </td>
                  <td className="px-6 py-5 text-center text-sm leading-relaxed text-text-soft">
                    {row.kitaContent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer-Box */}
        <div className="hidden md:flex items-center gap-5 rounded-2xl bg-white border border-text/5 shadow-sm px-6 py-5 mb-0">
          <span className="inline-flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-korallenrot/15 text-korallenrot">
            <VgHeartIcon />
          </span>
          <div className="flex-1">
            <p className="font-extrabold text-korallenrot">
              Beide Betreuungsformen haben ihre Stärken.
            </p>
            <p className="text-text-soft text-sm mt-0.5">
              Was zählt, ist das, was am besten zu Ihnen und Ihrem Kind passt.
            </p>
          </div>
        </div>

        {/* Mobile: Tab-Header + Karten */}
        <div className="md:hidden">

          {/* Tab-Header */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex flex-col items-center gap-1.5 bg-korallenrot text-white rounded-2xl py-4 px-3">
              <VgHouseHeartIcon />
              <span className="font-extrabold text-sm">Kindertagespflege</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 bg-korallenrot text-white rounded-2xl py-4 px-3">
              <VgBuildingIcon />
              <span className="font-extrabold text-sm">Kita</span>
            </div>
          </div>

          {/* Karten */}
          <div className="grid gap-4">
            {rows.map((row) => (
              <div key={row.merkmal} className="bg-white rounded-2xl border border-text/5 shadow-sm overflow-hidden">
                {/* Merkmal-Kopf */}
                <div className="flex justify-center items-center gap-3 px-4 py-3 border-b border-text/20">
                  <span className={`inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full ${row.iconBg} ${row.iconColor}`}>
                    <row.IconComponent />
                  </span>
                  <span className="font-extrabold text-sm">{row.merkmal}</span>
                </div>
                {/* Zweispaltig */}
                <div className="grid grid-cols-2 divide-x divide-text/20">
                  <div className="px-4 py-3">
                    <p className="text-sm text-text-soft leading-relaxed">{row.ktpContent}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-text-soft leading-relaxed">{row.kitaContent}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Footer-Box */}
            <div className="flex items-start gap-4 rounded-2xl bg-white border border-text/5 shadow-sm p-4 overflow-hidden relative">
              <span className="inline-flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-korallenrot/15 text-korallenrot">
                <VgHeartIcon />
              </span>
              <div className="flex-1">
                <p className="font-extrabold text-korallenrot text-sm leading-snug">
                  Beide Betreuungsformen haben ihre Stärken.
                </p>
                <p className="text-text-soft text-xs mt-1 leading-relaxed">
                  Was zählt, ist das, was am besten zu Ihnen und Ihrem Kind passt.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6 — FAQ                                                             */
/* ------------------------------------------------------------------ */

function buildFaqItems() {
  return [
    {
      iconBg: "bg-korallenrot/15",
      iconColor: "text-korallenrot",
      IconComponent: FaqCalendarIcon,
      q: "Für welches Alter ist Kindertagespflege?",
      a: "Bei uns werden Kinder im Alter von 0 bis 3 Jahren betreut – also genau in der Zeit, in der eine familiäre, ruhige Umgebung besonders wichtig ist.",
    },
    {
      iconBg: "bg-sonnengelb/60",
      iconColor: "text-[#9a6a00]",
      IconComponent: FaqPeopleIcon,
      q: "Wie viele Kinder werden betreut?",
      a: "Eine Tagespflegeperson betreut maximal 5 Kinder gleichzeitig. So bleibt genug Zeit für jedes einzelne Kind und es entstehen echte, vertrauensvolle Beziehungen.",
    },
    {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      IconComponent: FaqCertIcon,
      q: "Welche Qualifikationen haben Tagespflegepersonen?",
      a: "Alle Tagespflegepersonen verfügen über eine pädagogische Qualifizierung nach dem bundesweit anerkannten Curriculum und besitzen eine Pflegeerlaubnis des Amtes für Kindertagesbetreuung. Regelmäßige Fortbildungen sind verpflichtend.",
    },
    {
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      IconComponent: FaqEuroIcon,
      q: "Was kostet Kindertagespflege?",
      a: <>Die Elternbeiträge sind identisch mit denen einer Kita. Unter bestimmten Voraussetzungen kann der Beitrag reduziert werden.{" "}<a href="https://www.dresden.de/de/leben/kinder/tagesbetreuung/anmeldung/elternbeitraege.php?pk_campaign=Shortcut&pk_kwd=elternbeitraege" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-korallenrot transition-colors">Hier mehr erfahren.</a></>,
    },
    {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      IconComponent: FaqSearchIcon,
      q: "Wie finde ich eine passende Tagesmutter oder einen passenden Tagesvater?",
      a: "Über unsere Suche kannst du Tageseltern in deiner Nähe entdecken und siehst direkt, wer freie Plätze hat.",
    },
  ];
}

function FaqSection() {
  const items = buildFaqItems();
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-2xl px-4 py-20 md:py-24">

        {/* Kopf */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Häufige Fragen
          </h2>
          <p className="text-text-soft max-w-sm leading-relaxed mt-3">
            Antworten auf die wichtigsten Fragen rund um die Kindertagespflege.
          </p>
        </div>

        {/* Akkordeon-Karten */}
        <div className="space-y-4">
          {items.map((item) => (
            <FaqCard key={item.q} {...item} />
          ))}
        </div>

        {/* Noch Fragen? */}
        <div className="mt-6">
          <NochFragenCard />
        </div>

      </div>
    </section>
  );
}

/**
 * Natives <details>-Element mit farbigem Icon-Kreis.
 * Zugänglich (Keyboard + Screenreader), kein JavaScript nötig.
 */
function FaqCard({
  iconBg,
  iconColor,
  IconComponent,
  q,
  a,
}: {
  iconBg: string;
  iconColor: string;
  IconComponent: () => React.ReactElement;
  q: string;
  a: React.ReactNode;
}) {
  return (
    <details className="group bg-white rounded-2xl shadow-sm overflow-hidden">
      <summary className="flex items-center gap-4 cursor-pointer list-none px-5 py-5 hover:bg-creme/60 transition-colors">
        {/* Icon-Kreis */}
        <span
          className={`inline-flex w-12 h-12 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
        >
          <IconComponent />
        </span>
        {/* Frage */}
        <span className="flex-1 font-bold text-base md:text-lg text-text leading-snug">{q}</span>
        {/* + dreht sich zu × */}
        <span
          aria-hidden
          className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full border-2 border-korallenrot text-korallenrot transition-transform duration-200 group-open:rotate-45"
        >
          <PlusIcon />
        </span>
      </summary>
      {/* Antwort – eingerückt bündig mit dem Fragetext */}
      <div className="px-5 pb-6 pt-1 text-text-soft leading-relaxed text-[0.95rem]">
        <div className="pl-16">{a}</div>
      </div>
    </details>
  );
}

function NochFragenCard() {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl p-5"
      style={{ backgroundColor: "#fdf0d0" }}
    >
      <span
        className="inline-flex w-12 h-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f5a623" }}
      >
        <FaqLightbulbIcon />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-text text-lg leading-tight">Noch Fragen?</p>
        <p className="text-text-soft text-sm mt-0.5">
          Wir sind gerne für Sie da und helfen Ihnen weiter.
        </p>
      </div>
      <a
        href="mailto:info@dresdner-tageseltern.de"
        className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors bg-korallenrot text-white hover:bg-korallenrot-dunkel w-full sm:w-auto"
      >
        <FaqChatIcon />
        E-Mail schreiben
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7 — Final CTA                                                       */
/* ------------------------------------------------------------------ */

function FinalCtaSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-20 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:p-12 shadow-sm">
          <Image
            src="/images/allgemein/frauenkirche.png"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 38vw, 0px"
            className="!left-auto !w-full md:!w-[38%] object-cover object-top md:object-left pointer-events-none select-none opacity-20 md:opacity-100 [mask-image:linear-gradient(to_right,transparent_0%,black_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_45%)]"
          />
          <div className="relative md:max-w-[62%]">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Bereit, die passende Betreuung für dein Kind in Dresden zu finden?
            </h2>
            <p className="text-text-soft mb-6">
              Weil die ersten Jahre besondere Begleitung verdienen
            </p>
            <div className="flex items-center gap-6">
              <CtaButton
                href="/kindertagespflege-finden"
                label="Tageseltern finden"
                hint="Freie Plätze entdecken"
                variant="primary"
                className="w-full sm:w-auto sm:px-16"
              />
              {/* Herz – Desktop neben dem Button */}
              <Image
                src="/images/hero/herzapricot-transparent.png"
                alt=""
                width={400}
                height={280}
                aria-hidden
                className="hidden md:block pointer-events-none select-none w-28 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaButton({
  href,
  label,
  hint,
  variant,
  className = "",
}: {
  href: string;
  label: string;
  hint: string;
  variant: "primary" | "secondary";
  className?: string;
}) {
  const base =
    "flex flex-col items-start rounded-3xl px-10 py-3 transition-colors";
  const styles =
    variant === "primary"
      ? "bg-korallenrot text-white hover:bg-korallenrot-dunkel"
      : "bg-sonnengelb text-text hover:bg-sonnengelb/80";
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      <span className="font-semibold leading-tight">{label}</span>
      <span
        className={`text-xs leading-tight ${
          variant === "primary" ? "text-white/85" : "text-text-soft"
        }`}
      >
        {hint}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Inline-Icons (SVG)                                                  */
/* ------------------------------------------------------------------ */

function CalendarHeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8 3 v 4 M16 3 v 4 M3 10 h 18" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 18 s -3 -1.7 -3 -4 a 1.6 1.6 0 0 1 3 -1 a 1.6 1.6 0 0 1 3 1 c 0 2.3 -3 4 -3 4 z"
        fill="currentColor"
      />
    </svg>
  );
}


function VergleichUsersIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 19c1-3 4-4.5 6-4.5s5 1.5 6 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 19c.8-2.4 3-3.5 4.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function VergleichPersonIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c1.5-4 5-5.5 7-5.5s5.5 1.5 7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function VergleichHeartIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="currentColor" />
    </svg>
  );
}

function VergleichHouseIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 11L12 4l8 7v9H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function VergleichCoinIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 10h5a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5 V 19 M5 12 H 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ-Icons                                                            */
/* ------------------------------------------------------------------ */

/** Kalender mit Punkten */
function FaqCalendarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
      <circle cx="8" cy="19" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

/** Gruppe von Personen */
function FaqPeopleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 19c1-3.5 4-5 6-5s5 1.5 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 19c.8-2.8 3-4 4.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Zertifikat / Abzeichen */
function FaqCertIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 8h6M7 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 22l2-2.5 2 2.5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Euro-Zeichen */
function FaqEuroIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17 6.5A7 7 0 1 0 17 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 10h9M5 14h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Lupe mit Herz */
function FaqSearchIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 14.5s-3-1.8-3-4.2a2.1 2.1 0 0 1 3-1.9 2.1 2.1 0 0 1 3 1.9c0 2.4-3 4.2-3 4.2z"
        fill="currentColor" />
    </svg>
  );
}

/** Glühbirne (weiß auf orangem Hintergrund) */
function FaqLightbulbIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 21h6M12 3a6 6 0 0 1 4.6 9.9C15.4 14.3 15 15 15 16v1H9v-1c0-1-.4-1.7-1.6-3.1A6 6 0 0 1 12 3z"
        stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sprechblase für den Kontakt-Button */
function FaqChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

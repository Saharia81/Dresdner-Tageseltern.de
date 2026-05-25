import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "Eingewöhnung & Ersatzbetreuung | Dresdner Tages Eltern e.V.",
  description:
    "Wie läuft die Eingewöhnung in der Kindertagespflege ab? Was passiert bei Urlaub oder Krankheit? Alle Infos zur Eingewöhnung und zu den drei Ersatzbetreuungsmodellen.",
};

/* ------------------------------------------------------------------ */
/* Bildpfade                                                            */
/* ------------------------------------------------------------------ */

const IMAGES = {
  hero: "/images/allgemein/eingewoehnung-hero.png",
  eingewoehnung: "/images/allgemein/eingewoehnung-v2.png",
  herzAccent: "/images/hero/herzapricot.png",
};

/* ------------------------------------------------------------------ */
/* Seite                                                                */
/* ------------------------------------------------------------------ */

export default function EingewoehnungUndErsatzbetreuungPage() {
  return (
    <main>
      <HeroSection />
      <EingewoehnungSection />
      <ErsatzbetreuungSection />
      <FinalCtaSection />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Hero                                                             */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
          {/* Bild – rechte Spalte */}
          <div className="md:order-2 -mx-4 md:mx-0">
            <div
              className="relative aspect-[3/4] md:aspect-[5/6] overflow-hidden md:rounded-b-3xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]"
            >
              <Image
                src={IMAGES.hero}
                alt="Tagesmutter spielt mit zwei Kleinkindern auf dem Boden – liebevolle Betreuung bei den Dresdner Tageseltern e.V."
                fill
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Textspalte */}
          <div className="md:order-1 pt-6 md:pt-12">
            <Breadcrumb />

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-12 md:mt-16 mb-6">
              Gut begleitet.
              <br />
              Sicher betreut.
            </h1>
            <p className="text-lg text-text-soft mb-8 max-w-xl leading-relaxed">
              Eine vertrauensvolle Eingewöhnung und verlässliche Ersatzbetreuung
              sind wichtige Bausteine für eine gute Kindertagespflege. Sie geben
              Kindern Sicherheit und Eltern ein gutes Gefühl, von Anfang an und
              auch in besonderen Situationen.
            </p>

            {/* Drei Kernpunkte */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <UspItem
                icon={
                  <Image
                    src="/images/icons/bezugsperson.png"
                    alt=""
                    width={313}
                    height={313}
                    className="w-16 h-16 object-contain"
                    aria-hidden
                  />
                }
                title="Sicherheit"
                text="Vertraute Beziehungen geben Halt"
              />
              <UspItem
                icon={
                  <Image
                    src="/images/icons/kleine-gruppe.png"
                    alt=""
                    width={313}
                    height={313}
                    className="w-16 h-16 object-contain"
                    aria-hidden
                  />
                }
                title="Verlässlichkeit"
                text="Betreuung auch bei Ausfallzeiten"
              />
              <UspItem
                icon={
                  <Image
                    src="/images/icons/feder.png"
                    alt=""
                    width={313}
                    height={313}
                    className="w-16 h-16 object-contain"
                    aria-hidden
                  />
                }
                title="Vertrauen"
                text="Gutes Miteinander für alle"
              />
            </div>
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
        <li>
          <Link href="/fuer-eltern" className="hover:text-korallenrot transition-colors">
            Für Eltern
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li className="text-text font-medium" aria-current="page">
          Eingewöhnung &amp; Ersatzbetreuung
        </li>
      </ol>
    </nav>
  );
}

function UspItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {icon}
      <div className="leading-tight text-text-soft text-sm">
        <p className="font-semibold text-text">{title}</p>
        <p>{text}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Eingewöhnung                                                     */
/* ------------------------------------------------------------------ */

const EINGEWOEHNUNG_SCHRITTE = [
  {
    nummer: "1",
    titel: "Kennenlernen",
    text: "Erste Kontakte in der Kindertagespflegestelle.",
    icon: <EingewoehnungPeopleIcon />,
  },
  {
    nummer: "2",
    titel: "Vertrauen aufbauen",
    text: "Das Kind beobachtet, spielt und fasst langsam Vertrauen.",
    icon: <EingewoehnungHeartIcon />,
  },
  {
    nummer: "3",
    titel: "Erste Trennungen",
    text: "Erste kurze Abschiede – liebevoll begleitet.",
    icon: <EingewoehnungClockIcon />,
  },
  {
    nummer: "4",
    titel: "Sicherheit gewinnen",
    text: "Das Kind fühlt sich zunehmend sicher und geborgen.",
    icon: <EingewoehnungLeafIcon />,
  },
  {
    nummer: "5",
    titel: "Gut angekommen",
    text: "Die Eingewöhnung ist abgeschlossen. Der Alltag beginnt.",
    icon: <EingewoehnungSmileIcon />,
  },
];

function EingewoehnungSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        {/* Kopfzeile */}
        <div className="mb-2">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Eingewöhnung
          </h2>
          <p className="text-korallenrot font-semibold text-lg mt-1">
            Schritt für Schritt ankommen.
          </p>
        </div>

        {/* Zweispaltig: Bild links, Inhalt rechts */}
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,22rem)_1fr] md:items-stretch">
          {/* Bild */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden shadow-sm md:[mask-image:linear-gradient(to_right,black_65%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_right,black_65%,transparent_100%)]">
            <Image
              src={IMAGES.eingewoehnung}
              alt="Tagesmutter und Mutter sitzen gemeinsam mit einem Kleinkind auf dem Boden, sanfte Eingewöhnung"
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              className="object-cover object-[center_20%] md:object-[center_25%]"
            />
          </div>

          {/* Inhalt */}
          <div className="flex flex-col gap-6">
            <p className="text-text-soft leading-relaxed text-base">
              Die Eingewöhnung ist die Grundlage für eine vertrauensvolle
              Betreuung. Jedes Kind bekommt Zeit, um in seinem eigenen Tempo
              anzukommen und eine sichere Bindung zur Tagespflegeperson
              aufzubauen.
            </p>

            {/* Schritte */}
            <div className="relative">
              {/* Verbindungslinie – Desktop */}
              <div
                aria-hidden
                className="hidden md:block absolute top-6 left-6 right-6 h-px border-t-2 border-dashed border-korallenrot/30"
                style={{ zIndex: 0 }}
              />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                {EINGEWOEHNUNG_SCHRITTE.map((schritt) => (
                  <EingewoehnungSchritt key={schritt.nummer} {...schritt} />
                ))}
              </div>
            </div>

            {/* Hinweis-Box */}
            <div className="flex items-start gap-3 bg-white rounded-2xl shadow-sm p-4">
              <span className="text-korallenrot mt-0.5 shrink-0">
                <HeartSmallIcon />
              </span>
              <p className="text-sm text-text-soft leading-relaxed">
                <span className="font-bold text-text">Wichtig zu wissen: </span>
                Jedes Kind ist anders und bestimmt das Tempo mit. Eine
                gelungene Eingewöhnung schafft Sicherheit für alle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EingewoehnungSchritt({
  nummer,
  titel,
  text,
  icon,
}: {
  nummer: string;
  titel: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {/* Icon-Kreis */}
      <div className="inline-flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-korallenrot/20 text-korallenrot">
        {icon}
      </div>
      <p className="font-bold text-sm leading-tight">{titel}</p>
      <p className="text-text-soft text-xs leading-snug">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Ersatzbetreuung                                                  */
/* ------------------------------------------------------------------ */

const ERSATZ_MODELLE = [
  {
    titel: "Basis-ETP",
    text: "Die Ersatztagespflegeperson betreut die Kinder in den Räumen der Tagesmutter/-vater.",
    punkte: [
      "Die Vertretung findet in der vertrauten Umgebung des Kindes statt.",
      "Die Kindergruppe bleibt zusammen.",
      "Durch regelmäßige Treffen lernen die Kinder die Ersatztagesmutter kennen.",
    ],
  },
  {
    titel: "Stützpunkt",
    text: "Eine Ersatztagespflegeperson betreut die Gruppe in extra angemieteten Räumen.",
    punkte: [
      "Betreuung in kindergerechten Räumen.",
      "Die Kindergruppe bleibt zusammen.",
      "Regelmäßige Begleitung und Treffen sorgen für Beziehung und Vertrautheit.",
    ],
  },
  {
    titel: "Verzahntes Modell (4+1)",
    text: "Fünf Kindertagespflegepersonen schließen sich zusammen. Von ihnen betreut jede Kindertagespflegeperson vier Kinder. Der fünfte Platz ist für die Ersatzbetreuung vorgesehen.",
    punkte: [
      "Gemeinsame Treffen stärken Vertrautheit und Zusammenhalt.",
      "Mehr Sicherheit für Eltern durch ein festes Betreuungsnetzwerk.",
    ],
  },
  {
    titel: "Arbeitszeitmodell",
    text: "Zwei Tageseltern teilen sich eine Tagespflegestelle. Beide betreuen in Teilzeit und ersetzen sich bei Ausfall gegenseitig.",
    punkte: [
      "Die Kindergruppe bleibt zusammen.",
      "Die Kinder bleiben in der vertrauten Umgebung.",
      "Die Betreuung erfolgt durch eine bekannte Tagespflegeperson.",
    ],
  },
];

function ErsatzbetreuungSection() {
  return (
    <section id="ersatzbetreuung" className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        {/* Kopfzeile + Bild-Grid */}
        <div className="grid gap-8 md:grid-cols-[1fr_minmax(0,22rem)] items-start mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Ersatzbetreuung
            </h2>
            <p className="text-korallenrot font-semibold text-lg mt-1 mb-4">
              Verlässlich. Gut vorbereitet.
            </p>
            <p className="text-text-soft leading-relaxed max-w-lg">
              Für Ausfallzeiten der Kindertagespflegeperson durch Urlaub,
              Krankheit oder Fortbildung gibt es in Dresden verschiedene
              Ersatzbetreuungsformen. So ist die Betreuung eures Kindes auch
              dann gut gesichert.
            </p>
          </div>

          {/* Bild */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/kindertagespflege/ersatzbetreuung.png"
              alt="Kinder spielen zusammen in heller, freundlicher Atmosphäre – verlässliche Ersatzbetreuung"
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Drei Modell-Karten */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ERSATZ_MODELLE.map((m) => (
            <ErsatzModellKarte key={m.titel} {...m} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ErsatzModellKarte({
  titel,
  text,
  punkte,
}: {
  titel: string;
  text: string;
  punkte: string[];
}) {
  return (
    <div className="rounded-2xl shadow-sm overflow-hidden bg-white">
      {/* Kopfzeile */}
      <div className="bg-korallenrot px-5 pt-5 pb-4">
        <p className="font-extrabold text-base leading-tight text-white">
          {titel}
        </p>
      </div>

      {/* Text-Inhalt */}
      <div className="px-5 py-4 flex flex-col gap-4">
        <p className="text-text-soft text-sm leading-relaxed">{text}</p>
        <ul className="space-y-2">
          {punkte.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-text-soft">
              <span className="mt-1 shrink-0 text-korallenrot">
                <CheckIcon />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Final CTA                                                        */
/* ------------------------------------------------------------------ */

function FinalCtaSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:p-12 shadow-sm">
          <Image
            src="/images/kindertagespflege/frauenkiche.png"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 38vw, 0px"
            className="!left-auto !w-full md:!w-[38%] object-cover object-top md:object-left pointer-events-none select-none opacity-20 md:opacity-100 [mask-image:linear-gradient(to_right,transparent_0%,black_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_45%)]"
          />

          <div className="relative md:max-w-[62%]">
            <div className="mb-4">
              <p className="text-korallenrot font-semibold">
                Gemeinsam für eine gute Betreuung
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Eine gute Eingewöhnung und verlässliche Ersatzbetreuung schaffen
              Sicherheit und Vertrauen.
            </h2>
            <p className="text-text-soft mb-6 leading-relaxed">
              So können Kinder in einer liebevollen Umgebung wachsen und Eltern
              sich darauf verlassen, dass ihr Kind jeden Tag gut begleitet ist.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                variant="primary"
                href="/kindertagespflege-finden"
                className="w-full sm:w-auto"
              >
                Tageseltern finden
              </LinkButton>
              <LinkButton
                variant="secondary"
                href="mailto:info@dresdner-tageseltern.de"
                className="w-full sm:w-auto"
              >
                Kontakt aufnehmen
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SVG-Icons                                                            */
/* ------------------------------------------------------------------ */

function HeartSmallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EingewoehnungPeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3 19c1-3.5 4-5 6-5s5 1.5 6 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 19c.8-2.8 3-4 4.5-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EingewoehnungHeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 19s-6-4-6-9a4 4 0 0 1 6-2.3A4 4 0 0 1 18 10c0 5-6 9-6 9z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EingewoehnungClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 8v4l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EingewoehnungLeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 8c0 6-5 10-5 10S7 14 7 8a5 5 0 0 1 10 0z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function EingewoehnungSmileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9 14.5s1 1.5 3 1.5 3-1.5 3-1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="9" cy="10.5" r="1" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ErsatzHouseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11L12 4l8 7v9H4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 10s-2 1.2-2 3a2 2 0 0 0 4 0c0-1.8-2-3-2-3z"
        fill="currentColor"
      />
    </svg>
  );
}

function ErsatzBuildingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M2 11h20" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6" y="14" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="15" y="14" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 21v-4h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ErsatzGroupIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2 19c.8-3 3-4 4-4M10 19c.8-3 3-4 4-4M18 19c.8-3 3-4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarSmallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

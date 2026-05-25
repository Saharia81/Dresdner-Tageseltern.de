import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Über uns",
  description:
    "Wer wir sind, was uns antreibt und wer hinter dem Verein Dresdner Tages Eltern e.V. steht. Lerne unseren Vorstand, unser Maskottchen Albert und unsere Werte kennen.",
});

const VORSTAND: VorstandPerson[] = [
  {
    name: "Dana",
    rolle: "Vorsitzende",
    initial: "D",
    farbe: "bg-sonnengelb",
    text: "Dana behält den Überblick, bringt Menschen zusammen und setzt sich mit viel Herz für die Anliegen der Tageseltern ein.",
  },
  {
    name: "Anna",
    rolle: "Vorstand",
    initial: "A",
    farbe: "bg-korallenrot/30",
    text: "Anna unterstützt die Vereinsarbeit mit Ideen, Organisationstalent und einem offenen Ohr für die Gemeinschaft.",
  },
  {
    name: "Romy",
    rolle: "Vorstand",
    initial: "R",
    farbe: "bg-sonnengelb-hell",
    text: "Romy kümmert sich mit viel Kreativität um Sichtbarkeit, Öffentlichkeitsarbeit und die digitale Weiterentwicklung des Vereins.",
  },
  {
    name: "N. N.",
    rolle: "Kassenwartin",
    initial: "?",
    farbe: "bg-creme",
    text: "Unsere Kassenwartin sorgt dafür, dass Finanzen, Mitgliedsbeiträge und Vereinsmittel gut organisiert sind.",
  },
];

const WERTE = [
  {
    titel: "Gemeinschaft",
    text: "Wir vernetzen Tageseltern und stärken den Austausch.",
    icon: <CommunityIcon />,
  },
  {
    titel: "Sichtbarkeit",
    text: "Wir machen Kindertagespflege in Dresden bekannter.",
    icon: <EyeIcon />,
  },
  {
    titel: "Unterstützung",
    text: "Wir geben Familien Orientierung und Tageseltern Rückhalt.",
    icon: <HandHeartIcon />,
  },
  {
    titel: "Wertschätzung",
    text: "Wir zeigen, wie wertvoll diese Betreuungsform ist.",
    icon: <SparkleIcon />,
  },
];

const MITGLIEDS_VORTEILE = [
  {
    titel: "Gemeinschaft und Austausch",
    text: "Vernetze dich mit anderen Tageseltern und tausche Erfahrungen aus.",
    icon: <UsersIcon />,
  },
  {
    titel: "Mehr Sichtbarkeit",
    text: "Präsentiere dich und deine Kindertagespflegestelle auf unserer Website und bei Aktionen.",
    icon: <StarIcon />,
  },
  {
    titel: "Unterstützung im Alltag",
    text: "Profitiere von Materialien, Ideen und gemeinsamen Projekten.",
    icon: <ToolboxIcon />,
  },
  {
    titel: "Gemeinsam etwas bewegen",
    text: "Hilf mit, Kindertagespflege in Dresden stärker sichtbar zu machen.",
    icon: <RocketIcon />,
  },
];

export default function UeberUnsPage() {
  return (
    <main>
      <HeroSection />
      <WerWirSindSection />
      <VorstandSection />
      <AlbertSection />
      <WerteSection />
      <MitgliedWerdenSection />
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
      <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-20 pt-10 md:pt-14">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12 items-center">
          <div>
            <Breadcrumb current="Über uns" />
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-8 md:mt-10 mb-6">
              Über uns
            </h1>
            <p className="flex items-center gap-3 italic text-text-soft text-xl md:text-2xl mb-8">
              <Image
                src="/images/hero/herzapricot.png"
                alt=""
                width={1536}
                height={1024}
                aria-hidden
                className="w-28 md:w-32 h-auto select-none"
              />
              Gemeinsam stark für die Kleinsten unserer Stadt.
            </p>
            <p className="text-lg text-text-soft leading-relaxed max-w-xl">
              Wir sind der <strong>Dresdner Tages Eltern e.V.</strong> und setzen
              uns dafür ein, Kindertagespflege in Dresden sichtbarer,
              verständlicher und besser vernetzt zu machen. Mit viel Herz,
              Erfahrung und Engagement möchten wir Familien bei der Suche nach
              einem geeigneten Betreuungsplatz unterstützen und
              Kindertagespflege in Dresden stärken.
            </p>
          </div>

          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm">
            <Image
              src="/images/vorstand/team.png"
              alt="Der Vorstand des Dresdner Tages Eltern e.V. mit Maskottchen Albert"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Breadcrumb({ current }: { current: string }) {
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
          {current}
        </li>
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Wer wir sind                                                    */
/* ------------------------------------------------------------------ */

function WerWirSindSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-3xl px-4 py-20 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          Wer wir sind
        </h2>
        <p className="text-lg text-text-soft leading-relaxed">
          Unser Verein besteht aus engagierten Tageseltern, die gemeinsam etwas
          bewegen möchten. Wir möchten zeigen, wie wertvoll Kindertagespflege
          für Kinder und Familien ist. Dabei geht es uns um Sichtbarkeit,
          Austausch, Unterstützung und eine starke Gemeinschaft.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Vorstand                                                        */
/* ------------------------------------------------------------------ */

type VorstandPerson = {
  name: string;
  rolle: string;
  initial: string;
  farbe: string;
  text: string;
  foto?: string;
};

function VorstandSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Unser Vorstand
          </h2>
          <p className="text-text-soft text-lg max-w-2xl mx-auto">
            Vier Menschen, ein Ziel: Kindertagespflege in Dresden stärken.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VORSTAND.map((p) => (
            <VorstandKarte key={p.name + p.rolle} person={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VorstandKarte({ person }: { person: VorstandPerson }) {
  return (
    <Card className="flex flex-col items-center text-center gap-4 h-full overflow-hidden">
      <div
        className={`relative aspect-square -mx-6 -mt-6 w-[calc(100%+3rem)] overflow-hidden rounded-t-2xl ${person.farbe}`}
      >
        {person.foto ? (
          <Image
            src={person.foto}
            alt={`Portrait von ${person.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-extrabold text-text/40 select-none">
              {person.initial}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-extrabold">{person.name}</p>
        <p className="text-sm font-semibold text-korallenrot">{person.rolle}</p>
      </div>
      <p className="text-text-soft text-sm leading-relaxed flex-1">
        {person.text}
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Albert, das Maskottchen                                         */
/* ------------------------------------------------------------------ */

function AlbertSection() {
  return (
    <section className="bg-sonnengelb relative overflow-hidden">
      <Image
        src="/images/hero/herzapricot-transparent.png"
        alt=""
        width={400}
        height={280}
        className="hidden md:block absolute top-10 right-12 w-48 h-auto opacity-70 mix-blend-multiply select-none pointer-events-none"
        aria-hidden
      />
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-24 relative">
        <div className="rounded-3xl bg-white shadow-sm overflow-hidden">
          <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] items-center p-6 md:p-10">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-sonnengelb-hell flex items-center justify-center">
              <span
                className="text-8xl md:text-9xl select-none"
                role="img"
                aria-label="Pandabär"
              >
                🐼
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-korallenrot uppercase tracking-wide mb-2">
                Unser Maskottchen
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-5">
                Und dann gibt es noch Albert
              </h2>
              <p className="text-text-soft text-lg leading-relaxed">
                Albert ist unser Vereinsmaskottchen und sorgt auf Festen,
                Aktionen und Veranstaltungen immer für gute Laune. Er macht
                unseren Verein sichtbar, bringt Kinderaugen zum Leuchten und
                erinnert uns daran, dass Öffentlichkeitsarbeit auch fröhlich,
                nahbar und kindlich sein darf.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5 — Wofür wir stehen                                                */
/* ------------------------------------------------------------------ */

function WerteSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Wofür wir stehen
          </h2>
          <p className="text-text-soft text-lg max-w-2xl mx-auto">
            Diese vier Werte tragen unsere Vereinsarbeit jeden Tag.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WERTE.map((w) => (
            <Card
              key={w.titel}
              className="flex flex-col items-center text-center gap-4 h-full"
            >
              <span className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-sonnengelb text-text">
                {w.icon}
              </span>
              <h3 className="font-extrabold text-lg">{w.titel}</h3>
              <p className="text-text-soft text-sm leading-relaxed flex-1">
                {w.text}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6 — Mitglied werden                                                 */
/* ------------------------------------------------------------------ */

function MitgliedWerdenSection() {
  return (
    <section className="bg-korallenrot/15 relative overflow-hidden">
      <Image
        src="/images/hero/herzapricot-transparent.png"
        alt=""
        width={400}
        height={280}
        className="hidden md:block absolute bottom-12 left-10 w-56 h-auto opacity-60 mix-blend-multiply select-none pointer-events-none"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 relative">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-korallenrot uppercase tracking-wide mb-3">
            Mitglied werden
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5">
            Werde Teil unserer Gemeinschaft
          </h2>
          <p className="text-text-soft text-lg leading-relaxed">
            Unser Verein lebt von engagierten Tageseltern, die gemeinsam etwas
            bewegen möchten. Als Mitglied wirst du Teil eines starken
            Netzwerks, erhältst Unterstützung, Austausch und hilfst dabei,
            Kindertagespflege in Dresden sichtbarer zu machen.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {MITGLIEDS_VORTEILE.map((v) => (
            <Card
              key={v.titel}
              className="flex flex-col gap-3 h-full"
            >
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-korallenrot text-white">
                {v.icon}
              </span>
              <h3 className="font-extrabold text-lg">{v.titel}</h3>
              <p className="text-text-soft text-sm leading-relaxed flex-1">
                {v.text}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <LinkButton variant="primary" href="/mitglied-werden">
            Mitglied werden
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7 — Final CTA: Tageseltern finden                                   */
/* ------------------------------------------------------------------ */

function FinalCtaSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:p-12 shadow-sm">
          <Image
            src="/images/allgemein/frauenkirche.png"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 38vw, 0px"
            className="hidden md:block !left-auto !w-[38%] object-cover object-left pointer-events-none select-none [mask-image:linear-gradient(to_right,transparent_0%,black_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_45%)]"
          />
          <div className="relative md:max-w-[62%]">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Du möchtest mehr über Kindertagespflege erfahren?
            </h2>
            <p className="text-text-soft mb-6 leading-relaxed">
              Dann schau dich gern weiter auf unserer Website um. Hier findest
              du Informationen, freie Betreuungsplätze und Tageseltern in
              deiner Nähe.
            </p>
            <div className="flex flex-wrap gap-4">
              <LinkButton
                variant="primary"
                href="/kindertagespflege-finden"
              >
                Tageseltern finden
              </LinkButton>
              <LinkButton
                variant="secondary"
                href="/fuer-eltern/kindertagespflege"
              >
                Was ist Kindertagespflege?
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Inline-Icons (SVG)                                                  */
/* ------------------------------------------------------------------ */

function CommunityIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M2 19 c 1 -3 4 -4.5 6 -4.5 s 5 1.5 6 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 19 c .8 -2.4 3 -3.5 4.5 -3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12 s 4 -7 10 -7 s 10 7 10 7 s -4 7 -10 7 s -10 -7 -10 -7 z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function HandHeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11 s -2.5 -1.5 -2.5 -3.5 a 1.5 1.5 0 0 1 2.5 -1 a 1.5 1.5 0 0 1 2.5 1 c 0 2 -2.5 3.5 -2.5 3.5 z"
        fill="currentColor"
      />
      <path
        d="M4 15 c 0 -1 1 -2 2 -2 h 3 l 2 1 h 4 a 1.5 1.5 0 0 1 0 3 h -3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M4 15 v 4 c 0 1 1 2 2 2 h 9 c 2 0 6 -3 6 -5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 l 1.8 5.2 L 19 10 l -5.2 1.8 L 12 17 l -1.8 -5.2 L 5 10 l 5.2 -1.8 z"
        fill="currentColor"
      />
      <path
        d="M19 16 l .8 2 L 22 19 l -2.2 .8 L 19 22 l -.8 -2.2 L 16 19 l 2.2 -.8 z"
        fill="currentColor"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M2 19 c 1 -3 4 -4.5 6 -4.5 s 5 1.5 6 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 19 c .8 -2.4 3 -3.5 4.5 -3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 l 2.7 5.5 L 21 9.3 l -4.5 4.4 L 17.5 20 L 12 17 L 6.5 20 L 7.5 13.7 L 3 9.3 L 9.3 8.5 z"
        fill="currentColor"
      />
    </svg>
  );
}

function ToolboxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6 V 4 a 1 1 0 0 1 1 -1 h 4 a 1 1 0 0 1 1 1 v 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="6"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 12 h 18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 3 c 4 0 7 3 7 7 l -4 4 l -7 -7 z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 7 l 7 7 l -4 4 a 3 3 0 0 1 -4 0 l -3 -3 a 3 3 0 0 1 0 -4 z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 18 c -1 1 -1 3 -1 3 s 2 0 3 -1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

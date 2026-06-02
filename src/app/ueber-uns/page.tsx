import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Über uns",
  description:
    "Wir für Tageseltern – mit Herz, Erfahrung und Engagement. Lerne unseren Vorstand und unser Maskottchen Älbert kennen.",
});

type VorstandPerson = {
  name: string;
  rolle: string;
  initial: string;
  farbe: string;
  text: string;
  foto?: string;
  fotoClassName?: string;
};

const VORSTAND: VorstandPerson[] = [
  {
    name: "Dana Weiß",
    rolle: "Vorsitzende",
    initial: "D",
    farbe: "bg-sonnengelb-hell",
    foto: "/images/vorstand/dana.png",
    fotoClassName: "object-center",
    text: "Mit Herz und Leidenschaft für die Kindertagespflege und unseren Verein.",
  },
  {
    name: "Diana Schulze",
    rolle: "Vorsitzende",
    initial: "D",
    farbe: "bg-korallenrot/20",
    foto: "/images/vorstand/diana.png",
    text: "Mit Ideen, Worten und Herz gestaltet sie die Kommunikation unseres Vereins.",
  },
  {
    name: "Andrea Frühbing",
    rolle: "Kassenwart",
    initial: "A",
    farbe: "bg-sonnengelb-hell",
    foto: "/images/vorstand/andrea.png",
    fotoClassName: "object-center scale-125",
    text: "Mit Sorgfalt und Überblick kümmert sie sich um unsere Finanzen.",
  },
  {
    name: "Romy Weber",
    rolle: "Öffentlichkeitsarbeit",
    initial: "R",
    farbe: "bg-korallenrot/20",
    foto: "/images/vorstand/romy.png",
    text: "Sie macht unsere Arbeit\nonline sichtbar.",
  },
];

export default function UeberUnsPage() {
  return (
    <main>
      <HeroSection />
      <VorstandSection />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
          {/* Bild – rechts, oben bündig mit der Menüleiste */}
          <div className="md:order-2 -mx-4 md:mx-0">
            <div
              className="relative aspect-[15/8] md:aspect-[5/4] overflow-hidden md:rounded-b-3xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]"
            >
              <Image
                src="/images/vorstand/hero.png"
                alt="Der Vorstand des Dresdner Tages Eltern e.V."
                fill
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-right"
              />
            </div>
          </div>

          {/* Textspalte mit Breadcrumb oben */}
          <div className="md:order-1 pt-6 md:pt-12">
            <Breadcrumb current="Über uns" />
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-12 md:mt-16 mb-6">
              Über uns
            </h1>
            <p className="text-lg text-text-soft mb-4 max-w-xl leading-relaxed">
              Wir sind der <strong>Dresdner Tageseltern e.V.</strong> und
              setzen uns dafür ein, die Kindertagespflege in Dresden bekannter
              zu machen. Wir informieren Eltern, vernetzen Tageseltern und
              unterstützen Familien bei der Suche nach einem passenden
              Betreuungsplatz.
            </p>
            <p className="text-lg text-text-soft mb-6 max-w-xl leading-relaxed">
              Denn wir sind überzeugt: Eine gute Betreuung beginnt mit
              Vertrauen, Nähe und starken Beziehungen.
            </p>
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
/* Unser Vorstand                                                      */
/* ------------------------------------------------------------------ */

function VorstandSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-text text-center mb-12 md:mb-16">
          Unser Vorstand
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VORSTAND.map((p) => (
            <VorstandKarte key={p.name} person={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VorstandKarte({ person }: { person: VorstandPerson }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col items-center text-center gap-4">
      {/* Portrait-Kreis */}
      <div
        className={`relative aspect-square w-28 md:w-32 rounded-full overflow-hidden ${person.farbe} shadow-sm`}
      >
        {person.foto ? (
          <Image
            src={person.foto}
            alt={`Portrait von ${person.name}`}
            fill
            sizes="128px"
            className={`object-cover ${person.fotoClassName ?? "object-center"}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-extrabold text-text/40 select-none">
              {person.initial}
            </span>
          </div>
        )}
      </div>

      <p className="text-lg md:text-xl font-extrabold leading-tight">
        {person.name}
      </p>

      <p className="text-sm font-bold text-korallenrot leading-snug">
        {person.rolle}
      </p>

      {/* Beschreibung */}
      <p className="text-text-soft text-sm leading-relaxed whitespace-pre-line">
        {person.text}
      </p>
    </div>
  );
}


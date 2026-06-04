import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Über uns",
  description:
    "Wir für Tageseltern – mit Herz, Erfahrung und Engagement. Lerne unseren Vorstand und unser Maskottchen Albärt kennen.",
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
    foto: "/images/vorstand/dana.jpg",
    fotoClassName: "object-center",
    text: "Sie macht sich für die Bedürfnisse von Kindern, Familien und Tageseltern stark.",
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
    name: "Andrea Frübing",
    rolle: "Kassenwart",
    initial: "A",
    farbe: "bg-sonnengelb-hell",
    foto: "/images/vorstand/andrea.jpg",
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
      <MaskottchenSection />
      <CtaSection />
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
        <h2 className="relative text-3xl md:text-4xl font-extrabold leading-tight text-text text-center mb-12 md:mb-16">
          <span className="relative inline-block">
            <Image
              src="/images/hero/herzapricot.png"
              alt=""
              width={1536}
              height={1024}
              aria-hidden
              className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-24 md:w-32 h-auto select-none max-w-none"
            />
            Unser Vorstand
          </span>
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

/* ------------------------------------------------------------------ */
/* Maskottchen ALBERT                                                  */
/* ------------------------------------------------------------------ */

function MaskottchenSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 pt-40 pb-16 md:mt-0 md:pt-24 md:pb-20">
        <div className="relative rounded-2xl bg-sonnengelb-hell shadow-sm py-0 px-2 md:py-6 md:px-10 md:pl-[480px] max-h-[560px] md:max-h-none flex items-start md:items-start">
          <div className="hidden md:block absolute -left-8 bottom-0 w-[432px] h-[518px] pointer-events-none">
            <Image
              src="/images/vorstand/Albert1.png"
              alt="Maskottchen Albärt – ein Panda mit Albärt-Schal"
              fill
              className="object-contain object-bottom"
            />
          </div>
          <div className="flex flex-col md:flex-row items-end gap-8 md:gap-12">
            <div className="relative md:hidden w-[346px] h-[389px] flex-shrink-0 -ml-12 -mt-56">
              <Image
                src="/images/vorstand/Albert1.png"
                alt="Maskottchen Albärt – ein Panda mit Albärt-Schal"
                fill
                className="object-contain object-bottom"
              />
            </div>
            <div className="flex-1 text-center md:text-left pb-2 md:pb-0 relative md:-ml-24">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-text mb-6">
                  Hallo ich bin Albärt
                </h2>
                <p className="text-text-soft text-lg leading-relaxed">
                  Ich bin das Maskottchen des Dresdner Tageseltern e.V. und bei
                  vielen unserer Aktionen mit dabei.
                </p>
                <p className="text-text-soft text-lg leading-relaxed mt-3">
                  Ob bei Festen, Veranstaltungen oder Infoständen, ich sorge
                  für gute Laune, zaubere Kindern ein Lächeln ins Gesicht und
                  unterstütze den Verein dabei, die Kindertagespflege in Dresden
                  noch bekannter zu machen.
                </p>
              </div>
              <div className="hidden md:block absolute -right-16 top-0 w-48 h-48" style={{ transform: 'rotate(-85deg)' }}>
                <Image
                  src="/images/vorstand/stern.png"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VorstandKarte({ person }: { person: VorstandPerson }) {
  return (
    <div className="rounded-2xl bg-sonnengelb-hell p-6 shadow-sm flex flex-col items-center text-center gap-4">
      {/* Portrait-Kreis */}
      <div
        className={`relative aspect-square w-28 md:w-32 rounded-full overflow-hidden ${person.farbe} shadow-sm`}
      >
        {person.foto ? (
          <Image
            src={person.foto}
            alt={`Portrait von ${person.name}`}
            fill
            sizes="(max-width: 768px) 256px, 384px"
            quality={90}
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

/* ------------------------------------------------------------------ */
/* CTA Section                                                         */
/* ------------------------------------------------------------------ */

function CtaSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28">
        <div className="relative rounded-3xl bg-white p-8 md:p-12 shadow-sm text-left overflow-hidden">
          <div className="hidden md:block absolute bottom-0 right-0 w-1/2 h-40 opacity-20 pointer-events-none">
            <Image
              src="/images/vorstand/dresden-skyline.png"
              alt=""
              fill
              className="object-cover object-bottom object-right"
              aria-hidden
            />
          </div>
          <div className="relative z-10 md:z-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Schön, dass du da bist.
            </h2>
            <p className="text-text-soft text-lg mb-4">
              Jede Familie ist einzigartig und genauso individuell ist die Kindertagespflege.
            </p>
            <p className="text-text-soft text-lg mb-8">
              Lernen Sie Tagesmütter und Tagesväter in Ihrer Nähe kennen und finden Sie <br /> den passenden Betreuungsplatz für Ihr Kind.
            </p>
            <Link
              href="/kindertagespflege-finden"
              className="inline-block px-8 py-3 bg-korallenrot text-white font-bold rounded-full hover:bg-korallenrot/90 transition-colors"
            >
              Tageseltern finden
            </Link>
          </div>
          <div className="md:hidden relative w-[calc(100%+4rem)] h-32 -mx-8 -mb-8 mt-6 opacity-20 rounded-b-3xl overflow-hidden">
            <Image
              src="/images/vorstand/dresden-skyline.png"
              alt=""
              fill
              className="object-cover object-bottom object-center"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}


import Image from "next/image";
import Link from "next/link";
import { FinderClient } from "./FinderClient";

export const metadata = {
  title: "Kindertagespflege finden – Dresdner Tages Eltern e.V.",
  description:
    "Finde Tagesmütter und Tagesväter in Dresden auf der Karte. Mit Filter nach Beratungsstelle, freien Plätzen und gewünschtem Betreuungsbeginn.",
};

const IMAGES = {
  hero: "/images/hero/kartesuchen.png",
};

const MERKMALE = [
  { icon: "/images/icons/kleine-gruppe.png", label: "Kleine Gruppen" },
  { icon: "/images/icons/bezugsperson.png", label: "Feste Bezugsperson" },
  { icon: "/images/icons/feder.png", label: "Individuelle Betreuung" },
  { icon: "/images/icons/sparschwein.png", label: "Gleiche Kosten wie in Kita" },
];

export default function KindertagespflegeFindenPage() {
  return (
    <main className="bg-creme">
      <HeroSection />
      <FinderClient />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
          {/* Bild – oben bündig mit der Menüleiste (keine pt) */}
          <div className="md:order-2 -mx-4 md:mx-0">
            <div
              className="relative aspect-[3/4] md:aspect-[6/7] overflow-hidden md:rounded-b-3xl"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 20%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 20%)",
              }}
            >
              <Image
                src={IMAGES.hero}
                alt="Stilisierte Karte von Dresden mit eingezeichneten Tagespflegestellen"
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
              Finde liebevolle
              <br />
              Kindertagespflege
            </h1>
            <p className="text-lg text-text-soft mb-6 max-w-xl leading-relaxed">
              Entdecke Tageseltern in deiner Nähe und finde die Betreuung, die
              zu deinem Kind und eurer Familie passt.
            </p>
            <ul className="flex flex-col gap-0 mt-8">
              {MERKMALE.map((m) => (
                <li key={m.label} className="flex items-center gap-4">
                  <Image
                    src={m.icon}
                    alt=""
                    width={313}
                    height={313}
                    aria-hidden
                    className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
                  />
                  <span className="text-base md:text-lg">{m.label}</span>
                </li>
              ))}
            </ul>
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
          Kindertagespflege finden
        </li>
      </ol>
    </nav>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
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
      <Suspense fallback={null}>
        <FinderClient />
      </Suspense>
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
              className="relative aspect-[15/8] md:aspect-[4/3] overflow-hidden md:rounded-b-3xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]"
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
            <p className="mt-2 px-4 md:px-0 text-xs text-text-soft text-right">
              © SIMPLYMAPS.de | Geodaten: © OpenStreetMap-Mitwirkende
            </p>
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

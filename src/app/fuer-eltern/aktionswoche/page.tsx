import Image from "next/image";
import Link from "next/link";
import { existsSync } from "fs";
import path from "path";
import { LinkButton } from "@/components/ui/Button";
import { KaufparkCarousel } from "./KaufparkCarousel";
import { BolzplatzCarousel } from "./BolzplatzCarousel";

export const metadata = {
  title: "Aktionswoche Kindertagespflege – Dresdner Tages Eltern e.V.",
  description:
    "Jedes Jahr im Mai: Die Aktionswoche Kindertagespflege macht Familienpflege in Dresden sichtbar – mit bunten Aktionen, Begegnungen und Informationen für Familien.",
};

/**
 * Alle Bilder liegen unter public/images/aktionswoche/
 * Einfach die Dateien dort ablegen – Dateinamen entsprechen den Schlüsseln.
 * Fehlende Dateien werden automatisch als Platzhalter dargestellt.
 */
function resolveImg(relativePath: string): string | undefined {
  const fullPath = path.join(process.cwd(), "public", relativePath);
  return existsSync(fullPath) ? relativePath : undefined;
}

const IMG = {
  hero:              resolveImg("/images/aktionswoche/hero.jpg") ?? "/images/aktionswoche/hero.jpg",
  kaufpark1:         resolveImg("/images/aktionswoche/kaufpark-1.jpg") ?? "/images/aktionswoche/kaufpark-1.jpg",
  kaufpark2:         resolveImg("/images/aktionswoche/kaufpark-2.png") ?? "/images/aktionswoche/kaufpark-2.png",
  kaufpark3:         resolveImg("/images/aktionswoche/kaufpark3.jpg") ?? "/images/aktionswoche/kaufpark3.jpg",
  kaufpark4:         resolveImg("/images/aktionswoche/kaufpark-4.jpg") ?? "/images/aktionswoche/kaufpark-4.jpg",
  bolzplatzButton:   resolveImg("/images/aktionswoche/bolzplatz-button.png") ?? "/images/aktionswoche/bolzplatz-button.png",
  alaunPark1:        resolveImg("/images/aktionswoche/alaunpark-1.jpg"),
  alaunPark2:        resolveImg("/images/aktionswoche/alaunpark-2.jpg"),
  alaunPark3:        resolveImg("/images/aktionswoche/alaunpark-3.jpg"),
  haende:            resolveImg("/images/aktionswoche/haende.png"),        // Bunte bemalte Hände
  danke:             resolveImg("/images/aktionswoche/danke.png"),
};

/* ------------------------------------------------------------------ */
/* Seite                                                                */
/* ------------------------------------------------------------------ */

export default function AktionswochePage() {
  return (
    <main>
      <HeroSection />
      <RueckblickSection />
      <BolzplatzSection />
      <AlaunparkSection />
      <DankesSection />
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
          <div className="md:order-2 relative">
            <div className="relative aspect-[4/3] md:aspect-square overflow-hidden md:rounded-b-3xl">
              <Image
                src={IMG.hero}
                alt="Kind pustet Seifenblasen – fröhliche Stimmung bei der Aktionswoche Kindertagespflege in Dresden"
                fill
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center md:object-left"
              />
              {/* Mobil: Bild blendet unten in den Sektionshintergrund über */}
              <div
                className="absolute inset-0 pointer-events-none md:hidden"
                style={{ background: "linear-gradient(to bottom, transparent 75%, #fef2c2 100%)" }}
              />
              {/* Desktop: Bild blendet von links ein (Text-Seite hin) */}
              <div
                className="absolute inset-0 pointer-events-none hidden md:block"
                style={{ background: "linear-gradient(to right, #fef2c2 0%, transparent 20%)" }}
              />
            </div>

            {/* Gelber Kreis */}
            <div className="hidden md:flex absolute md:-bottom-10 md:-right-8 md:w-52 md:h-52 rounded-full bg-sonnengelb flex items-center justify-center text-center shadow-md z-10 px-5 md:px-8">
              <p className="italic text-text-soft leading-snug text-xs md:text-sm">
                Kindertagespflege soll bekannter werden. Viele Familien wissen noch gar nicht, dass es diese Betreuungsform gibt.
              </p>
            </div>
          </div>

          {/* Textspalte */}
          <div className="md:order-1 pt-6 md:pt-16">
            <Breadcrumb />

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-10 md:mt-16 mb-5">
              <span className="block">Aktionswoche</span>
              <span className="block">Kindertagespflege</span>
            </h1>

            <p className="text-text-soft leading-relaxed max-w-xl mb-3">
              Mit kleinen und großen Aktionen zeigen Tageseltern, Familien und
              Unterstützer:innen, wie wertvoll Kindertagespflege für Kinder,
              Eltern und unsere Stadt ist.
            </p>
            <p className="font-bold text-lg max-w-xl">
              Kindertagespflege muss sichtbar werden!
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
        <li>
          <Link
            href="/fuer-eltern"
            className="hover:text-korallenrot transition-colors"
          >
            Für Eltern
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li className="text-text font-medium" aria-current="page">
          Aktionswoche
        </li>
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Rückblick                                                        */
/* ------------------------------------------------------------------ */

function RueckblickSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        {/* Divider mit Titel */}
        <div className="relative flex items-center gap-4 mb-16 md:mb-20">
          <div className="flex-1 border-t border-text/15" />
          <h2 className="font-extrabold text-base md:text-lg tracking-[0.2em] uppercase shrink-0 px-2 text-text">
            Rückblick 2026
          </h2>
          <div className="flex-1 border-t border-text/15" />
        </div>

        {/* Event-Abschnitte */}
        <div className="space-y-16 md:space-y-24">
          <KaufparkEvent />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Bolzplatz (eigener Abschnitt, Hintergrund wie Hero)             */
/* ------------------------------------------------------------------ */

function BolzplatzSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <BolzplatzEvent />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Alaunpark                                                        */
/* ------------------------------------------------------------------ */

function AlaunparkSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <AlaunparkEvent />
      </div>
    </section>
  );
}

/* Kaufpark ----------------------------------------------------------- */

function KaufparkEvent() {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-end">
      {/* Gruppenfoto links – schmaler Fade rechts (Desktop) */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={IMG.kaufpark1}
          alt="Gruppenfoto – Familienaktion am Kaufpark"
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover"
        />
        {/* Desktop: rechter Rand blendet in den Sektionshintergrund über */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{ background: "linear-gradient(to right, transparent 88%, #fdf7e3 100%)" }}
        />
      </div>

      {/* Rechte Spalte: drei kleine Fotos + Text */}
      <div className="flex flex-col gap-4 pb-8 min-w-0">
        <KaufparkCarousel />

        {/* Text */}
        <h3 className="text-2xl md:text-3xl font-bold leading-tight text-text mt-4">
          Große Familienaktion am Kaufpark
        </h3>
        <p className="text-text-soft leading-relaxed">
          Ein buntes Highlight war unsere Aktion am Kaufpark. Mit
          Karussellfahrten und vielen gelben Kindern und Tageseltern konnten
          Familien Kindertagespflege ganz unkompliziert kennenlernen.
        </p>
      </div>
    </div>
  );
}

/* Bolzplatz ---------------------------------------------------------- */

function BolzplatzEvent() {
  return (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center">
      {/* Text */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold leading-tight text-text mb-3">
          Aktion am Bolzplatz<br />in Löbtau
        </h3>
        <p className="text-text-soft leading-relaxed">
          Am Bolzplatz in Löbtau wurde es offiziell: Der
          Landtagsabgeordnete Felix Hitzig überreichte unserem Verein eine
          Spende über{" "}
          <strong className="text-korallenrot">500 Euro</strong>. Ein starkes
          Zeichen der Unterstützung für die Kindertagespflege in Dresden.
        </p>
      </div>

      {/* Foto-Galerie */}
      <BolzplatzCarousel />

      {/* bolzplatz-button.png – gleiche Höhe wie Carousel-Bilder (aspect-[3/4], halbe Spaltenbreite) */}
      <div className="flex items-center justify-center">
        <div className="relative aspect-square w-full max-w-[180px] md:max-w-[260px] rounded-2xl overflow-hidden shadow-sm">
          <Image
            src={IMG.bolzplatzButton}
            alt="Bolzplatz-Aktion – Schaltfläche"
            fill
            sizes="(max-width: 768px) 180px, 260px"
            quality={90}
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}

/* Alaunpark ---------------------------------------------------------- */

function AlaunparkEvent() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {/* 3 Bilder nebeneinander – mittleres im Querformat, gleiche Höhe */}
      <div className="flex flex-col sm:flex-row gap-5 md:gap-6 items-center sm:items-stretch justify-center">
        <AlaunparkImage
          src={IMG.alaunPark1}
          alt="Kinder in bunten Regenjacken spielen bei der Aktionswoche im Alaunpark"
          flex="sm:flex-1"
          aspect="aspect-square"
          sizes="(max-width: 640px) 80vw, 28vw"
        />
        <AlaunparkImage
          src={IMG.alaunPark2}
          alt="Aktionsstand im Regen bei der Aktionswoche im Alaunpark"
          flex="sm:flex-[1.6]"
          aspect="aspect-[8/5]"
          sizes="(max-width: 640px) 80vw, 45vw"
        />
        <AlaunparkImage
          src={IMG.alaunPark3}
          alt="Gemeinsame Aktion bei der Aktionswoche im Alaunpark"
          flex="sm:flex-1"
          aspect="aspect-square"
          sizes="(max-width: 640px) 80vw, 28vw"
        />
      </div>

      {/* Text mit Regenschirm-Icon links */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-20 md:gap-28 max-w-5xl mx-auto">
        <span
          aria-hidden
          className="block w-16 h-16 md:w-20 md:h-20 bg-korallenrot shrink-0"
          style={{
            maskImage: "url(/images/aktionswoche/regenschirm-icon1.png)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskImage: "url(/images/aktionswoche/regenschirm-icon1.png)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
          }}
        />
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl md:text-3xl font-bold leading-tight text-text">
            Nass, aber sichtbar im Alaunpark und Ostrapark
          </h3>
          <p className="text-text-soft leading-relaxed">
            Im Alaunpark fiel unsere Aktion wortwörtlich ins Wasser. Doch
            schlechtes Wetter gibt es nicht: Trotz Regen hatten wir eine schöne
            gemeinsame Zeit, wurden ordentlich nass und haben gezeigt, dass
            Engagement auch bei heftigen Regenschauern leuchten kann.
          </p>
        </div>
      </div>
    </div>
  );
}

function AlaunparkImage({
  src,
  alt,
  flex,
  aspect,
  sizes,
}: {
  src: string | undefined;
  alt: string;
  flex: string;
  aspect: string;
  sizes: string;
}) {
  return (
    <div
      className={`${flex} ${aspect} relative w-full max-w-[20rem] sm:max-w-none rounded-2xl overflow-hidden shadow-md`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-sonnengelb/30 flex items-center justify-center">
          <span className="text-text-soft text-sm italic">Foto folgt</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5 — Danke & CTAs                                                     */
/* ------------------------------------------------------------------ */

function DankesSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        {/* Dankesbox */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-text mb-4">
              Gemeinsam machen wir Kindertagespflege sichtbar.
            </h2>
            <p className="text-text-soft leading-relaxed mb-4">
              Ein herzliches Dankeschön an alle Tageseltern, Familien,
              Unterstützer:innen und Besucher:innen, die die Aktionswoche
              2026 möglich gemacht haben.
            </p>
            <p className="font-bold text-korallenrot">
              Auch im nächsten Mai sind wir wieder dabei.
            </p>
          </div>

          {/* Bild */}
          <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-sm">
            {IMG.danke ? (
              <Image
                src={IMG.danke}
                alt="Danke – Aktionswoche Kindertagespflege Dresden"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-sonnengelb/30 flex items-center justify-center">
                <span className="text-text-soft text-sm italic">Foto folgt</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA-Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <LinkButton
            href="/fuer-eltern/kindertagespflege"
            variant="primary"
            className="flex-1 justify-center gap-2"
          >
            <PeopleCtaIcon />
            Mehr über Kindertagespflege erfahren
          </LinkButton>
          <LinkButton
            href="/kindertagespflege-finden"
            variant="secondary"
            className="flex-1 justify-center gap-2"
          >
            <MapPinCtaIcon />
            Tageseltern in Dresden finden
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SVG-Icons                                                            */
/* ------------------------------------------------------------------ */


function HeartHandsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
        stroke="white"
        strokeWidth="1.8"
      />
      <path
        d="M6 22c1.5-1 3-1.5 4-2M18 22c-1.5-1-3-1.5-4-2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartWhiteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
        stroke="white"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PeopleCtaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 19c1-3.5 4-5 6-5s5 1.5 6 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 19c.8-2.8 3-4 4.5-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MapPinCtaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

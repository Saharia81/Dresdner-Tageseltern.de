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
  ersatzbetreuungIcon: "/images/kindertagespflege/kalende1.png",
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
              Kindertagespflege ist eine liebevolle und flexible
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
            <div className="md:self-center flex items-start gap-4 md:gap-6">
              <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                <Image
                  src={IMAGES.ersatzbetreuungIcon}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain"
                  aria-hidden
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                  Was passiert bei Urlaub oder Krankheit?
                </h2>
                <p className="text-text-soft text-lg leading-relaxed mb-6">
                  Kinder lernen ihre Ersatzbetreuung bereits vorab kennen und
                  werden auch im Vertretungsfall in vertrauter Atmosphäre
                  begleitet. So bleibt die Betreuung verlässlich und sicher.
                </p>
                <LinkButton variant="primary" href="/fuer-eltern/faq">
                  Mehr zur Ersatzbetreuung
                </LinkButton>
              </div>
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
              Im Haushalt der Tagespflegeperson oder in anderen geeigneten
              Räumen, immer in einer Umgebung, in der sich Kinder wohl und
              sicher fühlen.
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
                    className="h-20 w-auto object-contain"
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
                    className="h-20 w-auto object-contain"
                  />
                }
                label="In anderen geeigneten Räumlichkeiten"
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
              <LinkButton variant="primary" href="/fuer-eltern/faq">
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

function OrtItem({ icon, label }: { icon: React.ReactNode; label: string }) {
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

const VERGLEICH_ROWS = [
  {
    merkmal: "Gruppengröße",
    icon: <UsersIcon />,
    tagespflege: "Maximal 5 Kinder",
    kita: "Größere Gruppen",
  },
  {
    merkmal: "Bezugsperson",
    icon: <PersonIcon />,
    tagespflege: "Eine feste Bezugsperson",
    kita: "Wechselndes Personal",
  },
  {
    merkmal: "Atmosphäre",
    icon: <HeartIcon />,
    tagespflege: "Familiär und individuell",
    kita: "Mehr Kinder, mehr Reize",
  },
  {
    merkmal: "Betreuungsort",
    icon: <HouseIcon />,
    tagespflege: "Häusliche Umgebung oder kleine Räume",
    kita: "Kita-Gebäude",
  },
  {
    merkmal: "Kosten für Eltern",
    icon: <CoinIcon />,
    tagespflege: "Gleiche Elternbeiträge wie in der Kita",
    kita: "Gleiche Elternbeiträge",
  },
];

function VergleichSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Kindertagespflege und Kita im Vergleich
        </h2>

        {/* Desktop: Tabelle */}
        <div className="hidden md:block rounded-3xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sonnengelb">
                <th className="px-6 py-4 font-extrabold">&nbsp;</th>
                <th className="px-6 py-4 font-extrabold">Kindertagespflege</th>
                <th className="px-6 py-4 font-extrabold">Kita</th>
              </tr>
            </thead>
            <tbody>
              {VERGLEICH_ROWS.map((row, i) => (
                <tr
                  key={row.merkmal}
                  className={i % 2 === 0 ? "bg-white" : "bg-creme/40"}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-semibold text-text whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-sonnengelb text-text">
                        {row.icon}
                      </span>
                      {row.merkmal}
                    </span>
                  </th>
                  <td className="px-6 py-4 text-text-soft">
                    {row.tagespflege}
                  </td>
                  <td className="px-6 py-4 text-text-soft">{row.kita}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Karten-Layout pro Merkmal */}
        <div className="md:hidden grid gap-4">
          {VERGLEICH_ROWS.map((row) => (
            <Card key={row.merkmal} className="flex flex-col gap-3">
              <p className="flex items-center gap-3 font-extrabold">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-sonnengelb text-text">
                  {row.icon}
                </span>
                {row.merkmal}
              </p>
              <div className="grid gap-2">
                <div className="rounded-xl bg-creme/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-text-soft mb-1">
                    Kindertagespflege
                  </p>
                  <p className="text-sm">{row.tagespflege}</p>
                </div>
                <div className="rounded-xl bg-white border border-text/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-text-soft mb-1">
                    Kita
                  </p>
                  <p className="text-sm">{row.kita}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6 — FAQ                                                             */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "Für welches Alter ist Kindertagespflege?",
    a: "Bei uns werden Kinder im Alter von 0 bis 3 Jahren betreut – also genau in der Zeit, in der eine familiäre, ruhige Umgebung besonders wichtig ist.",
  },
  {
    q: "Wie viele Kinder werden betreut?",
    a: "Eine Tagespflegeperson betreut maximal 5 Kinder gleichzeitig. So bleibt genug Zeit für jedes einzelne Kind und es entstehen echte, vertrauensvolle Beziehungen.",
  },
  {
    q: "Welche Qualifikationen haben Tagespflegepersonen?",
    a: "Alle Tagespflegepersonen verfügen über eine pädagogische Qualifizierung nach dem bundesweit anerkannten Curriculum und besitzen eine Pflegeerlaubnis des Jugendamtes. Regelmäßige Fortbildungen sind verpflichtend.",
  },
  {
    q: "Wie sind die Betreuungszeiten?",
    a: "Die Betreuungszeiten werden individuell zwischen Eltern und Tagespflegeperson abgestimmt. Dadurch lassen sich auch ungewöhnliche Arbeitszeiten oft gut abdecken.",
  },
  {
    q: "Was kostet Kindertagespflege?",
    a: "Die Elternbeiträge sind identisch mit denen einer Krippe oder Kita. Sie sind einkommensabhängig gestaffelt und werden durch die Landeshauptstadt Dresden bezuschusst – für Eltern entstehen also keine zusätzlichen Kosten.",
  },
  {
    q: "Wie finde ich eine passende Tagesmutter oder einen passenden Tagesvater?",
    a: "Über unsere Suche kannst du Tageseltern in deiner Nähe entdecken und siehst direkt, wer freie Plätze hat. Gerne unterstützen wir dich auch persönlich bei der Auswahl.",
  },
];

function FaqSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Häufige Fragen
        </h2>
        <div className="rounded-3xl bg-white shadow-sm divide-y divide-text/10 overflow-hidden">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Natives <details>-Element: zugänglich (Keyboard + Screenreader),
 * funktioniert ohne JavaScript, eignet sich daher gut für eine spätere
 * Übernahme nach WordPress / Elementor.
 */
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group">
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 hover:bg-creme/60 transition-colors">
        <span className="font-semibold text-base md:text-lg">{q}</span>
        <span
          aria-hidden
          className="inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-sonnengelb text-text transition-transform group-open:rotate-45"
        >
          <PlusIcon />
        </span>
      </summary>
      <div className="px-6 pb-6 text-text-soft leading-relaxed">{a}</div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* 7 — Final CTA                                                       */
/* ------------------------------------------------------------------ */

function FinalCtaSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-20 md:pb-24">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] items-center">
            <DresdenIllustration />

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Bereit, die passende Betreuung für dein Kind zu finden?
              </h2>
              <p className="text-text-soft mb-6">
                Wir sind gerne für dich da und unterstützen dich bei allen
                Fragen.
              </p>
              <div className="flex flex-wrap gap-4">
                <CtaButton
                  href="/kindertagespflege-finden"
                  label="Tageseltern finden"
                  hint="Freie Plätze entdecken"
                  variant="primary"
                />
                <CtaButton
                  href="/fuer-eltern"
                  label="Beratung für Eltern"
                  hint="Wir sind für dich da"
                  variant="secondary"
                />
              </div>
            </div>
          </div>

          <SkylineDecoration />
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
}: {
  href: string;
  label: string;
  hint: string;
  variant: "primary" | "secondary";
}) {
  const base =
    "flex flex-col items-start rounded-2xl px-5 py-3 transition-colors";
  const styles =
    variant === "primary"
      ? "bg-korallenrot text-white hover:bg-korallenrot-dunkel"
      : "bg-sonnengelb text-text hover:bg-sonnengelb/80";
  return (
    <Link href={href} className={`${base} ${styles}`}>
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

/**
 * Kleine Dresden-„Karten"-Illustration links im CTA: stilisierter
 * Elbbogen mit Pins. Reines SVG → keine Bildabhängigkeit.
 */
function DresdenIllustration() {
  return (
    <svg
      width="220"
      height="160"
      viewBox="0 0 220 160"
      fill="none"
      aria-hidden
      className="hidden md:block text-korallenrot"
    >
      <rect
        x="6"
        y="6"
        width="208"
        height="148"
        rx="20"
        fill="var(--color-sonnengelb-hell)"
      />
      <path
        d="M10 110 C 40 60, 90 120, 130 80 S 200 70, 215 95"
        stroke="var(--color-sonnengelb)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <g fill="currentColor">
        <circle cx="55" cy="75" r="6" />
        <circle cx="105" cy="60" r="6" />
        <circle cx="150" cy="85" r="6" />
        <circle cx="180" cy="100" r="6" />
      </g>
      <path
        d="M55 75 v 12 M105 60 v 12 M150 85 v 12 M180 100 v 12"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function SkylineDecoration() {
  return (
    <svg
      className="hidden lg:block absolute right-4 bottom-4 text-korallenrot opacity-70"
      width="260"
      height="60"
      viewBox="0 0 260 60"
      fill="none"
      aria-hidden
    >
      <path
        d="M0 50 L20 40 L30 45 L45 25 L55 30 L70 15 L82 30 L95 20 L110 40 L125 30 L140 35 L160 20 L175 30 L195 40 L215 30 L235 40 L260 35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M232 14 c -3 -4, -10 -4, -10 2 c 0 6, 10 10, 10 10 c 0 0, 10 -4, 10 -10 c 0 -6, -7 -6, -10 -2 z"
        fill="currentColor"
      />
    </svg>
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


function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20 c 1.5 -4 5 -5.5 7 -5.5 s 5.5 1.5 7 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20 s -7 -4.5 -7 -10 a 4 4 0 0 1 7 -2.6 a 4 4 0 0 1 7 2.6 c 0 5.5 -7 10 -7 10 z"
        fill="currentColor"
      />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11 L 12 4 L 20 11 V 20 H 4 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 10 h 5 a 2 2 0 0 1 0 4 h -4 a 2 2 0 0 0 0 4 h 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

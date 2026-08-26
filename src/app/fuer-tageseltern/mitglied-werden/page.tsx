import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mitglied werden",
  description:
    "Tagesmütter und Tagesväter in Dresden: Werde Mitglied bei den Dresdner Tages Eltern e.V. Mitgliedsantrag, Satzung und Beitragsordnung hier als PDF herunterladen.",
});

/* Statische Dateien liegen in public/downloads und werden bewusst nicht über
   next/link ausgeliefert, sondern über ein einfaches <a>. */
const DOWNLOAD_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors bg-korallenrot text-white hover:bg-korallenrot-dunkel";

export default function MitgliedWerdenPage() {
  return (
    <main>
      <HeroSection />
      <VorteileSection />
      <BeitragSection />
      <AblaufSection />
      <DownloadsSection />
      <KontaktCtaSection />
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
          {/* Bild – rechts, oben bündig mit der Menüleiste */}
          <div className="md:order-2 -mx-4 md:mx-0">
            <div className="relative aspect-[3/4] md:aspect-[5/6] overflow-hidden md:rounded-b-3xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]">
              <Image
                src="/images/allgemein/mitglied-werden-hero.png"
                alt="Zwei Tagesmütter sitzen am Tisch und füllen gemeinsam den Mitgliedsantrag aus"
                fill
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Textspalte mit Breadcrumb oben */}
          <div className="md:order-1 pt-6 md:pt-12">
            <Breadcrumb />

            <p className="text-korallenrot font-semibold text-lg mt-12 md:mt-16 mb-3">
              Für Tagesmütter &amp; Tagesväter
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Gemeinsam stark für die Kleinsten unserer Stadt
            </h1>
            <p className="text-lg text-text-soft leading-relaxed max-w-xl">
              Viele Eltern in Dresden suchen einen Kitaplatz und wissen gar
              nicht, dass es die Kindertagespflege gibt. Genau das wollen wir
              ändern. Wir machen diese Betreuungsform bekannter, damit Eltern
              die Wahl haben und damit deine Plätze belegt sind. Je mehr wir
              sind, desto mehr können wir bewegen. Werde Mitglied und unterstütze
              uns dabei.
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
            href="/fuer-tageseltern"
            className="hover:text-korallenrot transition-colors"
          >
            Für Tageseltern
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li className="text-text font-medium" aria-current="page">
          Mitglied werden
        </li>
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Vorteile                                                         */
/* ------------------------------------------------------------------ */

const VORTEILE = [
  {
    titel: "Kindertagespflege bekannter machen",
    text: "Unser wichtigstes Anliegen: Eltern in Dresden sollen wissen, dass es neben der Kita noch eine andere Betreuungsform gibt. Dafür sind wir mit Flyern, Aktionen und der Aktionswoche im Mai unterwegs.",
    icon: <MegafonIcon />,
  },
  {
    titel: "Dein eigener Steckbrief",
    text: "Du erscheinst mit Foto, Stadtteil und freien Plätzen in unserer Tageseltern-Suche. Eltern finden dich dort direkt auf der Karte.",
    icon: <KarteIcon />,
    link: { href: "/kindertagespflege-finden", label: "Zur Tageseltern-Suche" },
  },
  {
    titel: "Banner kostenfrei ausleihen",
    text: "Du hast einen Platz frei? Leih dir eines unserer Werbebanner für den Zaun. Über den QR-Code kommen Eltern direkt zu deinem Steckbrief.",
    icon: <BannerIcon />,
    link: { href: "/fuer-mitglieder/banner-buchen", label: "Banner ansehen" },
  },
];

function VorteileSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Warum Mitglied werden?
          </h2>
          <p className="text-korallenrot font-semibold text-lg mt-1">
            Was du davon hast.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VORTEILE.map((v) => (
            <VorteilKarte key={v.titel} {...v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VorteilKarte({
  titel,
  text,
  icon,
  link,
}: {
  titel: string;
  text: string;
  icon: React.ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sonnengelb-hell text-korallenrot">
        {icon}
      </span>
      <p className="font-extrabold text-lg leading-tight">{titel}</p>
      <p className="text-text-soft text-sm leading-relaxed flex-1">{text}</p>
      {link && (
        <Link
          href={link.href}
          className="text-korallenrot font-semibold text-sm hover:text-korallenrot-dunkel transition-colors"
        >
          {link.label} ›
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Beitrag                                                          */
/* ------------------------------------------------------------------ */

const STANDARD_LEISTUNGEN = [
  "Eigener Steckbrief in der Tageseltern-Suche",
  "Werbebanner kostenfrei ausleihen",
  "Netzwerktreffen und Ersatztagespflege",
  "Sichtbarkeit über Instagram und Presse",
];

function BeitragSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Was kostet die Mitgliedschaft?
          </h2>
          <p className="text-korallenrot font-semibold text-lg mt-1">
            Zwei Beiträge, ein Ziel.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm flex flex-col">
            <p className="text-korallenrot font-semibold">Für Tageseltern</p>
            <p className="font-extrabold text-xl mt-1">Standardmitgliedschaft</p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">10 €</span>
              <span className="text-text-soft">pro Monat</span>
            </p>
            <p className="text-text-soft text-sm mt-1">
              oder 120 € einmal im Jahr
            </p>
            <ul className="mt-6 space-y-2">
              {STANDARD_LEISTUNGEN.map((punkt) => (
                <li
                  key={punkt}
                  className="flex items-start gap-2 text-sm text-text-soft"
                >
                  <span className="mt-0.5 shrink-0 text-korallenrot">
                    <CheckIcon />
                  </span>
                  {punkt}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm flex flex-col">
            <p className="text-korallenrot font-semibold">
              Für Eltern und Fördernde
            </p>
            <p className="font-extrabold text-xl mt-1">
              Einfache Mitgliedschaft
            </p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">5 €</span>
              <span className="text-text-soft">pro Monat</span>
            </p>
            <p className="text-text-soft text-sm mt-1">
              oder 60 € einmal im Jahr
            </p>
            <p className="text-text-soft text-sm leading-relaxed mt-6">
              Für alle, die unsere Arbeit unterstützen möchten, ohne die
              Leistungen für Tageseltern zu nutzen. Steckbrief und Banner sind
              hier nicht enthalten. Dein Beitrag fließt trotzdem in die
              Öffentlichkeitsarbeit für die Kindertagespflege in Dresden.
            </p>
          </div>
        </div>

        <p className="text-text-soft text-sm leading-relaxed mt-6 max-w-3xl">
          Der Beitrag wird per SEPA-Lastschrift eingezogen. Das Mandat dafür ist
          Teil des Mitgliedsantrags. Alle Einzelheiten stehen in der
          Beitragsordnung.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Ablauf                                                           */
/* ------------------------------------------------------------------ */

const SCHRITTE = [
  {
    nummer: "1",
    titel: "Antrag herunterladen und ausfüllen",
    text: "Der Mitgliedsantrag ist ein ausfüllbares PDF. Du kannst ihn direkt am Rechner oder am Handy ausfüllen, ganz ohne Drucker.",
  },
  {
    nummer: "2",
    titel: "Unterschreiben",
    text: "Unterschreibe den Antrag mit dem Finger in einer PDF-App oder drucke ihn dafür aus. Die Einwilligung für Fotos auf Seite 2 gehört mit dazu.",
  },
  {
    nummer: "3",
    titel: "Per E-Mail an uns schicken",
    text: "Schick uns den unterschriebenen Antrag an info@dresdner-tageseltern.de. Wir melden uns bei dir und nehmen dich auf.",
  },
];

function AblaufSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            So wirst du Mitglied
          </h2>
          <p className="text-korallenrot font-semibold text-lg mt-1">
            In drei Schritten.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SCHRITTE.map((s) => (
            <div
              key={s.nummer}
              className="rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-korallenrot text-white font-extrabold">
                {s.nummer}
              </span>
              <p className="font-extrabold text-lg leading-tight">{s.titel}</p>
              <p className="text-text-soft text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5 — Downloads                                                        */
/* ------------------------------------------------------------------ */

const DOKUMENTE = [
  {
    datei: "/downloads/mitgliedsantrag.pdf",
    titel: "Mitgliedsantrag",
    text: "Aufnahmeantrag mit SEPA-Lastschriftmandat und der Einwilligung für Fotos. Am Rechner und am Handy ausfüllbar.",
    hinweis: "Ausfüllbares PDF, 2 Seiten",
  },
  {
    datei: "/downloads/satzung.pdf",
    titel: "Satzung",
    text: "Zweck des Vereins, Rechte und Pflichten der Mitglieder, Aufbau und Organe des Vereins.",
    hinweis: "PDF",
  },
  {
    datei: "/downloads/beitragsordnung.pdf",
    titel: "Beitragsordnung",
    text: "Höhe der Beiträge, Fälligkeit und Einzug per Lastschrift.",
    hinweis: "PDF",
  },
];

function DownloadsSection() {
  return (
    <section style={{ backgroundColor: "#fdf7e3" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Unterlagen zum Herunterladen
          </h2>
          <p className="text-korallenrot font-semibold text-lg mt-1">
            Alles, was du für den Beitritt brauchst.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DOKUMENTE.map((d) => (
            <div
              key={d.datei}
              className="rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sonnengelb-hell text-korallenrot">
                <DokumentIcon />
              </span>
              <p className="font-extrabold text-lg leading-tight">{d.titel}</p>
              <p className="text-text-soft text-sm leading-relaxed flex-1">
                {d.text}
              </p>
              <p className="text-text-soft text-xs font-semibold uppercase tracking-wide">
                {d.hinweis}
              </p>
              <a
                href={d.datei}
                target="_blank"
                rel="noopener"
                className={DOWNLOAD_BUTTON + " w-full"}
              >
                <DownloadIcon />
                Herunterladen
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6 — Kontakt CTA                                                      */
/* ------------------------------------------------------------------ */

function KontaktCtaSection() {
  return (
    <section className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
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
            <p className="text-korallenrot font-semibold mb-3">
              Du bist dir noch nicht sicher?
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Sprich uns einfach an.
            </h2>
            <p className="text-text-soft mb-6 leading-relaxed">
              Ob Fragen zum Beitrag, zum Steckbrief oder zur Ersatztagespflege:
              Wir erzählen dir gern, was die Mitgliedschaft im Alltag bringt.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                variant="primary"
                href="mailto:info@dresdner-tageseltern.de"
                className="w-full sm:w-auto"
              >
                E-Mail schreiben
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */

function MegafonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KarteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BannerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4v17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5 5h13l-2.5 3.5L18 12H5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DokumentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 13h6M9 16.5h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4v10m0 0l-4-4m4 4l4-4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 18h14"
        stroke="currentColor"
        strokeWidth="1.9"
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

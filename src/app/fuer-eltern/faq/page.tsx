import Link from "next/link";

export const metadata = {
  title: "Häufige Fragen – Dresdner Tages Eltern e.V.",
  description:
    "Antworten auf die wichtigsten Fragen rund um die Kindertagespflege in Dresden.",
};

/* ------------------------------------------------------------------ */
/* Daten                                                                */
/* ------------------------------------------------------------------ */

function buildFaqs() {
  return [
    {
      iconBg: "bg-korallenrot/15",
      iconColor: "text-korallenrot",
      IconComponent: CalendarIcon,
      q: "Für welches Alter ist Kindertagespflege?",
      a: "Bei uns werden Kinder im Alter von 0 bis 3 Jahren betreut, also genau in der Zeit, in der eine familiäre, ruhige Umgebung besonders wichtig ist.",
    },
    {
      iconBg: "bg-sonnengelb/60",
      iconColor: "text-[#9a6a00]",
      IconComponent: PeopleGroupIcon,
      q: "Wie viele Kinder werden betreut?",
      a: "Eine Tagespflegeperson betreut maximal 5 Kinder gleichzeitig. So bleibt genug Zeit und Aufmerksamkeit für jedes einzelne Kind und es entstehen echte, vertrauensvolle Beziehungen.",
    },
    {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      IconComponent: CertificateIcon,
      q: "Welche Qualifikationen haben Tagespflegepersonen?",
      a: "Alle Tagespflegepersonen verfügen über eine pädagogische Qualifizierung nach dem bundesweit anerkannten Curriculum und besitzen eine Pflegeerlaubnis des Amtes für Kindertagesbetreuung. Regelmäßige Fortbildungen sind Pflicht.",
    },
    {
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      IconComponent: EuroIcon,
      q: "Was kostet Kindertagespflege?",
      a: "Die Elternbeiträge sind identisch mit denen einer Kita oder Krippe und richten sich nach dem Einkommen. Unter bestimmten Voraussetzungen kann der Beitrag reduziert werden. Die Landeshauptstadt Dresden bezuschusst die Kosten.",
    },
    {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      IconComponent: SearchHeartIcon,
      q: "Wie finde ich eine passende Tagespflegeperson?",
      a: "Über unsere Suche kannst du Tageseltern in deiner Nähe entdecken und siehst direkt, wer freie Plätze hat. Einfach PLZ oder Stadtteil eingeben und passende Angebote in ganz Dresden entdecken.",
    },
    {
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      IconComponent: SwapIcon,
      q: "Was passiert bei Urlaub oder Krankheit?",
      a: "Kinder lernen ihre Ersatzbetreuung bereits vorab kennen. Im Vertretungsfall werden sie in vertrauter Atmosphäre begleitet – die Betreuung bleibt verlässlich und sicher, auch wenn die reguläre Tagespflegeperson verhindert ist.",
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Seite                                                                */
/* ------------------------------------------------------------------ */

export default function FaqPage() {
  const faqs = buildFaqs();

  return (
    <main className="relative bg-creme overflow-hidden">
      {/* Dekorative Blobs */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute -top-28 -left-28 w-80 h-80 rounded-full"
        style={{ backgroundColor: "rgba(248,121,108,0.13)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-28 -right-28 w-96 h-96 rounded-full"
        style={{ backgroundColor: "rgba(248,121,108,0.10)" }}
      />

      <div className="relative mx-auto max-w-2xl px-4 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Brotkrumen-Navigation" className="mb-10 text-sm text-text-soft">
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
              Häufige Fragen
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-12">
          <HeartWithRaysIcon />
          <h1 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4">Häufige Fragen</h1>
          <p className="text-text-soft text-lg max-w-sm leading-relaxed">
            Antworten auf die wichtigsten Fragen rund um die Kindertagespflege.
          </p>
        </div>

        {/* FAQ-Karten */}
        <div className="space-y-4">
          {faqs.map((item) => (
            <FaqCard key={item.q} {...item} />
          ))}
        </div>

        {/* Noch Fragen? */}
        <div className="mt-6">
          <NochFragenCard />
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ-Karte (natives <details> – kein JS nötig)                       */
/* ------------------------------------------------------------------ */

function FaqCard({
  iconBg,
  iconColor,
  IconComponent,
  q,
  a,
}: {
  iconBg: string;
  iconColor: string;
  IconComponent: () => React.JSX.Element;
  q: string;
  a: string;
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
        <span className="flex-1 font-bold text-base md:text-lg text-text leading-snug">
          {q}
        </span>

        {/* +  →  × beim Öffnen */}
        <span
          aria-hidden
          className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full border-2 border-korallenrot text-korallenrot transition-transform duration-200 group-open:rotate-45"
        >
          <PlusIcon />
        </span>
      </summary>

      {/* Antwort – eingerückt bündig mit der Frage */}
      <div className="px-5 pb-6 pt-1 text-text-soft leading-relaxed text-[0.95rem]">
        <div className="pl-16">{a}</div>
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Noch Fragen?                                                         */
/* ------------------------------------------------------------------ */

function NochFragenCard() {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl p-5"
      style={{ backgroundColor: "#fdf0d0" }}
    >
      {/* Glühbirnen-Icon */}
      <span
        className="inline-flex w-12 h-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f5a623" }}
      >
        <LightbulbIcon />
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-text text-lg leading-tight">Noch Fragen?</p>
        <p className="text-text-soft text-sm mt-0.5">
          Wir sind gerne für euch da und helfen euch weiter.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/kontakt"
        className="inline-flex items-center gap-2 rounded-full border-2 border-korallenrot text-korallenrot px-5 py-2.5 font-semibold text-sm hover:bg-korallenrot hover:text-white transition-colors whitespace-nowrap"
      >
        <ChatBubbleIcon />
        Kontakt aufnehmen
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SVG-Icons                                                            */
/* ------------------------------------------------------------------ */

/** Herz mit Strahlenkranz – Header-Deko */
function HeartWithRaysIcon() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden>
      {/* Strahlen */}
      {[
        [27, 3, 27, 8],
        [27, 46, 27, 51],
        [3, 27, 8, 27],
        [46, 27, 51, 27],
        [9, 9, 12.5, 12.5],
        [41.5, 41.5, 45, 45],
        [45, 9, 41.5, 12.5],
        [9, 45, 12.5, 41.5],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#f8796c"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
      {/* Herz */}
      <path
        d="M27 42 C27 42 12 32 12 21 A8.5 8.5 0 0 1 27 16.5 A8.5 8.5 0 0 1 42 21 C42 32 27 42 27 42Z"
        stroke="#f8796c"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Kalender mit Punkten */
function CalendarIcon() {
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
function PeopleGroupIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
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

/** Zertifikat / Qualifikation */
function CertificateIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 8h6M7 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M16 22l2-2.5 2 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Euro-Zeichen */
function EuroIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 6.5A7 7 0 1 0 17 17.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M5 10h9M5 14h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Suche mit Herz */
function SearchHeartIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M11 14.5s-3-1.8-3-4.2a2.1 2.1 0 0 1 3-1.9 2.1 2.1 0 0 1 3 1.9c0 2.4-3 4.2-3 4.2z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Vertretung / Wechsel */
function SwapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h13M13 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 17H7M11 13l-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Plus (dreht sich zum × beim Öffnen) */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Glühbirne (weiß auf orangem Kreis) */
function LightbulbIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 21h6M12 3a6 6 0 0 1 4.6 9.9C15.4 14.3 15 15 15 16v1H9v-1c0-1-.4-1.7-1.6-3.1A6 6 0 0 1 12 3z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sprechblase für den Kontakt-Button */
function ChatBubbleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

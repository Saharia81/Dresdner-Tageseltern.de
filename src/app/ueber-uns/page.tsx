import Image from "next/image";

export const metadata = {
  title: "Über uns – Dresdner Tages Eltern e.V.",
  description:
    "Wer wir sind, was wir tun und wer hinter dem Verein Dresdner Tages Eltern e.V. steht.",
};

const VORSTAND = [
  { name: "Dana Weiß", rolle: "Vorsitzende" },
  { name: "Diana Schulze", rolle: "Vorsitzende" },
  { name: "Andrea Frübing", rolle: "Kassenwartin" },
  { name: "Romy Weber", rolle: "Website & Social Media" },
];

export default function UeberUnsPage() {
  return (
    <main>
      {/* Hero mit Slogan */}
      <section className="bg-sonnengelb">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Über uns</h1>
          <p className="text-xl md:text-2xl italic text-text-soft">
            „Gemeinsam stark für die Kleinsten unserer Stadt."
          </p>
        </div>
      </section>

      {/* Wer wir sind */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Wer wir sind</h2>
        <p className="text-lg leading-relaxed">
          Der Dresdner Tages Eltern e.&#8239;V. wurde im Jahr <strong>2025</strong> gegründet.
          Mittlerweile sind wir <strong>über 50 Mitglieder</strong> – Tagesmütter
          und Tagesväter, die sich gemeinsam für die Kindertagespflege in
          unserer Stadt einsetzen.
        </p>
      </section>

      {/* Unser Ziel */}
      <section className="bg-creme">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Unser Ziel</h2>
          <p className="text-lg leading-relaxed mb-4">
            Alle Dresdner Familien sollen wissen, dass es neben der Kinderkrippe
            auch die <strong>Kindertagespflege</strong> als liebevolle
            Betreuungsform gibt.
          </p>
          <p className="text-lg leading-relaxed">
            Gerade in geburtenschwachen Jahren ist es wichtig, Eltern über ihre
            Möglichkeiten aufzuklären. Die Kindertagespflege ist vielen noch
            nicht bekannt – genau daran arbeiten wir.
          </p>
        </div>
      </section>

      {/* Was wir tun */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Was wir tun</h2>
        <p className="text-lg leading-relaxed">
          Wir machen die Kindertagespflege in Dresden sichtbar – über
          Öffentlichkeitsarbeit, unseren Instagram-Kanal, diese Website und
          Flyer. Wir stellen unsere Arbeit vor, beantworten Fragen und
          vermitteln interessierte Eltern an unsere Mitglieder.
        </p>
      </section>

      {/* Vorstand */}
      <section className="bg-creme">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            Unser Vorstand
          </h2>

          {/* Gruppenfoto */}
          <figure className="mx-auto mb-10 max-w-2xl">
            <Image
              src="/images/vorstand/team.png"
              alt="Der Vorstand des Dresdner Tages Eltern e.V. mit Maskottchen Albärt"
              width={1672}
              height={941}
              className="w-full h-auto rounded-3xl shadow-md"
              priority
            />
            <figcaption className="text-center text-sm text-text-soft mt-3">
              Mit dabei: unser Maskottchen Albärt, ein freundlicher Pandabär.
            </figcaption>
          </figure>

          <div className="grid gap-6 sm:grid-cols-2">
            {VORSTAND.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl bg-white p-6 shadow-sm text-center"
              >
                <p className="text-lg font-bold">{p.name}</p>
                <p className="text-text-soft">{p.rolle}</p>
              </div>
            ))}
          </div>

          {/* Maskottchen */}
          <div className="mt-10 rounded-2xl bg-sonnengelb/50 p-6 md:p-8 text-center">
            <p className="text-xl font-bold mb-2">Und dann ist da noch Albärt</p>
            <p className="text-text-soft leading-relaxed">
              Unser Maskottchen, ein freundlicher Pandabär. Er ist immer mit
              dabei und sorgt bei den Kindern für gute Laune.
            </p>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Kontakt</h2>
        <p className="text-lg mb-2">
          Du hast Fragen oder möchtest mehr erfahren?
        </p>
        <a
          href="mailto:info@dresdner-tageseltern.de"
          className="text-lg font-semibold text-korallenrot hover:text-korallenrot-dunkel underline underline-offset-4"
        >
          info@dresdner-tageseltern.de
        </a>
      </section>
    </main>
  );
}

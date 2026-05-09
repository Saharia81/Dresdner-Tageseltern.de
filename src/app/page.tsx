import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-sonnengelb">
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Wärme. Geborgenheit. Vertrauen.
          </h1>
          <p className="text-lg md:text-xl text-text-soft mb-10 max-w-2xl mx-auto">
            Kindertagespflege in Dresden – kleine Gruppen, eine feste
            Bezugsperson, und ein liebevoller Start ins Leben.
          </p>
          <Link
            href="/fuer-eltern/tagesmutter-finden"
            className="inline-block rounded-full bg-korallenrot text-white px-8 py-4 font-semibold text-lg hover:bg-korallenrot-dunkel transition-colors"
          >
            Tagesmutter finden
          </Link>
        </div>
      </section>

      {/* Was ist Kindertagespflege? */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Was ist Kindertagespflege?
        </h2>
        <p className="text-text-soft text-lg leading-relaxed text-center">
          Inhalt folgt – kurze, emotionale Erklärung.
        </p>
      </section>

      {/* USPs */}
      <section className="bg-creme">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            Warum Kindertagespflege?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Kleine Gruppe (max. 5 Kinder)",
              "Eine feste Bezugsperson",
              "Ruhige Atmosphäre",
              "Starke Ersatzbetreuung",
              "Gleiche Kosten wie die Krippe",
              "Idealer Start ins Leben",
            ].map((usp) => (
              <div
                key={usp}
                className="rounded-2xl bg-white p-6 shadow-sm font-semibold"
              >
                {usp}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

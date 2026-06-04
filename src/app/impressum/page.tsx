export const metadata = {
  title: "Impressum – Dresdner Tageseltern e.V.",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-extrabold mb-2">Angaben gemäß § 5 TMG</h2>
          <p>
            Dresdner Tageseltern e.V.
            <br />
            Am Bahndamm 6
            <br />
            01189 Dresden
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            Vertreten durch den Vorstand
          </h2>
          <p>
            Dana Weiß
            <br />
            Diana Schulze
            <br />
            Andrea Frübing
            <br />
            Romy Weber
          </p>
          <p className="mt-3 text-text-soft">
            Der Verein wird gemäß seiner Satzung jeweils durch zwei
            Vorstandsmitglieder gemeinsam vertreten.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">Vereinsregister</h2>
          <p>Eingetragen im Vereinsregister.</p>
          <p className="mt-3">
            Registergericht: Amtsgericht Dresden
            <br />
            Registernummer: VR 14771
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">Kontakt</h2>
          <p>
            Telefon:{" "}
            <a href="tel:+4917680700466" className="underline">
              0176 80700466
            </a>
            <br />
            E-Mail:{" "}
            <a href="mailto:info@dresdner-tageseltern.de" className="underline">
              info@dresdner-tageseltern.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">Gemeinnützigkeit</h2>
          <p>
            Der Dresdner Tageseltern e.V. ist als gemeinnütziger Verein
            anerkannt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p>
            Romy Weber
            <br />
            Eibenstocker Straße 85
            <br />
            01277 Dresden
          </p>
        </section>
      </div>
    </main>
  );
}

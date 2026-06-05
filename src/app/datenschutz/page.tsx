export const metadata = {
  title: "Datenschutz – Dresdner Tageseltern e.V.",
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      <div className="space-y-8 leading-relaxed">
        <section>
          <p className="text-text-soft">
            Wir freuen uns über Ihr Interesse an unserem Verein. Der Schutz
            Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen.
            Nachfolgend informieren wir Sie gemäß Art. 13 und 14 der
            Datenschutz-Grundverordnung (DSGVO) über die Verarbeitung
            personenbezogener Daten auf dieser Website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            1. Verantwortlicher
          </h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p className="mt-3">
            Dresdner Tageseltern e.V.
            <br />
            Am Bahndamm 6
            <br />
            01189 Dresden
          </p>
          <p className="mt-3">
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
          <p className="mt-3 text-text-soft">
            Ein Datenschutzbeauftragter ist gesetzlich nicht vorgeschrieben und
            wurde nicht bestellt. Bei Fragen zum Datenschutz wenden Sie sich
            bitte an die oben genannte Adresse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            2. Aufruf der Website und Server-Logfiles
          </h2>
          <p>
            Beim Aufrufen unserer Website werden durch unseren Hosting-Anbieter
            automatisch Informationen erfasst und in sogenannten Server-Logfiles
            gespeichert. Dies sind insbesondere:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>aufgerufene Seite bzw. Datei</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>übertragene Datenmenge</li>
            <li>Browsertyp und -version</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer-URL (zuvor besuchte Seite)</li>
            <li>IP-Adresse des anfragenden Geräts</li>
          </ul>
          <p className="mt-3">
            Diese Daten sind technisch erforderlich, um Ihnen die Website
            anzuzeigen, die Stabilität und Sicherheit zu gewährleisten und
            Missbrauch abzuwehren. Rechtsgrundlage ist unser berechtigtes
            Interesse an einem sicheren und funktionsfähigen Internetauftritt
            (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">3. Hosting (Vercel)</h2>
          <p>
            Unsere Website wird bei der Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, USA, gehostet. Vercel verarbeitet in unserem
            Auftrag die oben genannten Server-Logdaten. Wir haben mit Vercel
            einen Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO)
            geschlossen.
          </p>
          <p className="mt-3">
            Eine Übermittlung von Daten in die USA kann nicht ausgeschlossen
            werden. Die Übermittlung erfolgt auf Grundlage der
            Standardvertragsklauseln der EU-Kommission. Rechtsgrundlage ist
            unser berechtigtes Interesse an einem zuverlässigen Bereitstellen
            der Website (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            4. Cookies und Tracking
          </h2>
          <p>
            Unsere Website setzt keine Cookies zu Analyse- oder Werbezwecken
            ein. Es findet keine Reichweitenmessung, kein Tracking und keine
            Profilbildung statt. Es werden keine Daten an Analyse- oder
            Werbedienste weitergegeben.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            5. Kartendarstellung (OpenStreetMap)
          </h2>
          <p>
            Zur Anzeige der Standorte unserer Tagesmütter binden wir
            Kartenmaterial von OpenStreetMap ein. Anbieter ist die OpenStreetMap
            Foundation (OSMF), St John’s Innovation Centre, Cowley Road,
            Cambridge, CB4 0WS, Vereinigtes Königreich.
          </p>
          <p className="mt-3">
            Wenn Sie eine Seite mit eingebundener Karte aufrufen, lädt Ihr
            Browser die benötigten Kartenkacheln direkt von den Servern von
            OpenStreetMap. Dabei wird Ihre IP-Adresse an OpenStreetMap
            übertragen. Auf den weiteren Umgang mit diesen Daten haben wir
            keinen Einfluss. Rechtsgrundlage ist unser berechtigtes Interesse an
            einer ansprechenden Darstellung der Standorte (Art. 6 Abs. 1 lit. f
            DSGVO).
          </p>
          <p className="mt-3 text-text-soft">
            Weitere Informationen finden Sie in der Datenschutzerklärung von
            OpenStreetMap:{" "}
            <a
              href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              wiki.osmfoundation.org/wiki/Privacy_Policy
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            6. Profile unserer Tagesmütter
          </h2>
          <p>
            Auf dieser Website veröffentlichen wir Profile (Steckbriefe)
            unserer Tagesmütter und -väter, etwa mit Name, Betreuungsort,
            freien Plätzen und – sofern eine Einwilligung vorliegt – einem Foto.
          </p>
          <p className="mt-3">
            Die Veröffentlichung erfolgt auf Grundlage der Einwilligung der
            betroffenen Person (Art. 6 Abs. 1 lit. a DSGVO). Eine erteilte
            Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen
            werden. Wenden Sie sich dazu an die oben genannten Kontaktdaten;
            das betreffende Profil wird dann von der Website entfernt.
          </p>
          <h3 className="text-lg font-bold mt-6 mb-2">
            Monatliche Aktualisierung der freien Plätze
          </h3>
          <p>
            Damit die angezeigten freien Betreuungsplätze aktuell bleiben,
            senden wir den Tagespflegepersonen einmal im Monat eine E-Mail mit
            der Bitte, ihre freien Plätze zu bestätigen oder anzupassen. Hierfür
            verarbeiten wir die E-Mail-Adresse der Tagespflegeperson, einen
            zufällig erzeugten Zugangs-Token (über den der persönliche
            Bestätigungslink ohne Passwort funktioniert), den Zeitpunkt der
            letzten Bestätigung sowie die von der Person angegebenen
            Monatsangaben zu freien Plätzen.
          </p>
          <p className="mt-3">
            Rechtsgrundlage ist die Durchführung des
            Mitgliedschaftsverhältnisses (Art. 6 Abs. 1 lit. b DSGVO) sowie
            unser berechtigtes Interesse an aktuellen Angaben auf der Website
            (Art. 6 Abs. 1 lit. f DSGVO). Reagiert eine Person nicht, werden
            lediglich ihre freien Plätze vorübergehend ausgeblendet; das Profil
            bleibt bestehen.
          </p>
          <p className="mt-3">
            Der Versand dieser E-Mails erfolgt über unseren Mail-Provider
            ALL-INKL.COM – Neue Medien Münnich, Hauptstraße 68, 02742
            Friedersdorf, mit dem ein Vertrag zur Auftragsverarbeitung (Art. 28
            DSGVO) besteht.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            7. Kontaktaufnahme
          </h2>
          <p>
            Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir
            die von Ihnen mitgeteilten Angaben (z. B. Name, Kontaktdaten,
            Inhalt der Anfrage), um Ihr Anliegen zu bearbeiten.
            Rechtsgrundlage ist unser berechtigtes Interesse an der Beantwortung
            Ihrer Anfrage (Art. 6 Abs. 1 lit. f DSGVO) bzw., wenn Ihre Anfrage
            auf den Abschluss oder die Durchführung einer Mitgliedschaft zielt,
            Art. 6 Abs. 1 lit. b DSGVO.
          </p>
          <p className="mt-3">
            Diese Daten löschen wir, sobald sie für die Bearbeitung nicht mehr
            erforderlich sind und keine gesetzlichen Aufbewahrungspflichten
            entgegenstehen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            8. Ihre Rechte
          </h2>
          <p>Nach der DSGVO stehen Ihnen folgende Rechte zu:</p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Auskunft über die zu Ihnen gespeicherten Daten (Art. 15)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16)</li>
            <li>Löschung Ihrer Daten (Art. 17)</li>
            <li>Einschränkung der Verarbeitung (Art. 18)</li>
            <li>Datenübertragbarkeit (Art. 20)</li>
            <li>
              Widerspruch gegen die Verarbeitung, soweit diese auf einem
              berechtigten Interesse beruht (Art. 21)
            </li>
            <li>
              Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft
              (Art. 7 Abs. 3)
            </li>
          </ul>
          <p className="mt-3">
            Zur Ausübung Ihrer Rechte genügt eine formlose Nachricht an die oben
            genannten Kontaktdaten.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            9. Beschwerderecht bei der Aufsichtsbehörde
          </h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
            über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
            Die für uns zuständige Aufsichtsbehörde ist:
          </p>
          <p className="mt-3">
            Die Sächsische Datenschutz- und Transparenzbeauftragte
            <br />
            Devrientstraße 5
            <br />
            01067 Dresden
            <br />
            <a
              href="https://www.saechsdsb.de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              www.saechsdsb.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">
            10. Aktualität dieser Erklärung
          </h2>
          <p>
            Diese Datenschutzerklärung wird angepasst, sobald sich die
            Datenverarbeitung auf unserer Website ändert. Es gilt jeweils die
            hier veröffentlichte aktuelle Fassung.
          </p>
        </section>
      </div>
    </main>
  );
}

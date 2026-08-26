// Fügt die beiden Antragsseiten zu einem ausfüllbaren PDF zusammen.
// Koordinaten stammen aus der Linienerkennung auf den gerenderten Seiten.
// Braucht pdf-lib: npm i pdf-lib (nicht Teil der Projekt-Abhängigkeiten).
// Aufruf aus diesem Ordner: node mitgliedsantrag-bauen.mjs ../../public/downloads/mitgliedsantrag.pdf
import { readFile, writeFile } from "node:fs/promises";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFName,
  PDFBool,
} from "pdf-lib";

const QUELLE = new URL(".", import.meta.url).pathname.slice(1);
const ZIEL = process.argv[2] ?? "mitgliedsantrag.pdf";

const FELD_HG = rgb(1, 0.976, 0.878); // sehr helles Gelb, damit Felder auffindbar sind
const FELD_TEXT = rgb(0.12, 0.1, 0.09);

// Seite 1 hat eine MediaBox mit y-Ursprung 7.83. Die Koordinaten unten stammen
// aus dem gerenderten Bild und rechnen ab 0, deshalb dieser Versatz.
const S1_VERSATZ_Y = 7.83;

/* Seite 1: Rechtecke sitzen in den bereits gedruckten Kästen. ------------- */
const S1_TEXT = [
  ["nachname", 48.5, 716.0, 141.5, 13.5],
  ["vorname", 200.5, 716.0, 141.5, 13.5],
  ["strasse", 48.5, 687.5, 141.5, 13.0],
  ["hausnummer", 200.5, 687.5, 141.5, 13.0],
  ["postleitzahl", 48.5, 658.5, 141.5, 13.0],
  ["ort", 200.5, 658.5, 141.5, 13.0],
  ["telefon", 48.5, 626.5, 141.5, 13.0],
  ["email", 200.5, 626.5, 141.5, 13.0],
  ["geburtsdatum", 48.5, 594.5, 141.5, 13.0],
  ["beitrittsdatum", 200.5, 594.5, 141.5, 13.0],
  ["sepa_kontoinhaber", 48.5, 384.0, 141.5, 13.5],
  ["sepa_strasse_hausnummer", 48.5, 354.0, 141.5, 13.0],
  ["sepa_plz_ort", 263.0, 354.0, 141.5, 13.0],
  ["sepa_kreditinstitut", 48.5, 324.0, 141.5, 13.0],
  ["sepa_bic", 263.0, 324.0, 141.5, 13.0],
  ["sepa_iban", 48.5, 286.0, 141.5, 13.0],
  ["sepa_datum_ort", 48.5, 259.0, 141.5, 13.5],
  ["antrag_datum_ort", 48.5, 57.0, 172.5, 13.5],
];

const S1_CHECK = [
  ["ist_kindertagespflegeperson", 62.0, 562.0, 14.0, 13.5],
  ["keine_kindertagespflegeperson", 213.5, 562.0, 14.5, 13.5],
  ["beitrag_standard_monatlich", 51.0, 442.5, 7.5, 8.0],
  ["beitrag_standard_jaehrlich", 51.0, 430.0, 7.5, 8.0],
  ["beitrag_einfach_monatlich", 51.0, 417.0, 7.5, 8.0],
  ["beitrag_einfach_jaehrlich", 51.0, 404.5, 7.5, 8.0],
];

/* Seite 2: Felder sitzen auf den Unterstrichen, Unterschrift bleibt frei. - */
const S2_TEXT = [
  ["foto_name", 130.0, 268.4, 398.0, 14.0],
  ["foto_vorname", 130.0, 224.4, 398.0, 14.0],
  ["foto_datum_ort", 130.0, 180.4, 154.0, 14.0],
];

const doc = await PDFDocument.create();
doc.setTitle("Mitgliedsantrag Dresdner Tageseltern e.V.");
doc.setSubject("Aufnahmeantrag mit SEPA-Lastschriftmandat und Foto-Einwilligung");
doc.setCreator("Dresdner Tageseltern e.V.");
doc.setProducer("Dresdner Tageseltern e.V.");

for (const datei of ["Mitgliedsantrag1.pdf", "Mitgliedsantrag2.pdf"]) {
  const quelle = await PDFDocument.load(await readFile(`${QUELLE}/${datei}`));
  const [seite] = await doc.copyPages(quelle, [0]);
  doc.addPage(seite);
}

const [seite1, seite2] = doc.getPages();
const form = doc.getForm();
const helvetica = await doc.embedFont(StandardFonts.Helvetica);

function textfeld(name, seite, [x, y, breite, hoehe], schrift = 10) {
  const feld = form.createTextField(name);
  feld.addToPage(seite, {
    x: x + 1.5,
    y: y + 1,
    width: breite - 3,
    height: hoehe - 2,
    font: helvetica,
    borderWidth: 0,
    backgroundColor: FELD_HG,
    textColor: FELD_TEXT,
  });
  feld.setFontSize(schrift);
  return feld;
}

function ankreuzfeld(name, seite, [x, y, breite, hoehe]) {
  const feld = form.createCheckBox(name);
  feld.addToPage(seite, {
    x: x + 1,
    y: y + 1,
    width: breite - 2,
    height: hoehe - 2,
    borderWidth: 0,
    backgroundColor: FELD_HG,
    textColor: rgb(0.85, 0.32, 0.28),
  });
  return feld;
}

const versetzt = ([x, y, b, h]) => [x, y + S1_VERSATZ_Y, b, h];

for (const [name, ...rect] of S1_TEXT) textfeld(name, seite1, versetzt(rect));
for (const [name, ...rect] of S1_CHECK) ankreuzfeld(name, seite1, versetzt(rect));
for (const [name, ...rect] of S2_TEXT) textfeld(name, seite2, rect);

// Damit auch Handy-Apps und Acrobat die Felder sicher darstellen
form.acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.True);
form.updateFieldAppearances(helvetica);

await writeFile(ZIEL, await doc.save());
console.log(
  `${ZIEL} geschrieben: ${doc.getPageCount()} Seiten, ` +
    `${form.getFields().length} Felder`,
);

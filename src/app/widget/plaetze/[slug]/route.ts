// Einbettbares Kästchen "Freie Plätze" für die eigene Website einer Tagesmutter.
//
//   GET /widget/plaetze/<slug>
//
// Liefert eine kleine, eigenständige HTML-Seite (ohne Kopf- und Fußzeile der
// Vereinsseite), die per <iframe> auf fremden Websites eingebunden werden darf.
// Die Daten kommen direkt aus der Datenbank, sind also immer so aktuell wie
// die letzte Bestätigung über die Monatsmail.
//
// Optionale Parameter:
//   ?hintergrund=transparent       → durchsichtiger Hintergrund
//   ?hintergrund=ffffff            → eigene Hintergrundfarbe (Hex ohne #)

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const SITE = "https://dresdner-tageseltern.de";

// Gleiche Darstellung wie im Steckbrief: MM/JJJJ
function monatJahr(d: Date): string {
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

function tagMonatJahr(d: Date): string {
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}

function hintergrundAus(param: string | null): string {
  if (param === "transparent") return "transparent";
  if (param && /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(param)) return `#${param}`;
  return "#fdf7e3";
}

function seite(inhalt: string, hintergrund: string): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Freie Plätze</title>
<style>
  @font-face {
    font-family: "Nunito";
    src: url("/fonts/nunito/Nunito-latin.woff2") format("woff2");
    font-weight: 400 800;
    font-display: swap;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: transparent; }
  body {
    font-family: "Nunito", system-ui, sans-serif;
    color: #2f2a26;
    padding: 4px;
  }
  .karte {
    background: ${hintergrund};
    border: 1px solid rgba(255, 222, 89, 0.4);
    border-radius: 16px;
    padding: 16px;
    ${hintergrund === "transparent" ? "" : "box-shadow: 0 1px 2px rgba(0,0,0,0.06);"}
  }
  .kopf { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .kopf svg { color: #f8796c; flex-shrink: 0; }
  h1 { font-size: 16px; font-weight: 800; }
  ul { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
  li {
    display: flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600;
    background: #fff;
    border: 1px solid rgba(255, 222, 89, 0.6);
    border-radius: 999px;
    padding: 4px 12px;
  }
  .punkt { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
  .leer { color: #5a534c; font-size: 14px; }
  .fuss {
    margin-top: 12px;
    display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 12px;
    font-size: 12px; color: #5a534c;
  }
  .fuss a { color: #e3625a; text-decoration: none; font-weight: 700; }
  .fuss a:hover { text-decoration: underline; }
</style>
</head>
<body>
<div class="karte">
${inhalt}
</div>
</body>
</html>`;
}

const HERZ = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z"/></svg>`;

function antwort(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Ausdrücklich erlauben, dass jede Website das Kästchen einbettet.
      "Content-Security-Policy": "frame-ancestors *",
      // 5 Minuten zwischenspeichern, damit fremde Seiten die DB nicht belasten.
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const hintergrund = hintergrundAus(
    new URL(request.url).searchParams.get("hintergrund"),
  );

  const tm = await prisma.tagesmutter.findUnique({
    where: { slug },
    include: { freiePlaetze: true },
  });

  if (!tm || !tm.istAktiv) {
    return antwort(
      seite(
        `<p class="leer">Zu dieser Tagespflegestelle sind gerade keine Angaben verfügbar.</p>`,
        hintergrund,
      ),
      404,
    );
  }

  const fp = tm.freiePlaetze;
  const daten = [fp?.platz1Ab, fp?.platz2Ab, fp?.platz3Ab, fp?.platz4Ab, fp?.platz5Ab]
    .filter((d): d is Date => d instanceof Date)
    .sort((a, b) => a.getTime() - b.getTime());

  const liste =
    daten.length === 0
      ? `<p class="leer">Aktuell sind alle Plätze belegt.</p>`
      : `<ul>${daten
          .map((d) => `<li><span class="punkt" aria-hidden="true"></span>${monatJahr(d)}</li>`)
          .join("")}</ul>`;

  const stand = tm.lastConfirmed ?? fp?.aktualisiertAm ?? null;

  const inhalt = `
  <div class="kopf">${HERZ}<h1>${daten.length === 0 ? "Freie Plätze" : "Freie Plätze ab:"}</h1></div>
  ${liste}
  <div class="fuss">
    <span>${stand ? `Stand: ${tagMonatJahr(stand)}` : ""}</span>
    <a href="${SITE}/kindertagespflege-finden" target="_blank" rel="noopener">Dresdner Tages Eltern e.V.</a>
  </div>`;

  return antwort(seite(inhalt, hintergrund));
}

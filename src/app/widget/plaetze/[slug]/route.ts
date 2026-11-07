// Einbettbares Kästchen "Freie Plätze" für die eigene Website einer Tagesmutter.
//
//   GET /widget/plaetze/<slug>
//
// Liefert eine kleine, eigenständige HTML-Seite (ohne Kopf- und Fußzeile der
// Vereinsseite), die per <iframe> auf fremden Websites eingebunden werden darf.
// Die Daten kommen direkt aus der Datenbank, sind also immer so aktuell wie
// die letzte Bestätigung über die Monatsmail.
//
// Standard: durchsichtiger Hintergrund, alles in einer Zeile (bricht auf
// schmalen Bildschirmen um).
//
// Optionaler Parameter:
//   ?hintergrund=ffffff            → eigene Hintergrundfarbe (Hex ohne #)

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Gleiche Darstellung wie im Steckbrief: MM/JJJJ
function monatJahr(d: Date): string {
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

function hintergrundAus(param: string | null): string {
  if (param && /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(param)) return `#${param}`;
  return "transparent";
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
  html, body { background: ${hintergrund}; }
  body {
    font-family: "Nunito", system-ui, sans-serif;
    color: #2f2a26;
    padding: 4px;
  }
  .zeile { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .kopf { display: flex; align-items: center; gap: 6px; }
  .kopf svg { color: #f8796c; flex-shrink: 0; }
  h1 { font-size: 16px; font-weight: 800; white-space: nowrap; }
  ul { list-style: none; display: contents; }
  li {
    display: flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600;
    background: #fff;
    border: 1px solid rgba(255, 222, 89, 0.6);
    border-radius: 999px;
    padding: 4px 12px;
  }
  .punkt { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
  .leer { font-size: 14px; }
</style>
</head>
<body>
<div class="zeile">
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

  const inhalt =
    daten.length === 0
      ? `<div class="kopf">${HERZ}<h1>Freie Plätze:</h1></div><p class="leer">Aktuell sind alle Plätze belegt.</p>`
      : `<div class="kopf">${HERZ}<h1>Freie Plätze ab:</h1></div><ul>${daten
          .map((d) => `<li><span class="punkt" aria-hidden="true"></span>${monatJahr(d)}</li>`)
          .join("")}</ul>`;

  return antwort(seite(inhalt, hintergrund));
}

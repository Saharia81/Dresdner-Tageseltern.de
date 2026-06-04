import sharp from "sharp";
import path from "path";

const SRC = path.join(process.cwd(), "Fotos", "icon wohnraum.png");
const OUT_DIR = path.join(process.cwd(), "public", "images", "icons");

const OUTPUTS = [
  "wohnraum-tagespflegeperson.png",
  "wohnraum-andere-raeume.png",
];

const PAD = 16;
const DARK_THRESHOLD = 230; // niedriger als das (RGB) = Inhalt

async function main() {
  const { data, info } = await sharp(SRC)
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Pro Spalte zählen, ob sie Inhalt enthält.
  const colHasContent = new Uint8Array(w);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const idx = (y * w + x) * 3;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      if (r < DARK_THRESHOLD || g < DARK_THRESHOLD || b < DARK_THRESHOLD) {
        colHasContent[x] = 1;
        break;
      }
    }
  }

  // Zusammenhängende Inhalt-Spalten zu "Gruppen" zusammenfassen.
  const groups: { start: number; end: number }[] = [];
  let current: { start: number; end: number } | null = null;
  for (let x = 0; x < w; x++) {
    if (colHasContent[x]) {
      if (current) current.end = x;
      else current = { start: x, end: x };
    } else if (current) {
      // Toleriere kleine Lücken innerhalb eines Icons (Innendetails).
      const gapAhead = (() => {
        let g = 0;
        for (let i = x; i < w && !colHasContent[i] && g < 30; i++) g++;
        return g;
      })();
      if (gapAhead >= 30) {
        groups.push(current);
        current = null;
      }
    }
  }
  if (current) groups.push(current);

  if (groups.length < 2) {
    throw new Error(`Erwartet 2 Icons, gefunden: ${groups.length}`);
  }
  // Die zwei breitesten Gruppen sind unsere Icons.
  groups.sort((a, b) => b.end - b.start - (a.end - a.start));
  const top = groups.slice(0, 2).sort((a, b) => a.start - b.start);
  console.log("Icon-Spalten:", top);

  for (let i = 0; i < 2; i++) {
    const { start: x0, end: x1 } = top[i];
    // Vertikale Bounding-Box innerhalb der Spalten finden.
    let minY = h;
    let maxY = -1;
    let minX = w;
    let maxX = -1;
    for (let y = 0; y < h; y++) {
      for (let x = x0; x <= x1; x++) {
        const idx = (y * w + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        if (r < DARK_THRESHOLD || g < DARK_THRESHOLD || b < DARK_THRESHOLD) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    const iw = maxX - minX + 1;
    const ih = maxY - minY + 1;

    // Tight crop ohne Quadrat-Padding, nur minimaler transparenter Rand.
    // So bleiben beide Icons visuell gleich groß, wenn sie per CSS auf die
    // gleiche Höhe gerendert werden.
    const outPath = path.join(OUT_DIR, OUTPUTS[i]);
    await sharp(SRC)
      .extract({ left: minX, top: minY, width: iw, height: ih })
      .extend({
        top: PAD,
        bottom: PAD,
        left: PAD,
        right: PAD,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outPath);
    console.log(`✓ ${OUTPUTS[i]}  (Icon ${iw}×${ih})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

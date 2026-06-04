import sharp from "sharp";
import path from "path";

const SRC = path.join(process.cwd(), "Fotos", "Pins für Steckbriefe.png");
const OUT_DIR = path.join(process.cwd(), "public", "images", "steckbrief");

// 3 Spalten × 2 Reihen, Bild ist 1536×1024 → jede Zelle ist 512×512.
const CELLS: { name: string; col: number; row: number }[] = [
  { name: "pin-adresse.png", col: 0, row: 0 },
  { name: "pin-oeffnungszeiten.png", col: 1, row: 0 },
  { name: "pin-verpflegung.png", col: 2, row: 0 },
  { name: "pin-ersatzbetreuung.png", col: 0, row: 1 },
  { name: "pin-anmeldung-website.png", col: 1, row: 1 },
  { name: "pin-beratungsstelle.png", col: 2, row: 1 },
];

const CELL_W = 512;
const CELL_H = 512;
// Ein Pixel zählt als Icon-Pixel, wenn mind. ein RGB-Kanal unter diesem
// Schwellwert liegt (Hintergrund ist nahezu reines Weiß).
const PIXEL_DARK_THRESHOLD = 240;
const PAD = 32; // transparenter Rahmen ums Icon

async function findIconBounds(buf: Buffer, w: number, h: number) {
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const r = buf[idx];
      const g = buf[idx + 1];
      const b = buf[idx + 2];
      if (
        r < PIXEL_DARK_THRESHOLD ||
        g < PIXEL_DARK_THRESHOLD ||
        b < PIXEL_DARK_THRESHOLD
      ) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

async function main() {
  for (const { name, col, row } of CELLS) {
    const outPath = path.join(OUT_DIR, name);

    // 1. Zelle ausschneiden, auf Weiß flatten und als Raw-RGB-Buffer auslesen.
    const cellBuf = await sharp(SRC)
      .extract({
        left: col * CELL_W,
        top: row * CELL_H,
        width: CELL_W,
        height: CELL_H,
      })
      .flatten({ background: "#ffffff" })
      .removeAlpha()
      .raw()
      .toBuffer();

    // 2. Bounding-Box des Icons in der Zelle bestimmen.
    const { minX, minY, maxX, maxY } = await findIconBounds(
      cellBuf,
      CELL_W,
      CELL_H,
    );
    if (maxX < 0) {
      console.warn(`⚠ ${name}: kein Icon in Zelle gefunden, überspringe`);
      continue;
    }
    const iconW = maxX - minX + 1;
    const iconH = maxY - minY + 1;

    // 3. Icon ausschneiden, mit Alpha versehen, quadratisch padden + Rand.
    const iconBuf = await sharp(SRC)
      .extract({
        left: col * CELL_W + minX,
        top: row * CELL_H + minY,
        width: iconW,
        height: iconH,
      })
      .toBuffer();

    const square = Math.max(iconW, iconH);
    const padX = Math.floor((square - iconW) / 2);
    const padY = Math.floor((square - iconH) / 2);

    await sharp(iconBuf)
      .extend({
        top: padY + PAD,
        bottom: square - iconH - padY + PAD,
        left: padX + PAD,
        right: square - iconW - padX + PAD,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outPath);

    console.log(`✓ ${name}  (Icon ${iconW}×${iconH})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

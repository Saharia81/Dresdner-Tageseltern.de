import sharp from "sharp";
import path from "path";

const SRC = path.join(process.cwd(), "Fotos", "logo tageseltern.png");
const OUT = path.join(process.cwd(), "public", "images", "logo-tageseltern.png");

const PAD = 12; // transparenter Rand
const DARK_THRESHOLD = 200; // dunkler als das (RGB) zählt als Inhalt

async function main() {
  const { data, info } = await sharp(SRC)
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Hintergrund ist gelb (hoher R, hoher G, niedriger B).
      // Inhalt = alles, was NICHT gelb-ähnlich ist (dunkle Linien, Text, ...).
      const isYellow = r > 220 && g > 200 && b < 160;
      if (!isYellow) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error("Kein Inhalt gefunden");
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  console.log(`Crop: ${cropW}×${cropH} (von ${w}×${h})`);

  await sharp(SRC)
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .extend({
      top: PAD,
      bottom: PAD,
      left: PAD,
      right: PAD,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    // Vom gelben Hintergrund zu Transparenz: alle Pixel ähnlich #ffde59
    // werden auf alpha=0 gesetzt. Sharp hat dafür nichts Built-In —
    // wir tun den Schritt unten manuell auf dem Raw-Buffer.
    .png()
    .toBuffer()
    .then(async (croppedBuf) => {
      const meta = await sharp(croppedBuf).metadata();
      const cw = meta.width!;
      const ch = meta.height!;
      const raw = await sharp(croppedBuf)
        .ensureAlpha()
        .raw()
        .toBuffer();
      // raw ist nun RGBA: ersetze gelbe Pixel durch transparent.
      for (let i = 0; i < raw.length; i += 4) {
        const r = raw[i];
        const g = raw[i + 1];
        const b = raw[i + 2];
        // gelb-ähnlich: hoher rot- und grün-Anteil, niedriger blau-Anteil
        if (r > 220 && g > 200 && b < 160) {
          raw[i + 3] = 0;
        }
      }
      await sharp(raw, { raw: { width: cw, height: ch, channels: 4 } })
        .png()
        .toFile(OUT);
    });

  console.log(`✓ ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

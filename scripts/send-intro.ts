// Versand der einmaligen Erstmail (Roll-out) an die Tagesmütter.
//
// Test an EINE Adresse (echter Token, echter Link):
//   npx tsx scripts/send-intro.ts test info@romyweber.de
//
// Versand an ALLE aktiven Tagesmütter (Sicherheits-Flag nötig):
//   npx tsx scripts/send-intro.ts alle --senden
//
// Ohne --senden zeigt "alle" nur an, wie viele es wären (Trockenlauf).

import "dotenv/config";
import { prisma } from "../src/lib/db";
import { buildIntroEmail, sendeMail } from "../src/lib/email";

function warte(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendeAn(tm: { vorname: string; email: string; emailToken: string }) {
  const mail = buildIntroEmail({ vorname: tm.vorname, emailToken: tm.emailToken });
  await sendeMail({ an: tm.email, ...mail });
}

async function main() {
  const modus = process.argv[2];

  if (modus === "test") {
    const email = process.argv[3];
    if (!email) {
      console.error("Bitte Adresse angeben: npx tsx scripts/send-intro.ts test <email>");
      process.exit(1);
    }
    const tm = await prisma.tagesmutter.findFirst({
      where: { email },
      select: { vorname: true, email: true, emailToken: true },
    });
    if (!tm) {
      console.error(`❌ Keine Tagesmutter mit E-Mail ${email} gefunden.`);
      process.exit(1);
    }
    await sendeAn(tm);
    console.log(`✅ Test-Erstmail an ${tm.vorname} <${tm.email}> versandt.`);
    return;
  }

  if (modus === "alle") {
    const bestaetigt = process.argv.includes("--senden");
    const alle = await prisma.tagesmutter.findMany({
      where: { istAktiv: true },
      select: { vorname: true, email: true, emailToken: true },
      orderBy: { reihenfolge: "asc" },
    });

    if (!bestaetigt) {
      console.log(`Trockenlauf: Es würden ${alle.length} Erstmails versandt.`);
      console.log(`Zum echten Versand erneut mit  --senden  ausführen.`);
      return;
    }

    let ok = 0;
    const fehler: string[] = [];
    for (const tm of alle) {
      try {
        await sendeAn(tm);
        ok++;
        console.log(`  ✓ ${tm.email}`);
        await warte(400);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        fehler.push(`${tm.email}: ${msg}`);
        console.error(`  ✗ ${tm.email}: ${msg}`);
      }
    }
    console.log(`\n✅ Fertig: ${ok} versandt, ${fehler.length} fehlgeschlagen.`);
    if (fehler.length) console.log("Fehler:\n" + fehler.join("\n"));
    return;
  }

  console.error("Modus fehlt. Nutze:  test <email>   oder   alle [--senden]");
  process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Sendet eine echte Testmail (Monatsaufforderung) an eine angegebene Adresse.
// Aufruf:  npx tsx scripts/send-test-email.ts info@romyweber.de

import "dotenv/config";
import { buildMonthlyEmail, sendeMail } from "../src/lib/email";

const an = process.argv[2];
if (!an) {
  console.error("Bitte Empfänger-Adresse angeben: npx tsx scripts/send-test-email.ts <email>");
  process.exit(1);
}

const heute = new Date();

const mail = buildMonthlyEmail({
  vorname: "Romy",
  emailToken: "test-token",
  plaetze: [
    { nr: 1, ab: new Date(heute.getFullYear(), heute.getMonth() + 1, 1) },
    { nr: 2, ab: new Date(heute.getFullYear(), heute.getMonth() + 2, 15) },
    { nr: 3, ab: null },
    { nr: 4, ab: null },
    { nr: 5, ab: null },
  ],
  heute,
});

sendeMail({ an, betreff: `[TEST] ${mail.betreff}`, html: mail.html, text: mail.text })
  .then(() => console.log(`Testmail versandt an ${an}`))
  .catch((err) => {
    console.error("Versand fehlgeschlagen:", err);
    process.exit(1);
  });

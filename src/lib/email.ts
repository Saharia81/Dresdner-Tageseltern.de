// E-Mail-Versand und HTML-Templates für die monatliche
// Plätze-Aktualisierung der Tagesmütter.
//
// SMTP-Konfiguration erfolgt über Umgebungsvariablen
// (siehe .env.example: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).

import nodemailer, { type Transporter } from "nodemailer";

const APP_URL = process.env.APP_URL ?? "https://dresdner-tageseltern.de";
const ABSENDER_NAME = "Dresdner Tageseltern e.V.";
// Absender getrennt vom SMTP-Login: bei manchen Hostern (z.B. All-Inkl) ist
// der SMTP-Benutzername ein interner Login (mXXXXXXX), nicht die Adresse.
const ABSENDER_EMAIL =
  process.env.SMTP_FROM ?? "plaetze@dresdner-tageseltern.de";

const DATUM_FORMAT = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const MONAT_JAHR_FORMAT = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});

// ----------------------------------------------------------------
// Transport
// ----------------------------------------------------------------

let _transporter: Transporter | null = null;

function transporter(): Transporter {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP-Konfiguration unvollständig. Bitte SMTP_HOST, SMTP_USER, SMTP_PASS in .env setzen.",
    );
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SMTPS für 465, STARTTLS für 587
    auth: { user, pass },
  });
  return _transporter;
}

export async function sendeMail(opts: {
  an: string;
  betreff: string;
  html: string;
  text: string;
}): Promise<void> {
  await transporter().sendMail({
    from: `"${ABSENDER_NAME}" <${ABSENDER_EMAIL}>`,
    to: opts.an,
    subject: opts.betreff,
    html: opts.html,
    text: opts.text,
  });
}

// ----------------------------------------------------------------
// Helfer
// ----------------------------------------------------------------

function formatDatum(d: Date | null | undefined): string | null {
  if (!d) return null;
  return DATUM_FORMAT.format(d);
}

function monatJahr(d: Date): string {
  return MONAT_JAHR_FORMAT.format(d);
}

// Plätze werden nur noch monatsgenau erfasst → "August 2026".
function formatMonat(d: Date | null | undefined): string | null {
  if (!d) return null;
  return MONAT_JAHR_FORMAT.format(d);
}

function plusTage(d: Date, tage: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + tage);
  return n;
}

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ----------------------------------------------------------------
// Layout für alle Mails (einheitlicher Stil)
// ----------------------------------------------------------------

function layout(inhalt: string, preheader = ""): string {
  const domain = APP_URL.replace(/^https?:\/\//, "");
  return `<!doctype html>
<html lang="de" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
  <title>Dresdner Tageseltern e.V.</title>
</head>
<body style="margin:0;padding:0;background:#fef2c2;font-family:Nunito,'Segoe UI',Arial,sans-serif;color:#2f2a26;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fef2c2;opacity:0;">${escape(preheader)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fef2c2;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 2px 8px rgba(47,42,38,0.08);">
        <tr><td style="background:#ffde59;padding:20px 32px;text-align:center;">
          <img src="${APP_URL}/images/logo-tageseltern.png" width="260" alt="Dresdner Tageseltern e.V." style="display:inline-block;width:100%;max-width:260px;height:auto;border:0;">
        </td></tr>
        <tr><td style="padding:32px 32px 28px;font-size:16px;line-height:1.65;color:#2f2a26;">
          ${inhalt}
        </td></tr>
        <tr><td style="padding:20px 32px 24px;background:#fef2c2;font-size:12px;line-height:1.6;color:#5a534c;text-align:center;">
          <strong style="color:#2f2a26;">Dresdner Tageseltern e.V.</strong><br>
          <a href="${APP_URL}" style="color:#5a534c;text-decoration:none;">${domain}</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:info@dresdner-tageseltern.de" style="color:#5a534c;text-decoration:none;">info@dresdner-tageseltern.de</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Outlook-fester ("bulletproof") Button mit VML-Fallback.
function button(href: string, text: string, farbe: string): string {
  const label = escape(text);
  return `<!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:340px;" arcsize="50%" stroke="f" fillcolor="${farbe}">
    <w:anchorlock/><center style="color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:bold;">${label}</center>
  </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
  <a href="${href}" style="display:inline-block;background:${farbe};color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;line-height:48px;padding:0 32px;border-radius:999px;">${label}</a>
  <!--<![endif]-->`;
}

// ----------------------------------------------------------------
// Plätze-Übersicht (gemeinsamer Block für Aufforderung + Erinnerung)
// ----------------------------------------------------------------

export type PlatzInfo = { nr: number; ab: Date | null };

function plaetzeBlockHtml(plaetze: PlatzInfo[]): string {
  const zeilen = plaetze
    .filter((p) => p.ab !== null)
    .map(
      (p) =>
        `<p style="margin:4px 0;"><strong>Platz ${p.nr}:</strong> ab ${formatMonat(p.ab)}</p>`,
    )
    .join("");
  return `<div style="background:#fef2c2;border-radius:12px;padding:16px 20px;margin:16px 0;">
      ${zeilen || `<p style="margin:0;color:#5a534c;">Aktuell sind keine freien Plätze eingetragen.</p>`}
    </div>`;
}

function plaetzeBlockText(plaetze: PlatzInfo[]): string {
  return (
    plaetze
      .filter((p) => p.ab !== null)
      .map((p) => `Platz ${p.nr}: ab ${formatMonat(p.ab)}`)
      .join("\n") || "(aktuell keine freien Plätze eingetragen)"
  );
}

// ----------------------------------------------------------------
// Mail 1 – Monats-Aufforderung (Tag 1)
// ----------------------------------------------------------------

export function buildMonthlyEmail(args: {
  vorname: string;
  emailToken: string;
  plaetze: PlatzInfo[];
  heute: Date;
}): { betreff: string; html: string; text: string } {
  const { vorname, emailToken, plaetze, heute } = args;
  const monat = monatJahr(heute);
  const erinnerungAm = formatDatum(plusTage(heute, 5))!;
  const cleanupAm = formatDatum(plusTage(heute, 10))!;

  const confirmUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=confirm`;
  const editUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=edit`;

  const inhalt = `
    <p>Liebe ${escape(vorname)},</p>
    <p>bitte überprüfe deine aktuell eingetragenen freien Plätze auf unserer Website:</p>
    ${plaetzeBlockHtml(plaetze)}
    <p>
      ${button(confirmUrl, "Alles stimmt so – bestätigen", "#f8796c")}
    </p>
    <p>
      ${button(editUrl, "✏️ Ich möchte etwas ändern", "#5a534c")}
    </p>
    <p style="margin-top:24px;color:#5a534c;font-size:14px;">
      Bitte bestätige deine freien Plätze.
      Wenn wir bis zum <strong>${erinnerungAm}</strong> keine Antwort erhalten,
      schicken wir eine Erinnerung. Antwortest du bis zum
      <strong>${cleanupAm}</strong> nicht, werden deine freien Plätze
      vorübergehend von der Website entfernt. Dein Profil bleibt bestehen,
      aber Eltern finden dich bei der Platzsuche nicht.
    </p>
    <p style="margin-top:24px;">Viele Grüße,<br>Dresdner Tageseltern e.V.</p>
  `;

  const text = `Liebe ${vorname},

bitte überprüfe deine aktuell eingetragenen freien Plätze auf unserer Website:

${plaetzeBlockText(plaetze)}

Alles stimmt so – bestätigen:
${confirmUrl}

Ich möchte etwas ändern:
${editUrl}

Bitte bestätige deine freien Plätze. Wenn wir bis zum ${erinnerungAm} keine Antwort erhalten, schicken wir eine Erinnerung.
Antwortest du bis zum ${cleanupAm} nicht, werden deine freien Plätze
vorübergehend von der Website entfernt. Dein Profil bleibt bestehen,
aber Eltern finden dich bei der Platzsuche nicht.

Viele Grüße,
Dresdner Tageseltern e.V.`;

  return {
    betreff: `Bitte bestätige deine freien Plätze – ${monat}`,
    html: layout(
      inhalt,
      `Kurze Rückmeldung bis ${erinnerungAm}: Stimmen deine freien Plätze noch?`,
    ),
    text,
  };
}

// ----------------------------------------------------------------
// Mail 2 – Erinnerung (Tag 6)
// ----------------------------------------------------------------

export function buildReminderEmail(args: {
  vorname: string;
  emailToken: string;
  plaetze: PlatzInfo[];
  heute: Date;
}): { betreff: string; html: string; text: string } {
  const { vorname, emailToken, plaetze, heute } = args;
  const monat = monatJahr(heute);
  const cleanupAm = formatDatum(plusTage(heute, 5))!; // Tag 11 = +5 Tage ab Tag 6

  const confirmUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=confirm`;
  const editUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=edit`;

  const inhalt = `
    <p>Liebe ${escape(vorname)},</p>
    <p>
      vor einigen Tagen haben wir dich gebeten, deine freien Plätze zu bestätigen.
      Wir haben bisher noch keine Antwort von dir bekommen – kannst du das kurz
      erledigen? Hier deine aktuell eingetragenen Plätze:
    </p>
    ${plaetzeBlockHtml(plaetze)}
    <p>
      ${button(confirmUrl, "Alles stimmt so – bestätigen", "#f8796c")}
    </p>
    <p>
      ${button(editUrl, "✏️ Ich möchte etwas ändern", "#5a534c")}
    </p>
    <p style="margin-top:24px;color:#5a534c;font-size:14px;">
      Wenn wir bis zum <strong>${cleanupAm}</strong> keine Antwort erhalten,
      werden deine freien Plätze vorübergehend von der Website entfernt.
      Dein Profil bleibt bestehen, aber Eltern finden dich bei der Platzsuche nicht.
    </p>
    <p style="margin-top:24px;">Viele Grüße,<br>Dresdner Tageseltern e.V.</p>
  `;

  const text = `Liebe ${vorname},

vor einigen Tagen haben wir dich gebeten, deine freien Plätze zu bestätigen.
Wir haben bisher noch keine Antwort von dir bekommen – kannst du das kurz erledigen?
Hier deine aktuell eingetragenen Plätze:

${plaetzeBlockText(plaetze)}

Alles stimmt so – bestätigen:
${confirmUrl}

Ich möchte etwas ändern:
${editUrl}

Wenn wir bis zum ${cleanupAm} keine Antwort erhalten, werden deine freien Plätze
vorübergehend von der Website entfernt. Dein Profil bleibt bestehen,
aber Eltern finden dich bei der Platzsuche nicht.

Viele Grüße,
Dresdner Tageseltern e.V.`;

  return {
    betreff: `Erinnerung: Bitte bestätige deine freien Plätze – ${monat}`,
    html: layout(
      inhalt,
      `Nur ein Klick: Bitte bestätige deine freien Plätze bis ${cleanupAm}.`,
    ),
    text,
  };
}

// ----------------------------------------------------------------
// Mail 3 – Admin-Zusammenfassung (Tag 11)
// ----------------------------------------------------------------

export function buildAdminSummaryEmail(args: {
  heute: Date;
  bestaetigt: number;
  aktualisiert: number;
  nichtGeantwortet: number;
}): { betreff: string; html: string; text: string } {
  const { heute, bestaetigt, aktualisiert, nichtGeantwortet } = args;
  const monat = monatJahr(heute);

  const inhalt = `
    <h2 style="margin:0 0 16px;font-size:20px;">Monatsübersicht ${escape(monat)}</h2>
    <div style="background:#fef2c2;border-radius:12px;padding:16px 20px;margin:16px 0;">
      <p style="margin:6px 0;">✅ <strong>${bestaetigt}</strong> Tagesmütter haben bestätigt</p>
      <p style="margin:6px 0;">✏️ <strong>${aktualisiert}</strong> Tagesmütter haben Plätze aktualisiert</p>
      <p style="margin:6px 0;">❌ <strong>${nichtGeantwortet}</strong> Tagesmütter haben nicht geantwortet → Plätze gelöscht</p>
    </div>
    <p style="margin-top:24px;color:#5a534c;font-size:14px;">
      Automatischer Versand vom Cron-Job am 11. des Monats.
    </p>
  `;

  const text = `Monatsübersicht ${monat}:

✅ ${bestaetigt} Tagesmütter haben bestätigt
✏️ ${aktualisiert} Tagesmütter haben Plätze aktualisiert
❌ ${nichtGeantwortet} Tagesmütter haben nicht geantwortet → Plätze gelöscht`;

  return {
    betreff: `Monatsübersicht freie Plätze – ${monat}`,
    html: layout(
      inhalt,
      `${bestaetigt + aktualisiert} Rückmeldungen, ${nichtGeantwortet} ohne Antwort.`,
    ),
    text,
  };
}

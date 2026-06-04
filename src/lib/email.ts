// E-Mail-Versand und HTML-Templates für die monatliche
// Plätze-Aktualisierung der Tagesmütter.
//
// SMTP-Konfiguration erfolgt über Umgebungsvariablen
// (siehe .env.example: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).

import nodemailer, { type Transporter } from "nodemailer";

const APP_URL = process.env.APP_URL ?? "https://dresdner-tageseltern.de";
const ABSENDER_NAME = "Dresdner Tageseltern e.V.";
const ABSENDER_EMAIL =
  process.env.SMTP_USER ?? "plaetze@dresdner-tageseltern.de";

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

function layout(inhalt: string): string {
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fef2c2;font-family:Nunito,Arial,sans-serif;color:#2f2a26;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0;font-size:14px;color:#5a534c;font-weight:600;">Dresdner Tageseltern e.V.</p>
        </td></tr>
        <tr><td style="padding:16px 32px 32px;font-size:16px;line-height:1.6;">
          ${inhalt}
        </td></tr>
        <tr><td style="padding:16px 32px 24px;background:#fef2c2;font-size:12px;color:#5a534c;text-align:center;">
          Dresdner Tageseltern e.V. &middot; <a href="${APP_URL}" style="color:#5a534c;">${APP_URL.replace(/^https?:\/\//, "")}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function button(href: string, text: string, farbe: string): string {
  return `<a href="${href}" style="display:inline-block;background:${farbe};color:#ffffff;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;margin:4px 0;">${escape(text)}</a>`;
}

// ----------------------------------------------------------------
// Mail 1 – Monats-Aufforderung (Tag 1)
// ----------------------------------------------------------------

export type PlatzInfo = { nr: number; ab: Date | null };

export function buildMonthlyEmail(args: {
  vorname: string;
  emailToken: string;
  plaetze: PlatzInfo[];
  heute: Date;
}): { betreff: string; html: string; text: string } {
  const { vorname, emailToken, plaetze, heute } = args;
  const monat = monatJahr(heute);
  const erinnerungAm = formatDatum(plusTage(heute, 7))!;
  const cleanupAm = formatDatum(plusTage(heute, 10))!;

  const confirmUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=confirm`;
  const editUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=edit`;

  const plaetzeZeilen = plaetze
    .filter((p) => p.ab !== null)
    .map(
      (p) =>
        `<p style="margin:4px 0;"><span style="margin-right:6px;">📅</span><strong>Platz ${p.nr}:</strong> ab ${formatDatum(p.ab)}</p>`,
    )
    .join("");

  const plaetzeText =
    plaetze
      .filter((p) => p.ab !== null)
      .map((p) => `📅 Platz ${p.nr}: ab ${formatDatum(p.ab)}`)
      .join("\n") || "(aktuell keine freien Plätze eingetragen)";

  const inhalt = `
    <p>Liebe ${escape(vorname)},</p>
    <p>bitte überprüfe deine aktuell eingetragenen freien Plätze:</p>
    <div style="background:#fef2c2;border-radius:12px;padding:16px 20px;margin:16px 0;">
      ${plaetzeZeilen || `<p style="margin:0;color:#5a534c;">Aktuell sind keine freien Plätze eingetragen.</p>`}
    </div>
    <p>
      ${button(confirmUrl, "✅ Alles stimmt so – bestätigen", "#f8796c")}
    </p>
    <p>
      ${button(editUrl, "✏️ Ich möchte etwas ändern", "#5a534c")}
    </p>
    <p style="margin-top:24px;color:#5a534c;font-size:14px;">
      Wenn wir bis zum <strong>${erinnerungAm}</strong> keine Antwort erhalten,
      schicken wir eine Erinnerung. Antwortest du bis zum
      <strong>${cleanupAm}</strong> nicht, werden deine freien Plätze
      vorübergehend von der Website entfernt. Dein Profil bleibt bestehen.
    </p>
    <p style="margin-top:24px;">Viele Grüße,<br>Dresdner Tageseltern e.V.</p>
  `;

  const text = `Liebe ${vorname},

bitte überprüfe deine aktuell eingetragenen freien Plätze:

${plaetzeText}

Alles stimmt so – bestätigen:
${confirmUrl}

Ich möchte etwas ändern:
${editUrl}

Wenn wir bis zum ${erinnerungAm} keine Antwort erhalten, schicken wir eine Erinnerung.
Antwortest du bis zum ${cleanupAm} nicht, werden deine freien Plätze
vorübergehend von der Website entfernt. Dein Profil bleibt bestehen.

Viele Grüße,
Dresdner Tageseltern e.V.`;

  return {
    betreff: `Bitte bestätige deine freien Plätze – ${monat}`,
    html: layout(inhalt),
    text,
  };
}

// ----------------------------------------------------------------
// Mail 2 – Erinnerung (Tag 7)
// ----------------------------------------------------------------

export function buildReminderEmail(args: {
  vorname: string;
  emailToken: string;
  heute: Date;
}): { betreff: string; html: string; text: string } {
  const { vorname, emailToken, heute } = args;
  const monat = monatJahr(heute);
  const cleanupAm = formatDatum(plusTage(heute, 3))!; // Tag 10 = +3 Tage ab Tag 7

  const confirmUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=confirm`;
  const editUrl = `${APP_URL}/plaetze-bestaetigen?token=${emailToken}&action=edit`;

  const inhalt = `
    <p>Liebe ${escape(vorname)},</p>
    <p>
      vor einer Woche haben wir dich gebeten, deine freien Plätze zu bestätigen.
      Wir haben bisher noch keine Antwort von dir bekommen – kannst du das kurz
      erledigen?
    </p>
    <p>
      ${button(confirmUrl, "✅ Alles stimmt so – bestätigen", "#f8796c")}
    </p>
    <p>
      ${button(editUrl, "✏️ Ich möchte etwas ändern", "#5a534c")}
    </p>
    <p style="margin-top:24px;color:#5a534c;font-size:14px;">
      Wenn wir bis zum <strong>${cleanupAm}</strong> keine Antwort erhalten,
      werden deine freien Plätze vorübergehend von der Website entfernt.
      Dein Profil bleibt selbstverständlich bestehen.
    </p>
    <p style="margin-top:24px;">Viele Grüße,<br>Dresdner Tageseltern e.V.</p>
  `;

  const text = `Liebe ${vorname},

vor einer Woche haben wir dich gebeten, deine freien Plätze zu bestätigen.
Wir haben bisher noch keine Antwort von dir bekommen – kannst du das kurz erledigen?

Alles stimmt so – bestätigen:
${confirmUrl}

Ich möchte etwas ändern:
${editUrl}

Wenn wir bis zum ${cleanupAm} keine Antwort erhalten, werden deine freien Plätze
vorübergehend von der Website entfernt. Dein Profil bleibt bestehen.

Viele Grüße,
Dresdner Tageseltern e.V.`;

  return {
    betreff: `Erinnerung: Bitte bestätige deine freien Plätze – ${monat}`,
    html: layout(inhalt),
    text,
  };
}

// ----------------------------------------------------------------
// Mail 3 – Admin-Zusammenfassung (Tag 10)
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
      Automatischer Versand vom Cron-Job am 10. des Monats.
    </p>
  `;

  const text = `Monatsübersicht ${monat}:

✅ ${bestaetigt} Tagesmütter haben bestätigt
✏️ ${aktualisiert} Tagesmütter haben Plätze aktualisiert
❌ ${nichtGeantwortet} Tagesmütter haben nicht geantwortet → Plätze gelöscht`;

  return {
    betreff: `Monatsübersicht freie Plätze – ${monat}`,
    html: layout(inhalt),
    text,
  };
}

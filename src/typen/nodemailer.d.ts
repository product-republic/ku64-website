/**
 * Typen für nodemailer – so weit, wie diese Website es benutzt.
 *
 * ── Warum es diese Datei gibt ──────────────────────────────────────────────
 *
 * nodemailer liefert keine Typen mit, und `@types/nodemailer` ist hier nicht
 * installiert. Ohne Angabe ist `nodemailer` deshalb `any`: Ein Tippfehler in
 * `sendMail({ subjekt: … })` fällt niemandem auf, und die Mail geht ohne
 * Betreff raus. Genau das soll die Typprüfung verhindern.
 *
 * Bewusst nur das Benutzte statt einer vollständigen Nachbildung: Eine
 * halbrichtige Kopie der ganzen Schnittstelle wäre eine zweite Stelle, die
 * veraltet. Wer eine weitere Option braucht, trägt sie hier ein – und merkt
 * dabei, dass er sie braucht.
 *
 * Sollte `@types/nodemailer` einmal als Abhängigkeit dazukommen, gehört diese
 * Datei gelöscht.
 */
declare module 'nodemailer' {
  interface Anhang {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }

  interface Nachricht {
    from?: string;
    to: string;
    replyTo?: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: Anhang[];
  }

  interface Versandergebnis {
    messageId: string;
    accepted: string[];
    rejected: string[];
  }

  interface Transport {
    sendMail(nachricht: Nachricht): Promise<Versandergebnis>;
  }

  interface Zugang {
    /** Beides kann fehlen, wenn der Server ohne Anmeldung annimmt. */
    user?: string;
    pass?: string;
  }

  interface Einstellungen {
    host: string;
    port: number;
    /** true = SMTPS auf Port 465, false = STARTTLS auf 587. */
    secure?: boolean;
    auth?: Zugang;
  }

  export function createTransport(einstellungen: Einstellungen): Transport;

  const nodemailer: { createTransport: typeof createTransport };
  export default nodemailer;
}

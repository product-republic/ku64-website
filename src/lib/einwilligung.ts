/**
 * Das Tor, durch das jeder Drittanbieter muss.
 *
 * ── Die Regel ───────────────────────────────────────────────────────────
 *
 * Kein Skript, kein Bild, kein `iframe` eines Dritten wird geladen, solange
 * für seine Kategorie keine Einwilligung vorliegt. Und zwar nicht, weil sich
 * alle daran halten, sondern weil es keinen anderen Weg gibt: `laden()`
 * verlangt einen Slug aus `dienste.ts`, prüft dessen Kategorie und weigert
 * sich sonst. Ein Dienst ohne Eintrag im Verzeichnis kommt nicht durch.
 *
 * Das ist die eigentliche Absicherung. Ein Banner ist schnell gebaut; die
 * Schwierigkeit liegt darin, dass ein halbes Jahr später jemand ein Skript
 * einbindet, ohne daran zu denken. `dienste-pruefen.mjs` sucht deshalb
 * zusätzlich im gebauten HTML nach fremden Hosts, die nicht im Verzeichnis
 * stehen, und bricht den Bau ab.
 *
 * ── Was gespeichert wird ────────────────────────────────────────────────
 *
 * Ein Eintrag in `localStorage`, kein Cookie – ein Cookie ginge bei jeder
 * Anfrage mit zum Server, obwohl ihn nur der Browser braucht.
 *
 *   { kategorien: ['statistik'], am: '2026-07-30T…', fassung: 1 }
 *
 * `fassung` ist der Grund, warum das kein einfaches Ja/Nein ist: Kommt ein
 * Dienst hinzu, steigt `VERZEICHNIS_FASSUNG`, und die alte Einwilligung gilt
 * nicht mehr. Eine Zustimmung von gestern kann keinen Dienst decken, den es
 * gestern nicht gab.
 *
 * ── Warum sechs Monate ──────────────────────────────────────────────────
 *
 * Die Aufsichtsbehörden halten eine erneute Abfrage nach spätestens zwölf
 * Monaten für nötig; die DSK nennt sechs als guten Wert. Sechs Monate sind
 * hier gewählt, weil es die Praxis nichts kostet und die Besucherin die
 * Entscheidung dann noch erinnert.
 *
 * ── Ablehnen ist genauso schnell wie Annehmen ───────────────────────────
 *
 * Beide Schaltflächen sind gleich groß, gleich prominent, im selben Schritt.
 * Ein Banner, in dem „Alle ablehnen" zwei Klicks tiefer liegt, ist nach
 * Artikel 4 Nr. 11 DSGVO keine freiwillige Einwilligung – und wird von den
 * Behörden auch so behandelt.
 */

import {
  DIENSTE,
  VERZEICHNIS_FASSUNG,
  type Kategorie,
  type Dienst,
} from '../data/dienste';

const SCHLUESSEL = 'ku64:einwilligung';
const GUELTIG_TAGE = 182;

export interface Entscheidung {
  kategorien: Kategorie[];
  am: string;
  fassung: number;
}

/** `notwendig` braucht keine Einwilligung und wird nie abgefragt. */
const FREI: Kategorie = 'notwendig';

/* ── Lesen und Schreiben ─────────────────────────────────────────────── */

/**
 * Die gespeicherte Entscheidung – oder `null`, wenn keine gültige vorliegt.
 *
 * „Nicht gültig" heißt: nicht vorhanden, kaputt, älter als sechs Monate,
 * oder für eine frühere Fassung des Verzeichnisses erteilt. In allen vier
 * Fällen gilt: nichts ist erlaubt, und es wird gefragt.
 */
export function entscheidung(): Entscheidung | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return null;
    const e = JSON.parse(roh) as Entscheidung;
    if (!Array.isArray(e.kategorien) || typeof e.am !== 'string') return null;
    if (e.fassung !== VERZEICHNIS_FASSUNG) return null;
    const alter = (Date.now() - Date.parse(e.am)) / 86_400_000;
    if (!Number.isFinite(alter) || alter > GUELTIG_TAGE) return null;
    return e;
  } catch {
    /* Kaputter Eintrag zählt als keine Einwilligung – nicht als Zustimmung. */
    return null;
  }
}

/** Merken, was entschieden wurde, und alle Wartenden benachrichtigen. */
export function entscheiden(kategorien: Kategorie[]): void {
  const sauber = kategorien.filter((k) => k !== FREI);
  const e: Entscheidung = {
    kategorien: sauber,
    am: new Date().toISOString(),
    fassung: VERZEICHNIS_FASSUNG,
  };
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(e));
  } catch {
    /* Privater Modus ohne Speicher: Die Entscheidung gilt für diese Sitzung,
       weil sie im Ereignis unten mitgeht – nur nicht für die nächste. */
  }
  melden(e);
}

/**
 * Widerruf.
 *
 * Löscht die Entscheidung UND lädt die Seite neu. Das Neuladen ist der
 * Punkt: Ein Skript, das schon läuft, lässt sich nicht zurücknehmen. Wer
 * widerruft und danach dieselbe Seite mit laufendem Analytics sieht, hat
 * nicht widerrufen, sondern nur einen Eintrag gelöscht.
 */
export function widerrufen(): void {
  try {
    localStorage.removeItem(SCHLUESSEL);
  } catch {
    /* nichts zu löschen */
  }
  melden(null);
  if (typeof location !== 'undefined') location.reload();
}

/* ── Fragen ──────────────────────────────────────────────────────────── */

/** Ist diese Kategorie freigegeben? */
export function erlaubt(kategorie: Kategorie): boolean {
  if (kategorie === FREI) return true;
  return entscheidung()?.kategorien.includes(kategorie) ?? false;
}

/** Muss überhaupt gefragt werden? */
export function fragenNoetig(): boolean {
  if (entscheidung()) return false;
  return DIENSTE.some((d) => d.stand === 'aktiv' && d.kategorie !== FREI);
}

/* ── Benachrichtigung ────────────────────────────────────────────────── */

const EREIGNIS = 'ku64:einwilligung';

function melden(e: Entscheidung | null): void {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new CustomEvent(EREIGNIS, { detail: e }));
}

/**
 * Auf Änderungen hören.
 *
 * Ein Baustein, der einen Drittanbieter braucht, wartet damit auf die
 * Freigabe, statt sie einmal beim Seitenaufbau abzufragen: Wer erst nach dem
 * Rendern zustimmt, soll den Rundgang sehen, ohne die Seite neu zu laden.
 *
 * Gibt eine Funktion zum Abmelden zurück – ohne die hielte jeder
 * Seitenwechsel des ClientRouters einen Zuhörer mehr fest.
 */
export function beiAenderung(was: (e: Entscheidung | null) => void): () => void {
  const hoerer = (ereignis: Event) => was((ereignis as CustomEvent).detail ?? null);
  document.addEventListener(EREIGNIS, hoerer);
  return () => document.removeEventListener(EREIGNIS, hoerer);
}

/* ── Das Tor ─────────────────────────────────────────────────────────── */

const geladen = new Set<string>();

function dienstOderFehler(slug: string): Dienst {
  const d = DIENSTE.find((x) => x.slug === slug);
  if (!d) {
    /*
     * Kein stiller Fehlschlag.
     *
     * Ein Dienst ohne Eintrag ist ein Dienst, über den in der
     * Datenschutzerklärung nichts steht. Das ist kein Randfall, den man
     * durchwinkt – das ist der Fehler, den diese Datei verhindern soll.
     */
    throw new Error(
      `[einwilligung] „${slug}" steht nicht in src/data/dienste.ts. ` +
        'Kein Drittanbieter ohne Eintrag im Verzeichnis – sonst fehlt er in der ' +
        'Datenschutzerklärung und in der Auswahl.',
    );
  }
  if (d.stand !== 'aktiv') {
    throw new Error(
      `[einwilligung] „${slug}" steht als „${d.stand}" im Verzeichnis und darf nicht laden. ` +
        'Erst den Eintrag auf „aktiv" setzen und VERZEICHNIS_FASSUNG hochzählen.',
    );
  }
  return d;
}

/**
 * Ein Skript eines Drittanbieters laden – wenn erlaubt.
 *
 * Gibt `true` zurück, wenn geladen wurde oder schon lief, `false`, wenn die
 * Einwilligung fehlt. Kein `throw` in diesem Fall: Fehlende Einwilligung ist
 * der normale Zustand, kein Fehler.
 */
export function laden(slug: string, adresse: string): boolean {
  const d = dienstOderFehler(slug);
  if (!erlaubt(d.kategorie)) return false;
  if (geladen.has(adresse)) return true;

  const s = document.createElement('script');
  s.src = adresse;
  s.async = true;
  /* Kein `crossorigin` und kein `integrity`: Beide Anbieter liefern ihre
     Skripte veränderlich aus, ein Prüfwert wäre morgen falsch und würde das
     Skript blockieren – siehe Kommentar in dienste-pruefen.mjs. */
  document.head.append(s);
  geladen.add(adresse);
  return true;
}

/**
 * Darf dieser Dienst jetzt eingebettet werden?
 *
 * Für `iframe`-Einbettungen wie den Rundgang: Der Baustein fragt, setzt
 * seine Adresse selbst und weiß dabei, dass der Slug geprüft ist.
 */
export function darf(slug: string): boolean {
  const d = DIENSTE.find((x) => x.slug === slug);
  if (!d || d.stand !== 'aktiv') return false;
  return erlaubt(d.kategorie);
}

/**
 * Google Analytics starten.
 *
 * Steht hier und nicht im Seitenkopf, damit es genau einen Weg gibt. Die
 * Messkennung kommt aus `MESSKENNUNG` in `messung.ts`; fehlt sie, passiert
 * nichts – eine leere Kennung würde sonst als Skript mit `id=undefined`
 * geladen.
 *
 * `anonymize_ip` ist bei GA4 nicht mehr abschaltbar und daher nicht gesetzt.
 * Was gesetzt wird: keine Werbefunktionen, keine Verknüpfung mit Google
 * Signals – beides ist bei einer Zahnarztpraxis nicht zu rechtfertigen.
 */
export function analyticsStarten(kennung: string): boolean {
  if (!kennung) return false;
  if (!laden('google-analytics', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(kennung)}`)) {
    return false;
  }

  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer ?? [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  w.gtag('js', new Date());
  w.gtag('config', kennung, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  return true;
}

/**
 * Wann ein Behandlerprofil eine eigene Seite trägt.
 *
 * ── Das Problem ───────────────────────────────────────────────────────────
 *
 * 64 der 99 Profilseiten lagen unter 250 Wörtern, das kürzeste bei 64. Der
 * Grund ist nicht die Seitenvorlage, sondern die Datenlage: Von 139 Personen
 * haben zwei eine Leistung zugeordnet, Sprachen und Schwerpunkte sind fast
 * überall leer. Übrig bleibt der Vorstellungstext – und der ist bei manchen
 * zwei Sätze lang.
 *
 * ── Warum nicht einfach auffüllen ─────────────────────────────────────────
 *
 * Weil es nichts gibt, womit. Alles, was sich ergänzen ließe – was ein
 * Fachbereich macht, welche Leistungen es am Standort gibt, wie man einen
 * Termin bekommt –, wäre für alle 17 Prophylaxe-Kolleginnen am
 * Kurfürstendamm derselbe Text. Das tauscht ein dünnes Profil gegen 17
 * gleiche und macht es schlimmer, nicht besser.
 *
 * Der Versuch wurde beim Umbau der Standortseiten zweimal gemacht und
 * zweimal gemessen: Text hinzufügen, der sich nicht unterscheidet, erhöht
 * die Ähnlichkeit, statt sie zu senken.
 *
 * ── Die Regel ─────────────────────────────────────────────────────────────
 *
 * Eine Person bekommt eine eigenständige, indexierbare Seite, wenn ihr
 * Profiltext mindestens 120 eigene Wörter hat. Gezählt wird nur, was diese
 * Person über sich sagt – nicht die Seitenvorlage, nicht die Adresse des
 * Standorts, nicht der Terminaufruf.
 *
 * Wer darunter liegt, bleibt vollständig sichtbar: mit Foto, Name, Funktion
 * und Text auf der Teamübersicht des Standorts. Die eigene Seite existiert
 * weiter und ist erreichbar – sie verweist per Canonical auf die
 * Teamübersicht und steht nicht in der Sitemap.
 *
 * ── Warum das die richtige Grenze ist ─────────────────────────────────────
 *
 * 120 Wörter sind etwa vier Sätze. Darunter steht auf der Seite nichts, was
 * die Übersichtskachel nicht auch zeigt – ein Klick, der nichts Neues
 * bringt, ist ein enttäuschter Klick. Bei 26 Profilen greift die Regel; 71
 * stehen für sich.
 *
 * ── Selbstheilend ─────────────────────────────────────────────────────────
 *
 * Sobald jemand vier Sätze über sich ergänzt, überschreitet das Profil die
 * Grenze und die Seite steht wieder für sich – ohne dass hier etwas geändert
 * werden muss. Umgekehrt genauso: Wird ein Text gekürzt, fällt die Seite
 * still zurück in die Übersicht, statt als dünne Seite stehen zu bleiben.
 */
import profile from './profile.json';

/** Ab wie vielen eigenen Wörtern ein Profil für sich steht. */
export const MINDESTTIEFE = 120;

interface Profilblock {
  titel?: string;
  bloecke?: { text?: string }[];
  zeilen?: string[];
}

interface Profil {
  vorstellung?: string | string[];
  abschnitte?: Profilblock[];
}

/** Wörter, die diese Person über sich selbst sagt. Vorlagentext zählt nicht. */
export function profiltiefe(slug: string): number {
  const p = (profile as Record<string, Profil>)[slug];
  if (!p) return 0;

  const teile: string[] = [];
  if (Array.isArray(p.vorstellung)) teile.push(...p.vorstellung);
  else if (p.vorstellung) teile.push(p.vorstellung);

  for (const a of p.abschnitte ?? []) {
    if (a.titel) teile.push(a.titel);
    for (const b of a.bloecke ?? []) if (b.text) teile.push(b.text);
    for (const z of a.zeilen ?? []) teile.push(z);
  }

  return teile.join(' ').split(/\s+/).filter(Boolean).length;
}

/** Trägt dieses Profil eine eigene Seite? */
export function profilEigenstaendig(slug: string): boolean {
  return profiltiefe(slug) >= MINDESTTIEFE;
}

/**
 * Wer noch Text braucht – für die Rückfrage an die Praxis.
 *
 * Ausgegeben von `npm run profile:offen`. Vier Sätze je Person genügen, und
 * die schreibt jede Person am besten selbst.
 */
export function profileOhneTiefe(): { slug: string; woerter: number }[] {
  return Object.keys(profile as Record<string, Profil>)
    .map((slug) => ({ slug, woerter: profiltiefe(slug) }))
    .filter((p) => p.woerter < MINDESTTIEFE)
    .sort((a, b) => a.woerter - b.woerter);
}

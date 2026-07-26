/**
 * Zentrale SEO-Helfer. Jede Seite bekommt Titel, Description, Canonical und
 * strukturierte Daten aus genau einer Quelle – so entstehen keine Seiten mit
 * fehlenden oder doppelten Meta-Angaben.
 */

import {
  type Standort,
  adresseEinzeilig,
  oeffnungszeitenSchema,
} from '../data/standorte';
import type { Leistung } from '../data/leistungen';

export const SITE_NAME = 'KU64 – Die Zahnspezialisten';
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://ku64.de';

/**
 * Titel bauen. Google schneidet in der Praxis bei rund 60 Zeichen ab –
 * deshalb wird der Markenzusatz weggelassen, wenn es sonst zu lang würde.
 */
export function titelBauen(seitentitel: string, zusatz = 'KU64'): string {
  const voll = `${seitentitel} • ${zusatz}`;
  return voll.length <= 62 ? voll : seitentitel;
}

/**
 * Description auf eine sinnvolle Länge bringen, ohne mitten im Wort zu kappen.
 */
export function descriptionKuerzen(text: string, max = 158): string {
  const sauber = text.replace(/\s+/g, ' ').trim();
  if (sauber.length <= max) return sauber;
  const geschnitten = sauber.slice(0, max - 1);
  const letzterRaum = geschnitten.lastIndexOf(' ');
  return `${geschnitten.slice(0, letzterRaum > 0 ? letzterRaum : geschnitten.length)}…`;
}

export function kanonisch(pfad: string): string {
  const p = pfad.startsWith('/') ? pfad : `/${pfad}`;
  const mitSlash = p.endsWith('/') ? p : `${p}/`;
  return new URL(mitSlash, SITE_URL).href;
}

// ─────────────────────────── Strukturierte Daten ───────────────────────────

/**
 * Ein Standort als Dentist/LocalBusiness. Das ist der wichtigste Datensatz
 * für lokale Suche und für KI-Suchmaschinen, die nach Adresse, Öffnungszeiten
 * und Leistungsspektrum fragen.
 */
export function schemaStandort(s: Standort, leistungen: Leistung[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': kanonisch(`/${s.slug}/`) + '#praxis',
    name: s.nameLang,
    description: s.claim,
    url: kanonisch(`/${s.slug}/`),
    telephone: s.telefonRaw,
    email: s.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.strasse,
      postalCode: s.plz,
      addressLocality: s.ort,
      addressRegion: s.ort === 'Potsdam' ? 'Brandenburg' : 'Berlin',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: s.geo.lat,
      longitude: s.geo.lng,
    },
    openingHoursSpecification: oeffnungszeitenSchema(s),
    isAcceptingNewPatients: true,
    currenciesAccepted: 'EUR',
    parentOrganization: {
      '@type': 'MedicalOrganization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    availableService: leistungen.map((l) => ({
      '@type': 'MedicalProcedure',
      name: l.name,
      url: kanonisch(`/${s.slug}/leistungen/${l.slug}/`),
    })),
  };
}

/**
 * Eine Behandlung an einem konkreten Standort. Der Ortsbezug im Schema ist
 * entscheidend – ohne ihn ordnet die Suchmaschine die Leistung keinem
 * Standort zu und spielt im Zweifel den falschen aus.
 */
export function schemaLeistung(l: Leistung, s: Standort) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': kanonisch(`/${s.slug}/leistungen/${l.slug}/`) + '#behandlung',
    name: `${l.name} in ${s.ort}${s.bezirk ? `-${s.bezirk}` : ''}`,
    alternateName: l.synonyme,
    description: l.teaser,
    url: kanonisch(`/${s.slug}/leistungen/${l.slug}/`),
    procedureType: 'https://schema.org/TherapeuticProcedure',
    howPerformed: l.ablauf?.map((a) => `${a.titel}: ${a.text}`).join(' '),
    provider: { '@id': kanonisch(`/${s.slug}/`) + '#praxis' },
  };
}

/** FAQ-Auszeichnung – die Grundlage dafür, dass KI-Suchen direkt zitieren können. */
export function schemaFaq(eintraege: { frage: string; antwort: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: eintraege.map((e) => ({
      '@type': 'Question',
      name: e.frage,
      acceptedAnswer: { '@type': 'Answer', text: e.antwort },
    })),
  };
}

/** Breadcrumbs helfen Nutzenden und geben Suchmaschinen die Hierarchie vor. */
export function schemaBrotkrumen(punkte: { name: string; pfad: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: punkte.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      item: kanonisch(p.pfad),
    })),
  };
}

export function schemaOrganisation() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${SITE_URL}/#organisation`,
    name: SITE_NAME,
    url: SITE_URL,
    medicalSpecialty: 'https://schema.org/Dentistry',
  };
}

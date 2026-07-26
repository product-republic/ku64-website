# syntax=docker/dockerfile:1

# ── Build ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# fontconfig wird gebraucht, damit die Vorschaubilder (scripts/og-bilder.mjs)
# die Markenschriften finden. Ohne das Paket rendert librsvg leere Kacheln –
# das Skript bricht in dem Fall bewusst mit einer Prüfung ab.
RUN apk add --no-cache fontconfig ttf-dejavu

# Abhängigkeiten zuerst – so bleibt die Layer bei reinen Code-Änderungen im Cache.
COPY package*.json ./
RUN npm ci

COPY . .

# PUBLIC_SITE_URL geht in Canonicals, Sitemap und llms.txt ein und muss
# deshalb schon zur Buildzeit stimmen.
ARG PUBLIC_SITE_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
RUN npm run build

# ── Laufzeit ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Schriften auch zur Laufzeit. Das ist keine Kosmetik: Die Lächeln-Vorschau
# entsteht auf Anfrage im Server und bekommt dabei den Hinweisstreifen
# "KI-generiertes Bild" angesetzt (src/lib/ki-kennzeichnung.ts). Fehlt die
# Schrift, rendert librsvg den Streifen leer – und weil ein unmarkiertes
# Deepfake der schlechtere Ausgang wäre als gar kein Bild, bricht die
# Kennzeichnung dann ab und die Person bekommt eine Fehlermeldung statt ihres
# Bildes. Artikel 50 Absatz 4 der KI-Verordnung hängt an diesem Paket.
RUN apk add --no-cache fontconfig ttf-dejavu

# Inter kommt entpackt aus der Build-Stufe: Das Entpacken braucht wawoff2, und
# das ist eine Entwicklungsabhängigkeit, die hier nicht installiert wird.
COPY --from=build /root/.fonts/ku64-inter.otf /usr/share/fonts/ku64/ku64-inter.otf
RUN fc-cache -f && \
    # Nachweisen statt hoffen: Wenn fontconfig für "Inter" etwas anderes
    # zurückgibt, ist die Schrift nicht angekommen, und das Image darf nicht
    # entstehen. Ein Container, der erst beim ersten erzeugten Bild auffällt,
    # fällt in der Regel beim Kunden auf.
    fc-match Inter | grep -qi 'inter' || \
      (echo 'FEHLER: Inter nicht gefunden – die KI-Bildkennzeichnung bliebe leer.' && exit 1)

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# Nicht als root laufen lassen.
USER node

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]

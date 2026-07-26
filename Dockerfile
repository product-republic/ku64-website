# syntax=docker/dockerfile:1

# ── Build ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

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

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# Nicht als root laufen lassen.
USER node

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]

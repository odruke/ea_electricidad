# syntax=docker/dockerfile:1

FROM node:24.16.0-bookworm-slim AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build-time configuration. SITE_URL is required; there is deliberately no default so a
# missing or wrong canonical URL fails the build instead of shipping silently.
ARG SITE_URL
ARG SITE_ENV=staging
RUN test -n "$SITE_URL" || (echo "SITE_URL build argument is required" >&2 && exit 1)
ENV SITE_URL=$SITE_URL
ENV SITE_ENV=$SITE_ENV

RUN pnpm build

FROM caddy:2-alpine AS runtime

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

ENV SITE_ADDRESS=:80

EXPOSE 80 443 443/udp

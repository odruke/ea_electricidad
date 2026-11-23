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

# Static site plus its own HTTP policy (headers, redirects, caching, localized 404).
# Never published to the host: the shared VPS reverse proxy reaches it on the `proxy`
# network and only terminates TLS.
FROM caddy:2-alpine AS web

# The official caddy image marks the binary with `cap_net_bind_service=+ep`. Under an empty
# capability bounding set (`cap_drop: ALL`) execve fails with EPERM, so the container cannot
# start. This server listens on 8080 and needs no capability, so strip it when present.
RUN if getcap /usr/bin/caddy | grep -q .; then setcap -r /usr/bin/caddy; fi

COPY Caddyfile.web /etc/caddy/Caddyfile
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

COPY --from=build /app/dist /srv

EXPOSE 8080

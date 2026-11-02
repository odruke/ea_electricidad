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

# Internal static site. Never published to the host.
FROM caddy:2-alpine AS web

# The official caddy image marks the binary with `cap_net_bind_service=+ep`. Under an empty
# capability bounding set (`cap_drop: ALL`) execve fails with EPERM, so the container cannot
# start. Neither service needs the file capability: the edge gets NET_BIND_SERVICE from
# Compose and this server listens on 8080. Strip it when present so hardening stays usable.
RUN if getcap /usr/bin/caddy | grep -q .; then setcap -r /usr/bin/caddy; fi

COPY Caddyfile.web /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

ENV SITE_ADDRESS=:8080

EXPOSE 8080

# Public reverse proxy and TLS terminator. Contains no site files or build tooling.
FROM caddy:2-alpine AS edge

# Same file-capability issue as the web target; the edge binds 80/443 as root with
# NET_BIND_SERVICE added by Compose, so the file capability is redundant here too.
RUN if getcap /usr/bin/caddy | grep -q .; then setcap -r /usr/bin/caddy; fi

COPY Caddyfile /etc/caddy/Caddyfile

ENV SITE_ADDRESS=:80

EXPOSE 80 443 443/udp

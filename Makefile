# EA electricidad y multiservicios — container workflow
#
# This project ships only the `web` container. TLS and public ports belong to the shared
# reverse proxy, a separate project on the VPS that serves several sites and reaches this
# one on the external `proxy` Docker network as `ea-electricidad-web:8080`.
#
# On the VPS: `make build && make up`. Locally, without the shared proxy: `make up-local`.
# Compose reads `.env` automatically; SITE_URL is required for every Compose command.

SHELL := /bin/sh

COMPOSE ?= docker compose
COMPOSE_LOCAL = $(COMPOSE) -f compose.yaml -f compose.local.yaml
PROXY_NETWORK ?= proxy
BASE_URL ?= http://127.0.0.1:8080

.PHONY: help network build up up-local down restart logs status smoke clean

help: ## Show the available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  %-9s %s\n", $$1, $$2}'

network: ## Create the shared `proxy` network if it does not exist yet
	@docker network inspect $(PROXY_NETWORK) >/dev/null 2>&1 || docker network create $(PROXY_NETWORK)

build: ## Build the web image from the current source
	$(COMPOSE) build

up: network ## Start the site behind the shared proxy (no host port) and wait for health
	$(COMPOSE) up -d --wait

up-local: network ## Start the site and also publish it on 127.0.0.1:8080 for local tests
	$(COMPOSE_LOCAL) up -d --wait

down: ## Stop and remove the containers
	$(COMPOSE) down --remove-orphans

restart: ## Restart containers without rebuilding
	$(COMPOSE) restart

logs: ## Follow the last 200 log lines
	$(COMPOSE) logs -f --tail=200

status: ## Show container state and health
	$(COMPOSE) ps

smoke: ## Run the smoke test (default http://127.0.0.1:8080; BASE_URL=https://<domain> via the proxy)
	BASE_URL="$(BASE_URL)" PROXY_NETWORK="$(PROXY_NETWORK)" ./scripts/smoke.sh

clean: ## Remove the containers and the application image
	$(COMPOSE) down --rmi all --remove-orphans

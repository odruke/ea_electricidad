# EA electricidad y multiservicios — container workflow
#
# The same targets run locally and on the staging VPS. Compose reads `.env`
# automatically; SITE_URL is required for every Compose command.

SHELL := /bin/sh

COMPOSE ?= docker compose
BASE_URL ?= http://127.0.0.1

.PHONY: help build up down restart logs status smoke deploy clean

help: ## Show the available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  %-9s %s\n", $$1, $$2}'

build: ## Build the image from the current source
	$(COMPOSE) build

up: ## Start the service and wait for health
	$(COMPOSE) up -d --wait

down: ## Stop and remove containers (volumes are preserved)
	$(COMPOSE) down --remove-orphans

restart: ## Restart containers without rebuilding
	$(COMPOSE) restart

logs: ## Follow the last 200 log lines
	$(COMPOSE) logs -f --tail=200

status: ## Show container state and health
	$(COMPOSE) ps

smoke: ## Run the smoke test against the running site (BASE_URL=... for remote)
	BASE_URL="$(BASE_URL)" ./scripts/smoke.sh

# VPS only. Order matters: stop the service to free memory, drop the previous
# image so a failed build cannot keep serving stale code, sync origin/main,
# rebuild, then start and wait for health. Volumes are never removed.
deploy: ## Deploy the latest main on the VPS (stop, drop image, sync main, rebuild, start)
	$(COMPOSE) down --remove-orphans
	docker image rm -f ea-electricidad:local || true
	git fetch origin main
	git checkout -B main origin/main
	git reset --hard origin/main
	$(MAKE) build
	$(MAKE) up
	$(COMPOSE) ps

clean: ## Remove containers and application images (volumes are preserved)
	$(COMPOSE) down --rmi all --remove-orphans

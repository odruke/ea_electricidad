# EA electricidad y multiservicios — local container workflow
#
# Local deployment is `make build` followed by `make up`. The same compose file
# and targets work on any Docker-capable host. Compose reads `.env`
# automatically; SITE_URL is required for every Compose command.

SHELL := /bin/sh

COMPOSE ?= docker compose
BASE_URL ?= http://127.0.0.1

.PHONY: help build up down restart logs status smoke clean

help: ## Show the available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  %-9s %s\n", $$1, $$2}'

build: ## Build all service images from the current source
	$(COMPOSE) build

up: ## Start the stack and wait for health
	$(COMPOSE) up -d --wait

down: ## Stop and remove containers (volumes are preserved)
	$(COMPOSE) down --remove-orphans

restart: ## Restart containers without rebuilding
	$(COMPOSE) restart

logs: ## Follow the last 200 log lines from every service
	$(COMPOSE) logs -f --tail=200

status: ## Show container state and health for every service
	$(COMPOSE) ps

smoke: ## Run the smoke test against the running stack (BASE_URL=... for another host)
	BASE_URL="$(BASE_URL)" ./scripts/smoke.sh

clean: ## Remove containers and application images (volumes are preserved)
	$(COMPOSE) down --rmi all --remove-orphans

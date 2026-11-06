#!/usr/bin/env bash
# Smoke test for the multi-container stack.
#
# With no BASE_URL it targets the local Compose stack at http://127.0.0.1 and
# also verifies the Docker topology (services healthy, only the edge publishes
# ports, edge reaches web by DNS, neither image contains Node.js).
#
# With BASE_URL set to a remote host it only runs the HTTP assertions.
set -uo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1}"
BASE_URL="${BASE_URL%/}"
EDGE_IMAGE="${EDGE_IMAGE:-ea-electricidad-edge:local}"
WEB_IMAGE="${WEB_IMAGE:-ea-electricidad-web:local}"

failures=0

pass() {
  printf 'ok   %s\n' "$1"
}

fail() {
  printf 'FAIL %s\n' "$1" >&2
  failures=$((failures + 1))
}

assert_status() {
  local path="$1"
  local expected="$2"
  local actual
  actual="$(curl -s -o /dev/null -w '%{http_code}' "$BASE_URL$path")"
  if [ "$actual" = "$expected" ]; then
    pass "GET $path -> $actual"
  else
    fail "GET $path -> $actual (expected $expected)"
  fi
}

assert_contains() {
  local path="$1"
  local needle="$2"
  local body
  body="$(curl -s "$BASE_URL$path")"
  if printf '%s' "$body" | grep -Fq "$needle"; then
    pass "GET $path contains '$needle'"
  else
    fail "GET $path does not contain '$needle'"
  fi
}

assert_header() {
  local path="$1"
  local header="$2"
  local headers
  headers="$(curl -sI "$BASE_URL$path")"
  if printf '%s' "$headers" | grep -Fiq "$header"; then
    pass "GET $path has header '$header'"
  else
    fail "GET $path is missing header '$header'"
  fi
}

assert_redirect() {
  local path="$1"
  local expected="$2"
  local actual
  actual="$(curl -s -o /dev/null -w '%{redirect_url}' "$BASE_URL$path")"
  if [ "$actual" = "$expected" ]; then
    pass "$path redirects to $expected"
  else
    fail "$path redirects to '$actual' (expected '$expected')"
  fi
}

is_local_base_url() {
  case "$BASE_URL" in
    http://127.0.0.1 | http://127.0.0.1:* | http://localhost | http://localhost:* | http://\[::1\] | http://\[::1\]:*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

check_service_running() {
  local service="$1"
  local container_id health

  if ! printf '%s\n' "$running_services" | grep -qx "$service"; then
    fail "service '$service' is not running"
    return
  fi
  pass "service '$service' is running"

  container_id="$(docker compose ps -q "$service" 2>/dev/null || true)"
  if [ -z "$container_id" ]; then
    fail "could not resolve the container for '$service'"
    return
  fi

  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$container_id" 2>/dev/null || true)"
  if [ "$health" = "healthy" ]; then
    pass "service '$service' is healthy"
  else
    fail "service '$service' health is '$health' (expected 'healthy')"
  fi
}

check_topology() {
  if ! docker info >/dev/null 2>&1; then
    fail 'Docker daemon is not reachable (start the stack or set BASE_URL to a remote host)'
    return
  fi

  running_services="$(docker compose ps --status running --services 2>/dev/null || true)"

  check_service_running edge
  check_service_running web

  if docker compose port web 8080 >/dev/null 2>&1; then
    fail 'web publishes a host port (it must use expose only)'
  else
    pass 'web has no published host port'
  fi

  if [ -n "$(docker compose port edge 80 2>/dev/null || true)" ] &&
    [ -n "$(docker compose port edge 443 2>/dev/null || true)" ]; then
    pass 'edge publishes TCP 80 and 443'
  else
    fail 'edge does not publish both TCP 80 and 443'
  fi

  if docker compose exec -T edge wget -qO- http://web:8080/healthz 2>/dev/null | grep -q '^ok$'; then
    pass 'edge resolves and reaches web over the private network'
  else
    fail 'edge cannot reach web:8080 over the private network'
  fi

  check_image_has_no_node "$EDGE_IMAGE"
  check_image_has_no_node "$WEB_IMAGE"
}

check_image_has_no_node() {
  local image="$1"

  if ! docker image inspect "$image" >/dev/null 2>&1; then
    fail "image '$image' is missing"
    return
  fi

  if docker run --rm --entrypoint sh "$image" -c 'command -v node || command -v nodejs' >/dev/null 2>&1; then
    fail "image '$image' contains Node.js"
  else
    pass "image '$image' has no Node.js binary"
  fi
}

if is_local_base_url; then
  check_topology
fi

assert_status /healthz 200
assert_status /es/ 200
assert_status /en/ 200
assert_status /fr/ 200
assert_status /es/services/ 200
assert_status /es/contact/ 200
assert_status /es/legal/ 200
assert_status /robots.txt 200
assert_status /es/missing-page/ 404
assert_status /de/ 404
assert_status /fr/missing-page/ 404

assert_redirect / "$BASE_URL/es/"
assert_redirect /es "$BASE_URL/es/"

assert_contains /es/missing-page/ 'Página no encontrada'
assert_contains /fr/missing-page/ 'Page introuvable'
assert_contains /robots.txt 'Disallow: /'
assert_contains /es/ 'noindex, nofollow'

assert_header /es/ 'x-content-type-options: nosniff'
assert_header /es/ 'x-frame-options: DENY'
assert_header /es/ 'referrer-policy: strict-origin-when-cross-origin'
assert_header /es/ 'permissions-policy: camera=(), microphone=(), geolocation=()'
assert_header /es/ 'strict-transport-security:'
assert_header /es/ "content-security-policy: default-src 'self'"
assert_header /es/missing-page/ 'x-content-type-options: nosniff'
assert_header /es/missing-page/ "content-security-policy: default-src 'self'"

css_path="$(curl -s "$BASE_URL/es/" | grep -oE '/_astro/[^"]+\.css' | head -n 1)"
if [ -n "$css_path" ]; then
  assert_status "$css_path" 200
  assert_header "$css_path" 'cache-control: public, max-age=31536000, immutable'
else
  fail 'could not find a compiled stylesheet'
fi

if curl -s -H 'Accept-Encoding: gzip' -D - -o /dev/null "$BASE_URL/es/" | grep -qi '^content-encoding: gzip'; then
  pass 'HTML is compressed with gzip'
else
  fail 'HTML is not compressed with gzip'
fi

if [ "$failures" -ne 0 ]; then
  printf '\n%s smoke assertion(s) failed\n' "$failures" >&2
  exit 1
fi

printf '\nAll smoke assertions passed.\n'

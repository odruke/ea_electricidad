#!/usr/bin/env bash
set -uo pipefail

IMAGE="${IMAGE:-ea-electricidad:local}"
PORT="${PORT:-8080}"
BASE_URL="${BASE_URL:-}"
BASE_URL="${BASE_URL%/}"

CONTAINER=""
failures=0

cleanup() {
  if [ -n "$CONTAINER" ]; then
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

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

if [ -z "$BASE_URL" ]; then
  BASE_URL="http://127.0.0.1:$PORT"
  CONTAINER="ea-electricidad-smoke-$$"

  docker run -d --rm --name "$CONTAINER" \
    -e SITE_ADDRESS=:80 \
    -p "127.0.0.1:$PORT:80" \
    "$IMAGE" >/dev/null

  ready=0
  for _ in $(seq 1 30); do
    if curl -fsS "$BASE_URL/healthz" >/dev/null 2>&1; then
      ready=1
      break
    fi
    sleep 1
  done

  if [ "$ready" -ne 1 ]; then
    fail "container did not become healthy"
    exit 1
  fi
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

root_location="$(curl -s -o /dev/null -w '%{redirect_url}' "$BASE_URL/")"
if [ "$root_location" = "$BASE_URL/es/" ]; then
  pass "root redirects to /es/"
else
  fail "root redirects to '$root_location' (expected '$BASE_URL/es/')"
fi

slash_location="$(curl -s -o /dev/null -w '%{redirect_url}' "$BASE_URL/es")"
if [ "$slash_location" = "$BASE_URL/es/" ]; then
  pass "/es redirects to /es/"
else
  fail "/es redirects to '$slash_location' (expected '$BASE_URL/es/')"
fi

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
else
  fail "could not find a compiled stylesheet"
fi

if curl -s -H 'Accept-Encoding: gzip' -D - -o /dev/null "$BASE_URL/es/" | grep -qi '^content-encoding: gzip'; then
  pass 'HTML is compressed with gzip'
else
  fail 'HTML is not compressed with gzip'
fi

if [ -n "$CONTAINER" ]; then
  if docker run --rm --entrypoint sh "$IMAGE" -c 'command -v node || command -v nodejs' >/dev/null 2>&1; then
    fail 'runtime image contains Node.js'
  else
    pass 'runtime image has no Node.js binary'
  fi
fi

if [ "$failures" -ne 0 ]; then
  printf '\n%s smoke assertion(s) failed\n' "$failures" >&2
  exit 1
fi

printf '\nAll smoke assertions passed.\n'

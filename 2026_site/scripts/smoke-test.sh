#!/usr/bin/env bash
# Post-deploy smoke test for the live site — the last step of the deploy workflow,
# also runnable by hand:  sh scripts/smoke-test.sh   (SITE_URL / GITHUB_SHA optional)
#
# 1. Waits until THIS deploy is live: every page shows the commit in the header's
#    "BUILD" readout, so we poll the homepage for it (catches a stalled Pages build).
# 2. Checks the pages and files that matter: homepage, every page in the sitemap,
#    résumé PDF, llms.txt, sitemaps, and an old-URL redirect.
# Exits non-zero (red workflow run + GitHub email) if anything is wrong.
set -uo pipefail

SITE="${SITE_URL:-https://johnnguyen.net}"
SITE="${SITE%/}"
SHA7="$(printf '%s' "${GITHUB_SHA:-}" | cut -c1-7 | tr '[:lower:]' '[:upper:]')"
WAIT_MAX="${SMOKE_WAIT_SECONDS:-600}"
failures=0

ok()   { printf '  ✅ %s\n' "$1"; }
bad()  { printf '  ❌ %s\n' "$1"; failures=$((failures + 1)); }
bust() { printf '%s' "smoke=$(date +%s)$RANDOM"; }   # dodge the 10-minute Pages cache

# ── 1. Is this deploy live? ────────────────────────────────────────────────
if [ -n "$SHA7" ]; then
  echo "Waiting for build $SHA7 to go live on $SITE (up to ${WAIT_MAX}s)…"
  waited=0
  # Fetch the whole page first: piping into `grep -q` would cut curl off at the
  # first match and, with pipefail, count a success as a failure.
  until page="$(curl -fsSL "$SITE/?$(bust)")" && grep -q "$SHA7" <<<"$page"; do
    if [ "$waited" -ge "$WAIT_MAX" ]; then
      bad "build $SHA7 not live after ${WAIT_MAX}s (Pages build stuck? check Actions → pages build and deployment)"
      exit 1
    fi
    sleep 15; waited=$((waited + 15))
  done
  ok "build $SHA7 is live (after ~${waited}s)"
else
  echo "No GITHUB_SHA set; skipping the 'is this deploy live' wait."
fi

# ── 2. Key pages and files ─────────────────────────────────────────────────
echo "Checking key URLs…"
check() { # check <path> <expected content-type substring> [<text that must appear>]
  local path="$1" type="$2" needle="${3:-}" headers body code ctype
  headers="$(mktemp)"; body="$(mktemp)"
  code="$(curl -sL -o "$body" -D "$headers" -w '%{http_code}' "$SITE$path?$(bust)")"
  ctype="$(grep -i '^content-type:' "$headers" | tail -1 | tr -d '\r')"
  if [ "$code" != "200" ]; then bad "$path → HTTP $code"
  elif ! printf '%s' "$ctype" | grep -qi "$type"; then bad "$path → unexpected $ctype"
  elif [ -n "$needle" ] && ! grep -q "$needle" "$body"; then bad "$path → missing \"$needle\""
  else ok "$path"; fi
  rm -f "$headers" "$body"
}

check /                     text/html        '<title>John Nguyen'
check /resume.pdf           application/pdf
check /llms.txt             text/            '# John Nguyen'
check /sitemap-index.xml    xml              '<sitemapindex'
check /robots.txt           text/plain       'Sitemap:'
check /og/home.png          image/png
check /projects/icrossing/  text/html        'url=/projects/bcbs-tennessee'   # old URL redirect

# Every page listed in the sitemap must load.
for url in $(curl -fsSL "$SITE/sitemap-0.xml?$(bust)" | grep -o '<loc>[^<]*' | sed 's/<loc>//'); do
  check "${url#"$SITE"}" text/html '<title>'
done

echo
if [ "$failures" -gt 0 ]; then
  echo "Smoke test: $failures problem(s) on $SITE"
  exit 1
fi
echo "Smoke test passed: $SITE"

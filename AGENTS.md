# Cvvv Store — repo notes for agents

## What this is

A **static, single-file storefront**. The entire application lives in
`index.html`: inline `<style>` (lines ~6-266) and one inline `<script>`
(lines ~511-1150) that contains all state, rendering and event wiring.
There is **no build step, no bundler, no backend, no database**.
Do not add a build toolchain unless the task explicitly asks for one.

## Running it here

```bash
docker compose -f docker-compose.base44.yml up -d   # http://localhost:3000
```

`docker-compose.base44.yml` serves the cloned source with `python -m http.server`
on port 3000 (bind-mounted, so no image rebuild is needed for edits).

There is **no hot reload**: after editing `index.html`, call `reload_preview`
so the preview picks the change up.

Healthcheck probes `http://127.0.0.1:3000/` and requires the string
`Cvvv Store` in the response, so it fails on a torn/partial document.

## Quirks worth knowing

- Products are fetched at runtime from
  `https://raw.githubusercontent.com/realpremshop/PremShop/main/products.json`
  (`CONFIG.PRODUCTS_JSON_URL`). If that fetch fails the app silently falls back
  to `localStorage` and renders an empty grid — an empty product grid is
  therefore **not** proof that rendering is broken; check the console for
  `✅ Loaded N products` or the fallback warning.
- `CONFIG.GITHUB_TOKEN` is empty/redacted in the repo. Admin "sync to GitHub"
  flows (`syncProductsToGitHub`) cannot work without a real token; do not
  invent one.
- A 10s `setInterval` auto-refresh (end of the inline script) re-fetches the
  product JSON and re-renders when the payload actually changes.
- Auth and cart are `localStorage`-based (`cvvv_users`, `cvvv_cart`, ...).
  There is no server-side session, so "logged in" state is per-browser.

## Verifying a change

Load `http://localhost:3000/` and check the console: the app logs
`🚀 Cvvv Store ready!` on boot. A JS error before that log means the page is
blank/dead — that is the failure worth chasing. The nav, cart and login modal
are the main interactive surfaces.

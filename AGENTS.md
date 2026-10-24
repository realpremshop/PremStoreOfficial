# Cvvv Store — repository notes

## What this is
The entire app is the single file `index.html` (HTML + CSS + vanilla JS, Georgian/English UI).
There is no package.json, no build step, no backend and no database. All runtime state
(users, cart, current session, locally-edited products) lives in the browser's `localStorage`,
so each browser/visitor has its own data.

## Running it in the Base44 sandbox
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
One service, `web`: `python -m http.server` on port 3000 serving the repo bind-mounted at
`/app`. Because the source is served from disk there is nothing to rebuild; a page reload
picks up edits to `index.html`. Since this is not a hot-reloading dev server, use the
preview's full reload after changing the file.

## External dependencies (not local — no credentials involved)
- Product catalog: `loadProductsFromJSON()` fetches
  `https://raw.githubusercontent.com/realpremshop/PremShop/main/products.json`.
  That file does **not** exist in the public repo (404 as of setup), so the app falls back to
  `localStorage` and an empty catalog — the Featured/Trending grids render the
  "No products yet" empty state. That is the app's designed fallback, not a crash.
- The same URL is polled every 10s to auto-refresh the catalog (skipped for the creator account).
- Creator panel writes: `syncProductsToGitHub()` pushes `products.json` to that GitHub repo with
  `CONFIG.GITHUB_TOKEN`, which is redacted in the repo (`'******'`). Product saves therefore still
  work locally (localStorage + UI) but the GitHub sync logs an error and never persists.
  Note that this token is read from client-side JS, so any real token would be public to visitors —
  do not commit one; the write path belongs behind a server if it is ever needed.

## Accounts
- Creator account is hardcoded in `CONFIG` (`CREATOR_EMAIL` / `CREATOR_PASSWORD`). Logging in with
  it unlocks the Creator dashboard at the "Creator" nav entry.
- Buyer signup is client-side only: the verification code is generated in the browser, printed to
  the console and shown in an `alert()`. No email is sent.

## How to verify it works
1. `curl -s http://localhost:3000/ | head` returns the storefront HTML.
2. Load the preview: navbar with Login/Sign Up renders, the empty-state cards appear in the
   Featured/Trending sections.
3. Sign up (any email/password ≥ 6 chars, then the 6-digit code from the alert), or log in as the
   creator, and confirm the nav switches to the signed-in state.

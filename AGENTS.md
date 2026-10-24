# LuksShop — repository notes

## What this is
A static, no-build online store: plain HTML/CSS/vanilla JS served straight from this repo.
No package.json, no framework, no backend, no database. All state (cart, accounts, orders)
lives in the browser's `localStorage`, so each browser has its own data.

- `index.html` — shell: promo bar, header/nav, footer, chat widget, script tags
- `assets/css/style.css` — dark neon theme (pink accent `#ff007f`, glass cards)
- `assets/js/data.js` — the catalog (12 products, 4 categories), delivery rules, order steps
- `assets/js/store.js` — localStorage state: cart, accounts, orders, helpers
- `assets/js/views.js` — page templates (home, catalog, product, cart, checkout, order, status, contact, auth, account)
- `assets/js/app.js` — hash router, click/submit handlers, rule-based chat assistant

## Running it in the Base44 sandbox
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
One service, `web`: `python -m http.server` on port 3000 serving the repo bind-mounted at `/app`.
The source is read from disk on every request, so nothing needs rebuilding after an edit — but this
is not a hot-reloading dev server, so use the preview's full reload to see changes.

## Routing
Hash-based, so any static host works: `#/`, `#/catalog?cat=&q=&sort=`, `#/product/:id`, `#/cart`,
`#/checkout`, `#/order/:code`, `#/status?code=`, `#/contact`, `#/login`, `#/signup`, `#/account`.
A path that matches no route renders the not-found view.

## Non-obvious behaviour
- **Product images** are hot-linked from `media.base44.com` (public CDN). Each `<img>` has an
  `onerror` fallback that swaps in an emoji tile, so the grid still renders offline.
- **Orders are device-local.** Checkout creates an order (`LUKS-XXXXXX`) in `localStorage`;
  the status page and account page read from that same local list, so a code only resolves in the
  browser that placed the order. Order status stays `received` — nothing advances it, since there
  is no admin surface.
- **Accounts are device-local** and passwords are stored in plain text in `localStorage`. This is
  demo-grade only; put authentication on a server before real use.
- **Contact details and the TikTok handle are placeholders** (`@luksshop_official`,
  `+995 555 00 00 00`, `info@luksshop.ge`, footer links) — replace with the real ones.
  Ordering is handled by direct messages on TikTok; there is no checkout backend.
- **The chat widget is a rule-based helper** (keyword matching over the catalog), not an LLM call.

## How to verify it works
1. `curl -s http://localhost:3000/ | head` returns the storefront shell.
2. Home renders hero, 4 feature cards, 4 categories and "რჩეული პროდუქტები" with product images.
3. `#/catalog` lists 12 products; search, category chips and the sort select filter the grid and
   update the "ნაპოვნია N პროდუქტი" counter.
4. `+` on a product adds to the cart (header badge increments) → `#/cart` → `#/checkout` →
   submitting the form shows an order code on `#/order/LUKS-XXXXXX`.
5. `#/status` resolves that code; `#/signup` then `#/account` lists orders.

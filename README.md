# Lubby's Locs — spec website + branded store (Couture House Co.)

A finished, static website for **Lubby's Locs**, a loc salon at 1323 W Busch Blvd, Suite D, Tampa, FL 33612 (North Tampa).
Concept: **"The Loc Society"** (her own phrase, "haircare for the loc society"). Built as a sales pitch, ready to launch.

## Pages
| File | What it is |
| --- | --- |
| `index.html` | Home: hero, ratings, new-client offer, the scroll-drawn loc journey, menu at a glance, mission, gallery teaser, classes, "Take the care home" store strip + bundle, reviews, quick facts, FAQ |
| `services.html` | Full Booksy menu (66 services + 2 policy items) with sticky category chips |
| `classes.html` | 1-on-1 loc class ($500) and loc styling lesson ($75) |
| `gallery.html` | 45 real photos, filter chips by service, keyboard lightbox |
| `shop.html` | Lubby's Locs Hair Care store: filters, sort, bag drawer, bundle |
| `shop/<product>.html` | 7 product pages (Hair Butter, Growth Oil, Velvet Durag, Premium Silk Durag, Hair Bonnet Regular, Loc Stocking Cap, Hair Bonnet XL) |
| `visit.html` | Address, hours approach, policies, amenities, Netlify contact form |
| `404.html` | Branded not-found page |

## How the store works
- Vanilla JS bag drawer on every page (add, quantity edit, remove, subtotal). Saved in `localStorage` (wrapped in try/catch; falls back to memory).
- **Checkout routes to her real Square store** (where inventory and payments live): one product goes straight to that product's Square page; several products show a "Finish checkout on our secure Square store" step with a Square link per item. No payment data is ever collected on this site.
- Without JavaScript, every product shows a "Buy on Square" link instead.

## Preview locally
```
cd lubbys-locs-tampa
python3 -m http.server 8080
# open http://localhost:8080/
```
(Double-clicking `index.html` also works; fonts and the bag need a server for the best preview.)

## Deploy (Netlify)
1. Push this folder to a GitHub repo.
2. Netlify > Add new site > Import from Git > pick the repo. Build command: none. Publish directory: `.`
3. Site name: `lubbys-locs-tampa` (canonical URLs already point to https://lubbys-locs-tampa.netlify.app/).
4. Forms: Netlify detects the `contact` form automatically on first deploy. Turn on email notifications in Site settings > Forms.

## Domain
Proposed: **lubbyslocs.com** (see LAUNCH-NOTES.md). When it is live, replace the Netlify URL everywhere (canonical, og:url, og:image, JSON-LD, sitemap.xml, robots.txt, llms.txt).

## Tech notes
- Static HTML/CSS/vanilla JS. No frameworks, no external requests at runtime. Fonts self-hosted (Archivo variable, Archivo Black, Yellowtail from Fontsource).
- Stylesheets are versioned (`site.css?v=20261012a`). Bump the version on every CSS change, on every page, because `/assets/*` is cached as immutable.
- `netlify.toml`: security headers + strict CSP, asset caching, pretty URLs, branded 404, and README/LAUNCH-NOTES/QA-REPORT blocked from public view.

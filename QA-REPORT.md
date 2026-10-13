# QA report: Lubby's Locs spec site + store (Oct 12, 2026)

Served locally with `python3 -m http.server 8863`, tested with Playwright Chromium. Scripts live in `/home/claude/salons/qa/lubbys-locs-tampa/` (qa.py, cart_test.py, shoot.py); screenshots in `.../shots/`.

## Visual review (screenshots read and iterated)
All 14 pages captured full-page at 390, 768 and 1440 after scrolling through (reveals settled), plus mid-scroll captures of the growing loc and the members card, the bag drawer states, lightbox, mobile menu and JS-off views. Fixes made from the review:
- Product strip snapped its first card to the edge (added scroll-padding) and was clipped at 1240px on desktop (now bleeds to the viewport edge, aligned to the grid).
- "Menu at a glance" photo caption sat on the red offset block (block moved top-right).
- Mission quote wrapped one word per line at 1440 (width fixed); gallery teaser left holes on desktop (grid re-tiled).
- Page heroes were centered instead of left-aligned at 1440; services category chips scrolled the active chip half out of view.
- CTA logo disc sat behind body copy on phones (moved and dimmed); bone strip under the footer on phones (padding moved into the footer).
- Rotating logo stamp on product pages pushed the page 10px wide while spinning (now clipped to its circle); 404 disc likewise.
- Toast covered the bag subtotal (now screen-reader only while the bag is open); bag button hidden and empty when JavaScript is off.
- Copy: removed unverified "schedule changes week to week"; gallery labels for two uncaptioned Booksy uploads; "Any shipping or pickup options".
- Share image: sub-line collided with proof chips (re-laid out, checked at full size).

## Automated checks
| Check | Result |
| --- | --- |
| Console errors, page errors, failed requests, every page at 390/768/1440, served with the production CSP | 0 (42/42) |
| Horizontal overflow, static, 390/768/1440 | none (42/42) |
| Horizontal overflow sampled every 100 ms while wheel-scrolling the full page at 360/390/414 | none (42/42) |
| Sticky header stays at top: 0 while scrolling | yes (42/42) |
| Local links, assets, srcset entries, lightbox sources | 963/963 resolve |
| In-page anchors (incl. services.html#category links) | 554/554 exist |
| Absolute netlify.app URLs in pages, sitemap, robots, llms.txt | 166/166 resolve to files |
| JSON-LD blocks (HairSalon, WebSite, FAQPage, BreadcrumbList, ItemList, Product+Offer) | 31/31 parse |
| Exactly one h1 per page | 14/14 |
| Every img has alt, width, height | 14/14 pages |
| Titles <= 60 chars, descriptions <= 155 | 14/14 |
| Canonical = https://lubbys-locs-tampa.netlify.app/... | 13/13 (404 has none, noindex) |
| CSS linked with ?v=20261012a (site.css and fonts.css) | 14/14 |
| Emoji scan (all text files, base64 favicon payload excluded) | none |
| Placeholder or unfinished-text scan | none |
| Stable-scrolling block is the last rule; no overflow-x: clip on html/body/main | yes |
| Tap targets >= 44px (non-inline controls) at 390 | 14/14 pages |
| Reduced motion: all content visible, loc strand fully drawn | yes |
| JavaScript off: content visible, product pages show "Buy on Square" links | yes |
| Mobile menu: opens, focus moves in, Esc closes, aria-expanded updates, focus returns | yes |
| Gallery: filter counts (Barber = 4), lightbox opens, arrow keys, Esc closes | yes |
| Contact form: validation errors, local preview success state | yes |
| External domains linked | booksy.com, lubbys-locs.square.site, instagram.com, google.com (maps), search.google.com (reviews), couturehouse.co |

## Store / bag drawer (cart_test.py: 28/28 pass)
- Filters (Hair care = 2, Protect your style = 5), sort by price and name, help tile stays last.
- Add from card opens the drawer: count 1, subtotal $10.00. Esc closes.
- Product page stepper to 3, Add to bag: count 4, $40.00. Bag persists across pages and after reload.
- In-drawer +/-, typed quantity (5) and Remove all update line totals and subtotal correctly; empty state shows.
- Bundle "Add both to bag" adds Hair Bonnet XL + Hair Butter = $18.00.
- Checkout with one product navigates to its real Square URL (https://lubbys-locs.square.site/product/hair-butter/1).
- Checkout with several products shows the "Finish checkout on our secure Square store" step; links are the exact Square product URLs and open in a new tab; pickup note shown as a suggestion only.
- localStorage blocked (throws): bag still works in memory, no errors.

## Not verified here
- Real iPhone Safari (verified in Chromium emulation only; ask Fred to test in a Private tab).
- Lighthouse scores (no runner here). Built to budget: no runtime third-party requests, fonts self-hosted with the display face preloaded, hero image preloaded with fetchpriority=high, lazy images with dimensions and srcset, deferred script.
- Netlify Forms submission and headers (need a live deploy). Square pages were stubbed in tests (no live network calls).

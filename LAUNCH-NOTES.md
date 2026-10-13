# Lubby's Locs — launch notes (confirm with the owner before launch)

Live preview domain: https://lubbys-locs-tampa.netlify.app/ (used for every canonical, og:url, og:image, JSON-LD, sitemap, robots and llms.txt URL).
Proposed custom domain: **lubbyslocs.com** (check availability; alternatives lubbyslocs.co, lubbyslocstampa.com).

## Facts to confirm
- **Hours.** Google shows Mon 10 AM to 6 PM and Tue opening 10 AM; Booksy showed Oct 12 and 13 as closed and Fri 11 AM to 8 PM. The site deliberately shows no fixed hours table: "Book online for live availability" + "Call or text for after-hours appointments ($25 convenience deposit)". Get her real weekly hours, then add a table and `openingHoursSpecification` to the JSON-LD.
- **Name punctuation.** Site uses "Lubby's Locs" (Google, logo, Square). Booksy lists "Lubbys Locs"; suggest she updates Booksy.
- **Who "Lubby" is.** Copy refers to "Lubby" only (policies are signed Lubby; the class is "a hands on class with Lubby"). Reviews mention "JJ" / "Juana". Confirm how she wants to be named and whether to add a short About section with her photo.
- **Phone** (813) 520-1648 comes from Google only (also printed on her butter jar label). Confirm it takes texts.
- **Ratings** 4.9 / 181 Google and 5.0 / 305 Booksy as of Oct 12, 2026. Update counts at launch. Only the Google rating is in schema (home page).
- **Review quotes** are short paraphrases of public Booksy reviews, first name or initial only. Confirm she is comfortable with the names shown, or switch to initials.
- **Amenities** (parking, wheelchair accessible, child-friendly, Wi-Fi, credit cards, loyalty program) are from Booksy. Confirm, and ask how the loyalty program works so it can be described.
- **Menu and prices** copied from Booksy on Oct 12, 2026 (66 services + deposit and inconvenience-fee items). Descriptions are shortened paraphrases. "Military wash & retwist" appears in old reviews but not on the menu: not shown, no military discount claimed.
- **Mission quote** is from her Google "From the business" text (truncated there). Ask for the full paragraph.
- **Neighborhood.** "North Tampa" / "West Busch Blvd" is used as geography only.
- **Google review link** uses Place ID `ChIJw-md-NTHwogRBot3dB6f8Qw` (seen in an aggregator URL). Verify it opens her listing.

## Store (shop.html + shop/*.html)
- 7 products, names, prices and Square URLs verified on her Square store Oct 12, 2026. Product descriptions say what each item is plus general loc-care use. No ingredients and no results claims. "Growth Oil" is the product name only; the page states the name is not a promise.
- **Availability** is not in Product schema (in-stock status could not be confirmed). Add `availability` once she confirms stock.
- **Checkout today:** the bag hands off to Square. One product opens its Square product page; several products show a list of Square links (her Square site holds the real cart, inventory, tax and payment). The customer re-adds quantities on Square. This works with zero setup.
- **Shipping vs pickup:** not verified. The site only suggests "ask when you book or text to confirm" for salon pickup. Confirm what Square checkout offers (shipping, local pickup at the salon, local delivery) and update the copy.
- **Inventory sync:** prices are hard-coded in `assets/js/site.js` (product map) and the HTML. If she changes a price on Square, update both (or move to the API option below).
- **Upgrade offer (pitch):** move checkout on-site so the bag pays in one step: (a) Square Web Payments SDK + Catalog/Inventory API via a small Netlify Function (keeps her existing Square account and inventory), or (b) migrate the store to Shopify (Buy Button or Storefront API). Either removes the multi-link checkout step.
- Product photos are her own Square photos, cleaned onto a bone sweep. The durag photos on Square are tiny (about 190px); ask for larger photos.

## Photos and credits
- All salon photos are from her public Booksy portfolio/inspiration (service captions kept as labels in the gallery). Logo from Booksy. Must be approved/licensed by the owner before launch.
- Avoided photos centering children's faces; the two "Kids" gallery photos are top/back views. Skipped flyers, collages with logos/text, phone screenshots.
- Gallery labels "Booksy portfolio" are on two Booksy "inspiration" uploads with no service caption.

## Items to swap / add after launch
- Real weekly hours table (see above).
- An About/meet-Lubby section with her portrait, if she wants one.
- Larger product photos (durags, stocking cap, bonnet).
- Instagram feed link checked (@lubbyslocs from Booksy).

## Forms
- The visit-page contact form is a Netlify Form (`contact`, honeypot `company`). It submits only once deployed on Netlify; on localhost it shows a preview-mode message. Turn on email notifications in Netlify.

## Cache
- CSS is linked as `site.css?v=20261012a` and `fonts.css?v=20261012a`. Bump on every CSS change, on every page (including shop/*.html and 404.html). Test on iPhone in a Private tab.
- If the share image changes, give it a new filename (share-2.jpg) and update og:image/twitter:image.

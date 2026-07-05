# Design brief — Vype Bar

## Design read
An after-dark cocktail bar's own site: the guest checks hours, reads the
menu, and taps through to Instagram before walking in. Calm, confident,
unhurried — not a nightclub flyer.

## Concept spine
"The bar after closing, lit for one guest" — the page reads like the room
itself: dim, warm, one glass in focus. Typography carries the weight instead
of animation.

## Delivery tier
**editorial** — calm/minimal, typography + one strong image + bespoke chrome,
micro-motion only (hover states, on-mount reveals). Chosen deliberately: this
build runs on a constrained free-tier credit budget, so the cinema tier's
scroll-scrub video and full asset kit are out of scope for v1. Documented
trade-off (agreed with the user, not a shortcut): ONE generated hero image
carries the whole visual layer; every other surface is CSS/typography.

## Locked palette
- Background primary: `#0d0c0e` (near-black, warm neutral undertone — not
  pure black)
- Background secondary: `#17151a`
- Border: `#2a262d`
- Text primary: `#f5f2ef`
- Text secondary: `#9a939c`
- Accent (single saturated pop): `#e2385f` (raspberry/crimson) — used only for
  the hero scrim glow, the one CTA underline, prices, and hover states.

Defense: avoids all five banned families (no orange/amber ember-on-graphite,
no neon cyan/blue/green, no beige+brass, no AI purple, no repeat from a prior
build in this chat — first build). Raspberry-on-near-black reads as a bar's
own low glow rather than a stock "AI dark mode" accent.

## Locked type
`Outfit` (display, geometric, confident at large sizes) + `IBM Plex Mono`
(prices, labels, category kickers). Sans only — no serif; this is a modern
bar, not a heritage/editorial institution.

## Tier-1 technique
None required (editorial tier is exempt from the Tier-1 mandate). The one
signature move: the hero image sits full-bleed with a warm-to-transparent
scrim; the headline fades/rises in on mount (no scroll-gated opacity).

## Section plan
1. Nav — sticky, wordmark + "Menü" + Instagram glyph link.
2. Hero — full-bleed generated image, scrim, headline + subtext + one CTA
   (text-link, drawing underline).
3. About — text-only editorial block, no image (layout contrast vs hero).
4. Menu — grouped list by category, sourced live from D1 (admin-editable).
5. Visit — two-column: hours/address | WiFi (rendered only when the admin has
   set it — empty on launch by design, not a placeholder string).
6. Footer — site name, Instagram (conditional), discreet "Yönetim" admin link.

Eyebrow budget: ceil(6/3) = 2. Used: 0 (dropped in favor of direct
headlines — see design-recipe.md §4).

## CTA inventory
- **"Menüyü Gör"** (hero, scrolls to `#menu`) — its own component, drawing
  underline that fills in on hover, the ONLY rationed garment used on the
  page.
- Instagram glyph (nav + footer) — icon link, not a CTA garment.
- "Yönetim" (footer, admin login) — plain text link, deliberately
  unstyled/discreet, not part of the CTA inventory.

## Asset plan (credit-conscious v1)
- Hero visual: 1 generated image (`nano_banana_pro`, 16:9), no second
  candidate, no interaction pair.
- No section plates, no generated icon set, no logo mark (wordmark is set in
  type). Head kit: a simple generated/derived favicon from a monogram is
  deferred to the publish step (only generated when the user asks to
  publish/share, per the publish gate).
- Everything else on the page is CSS/typography — intentional, not a
  fallback.

## Backend (real, not a mock)
Type `website` with a real backend: D1 (`site_settings`, `menu_categories`,
`menu_items`), password-protected admin at `/admin` (signed HMAC session
cookie, no Higgsfield/fnf auth — this is the site's own admin, not a
Higgsfield account). Placeholder menu content ships on launch; the owner
replaces it from `/admin`. WiFi fields ship empty on purpose.

## Second site (not yet built)
A second bar, "Hype Bar", gets its own `create_website` + this same flow
later — separate concept spine, separate palette (must differ on the
anti-convergence axes from this build).

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

## Update — German relaunch (real venue)

The build pivoted from a fictional placeholder brand to the real business:
**Vype Lounge**, a shisha/cocktail lounge at Darmstädter Str. 75, 64331
Weiterstadt, Germany (real site: vype-bar.de). Changes made and why:

- **Language/currency**: public site now German, prices in EUR. The admin
  panel stays Turkish (the owner's own language for day-to-day editing) —
  a deliberate split between customer-facing and operator-facing surfaces.
- **Real photography, zero extra generation cost**: the user authorized
  pulling photos directly from the real site (vype-bar.de). Hero + gallery
  + a few menu items now use real venue photos (downloaded, resized,
  reoriented) instead of AI generation — supersedes the original "1 AI
  hero image" plan and spends no additional credits.
- **Menu item images**: `menu_items.image_url` (nullable) is now
  admin-editable; category headers stay text-only per the user's request.
- **Shisha category added**: the real business is primarily a shisha
  lounge (confirmed via the real site's title tag and door signage), so a
  Shisha category with starter flavors now leads the menu.
- **New pages**: `/impressionen` (real photo gallery, mirrors the real
  site's page of the same name), `/impressum` and `/datenschutz` (German
  legal requirement — drafted from known facts, flagged where the owner
  must still supply the responsible person's legal name before going live).
  The real site's `/karte` page was deliberately NOT mirrored — its content
  already exists here as the Menü section.
- **Hero motion**: replaced the static hero with `ScrollDepthHero` — a
  scroll-linked perspective/scale/rotateX effect (transform-only, no
  opacity gating, `prefers-reduced-motion` disables it entirely). No new
  motion library, no WebGL/3D asset.

## Update — Karte split into its own page, homepage rebuilt as a business
page

The owner asked for the homepage to read like a proper venue site rather
than menu-first: `/karte`'s content moved from a homepage section to its
own route (`/menu`, own header/footer, same `getPublicMenuData` loader).
The homepage no longer renders any menu items directly — it closes with a
short "Karte" teaser (heading + one line + CTA) instead.

The freed-up homepage space became three new sections, referencing the
real site's own editorial rhythm (photo + claim, alternating sides, one
saturated band) but built from our own real venue photos and reworked
layout rather than copied:
- Two `FeatureSplit` blocks (cocktails; atmosphere, the second with a CTA
  into `/impressionen`), each pairing a `TiltImage` with a short claim.
- One `AtmosphereBand` — the page's one saturated full-bleed section
  (three-across: photo / text card / photo), same "one warm band on an
  otherwise calm page" idea as the accent-brown `/menu` price kicker, just
  at section scale.
- A new `Reveal3D` component (`components/Reveal3D.tsx`) gives every new
  section a one-shot settle-into-place on first scroll-into-view
  (translateY + rotateX + opacity, IntersectionObserver-gated,
  `prefers-reduced-motion` shows the resting state immediately, no
  observer attached). This is an on-mount reveal per the editorial tier's
  motion budget, not a second scroll-scrubbed effect — the hero keeps its
  exclusive continuous scroll-link.
- `MenuCta` now renders through `Link` for internal paths (was
  anchor-only) so the hero CTA and nav can route to `/menu` with
  client-side navigation instead of an in-page anchor.
- Extracted `SiteFooter` (was a page-local `Footer` in `index.tsx`) so
  `/menu` and `/` share the same footer instead of a duplicated copy.

## Update — dark palette (owner-specified)

The owner gave an exact background hex, `#211A16`, as closer to the real
Vype tone than the cream pass above. This flips the whole `--color-vb-*`
token set from light back to dark (closer to the original locked palette
before the German-relaunch cream pivot, but a warmer, less neutral near-
black chosen by the owner rather than the original `#0d0c0e`):
- `--color-vb-bg: #211a16`, `--color-vb-bg-secondary: #2c231d`,
  `--color-vb-border: #3d332c`, `--color-vb-text: #f2ece2`,
  `--color-vb-text-secondary: #b0a496`.
- `--color-vb-accent` moved from the mid-brown `#674e42` to a lighter
  gold-taupe `#c9a876` — the mid-brown read at ~1.7:1 against the new dark
  body (illegible for kickers/hover/focus text, which is accent's main
  use). The one place accent is used as a *background* (`AtmosphereBand`)
  flipped its foreground from `text-vb-cream` to `text-vb-bg` to keep
  reading dark-on-gold instead of light-on-light.
- `--color-vb-cream` (fixed light tone for hero overlay content) is
  unchanged — it already worked against the dark hero scrim and still
  does.
- `theme-color` meta and the root `colorScheme` flipped back to
  `#211a16` / `dark`; `favicon.svg` recolored to match (dark rect, gold
  stroke). The admin dashboard shares the same tokens, so it goes dark
  too — not asked for specifically, but keeping one token set rather than
  forking a second palette for the operator-only surface.

## Second site (not yet built)
A second bar, "Hype Bar", gets its own `create_website` + this same flow
later — separate concept spine, separate palette (must differ on the
anti-convergence axes from this build).

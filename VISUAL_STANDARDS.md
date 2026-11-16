# Cooper Mapes Site — Visual Standards

A reference for Claude Code (and any developer) to maintain visual consistency across the codebase.

---

## 1. Typography

Two typefaces only. No substitutions. (Changed 2026-11-14 from Anton + Inter.)

### Alfa Slab One — Display
- **Source:** `next/font/google` in `app/layout.tsx` → CSS variable `--font-display`
- **Role:** Carousel titles, nav mobile overlay, "Sent!" confirmation, project h2s. **Page h1s are logo images, not text** (see §9).
- **Weights:** 400 (single weight — the only weight available)
- **Case:** ALWAYS uppercase (`text-transform: uppercase`)
- **Tracking:** `letter-spacing: 0`. Anton's negative tracking makes Alfa's glyphs collide — never use negative tracking here.
- **Line height:** Compressed — `.84` to `1.02` depending on size
- **License note:** SIL OFL with Reserved Font Name "Alfa Slab" — a modified copy of the font must be renamed.

### Piazzolla — Everything Else
- **Source:** `next/font/google` in `app/layout.tsx` → CSS variable `--font-body`. Variable font: do **not** pass a `weight` list (it triggers a Google Fonts "exactly one entry" error).
- **Role:** Body copy, nav links, labels/eyebrows, form fields, buttons, captions, badges, footer
- **Weights:** 400 (regular), 500 (medium), 600 (semibold)
- **Case:** Sentence case for body; UPPERCASE for small UI labels
- **Tracking:** Normal for body; `letter-spacing: 1px` – `1.6px` on uppercase labels

### Body Size Scale (four sizes only)
Min 14, max 24, even numbers only, max four sizes. Currently:

| Tier | Size | Used for |
|---|---|---|
| Subheader | `22px` | Page intros (Projects, Contact) |
| Default | `20px` | Main paragraphs (About bio), nav links |
| Secondary | `18px` | Project descriptions, form labels and inputs, not-found body, Home CTA |
| Tertiary | `16px` | Buttons, tag pills, captions, meta, audio player, footer, eyebrows (fluid `clamp(16px, 1.45vw, 22px)`) |

Don't introduce sizes outside this scale. Fluid `clamp()` is only for display text and the Home eyebrow.

### Mobile Size Scale (three sizes: 16 / 18 / 20)
Decided 2026-11-16. On mobile (`isMobile`, ≤768px) body text uses only 16 / 18 / 20 — the 22px tier does not exist on mobile. Desktop is unchanged. Set via `isMobile ? … : …` inline, never by deleting the desktop value.

| Tier | Size | Used for (mobile) |
|---|---|---|
| Primary | `20px` | About bio, Projects intro and Contact intro (were 22 — drop to 20), Contact sub-copy |
| Secondary | `18px` | Project descriptions, form labels/inputs, **all primary buttons** (Home CTA, Projects "Try The Tool", Contact "Send Message"), not-found body |
| Tertiary | `16px` | Tag pills, captions, carousel meta, audio player, About hover label, "(required)", error text, Home eyebrow (fixed 16 on mobile, not fluid) |

**Mobile footer exception: `14px`** for the copyright/tagline and the email (still within the 14px minimum). Desktop footer stays 16px.

Display text (Alfa Slab One) keeps its fluid sizes on mobile and is outside the scale. The hidden skip-link is 14px.

### Typographic Roles in Practice

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page h1 (Projects, Portfolio, About, Contact) | Logo image | em-sized off the h1 font-size, `clamp(44px, 6.5vw, 80px)` | — | — |
| Hero h1 (Home wordmark) | Logo image | `clamp(43.2px, 8.64vw, 115.2px)` | — | — |
| Carousel titles | Alfa Slab One | `clamp(22px, 2.8vw, 32px)` | 400 | `#111111` |
| Eyebrow / section label | Piazzolla | `clamp(16px, 1.45vw, 22px)` | 500 | `#1254D9` |
| Body copy | Piazzolla | `20px` (About), `18px` (descriptions) | 400 | `#5A5A5A` or `#3A3A3A` |
| Nav links | Piazzolla | `20px`, `44px` gap | 500 | `#111111` |
| Buttons | Piazzolla | `16px` (Home CTA `18px`) | 600 | `#FFFFFF` |
| Form labels (Contact) | Piazzolla | `18px` | 600 | `#111111` |
| Form inputs | Piazzolla | `18px` | 400 | `#111111` |
| Meta / captions | Piazzolla | `16px` | 500 | `#5A5A5A` (`#9A9A95` is only 2.83:1 on white — fails AA, don't use for text) |
| Carousel meta labels / values | Piazzolla | `16px` | 500 | `#5A5A5A` / `#111111` |
| Audio player title / name / time | Piazzolla | `16px` | 600 / 500 / 500 | `#111111` / `#5A5A5A` / `#5A5A5A` |

---

## 2. Color Palette

### Core
| Token | Hex | Usage |
|---|---|---|
| Primary text | `#111111` | Default body text, headings |
| Background white | `#FFFFFF` | Main page background, card surfaces |
| Background gray | `#EAEAEA` | Alternating section backgrounds, page canvas |
| Background dark | `#020201` | Not currently used as a full-section background (Portfolio is now white, Home's dark before/after panel was removed) — kept as a token for any future dark section |
| Subtle surface | `#FAFAF8` | Table rows, info cards |
| Sidebar surface | `#F7F6F4` | Wizard sidebar, form sidebars |

### Accent
| Token | Hex | Usage |
|---|---|---|
| Accent blue | `#1254D9` | CTAs, eyebrow labels, bullet squares, progress indicators, links on hover |
| Accent blue hover | `#0E45B5` | Button hover state |
| Accent blue (dark bg) | `#5B7BD6` | Labels and accents on `#020201` backgrounds |

### Text / Muted
| Hex | Usage |
|---|---|
| `#3A3A3A` | Body copy on white, stronger than default muted |
| `#4A4A4A` | Service body copy |
| `#5A5A5A` | Standard body muted |
| `#6A6A6A` | Secondary form text, subtitles |
| `#9A9A95` | Meta labels, table secondary, stat label |
| `#A0A09B` | Dimmed eyebrow (e.g. copyright) |
| `#B6B5AD` | Display numerals on gray background |
| `#D5D4CE` | Display numerals on white background |

### Borders / Dividers
| Hex | Context |
|---|---|
| `#E2E1DC` | Main section dividers on white |
| `#DCDBD7` | Card and service block borders |
| `#EDECE8` | Subtle inner row borders, table rows |
| `#CFCEC9` | Form input borders (default) |
| `#E4E3DE` | About section internal borders |
| `#242422` | Dividers on dark (`#020201`) background |
| `#2E2E2C` | Button borders on dark background |

---

## 3. Spacing Scale

**Base unit: 16px. All values snap to this rhythm.**

| Step | Value | Multiplier |
|---|---|---|
| xs | `4px` | × 0.25 |
| sm | `8px` | × 0.5 |
| md- | `12px` | × 0.75 |
| md | `16px` | × 1 |
| lg- | `24px` | × 1.5 |
| lg | `32px` | × 2 |
| xl | `48px` | × 3 |
| 2xl | `64px` | × 4 |
| 3xl | `96px` | × 6 |
| 4xl | `128px` | × 8 |
| 5xl | `192px` | × 12 |
| 6xl | `256px` | × 16 |
| 7xl | `384px` | × 24 |
| 8xl | `512px` | × 32 |

### Usage Guidelines

**Controls**
- Badges: `4px` top/bottom / `12px` left/right
- Carousel nav buttons: `8px` / `16px`
- Nav + service links: `12px` / `24px`
- Form fields: `12px` top/bottom / `16px` left/right
- Primary buttons: `12px` top/bottom / `24px` left/right

**Page Gutters**
- Horizontal: `clamp(24px, 5vw, 64px)` (fluid, never hardcoded)
- Nav height: `98px` fixed

**Section Blocks**
- Vertical section padding: `clamp(48px, 6vw, 96px)` typical; up to `clamp(64px, 7vw, 96px)` for hero-weight sections
- Max content width: `1180px` (standard), `1320px` (portfolio), `560px` (contact form — single centered form, not the wide multi-column layout used elsewhere)
- Hero top padding max: `384px`

---

## 4. Layout & Grid

- **Single-column max-width container** centered with `margin: 0 auto` and horizontal `clamp()` gutters.
- **Two-column flex rows** with `flex-wrap: wrap` and `gap: clamp(40px, 5vw, 72px)` for service and about layouts. Each column uses `flex: 1 1 340px` / `flex: 1 1 380px` so they collapse naturally on mobile.
- **Nav is fixed**, `z-index: 60`, `height: 98px`. All page content has `padding-top: 98px`.
- **Sections alternate** between `#FFFFFF` and `#EAEAEA` backgrounds. Dark sections (`#020201`) are used sparingly for strong contrast moments.
- **No border-radius** on layout elements, service cards, buttons, or badges — sharp rectangular corners throughout. Exceptions: radio inputs (`border-radius: 9999px`, see `globals.css`) and the Portfolio carousel's pagination dots (small circular indicators, not a card/button/badge).

---

## 5. Component Patterns

### Buttons (Primary)
```css
background: #1254D9;
color: #FFFFFF;
border: 1.5px solid #1254D9;
padding: 15px 24px;
font-size: 16px;
font-weight: 600;
letter-spacing: 0.6px;
text-transform: uppercase;
border-radius: 0; /* sharp corners */
cursor: pointer;
transition: all 0.2s ease;

/* Hover */
background: #0E45B5;
border-color: #0E45B5;
```

### Eyebrow / Section Labels
```css
font-family: var(--font-body), Georgia, serif;
font-size: 16px;
font-weight: 500;
letter-spacing: 1.4px; /* or 1.6px */
text-transform: uppercase;
color: #1254D9;
```

### Bullet Points (service lists)
A 7×7px square, no border-radius, color `#1254D9`, `margin-top: 8px`, paired with 18px / line-height 1.6 body text.

### Form Inputs
```css
padding: 12px 14px;
border: 1px solid #DCDBD7;
font-size: 18px;
color: #111111;
background: #FFFFFF;
outline: none;
/* Focus (via global :focus-visible, not a custom input rule) */
outline: 2px solid #1254D9;
```
No border-radius. Placeholder color: `#A6A5A0`.

### Pill Badge (exception to no-radius rule)
```css
background: #1254D9;
color: #FFFFFF;
font-size: 16px;
font-weight: 500;
letter-spacing: 1px;
text-transform: uppercase;
padding: 4px 12px;
border-radius: 999px;
```

---

## 6. Motion & Transitions

- **Standard UI transitions:** `0.2s ease` — buttons, nav links, opacity changes
- **Nav background scroll transition:** `0.35s ease`
- **Carousel / entrance animations:** `0.55s cubic-bezier(.22, .61, .36, 1)` — card transforms, title reveals
- **Staggered subtitle reveal:** `opacity 0.4s ease 0.18s, transform 0.4s ease 0.18s`
- **Image/overlay crossfades:** `0.35s ease`

---

## 7. Base Resets

Always include at the top of any stylesheet:
```css
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--font-body), Georgia, serif;
  color: #111111;
  background: #FFFFFF;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
input, select, textarea, button { font-family: inherit; }
::placeholder { color: #A6A5A0; }
```

---

## 8. Dark Section Overrides

Not currently applied anywhere in the live site (Portfolio and Home's dark panel were both converted to light backgrounds). Kept as reference for any future dark section — when inside a `background: #020201` section, override colors as follows:

| Element | Dark-bg value |
|---|---|
| Heading text | `#FFFFFF` |
| Body / meta text | `#9A9A95` |
| Eyebrow / labels | `#5B7BD6` |
| Dividers | `#242422` |
| Counter / index | `#1254D9` (unchanged) |
| Card surface | `#0E0E0D` |
| Card border | `#242422` |
| Button border (outline) | `#2A3A60` (default), `#5B7BD6` (hover) |

---

## 9. Image & Media Conventions

- All images: `object-fit: cover`, never stretched
- **Page-title logos** (`public/projects-logo.png`, `selected-works-logo.png`, `about-logo.png`, `name-wordmark.png`, `contact-logo.png`): PNGs cropped to the ink bounding box and rendered with `next/image` inside the h1. Height is set in `em` off the h1 font-size so the cap height matches Alfa Slab One (cap height = 0.778em): image height = (image px height ÷ cap-letter px height) × 0.778em. Top/bottom margins in `em` reproduce the old text line box so content below doesn't shift. Set `maxWidth: "none"` on any logo wider than its container — Tailwind preflight's `img { max-width: 100% }` otherwise squashes fixed-height images. Fit caps use `min(clamp(...), calc((100vw - 2 * gutter) / <logo width in em>))` on the h1 font-size so they never overflow on phones.
- Photo panels use `image-slot` web component for drag-and-drop replacement
- Portfolio carousel cards: square (`aspect-ratio: 1/1`), `clamp(220px, 28vw, 340px)` wide (`CoverflowCarousel.tsx`)
- About photo: `flex: 0 0 35%` of the row, `object-position: 60% 22%`
- School/affiliation logos: `height: 175px; width: auto`
- Nav logo: CM key mark (`/website-logo.png`), `50px` tall desktop / `36px` mobile, inside the fixed `98px` header
- Footer logo: Keynote Music Publishing (`/keynote-publishing-v2.png`), `234px` wide desktop / `180px` mobile. The PNG is the supplied "New Keynote for Website.png" **unedited** (white keyhole — do not make it transparent), cropped to the logo + 2px right pad so it is 3862×918 with 3824×898 of ink. **Rename the file (v3, …) whenever its contents change** — Next's optimized-image URL otherwise stays identical and browsers/CDN keep serving the old picture.
- **Mobile footer** (≤768px): centered copyright, no `|` divider, tagline ("Arranger · Composer · Educator") on its own line; 14px text; spacing 24px top → logo → 21px → divider → 18px → text → ~20px → icons/email → 24px bottom. The logo is nudged down 3px (`paddingTop: 3` / `marginBottom: 21`) because its ink is top-heavy (visual centroid ~39% down).
- **Mobile Home hero** stretches (`minHeight: calc(100svh - <measured footer height>px + 2px)`) so hero + footer exactly fill the viewport — no black band under the footer. Footer height is measured with a `ResizeObserver`, not hardcoded.
- **Mobile menu overlay**: Projects and About render their logo PNGs (`projects-logo.png`, `about-logo.png`) via a CSS mask colored with `currentColor` (white; blue `#1254D9` when active), `MENU_LOGOS` in `Nav.tsx`. Home, Portfolio and Contact are still Alfa text until matching assets exist (`selected-works-logo` / `contact-logo` say different words). Each row stays 80px tall (1.5em line box).
- Audio player (Portfolio): transparent, no border; unplayed waves `#CFCEC9`, played waves `#0B3A9A` (player-only color, not a brand token); play button ring/icon `#111111`

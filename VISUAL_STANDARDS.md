# Cooper Mapes Site — Visual Standards

A reference for Claude Code (and any developer) to maintain visual consistency across the codebase.

---

## 1. Typography

Two typefaces only. No substitutions.

### Anton — Display
- **Source:** Google Fonts (`family=Anton`)
- **Role:** Wordmark, page headings, section titles, service names, large numerals, carousel titles
- **Weights:** 400 (single weight — the only weight available)
- **Case:** ALWAYS uppercase (`text-transform: uppercase`)
- **Tracking:** Tight — typically `letter-spacing: -1px` to `-3px`. Never positive.
- **Size range:** 19px – 168px depending on context (use `clamp()` for fluid sizing)
- **Line height:** Compressed — `.88` to `1.02` depending on size

### Inter — Everything Else
- **Source:** Google Fonts (`family=Inter:wght@400;500;600`)
- **Role:** Body copy, nav links, labels/eyebrows, form fields, buttons, captions, badges, footer
- **Weights:** 400 (regular), 500 (medium), 600 (semibold)
- **Case:** Sentence case for body; UPPERCASE for small UI labels
- **Tracking:** Normal for body; `letter-spacing: 1.2px` – `1.6px` on uppercase labels
- **Size range:** 11px – 18px

### Font Loading
Always load both via Google Fonts in the `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Typographic Roles in Practice

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page/section h1 | Anton | `clamp(44px, 6.5vw, 80px)` | 400 | `#111111` |
| Hero h1 | Anton | `clamp(46px, 8vw, 96px)` | 400 | `#111111` |
| Carousel titles | Anton | `clamp(28px, 4vw, 56px)` | 400 | `#FFFFFF` |
| Stat numerals | Anton | `clamp(48px, 4.5vw, 72px)` | 400 | `#111111` |
| Section numerals (muted) | Anton | `clamp(48px, 5.5vw, 96px)` | 400 | `#B6B5AD` or `#D5D4CE` |
| Eyebrow / section label | Inter | `11px` – `12px` | 500 | `#1254D9` |
| Body copy | Inter | `16px` – `18px` | 400 | `#5A5A5A` or `#3A3A3A` |
| Nav links | Inter | `17px` | 500 | `#111111` |
| Buttons | Inter | `13px` | 600 | `#FFFFFF` |
| Form labels | Inter | `13px` | 500 | `#3A3A3A` |
| Form inputs | Inter | `15px` | 400 | `#141414` |
| Meta / captions | Inter | `12px` – `13px` | 500 | `#9A9A95` |
| Stat labels | Inter | `18px` | 600 | `#9A9A95` |

---

## 2. Color Palette

### Core
| Token | Hex | Usage |
|---|---|---|
| Primary text | `#111111` | Default body text, headings |
| Background white | `#FFFFFF` | Main page background, card surfaces |
| Background gray | `#EAEAEA` | Alternating section backgrounds, page canvas |
| Background dark | `#020201` | Portfolio section, dark hero accent block |
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
| `#B6B5AD` | Anton numerals on gray background |
| `#D5D4CE` | Anton numerals on white background |

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
- Max content width: `1180px` (standard), `1320px` (portfolio), `1100px` (contact), `760px` (Terms/Privacy — narrower deliberately, for readable line-length on dense legal paragraphs)
- Hero top padding max: `384px`

---

## 4. Layout & Grid

- **Single-column max-width container** centered with `margin: 0 auto` and horizontal `clamp()` gutters.
- **Two-column flex rows** with `flex-wrap: wrap` and `gap: clamp(40px, 5vw, 72px)` for service and about layouts. Each column uses `flex: 1 1 340px` / `flex: 1 1 380px` so they collapse naturally on mobile.
- **Nav is fixed**, `z-index: 60`, `height: 98px`. All page content has `padding-top: 98px`.
- **Sections alternate** between `#FFFFFF` and `#EAEAEA` backgrounds. Dark sections (`#020201`) are used sparingly for strong contrast moments.
- **No border-radius** on layout elements, service cards, buttons, or badges — sharp rectangular corners throughout. The only exception is wizard step indicator circles.

---

## 5. Component Patterns

### Buttons (Primary)
```css
background: #1254D9;
color: #FFFFFF;
border: 1.5px solid #1254D9;
padding: 12px 24px;
font-size: 13px;
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
font-family: Inter, sans-serif;
font-size: 11px; /* or 12px for larger contexts */
font-weight: 500;
letter-spacing: 1.4px; /* or 1.6px */
text-transform: uppercase;
color: #1254D9;
```

### Bullet Points (service lists)
A 7×7px square, no border-radius, color `#1254D9`, `margin-top: 8px`, paired with 16px / line-height 1.6 body text.

### Form Inputs
```css
padding: 12px 16px;
border: 1px solid #CFCEC9;
font-size: 15px;
color: #141414;
background: #FFFFFF;
outline: none;
/* Focus */
border-color: #1254D9;
```
No border-radius. Placeholder color: `#A6A5A0`.

### Pill Badge (exception to no-radius rule)
```css
background: #1254D9;
color: #FFFFFF;
font-size: 11px;
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
  font-family: Inter, Helvetica, Arial, sans-serif;
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

When inside a `background: #020201` section, override colors as follows:

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
- Photo panels use `image-slot` web component for drag-and-drop replacement
- Portfolio cards: fixed ratio `clamp(280px, 76vw, 400px)` tall, `clamp(220px, 60vw, 320px)` wide
- About photo: `flex: 0 0 35%` of the row, `object-position: 60% 22%`
- School/affiliation logos: `height: 175px; width: auto`

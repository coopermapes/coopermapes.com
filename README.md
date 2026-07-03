# coopermapes.com

Marketing and portfolio site for **Cooper Mapes** — a marching-band arranger, composer, and educator. The site presents his services (flip-folder conversion, part editing & revoicing, custom arranging), a portfolio of selected works with audio playback, an about page, and a multi-step contact/quote flow.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, React 19) with Turbopack
- **TypeScript**
- **Tailwind CSS v4** (theme tokens in `app/globals.css`; most component styling is inline)
- **[WaveSurfer.js](https://wavesurfer.xyz)** — waveform audio player on the portfolio page
- **[PostHog](https://posthog.com)** — privacy-conscious analytics (pageviews only; session recording disabled)
- **[Phosphor Icons](https://phosphoricons.com)** — iconography
- **[Formspree](https://formspree.io)** — form delivery for the contact and quote-wizard submissions
- Deployed on **[Vercel](https://vercel.com)**

> ⚠️ See `AGENTS.md` — this project pins a Next.js build with breaking changes from stock Next.js. Consult `node_modules/next/dist/docs/` before relying on framework APIs from memory.

## Project structure

```
app/
  layout.tsx              Root layout: fonts (Anton + Inter), Nav, Footer, PostHog, skip-link
  page.tsx                Home route
  {services,portfolio,about,contact,terms,privacy}/page.tsx   Route wrappers + metadata
  robots.ts, sitemap.ts   SEO
  globals.css             Tailwind @theme brand tokens, resets, animations
  hooks/useIsMobile.ts    matchMedia-based mobile breakpoint hook
  components/
    Nav.tsx               Fixed nav + full-screen mobile overlay
    Footer.tsx
    HomeSection.tsx       Hero + interactive before/after score slider
    ServicesSection.tsx
    PortfolioSection.tsx  3D carousel of works + WaveSurfer audio player
    AboutSection.tsx
    ContactSection.tsx    Landing → branching multi-step quote wizard / inquiry form
    EmailLink.tsx         mailto link with clipboard fallback
    GridPattern.tsx       Decorative interactive SVG background
    TermsSection.tsx, PrivacySection.tsx, LegalPage.tsx
    PostHogProvider.tsx   Client-side analytics provider
    ui/button.tsx         CVA-based button primitive
lib/utils.ts              cn() — clsx + tailwind-merge
public/                   Images, audio, favicons; portfolio assets under public/portfolio/
VISUAL_STANDARDS.md       Design system: typography, color, spacing, components
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment variables

Analytics is optional — the app runs fine without it (PostHog is only initialized when a key is present). To enable it, create a `.env.local` in the project root (gitignored):

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com   # or https://eu.i.posthog.com
```

For production, set the same variables in the Vercel project settings.

## Forms

Contact submissions post directly to Formspree endpoints (no backend):

- **Inquiry form** — general contact
- **Quote wizard** — the multi-step flip-folder / revoicing request flow

Both live in `app/components/ContactSection.tsx`.

## Design system

Visual conventions — typography (Anton for display, Inter for text), the `#1254D9` blue accent, spacing scale, near-zero border radius, and dark-section overrides — are documented in [`VISUAL_STANDARDS.md`](./VISUAL_STANDARDS.md). Keep it in sync when changing shared styles.

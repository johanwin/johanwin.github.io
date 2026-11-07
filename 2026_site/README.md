# johnnguyen.org

Personal portfolio — Astro (static) + React islands + TypeScript + Tailwind v4 + shadcn/ui + Framer Motion.
Bauhaus grid × Designers Republic / Wipeout HUD. Single dark theme; each section is a full-bleed band with its own accessible dark tone,
cross-faded with modern CSS (color-mix, nesting, scroll-driven animations).

## Run

All commands run from this folder (`2026_site/`):

```bash
cd 2026_site
npm install       # once, and again only when package.json changes
npm run dev       # http://localhost:4321
npm run build     # astro check + static build → dist/
npm run preview
```

## Deploy (GitHub Pages + custom domain)

1. Push to a GitHub repo (e.g. `johanwin.github.io`).
2. Repo **Settings → Pages → Source: GitHub Actions**, then set **Custom domain** to `johnnguyen.org`
   and tick **Enforce HTTPS** once the certificate is issued.
3. At your DNS provider, point the apex domain at GitHub Pages: `A` records to
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (and optionally `CNAME www → johanwin.github.io`).
4. Merge into `master`; `.github/workflows/deploy-2026.yml` (repo root) builds `2026_site/` and publishes it.
   `public/CNAME` ships with every build so the domain setting survives deploys.

## Edit your content

Everything personal is in `src/data/`:

| File | What |
|---|---|
| `site.ts` | name, title, bio, email, domain, portrait photo, nav, social links |
| `skills.ts` | capability matrix (level 1–5, years) |
| `projects.ts` | project cards: era, status, telemetry tags, scope notes, single-image framing (`telemetry` / `schematic`) |
| `experience.ts` | changelog-style timeline |

Replace the placeholder SVG captures in `public/images/projects/` with real screenshots (keep explicit
`width`/`height` in `projects.ts` to avoid layout shift). Add `public/resume.pdf` or remove the link.
For the About photo, add e.g. `public/images/portrait.jpg` (3:4) and set `site.portrait.src`.

## Structure

```
├── astro.config.mjs            site, base, React + Tailwind (Vite plugin), prefetch
├── components.json             shadcn/ui config (npx shadcn add … works)
├── public/                     favicon, og.png, images/, .nojekyll
└── src/
    ├── layouts/BaseLayout.astro   <head>, ClientRouter, persisted HUD header
    ├── pages/
    │   ├── index.astro            Hero · About · Projects · Experience · Contact
    │   ├── projects/[slug].astro  static case-study pages (title morphs via view transition)
    │   └── 404.astro
    ├── components/
    │   ├── islands/               React + Framer Motion (hydrated)
    │   │   ├── HUDNavigation.tsx  client:load  — clock, scroll-spy, drawer
    │   │   ├── ProjectCard.tsx    client:visible — tabs, zoom modal, hover states
    │   │   └── ChangelogTimeline.tsx client:visible — staggered reveal
    │   ├── ui/                    shadcn primitives restyled (card, badge, button, dialog)
    │   ├── hud/                   zero-JS Astro primitives (Band, HudFrame, SectionHeader, DiagnosticTrigger)
    │   └── sections/              zero-JS Astro sections
    ├── data/                      all content
    ├── lib/utils.ts               cn(), withBase(), pad()
    └── styles/global.css          tokens, section tones, band cross-fades, HUD utilities, view-transition CSS
```

## Section tones

Set in `src/styles/global.css` under **SECTION TONES**:

| Band | Tone | Accent |
|---|---|---|
| Hero | `#0a0a0b` carbon | orange |
| About | `#3d0b12` oxblood red | yellow (keeps hue separation from red) |
| Projects | `#0b1a33` deep navy | orange |
| Log | `#0b2619` racing green | orange |
| Contact | `#2b0f38` plum | orange |

Surfaces, hairlines and grid are derived from each band's `--bg` with `color-mix()`, so changing one
hex re-tints everything inside that band. Every text colour stays ≥ 4.5:1 on every tone (body text ≥ 13.8:1).

## Hero creature (`src/components/hud/Symbiote.astro`)

A `<symbiote-canvas>` custom element: one raymarched WebGL fragment shader, no libraries (~4 kB gz).
Hover steers it, drag (on empty space, or anywhere on touch) spins it with inertia.

- Renders only while visible; adaptive resolution (0.35–0.9×) based on frame time; DPR capped at 1.5.
- `prefers-reduced-motion`: no idle animation — it only moves while you move it.
- No WebGL → a soft CSS glow fallback. Context loss is handled.
- Tweak size/shape in `map()` (core radius, tendril count/length) and the colour via `<Symbiote accent="#…" />`.

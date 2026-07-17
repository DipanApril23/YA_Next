# Young Architects — Official Website

The marketing site for **Young Architects**, an AI-powered digital agency.
Built on the Next.js App Router with a strict separation between **markup**, **styling**, and
**content** — so new sections can be added quickly without touching existing code.

🔗 **Live:** [ya-next.vercel.app](https://ya-next.vercel.app/)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Architecture Rules](#architecture-rules)
5. [Adding a New Section](#adding-a-new-section)
6. [The Data Layer](#the-data-layer)
7. [The Styling Layer](#the-styling-layer)
8. [Performance](#performance)
9. [Images & Assets](#images--assets)
10. [Extracted Sections Library](#extracted-sections-library)
11. [Deployment](#deployment)

---

## Tech Stack

| Area | Choice |
| ---- | ------ |
| Framework | [Next.js 16](https://nextjs.org) — App Router, Turbopack |
| UI library | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + co-located plain CSS |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [lucide-react](https://lucide.dev) |
| Fonts | `next/font` — Roboto (self-hosted) |
| Utilities | [classnames](https://github.com/JedWatson/classnames) |
| Hosting | [Vercel](https://vercel.com) |

---

## Getting Started

**Prerequisites:** Node.js 18.18+ (Node 20 LTS recommended) and npm.

```bash
npm install     # install dependencies
npm run dev     # start dev server → http://localhost:3000
```

### Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

All source lives under `src/`. The `@/*` import alias maps to `src/*` (see `jsconfig.json`).

```
src/
├── app/                        # Next.js App Router — ROUTES ONLY
│   ├── layout.js               # Root layout: fonts, metadata, <html>/<body>
│   ├── page.js                 # Home page — composes sections
│   ├── not-found.jsx           # 404 page
│   ├── globals.css             # Tailwind import, theme tokens, global rules
│   └── favicon.ico
│
├── components/
│   ├── ui/                     # Reusable, content-agnostic primitives
│   │   ├── Button/             #   Button.jsx + button.css
│   │   ├── Container/          #   Container.jsx
│   │   ├── FlipCard/           #   FlipCard.jsx + flipcard.css
│   │   └── index.js            #   barrel → import { Button } from "@/components/ui"
│   │
│   ├── layout/                 # App shell — present on every page
│   │   ├── Header/             #   Header.jsx
│   │   ├── Navbar/             #   Navbar.jsx, MobileSidebar.jsx + navbar.css
│   │   ├── Footer/             #   Footer.jsx
│   │   ├── Layout/             #   Layout.jsx (Header + <main> + Footer)
│   │   └── index.js
│   │
│   ├── sections/               # Page sections — the composable page building blocks
│   │   ├── Hero/               #   Hero.jsx + hero.css                (dark)
│   │   ├── MainServices/       #   MainServices.jsx + mainServices.css (light)
│   │   ├── WhyChoose/          #   WhyChoose.jsx + WhyChoose.module.css (dark)
│   │   └── index.js
│   │
│   └── index.js                # Top-level barrel (re-exports ui + layout + sections)
│
├── data/                       # ALL content & configuration — no data lives in components
│   ├── json/                   # Content collections
│   │   ├── about.json          #   → rendered by WhyChoose
│   │   ├── courses.json        #   ┐
│   │   ├── students.json       #   ├ available for upcoming sections
│   │   ├── testimonials.json   #   │
│   │   └── works.json          #   ┘
│   ├── nav.js                  # NAV_ITEMS (menu tree) + NAV_CONTENT (brand, CTA labels)
│   ├── hero.js                 # HERO_CONTENT, HERO_CTAS, HERO_STATS, HERO_BENEFITS, HERO_PARTICLES
│   ├── mainServices.js         # MAIN_SERVICES_CONTENT + MAIN_SERVICES (the 8 cards)
│   ├── whyChoose.js            # WHYCHOOSE_CONTENT (rich copy segments)
│   ├── flipCard.js             # FLIPCARD_SERVICES, FLIPCARD_QR_CORNERS, FLIPCARD_DEFAULTS
│   ├── footer.js               # FOOTER_CONTENT, FOOTER_QUICK_LINKS, FOOTER_OTHER_LINKS, FOOTER_CONTACT
│   ├── notFound.js             # NOT_FOUND_CONTENT
│   └── index.js                # Central barrel → import { HERO_STATS } from "@/data"
│
└── assets/                     # Locally imported images
    ├── logo/brandlogo.webp     #   → imported by Navbar
    └── mainServices/           #   → drop the 8 service illustrations here (see its README)
```

### Page composition

`app/page.js` mounts the sections in order. Sections own their own theme, so the page just
supplies the surrounding background:

| Order | Section | Theme |
| ----- | ------- | ----- |
| 1 | `Hero` | dark (`#03030a`) |
| 2 | `MainServices` | **light** — owns its own gradient background |
| 3 | `WhyChoose` | dark |

---

## Architecture Rules

These are the conventions that keep the project clean. **Please follow them when adding code.**

### 1. Components hold markup and behaviour — never content

No strings, arrays, config objects, or copy live inside a component. Everything renderable
comes from `@/data`.

```jsx
// ❌ Don't
const TAGS = ["SEO", "Web Dev"];
<h1>Build a Digital Presence</h1>

// ✅ Do
import { HERO_TAGS, HERO_CONTENT } from "@/data";
<h1>{HERO_CONTENT.headlineLead}</h1>
```

### 2. No inline style rules

Every CSS declaration lives in a stylesheet — a co-located `.css` file or a Tailwind utility
class. The `style` prop is used for exactly two things:

| Allowed use | Why |
| ----------- | --- |
| **Framer Motion values** — `style={{ y: blobY }}`, `style={{ rotateX }}` | Runtime values driven by scroll/mouse; this is the Motion API, not styling |
| **CSS custom properties** — `style={particleVars(p)}` | Bridges *data* into CSS; the actual rules stay in the stylesheet |

```jsx
// ❌ Don't — a style rule inline
<div style={{ background: "#03030a", borderRadius: "50%" }} />

// ✅ Do — rule in hero.css, class on the element
<div className="hero-aurora-1" />

// ✅ Do — dynamic data via custom properties, rule in CSS
<div className="hero-particle" style={{ "--p-left": p.left }} />
```

### 3. Styling choices belong in CSS, not data

Data carries **intent**; the stylesheet decides what that looks like.

```js
// ❌ Don't — Tailwind classes in data
{ label: "View Policy", widthClass: "sm:min-w-[180px]" }

// ✅ Do — semantic flag; hero.css owns `.hero-cta--narrow`
{ label: "View Policy", narrow: true }
```

Same pattern for `WHYCHOOSE_CONTENT`, where segments carry a semantic
`tone: "blue" | "dark" | "primary"` that the component maps to a class.

### 4. Server components by default

Add `"use client"` **only** when a component needs state, effects, event handlers, or
Framer Motion. `Layout`, `Header`, `Footer`, and `WhyChoose` are server components.

### 5. Import through barrels

```js
import { Button, Container } from "@/components/ui";
import { Hero, WhyChoose }   from "@/components/sections";
import { HERO_STATS }        from "@/data";
```

---

## Adding a New Section

The structure is designed to make this a mechanical, four-step process.

**1. Create the folder** — `src/components/sections/YourSection/`

```
src/components/sections/YourSection/
├── YourSection.jsx
└── yourSection.css        # only if Tailwind utilities aren't enough
```

**2. Create its data** — `src/data/yourSection.js`

```js
export const YOURSECTION_CONTENT = {
  heading: "Your heading",
  body: "Your paragraph copy.",
};

export const YOURSECTION_ITEMS = [
  { title: "First", description: "…" },
];
```

**3. Register the exports**

```js
// src/data/index.js
export { YOURSECTION_CONTENT, YOURSECTION_ITEMS } from "./yourSection";

// src/components/sections/index.js
export { default as YourSection } from "./YourSection/YourSection";
```

**4. Mount it on the page** — `src/app/page.js`

```jsx
import { Layout } from "@/components/layout";
import { Hero, WhyChoose, YourSection } from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      <div className="bg-black"><Hero /></div>
      <div className="bg-black"><YourSection /></div>
      <div className="bg-black"><WhyChoose /></div>
    </Layout>
  );
}
```

**Section checklist**
- [ ] No literal copy or arrays inside the `.jsx`
- [ ] No inline style rules (Motion values / CSS vars only)
- [ ] `"use client"` only if genuinely interactive
- [ ] Data exported from `src/data/index.js`
- [ ] Component exported from `src/components/sections/index.js`
- [ ] Section has a stable `id` if the navbar links to it (see `NAV_ITEMS`)

---

## The Data Layer

Everything the UI renders is in `src/data` and re-exported from `src/data/index.js`.

**Derived values are computed in data, not in components.** For example
`HERO_PARTICLES` pre-computes each particle's glow blur/colour, and `FLIPCARD_SERVICES`
pre-computes its accent tints — so the component only forwards values into CSS variables:

```js
// src/data/flipCard.js
export const FLIPCARD_SERVICES = SERVICE_ENTRIES.map((svc, i) => ({
  ...svc,
  tintBg: `${svc.color}12`,
  pulseDuration: `${2 + i * 0.3}s`,
}));
```

**Rich copy is stored as segments** when parts of a sentence need different emphasis
(`src/data/whyChoose.js`), keeping colour/bold decisions data-driven without embedding markup.

> **Note:** `courses.json`, `students.json`, `testimonials.json`, and `works.json` are not
> currently rendered — they're retained as ready-made content for upcoming sections.

---

## Main Services Section

The light-theme services grid ([`MainServices`](src/components/sections/MainServices/)) is fully
data-driven from [`src/data/mainServices.js`](src/data/mainServices.js).

**Responsive grid** — 1 column → 2 columns (≥640px) → 4 columns (≥1024px), giving two clean rows
of four on desktop.

**Per-card flags** (set in the data, no JSX changes needed):

| Field | Effect |
| ----- | ------ |
| `image` | Renders the illustration. When `null`, falls back to a gradient tile with `icon` |
| `icon` | A lucide-react name, resolved by `SERVICE_ICONS` in `MainServices.jsx` |
| `featured` | Draws the persistent cyan glow ring (currently on *AI Automation*) |
| `comingSoon` | Adds the amber diamond badge and swaps *Explore* for the "Coming Soon" marker |
| `note` | `{ strong, rest }` — appended to the description (e.g. "**Launching Soon** — ask us…") |

### Adding the card illustrations

The cards currently render **icon tiles as a placeholder**. To use the real artwork, drop the
files into [`src/assets/mainServices/`](src/assets/mainServices/) and set the `image` field —
full instructions and suggested filenames are in that folder's `README.md`.

> The section links from the navbar (`#services`), so `.ms-section` carries a
> `scroll-margin-top` to keep the heading clear of the fixed navbar on anchor jumps.
> Any future section the navbar links to needs the same.

---

## The Styling Layer

Three complementary tools, used deliberately:

| Tool | Use for | Example |
| ---- | ------- | ------- |
| **Tailwind utilities** | Layout, spacing, typography, responsive behaviour | `className="flex gap-4 md:w-1/2"` |
| **Co-located `.css`** | Keyframes, complex gradients, animation classes — anything global to a component | `hero.css`, `flipcard.css` |
| **CSS Modules** (`*.module.css`) | Scoped classes where a generic name could collide | `WhyChoose.module.css` |

**Why plain `.css` and not Modules everywhere?** Some class names must stay global and stable —
keyframe names referenced from other rules, and classes like `.hero-grad-text` used alongside
CSS custom properties. Modules hash those names, which breaks the reference.

**Theme tokens** live in `src/app/globals.css` under `@theme inline` (Tailwind v4's CSS-based
config) — that's where `text-primary`, `text-primary-blue`, `text-secondary-light` etc. come from.

---

## Performance

The site is tuned for Core Web Vitals on mobile (PageSpeed: 70 → 90+).

| Technique | Where |
| --------- | ----- |
| **Self-hosted fonts** via `next/font` — removes a render-blocking external stylesheet (~2.4s) | `app/layout.js` |
| **LCP-safe hero entrance** — headline/lead paragraph paint on first server render; the entrance is a *transform-only* CSS slide holding `opacity: 1`, so it animates without delaying LCP | `hero.css` → `.hero-rise` |
| **Compositor-friendly animation** — entrance animates `transform` only | `hero.css` |
| **Optimized images** — `next/image` serving resized AVIF/WebP with explicit `sizes` | `next.config.mjs` |
| **`content-visibility`** — defers off-screen section rendering | `globals.css` → `.cv-section` |
| **Reduced motion** — honoured globally | `globals.css` |

> ⚠️ **Don't reintroduce an `opacity: 0` entrance on the hero headline or lead paragraph.**
> That's the LCP element — hiding it behind JS hydration previously cost ~3s of LCP.

---

## Images & Assets

Images are served through the Next.js image optimizer. Allowed remote hosts are declared in
[`next.config.mjs`](next.config.mjs):

```js
images: {
  remotePatterns: [{ protocol: "https", hostname: "youngarchitects.in" }],
  formats: ["image/avif", "image/webp"],
  qualities: [75, 100],
}
```

**Two sources of images:**
- **Remote** — every `src/data/json/*.json` entry points at `https://youngarchitects.in/assets/…`.
  This is how the site actually loads its content imagery.
- **Local** — `src/assets/`, used via static import. Only `logo/brandlogo.webp` is currently
  imported (by the Navbar).

To add a new remote host, extend `remotePatterns`.

---

## Extracted Sections Library

The **Capabilities** and **Services** sections were removed from this project to make room for
new sections, and archived as a standalone, reusable library:

```
~/Desktop/ya-sections-library/
├── README.md          # full re-import instructions
├── capabilities/      # CapabilitiesSection.jsx + css + data
├── services/          # Service.jsx, ServiceCards.jsx + css + data + services.json
├── shared/Modal.jsx   # dependency of ServiceCards
└── assets/            # service-wire.webp
```

To bring one back, follow the instructions in that folder's `README.md`. Notes:
- **Capabilities** requires reinstalling `gsap` (`npm install gsap`) — it was removed from this
  project's dependencies when the section was extracted.
- **Services** needs `Modal` copied into `src/components/ui/` and a `<div id="portal-modal-root" />`
  in the root layout (already present in `app/layout.js`).
- Those files still contain inline `style={{}}` — they preserve the original design as shipped.
  If you re-import them, migrate their styles to match this project's
  [no-inline-styles rule](#2-no-inline-style-rules).

---

## Deployment

Deployed on **Vercel**. Pushes to `main` trigger a production deployment; pull-request branches
get preview deployments automatically.

```bash
npm run build && npm run start   # verify a production build locally
```

---

## License

Proprietary — © Young Architects. All rights reserved.

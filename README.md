# Young Architects — Official Website

The marketing site for **Young Architects**, an AI-powered digital agency in Kolkata.

Built on the Next.js App Router with a strict separation between **markup**, **styling**, and
**content**. The rule that drives the whole codebase: *no editable copy lives inside a component.*
Every string a visitor reads comes from a JSON file in `src/data/content/`, so the site's text can
be changed — or later served by a headless CMS — without touching a line of React.

🔗 **Live:** [ya-next.vercel.app](https://ya-next.vercel.app/)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [The Data Layer](#the-data-layer) ← **start here if you are editing copy**
5. [Handover to a Headless CMS (WordPress / ACF)](#handover-to-a-headless-cms-wordpress--acf)
6. [Architecture Rules](#architecture-rules)
7. [The Styling Layer](#the-styling-layer)
8. [Page Composition & the App Shell](#page-composition--the-app-shell)
9. [Adding a New Section](#adding-a-new-section)
10. [Performance](#performance)
11. [Component Inventory](#component-inventory)
12. [Deployment](#deployment)

---

## Tech Stack

| Concern   | Choice                                                          |
| --------- | --------------------------------------------------------------- |
| Framework | **Next.js 16** (App Router, Turbopack), **React 19**            |
| Styling   | **Tailwind CSS v4** + scoped per-section `.css` files           |
| Animation | **framer-motion** (via `LazyMotion`), **GSAP + ScrollTrigger**  |
| Icons     | **lucide-react**                                                 |
| Fonts     | **next/font** (self-hosted Roboto)                               |
| Language  | JavaScript (JSX). No TypeScript.                                 |

---

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

---

## Project Structure

```
src/
├─ app/                       Next.js App Router
│  ├─ layout.js               root layout — fonts, metadata, and the app shell
│  ├─ page.js                 the home page: section order only
│  ├─ not-found.jsx           404 route
│  ├─ globals.css             the ONLY global stylesheet (tokens + 2 utilities)
│  └─ favicon.ico
│
├─ assets/                    images imported by components (next/image optimises them)
│
├─ components/
│  ├─ index.js                barrel → re-exports ui + layout + sections
│  ├─ DeferredSection.jsx     lazy-mounts heavy below-the-fold sections
│  │
│  ├─ layout/                 the app shell, rendered on every route
│  │  ├─ Layout/              Header + <main> + BrandMark + Footer
│  │  ├─ Header/  Navbar/     the recursive, infinite-depth silo menu
│  │  ├─ Footer/              magnetic social dock + link columns
│  │  └─ MotionProvider/      <LazyMotion> wrapper
│  │
│  ├─ sections/               one folder per page section: Component + its .css
│  │  ├─ Hero/  OurProcess/  Services/  ConsultationCTA/  OurPartners/
│  │  ├─ CaseStudies/  Testimonials/  Faq/  BrandMark/
│  │  └─ MainServices/  WhyChoose/          (built, not currently mounted)
│  │
│  └─ ui/                     reusable primitives
│     └─ Button/  Container/  FlipCard/  MagneticButton/
│        Modal/  SectionDivider/  SectionHeader/
│
└─ data/                      ← ALL CONTENT LIVES HERE (see next section)
   ├─ index.js                the single import surface: `import { … } from "@/data"`
   ├─ content/*.json          editable copy      (17 files — the CMS handover)
   ├─ config/*.json           developer config   (8 files — NOT for the CMS)
   ├─ *.js                    thin loaders that join JSON to the components
   └─ json/                   legacy image manifests (see the barrel's note)
```

**Path alias:** `@/*` → `src/*` (configured in `jsconfig.json`).

---

## The Data Layer

This is the most important part of the codebase to understand.

Components import **only** from the `@/data` barrel. They never read a JSON file directly, and they
never contain a hardcoded sentence, label, link or `alt` text.

```
src/data/
├─ content/     EDITABLE COPY — safe to hand to a marketer or a CMS
├─ config/      DEVELOPER CONFIG — design tokens, animation timings, particles
├─ *.js         THIN LOADERS — import the JSON, re-export under stable names
└─ index.js     the barrel every component imports from
```

### Why the content / config split

An editor should never meet a hex value or a cubic-bezier curve, and a CMS record should never carry
a Tailwind class. So the two are stored apart:

|                            | `content/`                                                              | `config/`                                                                     |
| -------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Contains                   | headlines, body copy, links, catalogue entries, testimonials, `alt` text | colours, gradients, easing curves, springs, particle positions, tab ids        |
| Owner                      | marketing / CMS                                                          | developers                                                                     |
| Goes to the backend team?  | **Yes**                                                                  | **No**                                                                         |
| Files                      | 17                                                                       | 8                                                                              |

Every JSON file opens with a **`$comment`** key describing its shape, its owner, and any gotcha
(for example: "values wrapped in `[XX]` are placeholders — replace before publishing"). That comment
is the file's documentation and travels with it into the handover.

### Why there are loader `.js` files at all

JSON cannot express three things the UI needs, so a thin module bridges the gap. Each loader does
one small job and nothing else:

| Loader           | What it does beyond re-exporting                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `nav.js`         | resolves each node's `icon` **string** into a real lucide-react component via `navIcons.js` — React components cannot live in JSON |
| `hero.js`        | expands a 14-particle backdrop from a small formula, so nobody hand-maintains 140 derived CSS values          |
| `flipCard.js`    | derives four tint/pulse values per service from its one authored `color`                                      |
| `caseStudies.js` | merges the editorial copy with the dark-glass design tokens the component expects as one object               |
| `services.js`    | joins the tab config to the catalogue (`SERVICE_TABS[].id` ⇄ a key in `services.json`)                        |
| `motion.js`      | exposes the shared easing/spring tokens                                                                       |

Everything else is a one-line pass-through. **The exported names are the contract the components code
against — keep them stable.**

### To change any text on the site

1. Find the file in `src/data/content/` (they are named after the section).
2. Edit the string.
3. Save. That is the whole process — no component, no CSS, nothing else to touch.

---

## Handover to a Headless CMS (WordPress / ACF)

The `src/data/content/` folder **is** the handover package. Give the backend team that folder and
nothing else.

**How it maps:**

* One JSON file → one ACF **field group** (or one options page).
* A top-level object (`content`) → a **group** field.
* A top-level array (`items`, `columns`, `steps`, `faqs`, `services`) → a **repeater**, one sub-field
  per key in the array's objects.
* The `$comment` key at the top of each file documents the intended shape and any editorial warning.
  It is a plain string and can be ignored by the importer.

**Rules the backend team should know:**

* **`$comment` is documentation, not data.** Do not create a field for it.
* **`icon` fields are keys, not images.** They hold a lucide-react component *name* (e.g. `"Gavel"`).
  Expose them as a select whose options come from `NAV_ICONS` in `src/data/navIcons.js`, not as a
  free-text or upload field.
* **In-page links must stay root-relative** — `"/#services"`, never `"#services"`. The navbar and
  footer render on every route, and a bare hash resolves against the current route, so it would do
  nothing for a visitor who is not already on the home page.
* **`services.json` keys must match `config/serviceTabs.json`.** A tab finds its cards by that id.
* **Do not migrate `src/data/config/`.** It is developer configuration with no editorial meaning.

**Swapping JSON for the CMS later** touches only the loader files: change
`import x from "./content/hero.json"` into a fetch, keep the exported names identical, and no
component changes at all.

---

## Architecture Rules

1. **No copy inside components.** Every visitor-facing string — including `alt` and `aria-label` —
   comes from `@/data`. This is easy to audit: grep the components for a quoted sentence and you
   should find none.
2. **No data files inside component folders.** All data lives in `src/data/`. A section folder holds
   its component and its stylesheet, nothing else.
3. **Components import from the barrel**, i.e. `from "@/data"` — never a deep path into a JSON file.
   That indirection is what makes the CMS migration a one-file change.
4. **Icons are keys in data, components in code.** The registry (`navIcons.js`, or a `*_ICONS` map
   beside a section) is the only place data meets React.
5. **Colour reaches CSS as data.** Per-item accents are forwarded as CSS custom properties
   (`--accent`, `--dot`, `--chip-accent`), so theming is a data edit, not a stylesheet edit.
6. **Shared motion tokens.** Easing curves and springs come from `@/data` (`EASE_SMOOTH`,
   `EASE_ENTRANCE`, `SPRING_FAST`, `SPRING_SNAPPY`, `SPRING_DOCK`). They were previously re-declared
   in five components, which is how a design language silently drifts.
7. **Every file opens with a header comment** saying what it is and why it exists.

---

## The Styling Layer

* **`src/app/globals.css` is the only global stylesheet.** It holds the Tailwind entry point, brand
  tokens, breakpoints, the `body` rule, and exactly two cross-cutting utilities (`.cv-section` and
  the `prefers-reduced-motion` guard). Section rules must not be added here.
* **Each section owns a sibling `.css` file** (`hero.css`, `ourProcess.css`, …) imported by its
  component, with a prefixed class namespace (`hero-`, `ya-`, `fc-`, `ms-`, `house-`).
* **`WhyChoose.module.css` is the one CSS Module**, because its two class names are generic enough
  to collide.
* **There is no CSS-in-JS and no inline `<style>` block** anywhere in the project.
* Brand tokens are defined once in `:root` and bridged into Tailwind via `@theme inline`, so
  `text-primary` and `var(--primary)` can never disagree.

---

## Page Composition & the App Shell

`src/app/layout.js` wraps every route in `<Layout>`, which renders:

```
Header (Navbar)  →  <main>{page}</main>  →  SectionDivider  →  BrandMark  →  Footer
```

So the **navbar, the closing BrandMark statement and the footer appear on every route** — including
`not-found.jsx` and any page added later — with no wiring. A new page only returns its own sections.

> ⚠️ **Do not wrap a new page in `<Layout>` again.** That used to be the pattern here, so it is an
> easy habit to repeat, but it would now render two navbars, two BrandMarks and two footers.

`src/app/page.js` therefore contains only the section order and each section's placeholder height —
no content and no markup of its own.

---

## Adding a New Section

1. **Content** → create `src/data/content/mySection.json` with a `$comment` describing its shape.
2. **Loader** → create `src/data/mySection.js` re-exporting it under a stable name.
3. **Barrel** → add that export to `src/data/index.js`.
4. **Component** → create `src/components/sections/MySection/MySection.jsx` + `mySection.css`,
   importing its content from `@/data`.
5. **Mount** → add it to `src/app/page.js`; if it is heavy and below the fold, register it in
   `LOADERS` in `DeferredSection.jsx` and mount it as `<DeferredSection name="MySection" … />`.

No existing file needs to change beyond steps 3 and 5.

---

## Performance

* **Deferred mounting.** Every heavy below-the-fold section loads its JavaScript only when the
  visitor scrolls near it (`DeferredSection`), with a placeholder holding the section's height and
  background so nothing shifts. Chunks are also prefetched on the first real interaction.
* **Crawler safeguard.** Search-engine renderers do not scroll — they render once with a very tall
  viewport. `DeferredSection` detects that (`innerHeight > 2000`) and mounts everything immediately,
  so the whole page is indexable without costing a visitor a byte.
* **Hidden SEO catalogue.** The Services deck shows one card at a time, so `ServicesSeo.jsx`
  server-renders the entire catalogue as `sr-only` semantic markup plus Schema.org `ItemList`. The
  FAQ likewise emits `FAQPage` structured data. Both read the same JSON the visible UI does, so they
  can never drift out of sync.
* **`LazyMotion`.** Components use framer-motion's lightweight `m.*` elements, roughly halving the
  animation runtime payload.
* **`content-visibility`.** The `.cv-section` utility skips rendering off-screen sections.
* **Deterministic decoration.** Particle and star positions come from fixed data or a *seeded* PRNG,
  never `Math.random()` — random values would differ between the server and client renders and cause
  a hydration mismatch.
* **`prefers-reduced-motion`** is honoured globally and per-section.

---

## Component Inventory

Sections currently mounted on the home page, in order:

`Hero` → `OurProcess` → `ServicesSeo` + `Services` → `ConsultationCTA` (embeds `OurPartners`) →
`CaseStudies` → `Testimonials` (embeds `Faq`) → `BrandMark` → `Footer`

**Built but not currently mounted:** `MainServices` and `WhyChoose`. Their components, stylesheets
and data are complete and kept in place so they can be dropped into `page.js` at any time. They are
labelled as unmounted in their own file headers and in the data barrel.

**Legacy, unreferenced:** `src/data/json/students.json`, `works.json`, `courses.json` and
`testimonials.json` are no longer read by any component (`about.json` still is, by `WhyChoose`).
They are kept so nothing is silently deleted, and can be removed once you have confirmed no upcoming
page needs them.

---

## Deployment

Deployed on Vercel. `npm run build` produces a fully static prerender of `/` and `/_not-found`
(`next build` reports both as ○ Static), so there is no server runtime to provision.

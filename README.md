# Young Architects — Official Website

The marketing site for **Young Architects**, an AI-powered digital agency in Kolkata.

Built on the Next.js App Router with a strict separation between **markup**, **styling** and
**content**. The rule that drives the whole codebase: *no editable copy lives inside a component.*
Every string a visitor reads comes from a JSON file in `src/data/content/`, so the site's text can be
changed — or later served by a headless CMS — without touching a line of React.

The site is **exported to static HTML** and served from shared hosting. There is no Node process in
production.

🔗 **Live:** [youngarchitects.in](https://youngarchitects.in/) · hosted on Hostinger (Premium Web
Hosting, LiteSpeed)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Commands](#commands)
3. [Project Structure](#project-structure) ← every file, annotated
4. [Routing & Pages](#routing--pages)
5. [The Data Layer](#the-data-layer) ← **start here if you are editing copy**
6. [Where Images Live](#where-images-live)
7. [The Styling Layer](#the-styling-layer)
8. [The App Shell](#the-app-shell)
9. [Analytics (Google Tag Manager)](#analytics-google-tag-manager)
10. [Build & Deploy to Hostinger](#build--deploy-to-hostinger)
11. [Performance](#performance)
12. [Adding Things](#adding-things)
13. [Known Gaps & Maintenance](#known-gaps--maintenance)

---

## Tech Stack

| Concern    | Choice                                                         |
| ---------- | -------------------------------------------------------------- |
| Framework  | **Next.js 16** (App Router, Turbopack), **React 19**           |
| Output     | **Static export** (`output: "export"`) → `out/`                |
| Styling    | **Tailwind CSS v4** + scoped per-component `.css` files        |
| Animation  | **framer-motion** (via `LazyMotion`), **GSAP + ScrollTrigger** |
| Icons      | **lucide-react**                                                |
| Fonts      | **next/font** — Roboto site-wide; Space Grotesk + JetBrains Mono on the 404 only |
| Analytics  | **Google Tag Manager** (`GTM-P2BN6H8T`)                        |
| Language   | JavaScript (JSX). No TypeScript.                                |

All seven runtime dependencies are actually imported — there is no dead weight in `package.json`.

---

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export → out/   (this is what you upload)
npm run lint
```

`npm run build` writes **`out/`**, not a server bundle. See
[Build & Deploy](#build--deploy-to-hostinger).

---

## Project Structure

```
.
├─ next.config.mjs        static export + image + CSS strategy (heavily commented)
├─ jsconfig.json          path alias  @/*  →  src/*
├─ postcss.config.mjs     Tailwind v4 entry
├─ eslint.config.mjs      eslint-config-next
├─ package.json
│
├─ public/                copied VERBATIM into out/ — no processing
│  ├─ .htaccess           Apache/LiteSpeed rules: 404 page, gzip, cache headers
│  └─ assets/             69 images the site loads at runtime (see "Where Images Live")
│
└─ src/
   ├─ app/                        Next.js App Router
   │  ├─ layout.js                <html>/<body>, Roboto, metadata, GTM. NO app shell.
   │  ├─ globals.css              the ONLY global stylesheet
   │  ├─ favicon.ico
   │  ├─ not-found.jsx            404 route — owns its two fonts + metadata
   │  └─ (site)/                  route group: everything wrapped in the site shell
   │     ├─ layout.js             renders <Layout> (Navbar + BrandMark + Footer)
   │     ├─ page.js               the home page: section order only
   │     └─ [...slug]/page.jsx    catch-all → 70 Coming Soon pages
   │
   ├─ assets/             source images. ONLY reach the build if a component
   │                      `import`s them — see "Where Images Live"
   │
   ├─ components/
   │  ├─ index.js                 barrel → ui + layout + sections
   │  ├─ DeferredSection.jsx      lazy-mounts heavy below-the-fold sections
   │  │
   │  ├─ layout/                  the app shell
   │  │  ├─ Layout/               SplashCursor + Header + <main> + BrandMark + Footer
   │  │  ├─ Header/               thin wrapper around Navbar
   │  │  ├─ Navbar/               recursive infinite-depth silo menu
   │  │  │  ├─ Navbar.jsx         cascading flyouts (desktop) / nested accordion (mobile)
   │  │  │  ├─ navbar.css
   │  │  │  └─ scrollToSection.js anchor scrolling + cross-route anchor handling
   │  │  ├─ Footer/               magnetic social dock + link columns
   │  │  └─ MotionProvider/       <LazyMotion features={domAnimation}>
   │  │
   │  ├─ sections/                one folder per section: Component + its .css
   │  │  ├─ Hero/                 headline, CTAs, stats, FlipCard column
   │  │  ├─ OurProcess/           light "blueprint spine" section
   │  │  ├─ Services/             Service.jsx (deck) + ServiceCards + ServicesSeo
   │  │  ├─ ConsultationCTA/      booking form; embeds OurPartners
   │  │  ├─ OurPartners/          platform logo strip  (currently commented out)
   │  │  ├─ CaseStudies/          three case-study cards + results index
   │  │  ├─ Testimonials/         client quotes; embeds Faq
   │  │  ├─ Faq/                  accordion + FAQPage structured data
   │  │  ├─ BrandMark/            closing outlined wordmark
   │  │  ├─ ComingSoon/           the placeholder every unbuilt menu page renders
   │  │  ├─ NotFound/             the animated 404 sheet
   │  │  └─ MainServices/, WhyChoose/   built, not currently mounted
   │  │
   │  └─ ui/                      reusable primitives
   │     ├─ Button/               gradient CTA
   │     ├─ Container/            max-width wrapper
   │     ├─ FlipCard/             the 3D business card in the hero
   │     ├─ MagneticButton/       spring CTA that leans toward the pointer
   │     ├─ Modal/                portal dialog
   │     ├─ SectionDivider/       the "blueprint seam" between sections
   │     ├─ SectionHeader/        badge + headline + subheading
   │     └─ SplashCursor/         WebGL fluid cursor + its arming gate
   │
   └─ data/                ← ALL CONTENT LIVES HERE
      ├─ index.js          the barrel: `import { … } from "@/data"`
      ├─ content/*.json    editable copy (18 files) — the CMS handover
      ├─ config/*.json     developer config (9 files) — NOT for the CMS
      ├─ *.js              thin loaders joining JSON to components
      ├─ navRoutes.js      derives all 67 page routes from the nav tree
      ├─ navIcons.js       lucide icon registry (the one place data meets React)
      └─ json/             legacy image manifests (only about.json is still read)
```

**Path alias:** `@/*` → `src/*`.

---

## Routing & Pages

`npm run build` generates **74 HTML pages**:

| Route                         | Count | Source                              |
| ----------------------------- | ----- | ----------------------------------- |
| `/`                           | 1     | `app/(site)/page.js`                |
| 67 menu destinations          | 67    | `app/(site)/[...slug]/page.jsx`     |
| 3 legal pages                 | 3     | same catch-all, from `footer.json`  |
| `/404.html` + `_not-found`    | 3     | `app/not-found.jsx`                 |

### The `(site)` route group

`(site)` is wrapped in parentheses, so it **groups routes without adding a URL segment** — the page
beside it is still served at `/`.

It exists so the app shell (Navbar, BrandMark, Footer, SplashCursor) wraps the marketing site but
**not** `not-found.jsx`. The 404 is a full-screen sheet with its own brand bar, footer and cursor;
inside the shell it rendered two brand marks stacked on top of each other.

### The catch-all: 70 Coming Soon pages

Every menu item that is not an on-page anchor points at a real route. Rather than 70 near-identical
files, one catch-all renders them all, with the route list **derived from the data itself**
(`src/data/navRoutes.js`): 67 from the nav tree, plus the three legal pages read from `legal` in
`content/footer.json`. Add a menu item — or a footer legal row — with an `href`, and its page exists.

They are still real, prerendered, individually-titled HTML pages — `generateStaticParams` enumerates
them at build time — and they are `noindex, follow` while they are placeholders.

**`export const dynamicParams = false`** is load-bearing: it makes an unknown URL 404 *before* the
segment renders, so the 404 comes up standalone rather than nested inside the site shell.

### On-page anchors vs routes

The **Home** menu points at sections of the homepage; everything else points at pages. Both are
authored root-relative (`/#services`, `/our-services/seo`) so they work from any route:

* `/#services` **on** the homepage → intercepted, smooth-scrolled
* `/#services` **from another route** → `next/link` navigates to `/`, then `useHashScroll` scrolls
* `/our-services/seo` → ordinary navigation

`isSamePageAnchor()` in `scrollToSection.js` makes that decision per click.

---

## The Data Layer

The most important part of the codebase to understand.

Components import **only** from the `@/data` barrel. They never read a JSON file directly and never
contain a hardcoded sentence, label, link or `alt` text.

```
src/data/
├─ content/     EDITABLE COPY — safe to hand to a marketer or a CMS
├─ config/      DEVELOPER CONFIG — timings, particle formulas, theme maps
├─ *.js         THIN LOADERS — import the JSON, re-export under stable names
└─ index.js     the barrel every component imports from
```

**To change any text on the site:** find the section's file in `src/data/content/` and edit it. Each
file opens with a `$comment` describing its shape. Nothing else needs to change.

### Two deliberate exceptions to the barrel

`navRoutes.js` and `comingSoon.js` are **not** re-exported from `index.js`. The barrel is imported by
client components, and `navRoutes.js` builds its 67-route map with a module-scope walk that a bundler
cannot tree-shake — re-exporting it put the whole route map into the browser bundle. Import them from
their own modules instead.

---

## Where Images Live

There are **two** places, and the difference matters.

| | `public/assets/` | `src/assets/` |
| --- | --- | --- |
| Reaches `out/` | always, verbatim | only if a component `import`s it |
| Referenced as | `"/assets/…"` in JSON | `from "@/assets/…"` in JSX |
| Count today | **69 files, 7.3 MB** | 2 imported; **66 unused** |

Everything the site loads at runtime lives in `public/assets/`. These used to be fetched from
`https://youngarchitects.in/assets/…` — the same server the site now deploys to — so emptying
`public_html` broke every image on the site. They are now bundled, and the site is self-contained.

Audited on the current build: **no duplicates, nothing requested that is missing, nothing shipped
that is never asked for.**

`src/assets/` still holds 66 files (14.8 MB) that nothing imports. They never reach `out/`, so they
cost the visitor nothing — they are repo weight only, kept so nothing is silently deleted.

---

## The Styling Layer

* **`src/app/globals.css` is the only global stylesheet** — Tailwind entry, brand tokens,
  breakpoints, the `body` rule, the YAGlyphs font shim, and three cross-cutting rules
  (`.cv-section`, `:target` navbar clearance, the `prefers-reduced-motion` guard). Section rules must
  not be added here.
* **Each component owns a sibling `.css` file** with a prefixed namespace — `hero-`, `fc-`, `nf-`,
  `cs-`, `sc-`, `sv-`, `md-`, `mb-`, `faq-`, `tst-`, `ya-`.
* Because those are plain global stylesheets, **generic class names are scoped by a parent selector**
  (`.ya-404 .btn-primary`, `.cs-section .cs-title`) so they cannot collide.
* `WhyChoose.module.css` is the one CSS Module.
* Brand tokens are defined once in `:root` and bridged into Tailwind via `@theme inline`, so
  `text-primary` and `var(--primary)` can never disagree.

### What belongs in a stylesheet, and what belongs on `style={{ }}`

The split is **not** "no inline styles". It is whether the value can be known without
rendering the component:

| The value is… | Where it goes | Example |
| --- | --- | --- |
| the same on every render | the sibling `.css` file | a card's panel gradient, a hairline, a z-index |
| a per-instance value from data | the `style` prop | a service's own `accent` colour, tinted per use |
| driven by state or a spring | the `style` prop, beside the state | `opacity: isOpen ? 1 : 0` |
| one value that a *cluster* of rules depends on | a CSS custom property, rules in the `.css` | `--cs-label`, `--chip-accent`, `--i` |

Moving a per-service colour into CSS would mean either a custom property per shade or
`color-mix()`, which rounds the alpha and would shift every accent on the page — so those
stay inline, deliberately. Roughly half the remaining `style={{ }}` blocks in the codebase
are in that category, and the header of each stylesheet says which half it owns.

### One trap: `-webkit-` prefixed properties must come FIRST

Lightning CSS prunes declarations it thinks the browserslist does not need. This project's
floor is `safari 16.4`, which needs `-webkit-backdrop-filter` and `-webkit-mask-image`. Write
the standard property first and **the unprefixed one is dropped from the build entirely**,
leaving only the `-webkit-` form — which modern Chrome does not treat as an alias, so it
computes to `none` and the effect silently disappears in production while looking fine in dev.

Always write the prefixed declaration first and the standard one last:

```css
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);      /* last, so it survives */
```

This bit the glass blur on the case-study badges and the services tab bar once already.

---

## The App Shell

`src/app/(site)/layout.js` renders:

```
SplashCursor → Header (Navbar) → <main>{page}</main> → SectionDivider → BrandMark → Footer
```

So the navbar, closing BrandMark and footer appear on **the homepage and all 70 Coming Soon pages**
with no wiring. `src/app/(site)/page.js` contains only the section order and each section's
placeholder height.

> ⚠️ **Do not wrap a new page in `<Layout>` again** — it is already applied by the group layout, and
> doing so renders two navbars and two footers.
>
> ⚠️ **Anything placed beside the root layout renders chrome-less.** That is deliberate for
> `not-found.jsx`. New marketing routes belong in `src/app/(site)/`.

---

## Analytics (Google Tag Manager)

Container **`GTM-P2BN6H8T`**, installed in `src/app/layout.js` so it covers all 74 pages.

Both halves of Google's snippet are present — the loader, and the `<noscript>` iframe immediately
after `<body>`. The container ID is a single constant so the two cannot drift apart.

**Strategy: `lazyOnload`.** Google's "as high in the `<head>` as possible" is advice for plain HTML,
where document position is the only control. In Next it is `strategy` that decides when a script
runs. Measured on the exported build, three mobile runs each:

| | Mobile score |
| --- | --- |
| No GTM | 87 |
| `afterInteractive` | 75 · 83 · 73 → **75** |
| `lazyOnload` | 82 · 86 · 83 → **83** |

The trade: tags fire a beat later, so a visitor who leaves within the first second may go uncounted.
If a tag ever has to run before hydration — consent management is the usual reason — move it to
`afterInteractive` and accept the cost.

---

## Build & Deploy to Hostinger

Hostinger Premium is shared hosting (LiteSpeed, PHP) — **there is no Node runtime**, so the site is
pre-rendered to static HTML.

### 1. Build

```bash
npm run build     # → out/   ~25 MB, 785 files
```

Three config settings make this work, all in `next.config.mjs`:

| Setting | Why |
| --- | --- |
| `output: "export"` | emits `out/` instead of a server build |
| `trailingSlash: true` | writes `out/our-services/seo/index.html`, so Apache serves the extensionless URL with no rewrite rules |
| `images.unoptimized: true` | required — `/_next/image` is a server route that shared hosting does not have |

`experimental.inlineCss` is **off**, and that was measured: inlining copies the 126 KB stylesheet
into all 71 pages *and* their RSC payloads, taking the export from **24 MB to 66 MB** for **one
point** of PageSpeed. It also made the File Manager give up part-way through extracting the archive.

### 2. Package

```bash
cd out && powershell -Command "Compress-Archive -Path * -DestinationPath ../ya-site.zip -Force"
```

≈ **11 MB**. `.htaccess` is inside it — `public/.htaccess` is copied into `out/` by the build.

### 3. Upload

1. hPanel → **File manager** → `public_html`
2. Delete the previous deploy's contents
3. Upload `ya-site.zip`
4. **Extract** → click `..` up to `/files/` → folder name **`public_html`** → tick **Overwrite**

The folder name matters: the dialog extracts to *destination ÷ folder name*, so extracting while
already inside `public_html` buries the site one level down and the domain 403s.

### 4. Verify — the folders are what fail

A partial extraction leaves `index.html` in place and silently drops the folders, which shows up as
*"Application error: a client-side exception has occurred"* (the HTML loads, its JS chunks 404).

```bash
curl -o /dev/null -w "%{http_code}\n" https://youngarchitects.in/our-services/seo/    # 200
curl -o /dev/null -w "%{http_code}\n" https://youngarchitects.in/assets/image/qr.webp # 200
curl -sI -H "Accept-Encoding: gzip" https://youngarchitects.in/ | grep -i content-encoding  # gzip
```

If a folder 404s, the extraction failed — re-extract, or upload over **FTP**, which handles 759 files
far more reliably than the browser File Manager.

### What `.htaccess` does

`ErrorDocument 404 /404.html`; gzip for text types; a one-year immutable cache for
`/_next/static/` — scoped **by path, not by file extension**, so it cannot freeze `/assets/` images
that get replaced in place.

### Moving back to a Node host

Delete `output`, `trailingSlash` and `images.unoptimized` from `next.config.mjs`. The image-optimiser
settings underneath them were left in place for exactly this.

---

## Performance

Everything here was measured, not assumed. Lighthouse was run with software WebGL and CPU throttling
calibrated so the harness reproduced the site's real PageSpeed scores within ±2 points.

**The two findings that mattered most:**

* **The WebGL cursor was costing 25.7 seconds of blocking time.** `SplashCursor` ran an unconditional
  60fps Navier-Stokes solve forever, even with the pointer never moving. PageSpeed's runners have no
  GPU, so it fell back to software rendering on the main thread. It now starts on the first
  `pointermove` — the canvas paints nothing before that, so this is invisible to a visitor. Desktop
  went **68 → 100**.
* **The 404's fonts were preloaded on every page.** `not-found.jsx` sits at the app root, and
  `next/font` preloads by default, so Space Grotesk and JetBrains Mono — **52.4 KB the homepage never
  renders** — sat on every page's critical path. Fixed with `preload: false`.

**Standing techniques:**

* **Deferred mounting** — heavy below-the-fold sections load their JS only on approach
  (`DeferredSection`), with placeholders holding height and background so nothing shifts.
* **Crawler safeguard** — search engines do not scroll, so a viewport taller than 2000px mounts
  everything immediately; the page is fully indexable without costing a visitor a byte.
* **Hidden SEO catalogue** — the Services deck shows one card at a time, so `ServicesSeo.jsx`
  server-renders the whole catalogue as `sr-only` markup plus Schema.org `ItemList`. The FAQ emits
  `FAQPage` data. Both read the same JSON the visible UI does.
* **`LazyMotion`** — components use framer-motion's `m.*`, roughly halving the animation payload.
* **Deterministic decoration** — particle and star positions come from index-based formulas, never
  `Math.random()`, so server and client markup match.
* **`prefers-reduced-motion`** is honoured globally and per-section.

**What static hosting costs.** With `images.unoptimized`, the four hero images ship at full size —
**326 KB instead of 36 KB**. That is the single biggest remaining lever: pre-resizing them to the
dimensions they actually render at would recover most of it.

---

## Adding Things

### A new section on the homepage

1. `src/data/content/mySection.json` — the copy, with a `$comment`
2. `src/data/mySection.js` — a loader re-exporting it
3. add that export to `src/data/index.js`
4. `src/components/sections/MySection/MySection.jsx` + `mySection.css`
5. mount it in `src/app/(site)/page.js`; if heavy and below the fold, register it in `LOADERS` in
   `DeferredSection.jsx`

### A new menu item

Add it to `src/data/content/nav.json` with an `href`. That is all — `navRoutes.js` derives the route,
the catch-all renders a Coming Soon page for it, and `generateStaticParams` prerenders it.

### A new legal / footer-only page

Add a row to `legal` in `src/data/content/footer.json` with `href`, `label`, `icon` (a NAV_ICONS
key) and `desc`. The footer link and its page come from that same row, so they cannot drift apart.

### Replacing a Coming Soon page with the real thing

Create the concrete route, e.g. `src/app/(site)/about-us/our-team/page.jsx`. A specific segment beats
a catch-all in Next's matcher, so it takes over with no other change.

---

## Known Gaps & Maintenance

* **Facebook and Instagram links are `#` placeholders** in `content/footer.json` → `socials`. They
  are inert rather than broken; fill in the real profile URLs when you have them.
* **`YA_Policy.pdf` no longer exists.** The hero's "View Policy" CTA used to point at
  `https://youngarchitects.in/assets/YA_Policy.pdf`, lost when `public_html` was cleared and never in
  this repo. It now points at `/privacy-policy` so the button is not a dead link. To restore the
  document: drop the file in `public/assets/` and set the CTA's `href` in `content/hero.json` back to
  `/assets/YA_Policy.pdf`.
* **The Coming Soon pages are placeholders.** All 70 are `noindex, follow` on purpose — a page that
  only says "coming soon" competing in search for its own keyword is worse than no page. Remove that
  from `[...slug]/page.jsx` as real content lands.
* **66 unused files in `src/assets/`** (14.8 MB). They never ship; delete once you are sure no
  upcoming page needs them.
* **Legacy `src/data/json/`** — only `about.json` is still read (by `WhyChoose`).
* **`MainServices` and `WhyChoose`** are built and complete but not mounted.

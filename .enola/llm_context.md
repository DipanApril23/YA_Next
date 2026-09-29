# Architecture Snapshot

## Repository Map

| Module | Language | Symbols | Exported |
|--------|----------|---------|----------|
| `.` | typescript | 3 | 3 |
| `src/app` | typescript | 6 | 3 |
| `src/app/(site)` | typescript | 2 | 2 |
| `src/app/(site)/[...slug]` | typescript | 5 | 4 |
| `src/components` | typescript | 4 | 1 |
| `src/components/analytics` | typescript | 4 | 2 |
| `src/components/layout` | typescript | 0 | 0 |
| `src/components/layout/Footer` | typescript | 10 | 1 |
| `src/components/layout/Header` | typescript | 1 | 1 |
| `src/components/layout/Layout` | typescript | 1 | 1 |
| `src/components/layout/MotionProvider` | typescript | 1 | 1 |
| `src/components/layout/Navbar` | typescript | 43 | 6 |
| `src/components/sections` | typescript | 0 | 0 |
| `src/components/sections/BrandMark` | typescript | 4 | 1 |
| `src/components/sections/CaseStudies` | typescript | 19 | 1 |
| `src/components/sections/ComingSoon` | typescript | 1 | 1 |
| `src/components/sections/ConsultationCTA` | typescript | 4 | 1 |
| `src/components/sections/Faq` | typescript | 4 | 2 |
| `src/components/sections/FinalCTA` | typescript | 3 | 1 |
| `src/components/sections/Hero` | typescript | 2 | 1 |
| `src/components/sections/MainServices` | typescript | 16 | 1 |
| `src/components/sections/NotFound` | typescript | 2 | 2 |
| `src/components/sections/OurProcess` | typescript | 8 | 2 |
| `src/components/sections/OurProcess/visuals` | typescript | 20 | 8 |
| `src/components/sections/Services` | typescript | 16 | 3 |
| `src/components/sections/Testimonials` | typescript | 9 | 1 |
| `src/components/sections/WhyChoose` | typescript | 3 | 1 |
| `src/components/ui` | typescript | 0 | 0 |
| `src/components/ui/Button` | typescript | 1 | 1 |
| `src/components/ui/Container` | typescript | 1 | 1 |
| `src/components/ui/FlipCard` | typescript | 4 | 1 |
| `src/components/ui/MagneticButton` | typescript | 5 | 1 |
| `src/components/ui/Modal` | typescript | 1 | 1 |
| `src/components/ui/SectionCTA` | typescript | 6 | 2 |
| `src/components/ui/SectionDivider` | typescript | 4 | 1 |
| `src/components/ui/SectionHeader` | typescript | 2 | 1 |
| `src/components/ui/SplashCursor` | typescript | 3 | 2 |
| `src/data` | typescript | 68 | 59 |

## Extraction Quality

- Files parsed: **81** / 285 seen (0 file(s) + 11 directory tree(s) skipped by ignore globs)
- Parse errors: 0

## Architecture Pattern

**Architecture pattern: nextjs** (confidence: 95%)

Recognised nextjs from directory names: 36 of 38 typescript modules classified. No import in this repository crosses one of its ordered layers, so the pattern names a layout without grading anything: nothing here can breach it.

Layer mapping:
- module "src/app" maps to layer "pages"
- module "src/app/(site)" maps to layer "pages"
- module "src/app/(site)/[...slug]" maps to layer "pages"
- module "src/components" maps to layer "components"
- module "src/components/analytics" maps to layer "components"
- module "src/components/layout" maps to layer "components"
- module "src/components/layout/Footer" maps to layer "components"
- module "src/components/layout/Header" maps to layer "components"
- module "src/components/layout/Layout" maps to layer "components"
- module "src/components/layout/MotionProvider" maps to layer "components"
- module "src/components/layout/Navbar" maps to layer "components"
- module "src/components/sections" maps to layer "components"
- … and 24 more (query_insights(explainer="layers") for all)

## How to Add a Feature

This code is laid out as **nextjs**. A dependency runs from an outer layer to an inner one, so a feature is built inward:

1. **pages** — e.g. `src/app`
2. **components** — e.g. `src/components`

## Entry Points

_No entry points detected._

## Dependency Rules

- `src/components/sections/OurProcess` -> `src/components/sections/OurProcess/visuals`
- `src/components` -> `src/components/layout`
- `src/components` -> `src/components/sections`
- `src/components` -> `src/components/ui`

## Critical Modules

| Module | Fan-In | Fan-Out | Criticality |
|--------|--------|---------|-------------|
| `src/components` | 0 | 3 | low |
| `src/components/layout` | 1 | 0 | low |
| `src/components/sections` | 1 | 0 | low |
| `src/components/sections/OurProcess` | 0 | 1 | low |
| `src/components/sections/OurProcess/visuals` | 1 | 0 | low |
| `src/components/ui` | 1 | 0 | low |

---

*Generated at 2026-09-29T16:08:58Z in 881.3468ms. 722 facts, 23 insights.*

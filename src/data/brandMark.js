// ─── BrandMark (closing statement) — data loader ──────────────────────
//
// A thin adapter over ./content/brandMark.json.
//
// The section is the giant outlined "Young Architects" wordmark that sits
// above the footer on every route. `words` renders one line each — the
// component makes no assumption about how many there are — and the tagline is
// split into a muted `lead` and a gradient `accent` so the emphasis stays data
// rather than hardcoded JSX.
//
// Consumed by: src/components/sections/BrandMark/BrandMark.jsx (via @/data).

import brandMarkContent from "./content/brandMark.json";

export const BRANDMARK_CONTENT = brandMarkContent.content;

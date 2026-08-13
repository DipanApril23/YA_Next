// ─── Coming Soon page — data loader ───────────────────────────────────
//
// A thin adapter over ./content/comingSoon.json. Only the framing that is the
// SAME on every unbuilt page lives here — the badge, the shared body copy, the
// two CTAs and the "while you're here" links.
//
// Each page's heading and standfirst are NOT here: they come from the nav item
// the URL matched (see ./navRoutes.js), so a page is titled by the same words
// the menu row uses and the two can never disagree.
//
// Consumed by: src/components/sections/ComingSoon/ComingSoon.jsx (via @/data).

import comingSoonContent from "./content/comingSoon.json";

export const COMING_SOON_CONTENT = comingSoonContent.content;

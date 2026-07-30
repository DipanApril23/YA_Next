// ─── 404 page — data loader ───────────────────────────────────────────
//
// A thin adapter over ./content/notFound.json. Each action carries
// `external: true` when it should open in a new tab.
//
// Consumed by: src/app/not-found.jsx.

import notFoundContent from "./content/notFound.json";

export const NOT_FOUND_CONTENT = notFoundContent.content;

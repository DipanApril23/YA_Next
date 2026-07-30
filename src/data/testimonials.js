// ─── Testimonials section — data loader ───────────────────────────────
//
// A thin adapter over two JSON files:
//   ./content/testimonials.json    header copy, marquee rows, the cards (CMS)
//   ./config/testimonialsTheme.json avatar gradients + badges (developer only)
//
// ⚠️ SAMPLE COPY — NOT REAL CLIENTS
// The twelve entries in the content file are placeholder scaffolding written to
// fill the design. Names, companies and metrics are FICTIONAL. Replace them all
// with genuine client quotes (with written permission) before this page goes
// live — publishing invented testimonials as real is misleading and, in most
// markets, illegal advertising.
//
// ITEM SHAPE (one object per card)
//   id           stable key; also selects the avatar gradient
//   quote        testimonial body (keep ≤ ~40 words so cards stay even)
//   author       person's name          role     job title
//   company      company name           companyType  small grey footer line
//   avatar       2-letter initials for the gradient disc
//   avatarImage  optional photo URL; null → the initials disc renders
//   rating       1–5, drives the star row
//   metric       optional { value, label } badge; null → badge omitted
//
// The section splits the array in half — first half scrolls left, second half
// right — so entries can be added or removed freely.
//
// `TESTIMONIALS_AVATARS` is exported separately because gradients are a pure
// display concern a CMS would never own; the component reads it to decorate
// each card without the copy ever carrying a Tailwind class.
//
// Consumed by: src/components/sections/Testimonials/Testimonials.jsx.

import testimonialsContent from "./content/testimonials.json";
import theme from "./config/testimonialsTheme.json";

export const TESTIMONIALS_CONTENT = testimonialsContent.content;
export const TESTIMONIALS_ITEMS = testimonialsContent.items;

export const TESTIMONIALS_AVATARS = {
  gradients: theme.avatarGradients,
  fallbackGradient: theme.fallbackGradient,
  badges: theme.avatarBadges,
};

// ─── Our Partners strip — data loader ─────────────────────────────────
//
// A thin adapter over ./content/ourPartners.json. Two marquee rows of
// platform chips, embedded inside the Consultation CTA section (it is not a
// standalone page section).
//
// Per platform: `monogram` is the styled fallback glyph rendered while `logo`
// is null, and `accent` is the brand colour forwarded to CSS as the
// `--chip-accent` custom property.
//
// ⚠ Framing is "Platforms We Build With", NOT "Certified Partners". Only claim
//   a partner badge you actually hold (e.g. Google Partner) with verifiable
//   status, and client logos need written permission.
//
// Consumed by: src/components/sections/OurPartners/OurPartners.jsx.

import ourPartnersContent from "./content/ourPartners.json";

export const OURPARTNERS_CONTENT = ourPartnersContent.content;
export const OURPARTNERS_ROW_ONE = ourPartnersContent.rowOne;
export const OURPARTNERS_ROW_TWO = ourPartnersContent.rowTwo;

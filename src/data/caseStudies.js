// ─── Case Studies section — data loader ───────────────────────────────
//
// WHAT THIS FILE IS
// A thin adapter over JSON. It holds no copy and no colours of its own:
//
//   ./content/caseStudies.json      header copy + the case-study cards (CMS)
//   ./config/caseStudiesTheme.json  dark-glass design tokens (developer only)
//
// WHY THE SPLIT
// The component wants one `CASESTUDIES_CONTENT` object, but copy and design
// tokens have very different owners: an editor should be able to rewrite a
// case study without ever seeing a hex value, and a CMS record should not
// contain `gradientText`. They are stored apart and merged here, so the
// component's contract is unchanged while the handover stays clean.
//
// Consumed by: src/components/sections/CaseStudies/CaseStudies.jsx (via @/data).

import caseStudiesContent from "./content/caseStudies.json";
import theme from "./config/caseStudiesTheme.json";

export const CASESTUDIES_CONTENT = {
  tokens: theme.tokens,
  gradient: theme.gradient,
  gradientText: theme.gradientText,
  ...caseStudiesContent.content,
};

export const CASESTUDIES_ITEMS = caseStudiesContent.items;

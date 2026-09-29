// ─── Closing CTA card — data loader ───────────────────────────────────
//
// A thin adapter over ./content/finalCta.json.
//
// The dark card that closes the homepage: headline, proof pills, the two
// buttons and the trust line. Everything an editor owns is in the JSON; the
// card's glow, grid, noise and spotlight are presentation and stay in
// FinalCTA.jsx / finalCta.css.
//
// The secondary link points at a PDF in public/downloads, the same folder the
// consultation section's resource buttons use — so the collateral has one home
// and one naming convention rather than two.
//
// Consumed by: src/components/sections/FinalCTA/FinalCTA.jsx.

import finalCtaContent from "./content/finalCta.json";

export const FINAL_CTA = finalCtaContent;

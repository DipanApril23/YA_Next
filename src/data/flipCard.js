// ─── FlipCard (digital business card) — data loader ───────────────────
//
// A thin adapter over two JSON files:
//   ./content/flipCard.json   the service list + default contact details (CMS)
//   ./config/flipCard.json    QR corner markers + the tint/pulse formula (dev)
//
// WHY THE TINTS ARE DERIVED HERE RATHER THAN STORED
// Each service row needs four extra presentation values (background tint,
// border tint, icon tint, pulse duration). Storing them would mean an editor
// changing one brand colour had to hand-edit four more hex strings and keep
// them consistent — so only the base `color` is authored, and this module
// expands it. Every derived value is consumed by `.fc-service*` in
// flipcard.css through CSS custom properties, which keeps the component
// purely presentational.
//
// Consumed by: src/components/ui/FlipCard/FlipCard.jsx (via the @/data barrel).

import flipCardContent from "./content/flipCard.json";
import flipCardConfig from "./config/flipCard.json";

const { bgAlphaHex, borderAlphaHex, iconAlphaHex, pulseBaseSeconds, pulseStepSeconds } =
  flipCardConfig.tintFormula;

export const FLIPCARD_SERVICES = flipCardContent.services.map((svc, i) => ({
  ...svc,
  tintBg: `${svc.color}${bgAlphaHex}`,
  tintBorder: `${svc.color}${borderAlphaHex}`,
  tintIcon: `${svc.color}${iconAlphaHex}`,
  pulseDuration: `${pulseBaseSeconds + i * pulseStepSeconds}s`,
}));

/* Decorative bracket markers overlaid on the QR code. */
export const FLIPCARD_QR_CORNERS = flipCardConfig.qrCorners;

export const FLIPCARD_DEFAULTS = flipCardContent.defaults;

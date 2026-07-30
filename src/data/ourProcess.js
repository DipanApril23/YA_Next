// ─── Our Process section — data loader ────────────────────────────────
//
// WHAT THIS FILE IS
// A thin adapter that re-exports JSON under the names the component expects.
// It holds no copy and no tuning numbers of its own:
//
//   ./content/ourProcess.json          header copy + the five process steps
//   ./config/ourProcessParticles.json  developer config for the backdrop dots
//
// THE DATA CONTRACT (see also ../components/sections/OurProcess/README.md)
// Each step is plain, serialisable JSON. Two fields are indirections rather
// than literals, on purpose:
//   icon    a KEY, not a component — resolved by PROCESS_ICONS in
//           OurProcess.jsx. Keeps React out of the data so the file maps 1:1
//           onto a CMS record.
//   accent  a colour forwarded to the stylesheet as the `--accent` custom
//   glow    property (and `--glow`), so per-step theming is data, not CSS.
//
// Consumed by: src/components/sections/OurProcess/OurProcess.jsx (via @/data).

import ourProcessContent from "./content/ourProcess.json";
import particleConfig from "./config/ourProcessParticles.json";

export const OURPROCESS_CONTENT = ourProcessContent.content;
export const OURPROCESS_STEPS = ourProcessContent.steps;
export const OURPROCESS_PARTICLES = particleConfig.particles;

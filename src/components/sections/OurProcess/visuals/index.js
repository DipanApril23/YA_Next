// ─── Process visuals — the barrel and the kind → component lookup ────
//
// One animated diagram per process phase. `visual.kind` in the content JSON
// is a KEY, exactly like `icon` is: the data stays plain, serialisable and
// CMS-safe, and this file is the only place that knows which React component
// a key resolves to.
//
//   src/data/content/ourProcess.json   steps[].visual  → { kind, caption, … }
//   ./<Kind>Visual.jsx                 the diagram itself (markup only)
//   ./VisualFrame.jsx                  the shared panel chrome + in-view switch
//   ./useLiveInView.js                 the switch itself
//   ./processVisuals.css               every style rule (all `opv-` prefixed)
//
// TO ADD A PHASE: write the diagram component, add it to PROCESS_VISUALS
// below, then set `visual.kind` on the step. An unknown or missing kind
// renders nothing — a step without a diagram is a valid step, so a typo in
// the CMS degrades to the card's copy instead of crashing the page.

import ConsultVisual from "./ConsultVisual";
import PlanVisual from "./PlanVisual";
import FunnelVisual from "./FunnelVisual";
import ScaleVisual from "./ScaleVisual";
import CloseVisual from "./CloseVisual";
import "./processVisuals.css";

const PROCESS_VISUALS = {
  consult: ConsultVisual,
  plan: PlanVisual,
  funnel: FunnelVisual,
  scale: ScaleVisual,
  close: CloseVisual,
};

export default function ProcessVisual({ visual, className }) {
  const Visual = visual && PROCESS_VISUALS[visual.kind];
  if (!Visual) return null;
  return <Visual data={visual} className={className} />;
}

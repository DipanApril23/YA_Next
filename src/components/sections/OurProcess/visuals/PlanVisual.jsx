/* ============================================================
   PHASE 02 · STRATEGY — "the blueprint draws itself"
   A spec sheet being drafted: a spine drops down the sheet, each
   module snaps onto it in turn with its rule line drawing out to the
   right, and the revision stamp lands last.
   Copy it illustrates: "built around your goals, market, and budget".
   ============================================================ */

import VisualFrame from "./VisualFrame";

/* Dimension-rule lengths, % of the sheet — a drafted sheet measures each
   module to its own width, and equal rules read as a table instead. */
const RULE_WIDTHS = [100, 74, 88];

export default function PlanVisual({ data, className }) {
  return (
    <VisualFrame
      kind="plan"
      caption={data.caption}
      status={data.status}
      className={className}
    >
      <div className="opv-sheet">
        {/* The spine the modules hang off is drawn by .opv-modules::before, so
            it starts and ends on a node centre however many modules there are. */}
        <ul className="opv-modules">
          {data.modules.map((label, i) => (
            <li
              key={label}
              className="opv-module"
              style={{ "--i": i, "--w": `${RULE_WIDTHS[i % RULE_WIDTHS.length]}%` }}
            >
              <span className="opv-module-node">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span className="opv-module-label">{label}</span>
              {/* Dimension rule — the blueprint measurement for this module */}
              <span className="opv-module-rule">
                <span className="opv-module-rule-fill" />
              </span>
            </li>
          ))}
        </ul>

        {/* Revision stamp — lands once the sheet is complete */}
        <span className="opv-stamp">Plan · rev 01</span>
      </div>
    </VisualFrame>
  );
}

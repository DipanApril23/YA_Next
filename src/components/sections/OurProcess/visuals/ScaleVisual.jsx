/* ============================================================
   PHASE 04 · OPTIMIZE — "winners get budget, waste gets cut"
   Columns grow off the baseline in sequence and a trend line draws
   across them. Then the two decisions play out on the chart itself:
   one column is scaled up and lit, the other is pulled back and
   greyed out.
   Copy it illustrates: "winners get budget, waste gets cut".
   ============================================================ */

import VisualFrame from "./VisualFrame";

/* Column heights, % of the plot area. Geometry only — the chart is a
   diagram of a decision, not a report of a result, so nothing here is a
   number a visitor could read as a claim. */
const COLUMNS = [34, 48, 40, 62, 26, 70, 58, 92];
const CUT_INDEX = 4; // the one that gets pulled back
const WINNER_INDEX = 7; // the one that gets the budget

/* Trend line across the column tops, in the SVG's own 100×40 box.
   Plain arithmetic (no Math.sin/pow), so server and client agree exactly.
   The cut column is the one point the line does NOT follow: it is the outlier
   the review is about to remove, and once it drops the line would otherwise
   be left with a visible notch hanging over an empty slot. */
const PLOT_H = 40;
const TREND = COLUMNS.map((h, i) => {
  const v =
    i === CUT_INDEX ? (COLUMNS[i - 1] + COLUMNS[i + 1]) / 2 : h;
  const x = (i * 100) / (COLUMNS.length - 1);
  const y = PLOT_H - (v / 100) * (PLOT_H - 4) - 2;
  return `${x},${y}`;
}).join(" ");

export default function ScaleVisual({ data, className }) {
  return (
    <VisualFrame
      kind="scale"
      caption={data.caption}
      status={data.status}
      className={className}
    >
      <div className="opv-chart">
        <div className="opv-columns">
          {COLUMNS.map((h, i) => (
            <span
              key={i}
              className={
                "opv-column" +
                (i === WINNER_INDEX ? " is-winner" : "") +
                (i === CUT_INDEX ? " is-cut" : "")
              }
              style={{ "--h": `${h}%`, "--i": i }}
            />
          ))}
        </div>

        {/* Trend across the tops — draws once the columns have grown */}
        <svg
          className="opv-trend"
          viewBox={`0 0 100 ${PLOT_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline points={TREND} />
        </svg>

        <span className="opv-baseline" />
      </div>

      <ul className="opv-legend">
        <li className="opv-legend-item opv-legend-item--up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16 10 10l4 4 6-7" />
            <path d="M15 7h5v5" />
          </svg>
          {data.winnerLabel}
        </li>
        <li className="opv-legend-item opv-legend-item--down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
          {data.cutLabel}
        </li>
      </ul>
    </VisualFrame>
  );
}

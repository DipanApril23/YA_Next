/* ============================================================
   PHASE 05 · REVENUE — "nothing slips through"
   Three leads move along their tracks, each one further than the last,
   until the final one lands as won. Beside them a ring closes on itself
   and the check drops in: every lead accounted for.
   Copy it illustrates: "every lead captured, followed up, and
   accounted for".
   ============================================================ */

import VisualFrame from "./VisualFrame";

/* How far along its track each lead sits, as a % — the shape of a
   pipeline, not a measurement of one. Index matches `statuses` in the data. */
const PROGRESS = [38, 70, 100];

/* Ring geometry: r=15 in a 40×40 box → circumference 2πr, rounded so the
   dash maths is a plain literal rather than a float computed at render. */
const RING_LENGTH = 94.2;

export default function CloseVisual({ data, className }) {
  return (
    <VisualFrame
      kind="close"
      caption={data.caption}
      status={data.status}
      className={className}
    >
      <div className="opv-pipeline">
        <ul className="opv-leads">
          {data.statuses.map((status, i) => {
            const done = i === data.statuses.length - 1;
            return (
              <li
                key={status}
                className={"opv-lead" + (done ? " is-won" : "")}
                style={{ "--i": i, "--p": `${PROGRESS[i] ?? 100}%` }}
              >
                <span className="opv-lead-label">{status}</span>
                <span className="opv-lead-track">
                  <span className="opv-lead-fill" />
                  <span className="opv-lead-head" />
                </span>
                <span className="opv-lead-mark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              </li>
            );
          })}
        </ul>

        {/* Reconciliation ring — closes once the last lead is won */}
        <div className="opv-ring-wrap">
          <svg className="opv-ring" viewBox="0 0 40 40" aria-hidden="true">
            <circle className="opv-ring-track" cx="20" cy="20" r="15" />
            <circle
              className="opv-ring-fill"
              cx="20"
              cy="20"
              r="15"
              style={{ "--len": RING_LENGTH }}
            />
          </svg>
          <span className="opv-ring-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="opv-ring-label">{data.ringLabel}</span>
        </div>
      </div>
    </VisualFrame>
  );
}

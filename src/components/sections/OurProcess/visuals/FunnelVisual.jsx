/* ============================================================
   PHASE 03 · BUILD — "the funnel, running"
   The funnel outline draws itself, its stages light up top to bottom,
   and traffic falls through it continuously: the dots converge as the
   walls narrow, and what makes it all the way through collects and
   glows at the spout.
   Copy it illustrates: "a fail-proof marketing funnel … deployed".
   ============================================================ */

import VisualFrame from "./VisualFrame";

/* Falling traffic. Integer maths only, so the server and client render
   byte-identical markup (see the note in ConsultVisual). Each dot carries:
     x     start position, % across the funnel mouth
     drift how far it slides toward the spout on the way down
     dur   fall duration, ms      dl  start offset, ms      s  diameter, px */
const DROPS = Array.from({ length: 16 }, (_, i) => {
  const x = 6 + ((i * 23 + (i % 4) * 13) % 88); // 6–93
  return {
    x,
    /* Converge on the spout: the further out it starts, the more it moves. */
    drift: Math.round((50 - x) * 0.72),
    dur: 2100 + ((i * 317) % 1700),
    dl: (i * 233) % 2800,
    s: 2 + (i % 3),
  };
});

export default function FunnelVisual({ data, className }) {
  const stages = data.stages;

  return (
    <VisualFrame
      kind="funnel"
      caption={data.caption}
      status={data.status}
      className={className}
    >
      {/* --n drives the band heights, so the funnel re-slices itself if a
          stage is added or removed in the content JSON. */}
      <div className="opv-funnel-wrap" style={{ "--n": stages.length }}>
        {/* Everything inside is clipped to the funnel silhouette, so the
            falling traffic is trimmed by the walls as they close in. */}
        <div className="opv-funnel">
          {stages.map((stage, i) => (
            <span key={stage} className="opv-band" style={{ "--i": i }} />
          ))}

          {DROPS.map((d, i) => (
            <span
              key={i}
              className="opv-drop"
              style={{
                "--x": `${d.x}%`,
                "--drift": d.drift,
                "--dur": `${d.dur}ms`,
                "--dl": `${d.dl}ms`,
                "--s": `${d.s}px`,
              }}
            />
          ))}
        </div>

        {/* Silhouette — stroked separately so the clip-path gets an edge */}
        <svg
          className="opv-funnel-outline"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="0,0 100,0 64,100 36,100" />
        </svg>

        {/* Stage names sit above the clip so they are never trimmed */}
        <ul className="opv-stage-labels">
          {stages.map((stage, i) => (
            <li key={stage} className="opv-stage-label" style={{ "--i": i }}>
              {stage}
            </li>
          ))}
        </ul>

        {/* What comes out the bottom */}
        <span className="opv-spout" />
      </div>
    </VisualFrame>
  );
}

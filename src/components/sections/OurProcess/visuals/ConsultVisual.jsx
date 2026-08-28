/* ============================================================
   PHASE 01 · DISCOVERY — "the call is live"
   A connected caller node with signal rings, a voice waveform that
   keeps moving while the card is on screen, and the three things the
   call is there to capture landing as notes, one after another.
   Copy it illustrates: "understand your business goals in depth".
   ============================================================ */

import VisualFrame from "./VisualFrame";

/* Waveform geometry. Integer-only maths on purpose: these values are
   computed during render on both the server and the client, and integer
   arithmetic is exact in JS, so the two passes cannot disagree and
   hydration can never mismatch. (Math.sin would be a hydration risk —
   engines are allowed to differ in its last bits.) */
const BAR_COUNT = 26;
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const jitter = 30 + ((i * 37 + (i % 5) * 19 + (i % 7) * 11) % 70); // 30–99
  const edge = Math.min(i, BAR_COUNT - 1 - i); // distance from either end
  const envelope = Math.min(100, 45 + edge * 12); // quiet at the edges
  return Math.round((jitter * envelope) / 100);
});

export default function ConsultVisual({ data, className }) {
  return (
    <VisualFrame
      kind="consult"
      caption={data.caption}
      status={data.status}
      className={className}
    >
      <div className="opv-call">
        {/* Caller node — two rings breathe outward while connected */}
        <span className="opv-caller">
          <span className="opv-caller-ring" />
          <span className="opv-caller-ring opv-caller-ring--2" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>

        {/* Live voice waveform */}
        <div className="opv-wave">
          {BARS.map((h, i) => (
            <span key={i} className="opv-wave-bar" style={{ "--h": `${h}%`, "--i": i }} />
          ))}
        </div>
      </div>

      {/* What the call captures — each note lands in turn */}
      <ul className="opv-notes">
        {data.notes.map((note, i) => (
          <li key={note} className="opv-note" style={{ "--i": i }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {note}
          </li>
        ))}
      </ul>
    </VisualFrame>
  );
}

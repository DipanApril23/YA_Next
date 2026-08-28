"use client";

/* ============================================================
   VISUAL FRAME — the chrome every process diagram sits in
   Young Architects · Our Process

   One frame, five diagrams: the instrument-panel shell (hairline
   border, blueprint grid, corner brackets, travelling sheen, caption
   row) lives here so the individual visuals only own their own moving
   parts. It also owns the in-view switch — `.is-live` on this element
   is what starts and pauses every animation inside it.

   The caption row is real text and stays in the accessibility tree;
   the drawing itself is decorative and is hidden from it, because
   everything it depicts is already said in the card's copy above.
   ============================================================ */

import useLiveInView from "./useLiveInView";

export default function VisualFrame({
  kind,
  caption,
  status,
  className = "",
  children,
}) {
  const [ref, live] = useLiveInView();

  return (
    <figure
      ref={ref}
      className={`opv opv--${kind}${live ? " is-live" : ""}${className ? ` ${className}` : ""}`}
    >
      {/* Panel texture: blueprint rule, a slow sheen pass, four brackets */}
      <span aria-hidden="true" className="opv-grid" />
      <span aria-hidden="true" className="opv-sheen" />
      <span aria-hidden="true" className="opv-bracket opv-bracket--tl" />
      <span aria-hidden="true" className="opv-bracket opv-bracket--tr" />
      <span aria-hidden="true" className="opv-bracket opv-bracket--bl" />
      <span aria-hidden="true" className="opv-bracket opv-bracket--br" />

      <figcaption className="opv-caption">
        <span className="opv-caption-text">{caption}</span>
        <span className="opv-status">
          <span aria-hidden="true" className="opv-status-dot" />
          {status}
        </span>
      </figcaption>

      <div aria-hidden="true" className="opv-stage">
        {children}
      </div>
    </figure>
  );
}

"use client";

// ─── BrandMark ────────────────────────────────────────────────────────
// Full-bleed closing brand statement: a giant OUTLINED "Young Architects"
// wordmark that fills with the brand cyan→blue→purple→pink gradient under
// the cursor — a spotlight-follow reveal (the effect from premium agency
// sites). Faithful behaviour on every input:
//   • pointer devices  → an interactive gradient spotlight tracks the cursor,
//     with a soft magnetic tilt and an eased "glide" instead of an instant
//     snap (pure outline until you hover, then it fills where you point).
//   • touch / no-hover → a gradient band sweeps across the wordmark on a
//     loop, so the effect is alive without a hover.
// Fully responsive (clamp sizing, no wrap), reduced-motion aware, and the
// wordmark is real, readable DOM text (accessible + crawlable).
// Copy → src/data/content/brandMark.json (via @/data); styles → brandMark.css.

import { useRef, useCallback } from "react";
import { m, useReducedMotion } from "framer-motion";
import { BRANDMARK_CONTENT as CONTENT, EASE_SMOOTH as EASE } from "@/data";
import "./brandMark.css";

/* One line of the wordmark per entry — the component makes no assumption about
   how many there are, so the lockup is a data edit. */
const WORDS = CONTENT.words;
const MAX_TILT = 6; // degrees — a whisper of depth, not a gimmick

/* One copy of the wordmark. The outline copy is the real, in-flow text that
   defines the layout; the fill copies are decorative overlays. */
function Mark({ variant }) {
  return (
    <div className={`ya-mark ya-mark--${variant}`} aria-hidden={variant !== "outline"}>
      {WORDS.map((word) => (
        <span key={word} className="ya-mark__line">
          {word}
        </span>
      ))}
    </div>
  );
}

export default function BrandMark() {
  const stageRef = useRef(null);
  const frame = useRef(0);
  const reduce = useReducedMotion();

  // Track the pointer as CSS variables on the stage (rAF-throttled). --mx/--my
  // and --rx/--ry are registered (@property) with a CSS transition, so every
  // update we push here glides to its target instead of snapping — that's
  // what turns "cursor tracking" into "cursor tracking that feels expensive".
  const onMove = useCallback(
    (e) => {
      if (e.pointerType === "touch") return; // touch gets the auto-sweep, untouched by this
      const el = stageRef.current;
      if (!el || frame.current) return;
      const { clientX, clientY } = e;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const r = el.getBoundingClientRect();
        const x = clientX - r.left;
        const y = clientY - r.top;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);

        if (!reduce) {
          // Magnetic tilt: pointer offset from stage centre, normalised to
          // [-1, 1]. CLAMPED because the pointer now roams the whole section,
          // so it is regularly outside the stage box (above the wordmark, or
          // down by the tagline) where the raw ratio exceeds ±1 and would
          // swing the tilt past MAX_TILT into a visible lurch.
          const nx = Math.max(-1, Math.min(1, (x / r.width) * 2 - 1));
          const ny = Math.max(-1, Math.min(1, (y / r.height) * 2 - 1));
          el.style.setProperty("--ry", `${(nx * MAX_TILT).toFixed(2)}deg`);
          el.style.setProperty("--rx", `${(-ny * MAX_TILT).toFixed(2)}deg`);
        }
      });
    },
    [reduce]
  );

  const onLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    // The POINTER SURFACE IS THE WHOLE SECTION, not just the wordmark box.
    // When these handlers lived on .ya-stage, the spotlight died the instant
    // the cursor left that box — crossing the tagline or the strip above the
    // footer snapped the fill off mid-glide, which read as the effect being
    // broken rather than as "you left the target". Tracking at section level
    // means the light keeps following the cursor anywhere in the block and
    // simply falls off the letters naturally when it is no longer over them.
    <section
      className="ya-brand cv-section"
      aria-label={CONTENT.ariaLabel}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* Ambient background: a deep solid-dark base with two soft drifting
          brand glows for depth, plus a faint film-grain layer so the dark
          gradient reads as material, not flat CSS. */}
      <div className="ya-brand__bg" aria-hidden="true">
        <span className="ya-orb ya-orb--a" />
        <span className="ya-orb ya-orb--b" />
        <span className="ya-grain" />
      </div>

      <div className="ya-brand__inner mt-12">
        <m.div
          ref={stageRef}
          className="ya-stage"
          initial={reduce ? false : { opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
        >
          {/* Everything visual lives one level deeper (.ya-stage__tilt) so the
              CSS tilt transform never fights framer-motion's own inline
              transform on this element (translateY/opacity for entrance). */}
          <div className="ya-stage__tilt">
            <span className="ya-stage__glow" aria-hidden="true" />
            <Mark variant="outline" />
            <div className="ya-layer ya-layer--cursor" aria-hidden="true">
              <Mark variant="fill" />
            </div>
            <div className="ya-layer ya-layer--sweep" aria-hidden="true">
              <Mark variant="fill" />
            </div>
          </div>
        </m.div>

        <m.p
          className="ya-tagline"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
          {CONTENT.tagline.lead}
          <span>{CONTENT.tagline.accent}</span>
        </m.p>
      </div>
    </section>
  );
}
"use client";

// ─── SectionDivider ───────────────────────────────────────────────────
// The seam between two page sections, drawn as a draughtsman's rule:
// hairline + measurement ticks + a gem-cut node on the axis, with a light
// sweep running the rule. Layer-by-layer notes live in sectionDivider.css.
//
// IT SITS *ON* THE SEAM. The root is height:0, so it adds no vertical
// space and the boundary between the two sections stays exactly where it
// was — the rule straddles that line, half bleeding into each side. Drop
// it between two sections in page.js and it needs no configuration:
//
//   <MainServices />
//   <SectionDivider />
//   <OurProcess />
//
// No `theme`/`surface` props by design. Each seam has a dark section on
// one side and a light one on the other, so the divider is drawn entirely
// in brand colour (gradient beam, violet ticks, gem node) — legible on
// both halves, with nothing to configure per boundary.
//
// The draw-in re-runs every time the seam re-enters the viewport
// (`viewport.once: false`), so scrubbing the page keeps re-drawing it.

import { motion } from "framer-motion";
import "./sectionDivider.css";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: false, margin: "-80px" };

const TICKS = [
  ["l1", "near"],
  ["r1", "near"],
  ["l2", "far"],
  ["r2", "far"],
];

export default function SectionDivider({ className = "" }) {
  return (
    <div aria-hidden="true" className={`ya-div ${className}`.trim()}>
      <div className="ya-div-inner">
        <motion.span
          className="ya-div-bloom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
        />

        {/* The rule — draws outward from the centre */}
        <div className="ya-div-lineWrap">
          <motion.div
            className="ya-div-line"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <span className="ya-div-beam" />
            <span className="ya-div-sweep" />
          </motion.div>
        </div>

        {/* Measurement ticks — step outward after the rule lands */}
        {TICKS.map(([pos, weight], i) => (
          <motion.span
            key={pos}
            className={`ya-div-tick ya-div-tick--${weight} ya-div-tick--${pos}`}
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay: 0.42 + i * 0.05, ease: EASE }}
          />
        ))}

        {/* The node — scale lives here, rotation lives on the child */}
        <motion.span
          className="ya-div-nodeWrap"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span className="ya-div-node" />
          <span className="ya-div-node-ring" />
        </motion.span>
      </div>
    </div>
  );
}

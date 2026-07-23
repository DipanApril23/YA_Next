"use client";

// ─── SectionHeader ────────────────────────────────────────────────────
// The one header every section uses: status chip → shimmering gradient
// headline → muted sub-paragraph. Design, colours and both animations are
// the Hero's (see sectionHeader.css for the exact values it mirrors), so
// the page introduces every block the same way.
//
// The Hero itself keeps its own markup — it is the reference, its headline
// is the page h1, and its copy paints on first server render for LCP. This
// component is for the scroll-triggered sections below it.
//
// Motion matches the Hero's `fadeUp` variant exactly (y:28 → 0, 0.75s,
// cubic-bezier(0.22,1,0.36,1)); only the trigger differs — sections animate
// on scroll-into-view rather than on load, staggered chip → heading → sub
// to reproduce the Hero's hero-rise cadence.
//
// USAGE
//   <SectionHeader
//     theme="light"            // "dark" (default, Hero's colours) | "light"
//     align="center"           // "center" (default) | "left"
//     size="md"                // "md" (default) | "sm" for a nested strip
//     badge={CONTENT.badge}
//     headingLead={CONTENT.headingLead}    // gradient half
//     headingRest={CONTENT.headingRest}    // solid half
//     subheading={CONTENT.subheading}
//   />
// Every field is optional — omit `badge` for a section with no chip.

import { motion } from "framer-motion";
import "./sectionHeader.css";

// Identical to the Hero's fadeUp (Hero.jsx) — same distance, duration, ease.
const fadeUp = (delay = 0) => ({
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  },
});

export default function SectionHeader({
  badge,
  headingLead,
  headingRest,
  subheading,
  theme = "dark",
  align = "center",
  size = "md",
  as: Heading = "h2",
  headingId,
  className = "",
}) {
  return (
    <motion.div
      className={`ya-sh ya-sh--${theme} ya-sh--${align} ya-sh--${size} ${className}`.trim()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {badge && (
        <motion.span variants={fadeUp(0.05)} className="ya-sh-badge">
          <span aria-hidden="true" className="ya-sh-badge-dot" />
          {badge}
        </motion.span>
      )}

      {(headingLead || headingRest) && (
        <motion.div variants={fadeUp(0.15)}>
          <Heading id={headingId} className="ya-sh-heading">
            {headingLead && <span className="ya-sh-lead">{headingLead}</span>}
            {headingLead && headingRest ? " " : null}
            {headingRest && <span className="ya-sh-rest">{headingRest}</span>}
          </Heading>
        </motion.div>
      )}

      {subheading && (
        <motion.p variants={fadeUp(0.25)} className="ya-sh-sub">
          {subheading}
        </motion.p>
      )}
    </motion.div>
  );
}

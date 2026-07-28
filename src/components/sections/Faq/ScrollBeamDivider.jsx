"use client";

/**
 * ScrollBeamDivider — the shared "laser line" that marks the seam between
 * sections. Most sections render it flush at their top edge (with `pt-0`) so it
 * sits exactly on the boundary with the previous section.
 *
 * On scroll into view a thin gradient line scales out from the center and a
 * brighter blurred dot fades in for a sharp focal point. `viewport.once: false`
 * means it re-animates every time it re-enters the viewport.
 *
 * Uses framer-motion's lightweight `m` element (the app is wrapped in a
 * <LazyMotion> provider) — same animation, smaller runtime.
 */

import { m } from "framer-motion";

export default function ScrollBeamDivider() {
  // Completely transparent wrapper with minimal vertical padding
  return (
    <div className="relative w-full flex justify-center py-0 overflow-hidden">
      <div className="relative w-full max-w-4xl flex items-center justify-center">

        {/* The Core Animated Line (Shoots out from the center) */}
        <m.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent origin-center"
        />

        {/* A tiny concentrated dot in the center for a sharp "laser" feel */}
        <m.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-[2px] bg-violet-400 blur-[1px]"
        />

      </div>
    </div>
  );
}

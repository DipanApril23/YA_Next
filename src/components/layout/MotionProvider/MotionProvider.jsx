"use client";

// ─── MotionProvider ───────────────────────────────────────────────────
// Wraps the app in framer-motion's <LazyMotion> so components can render
// the lightweight `m.*` elements instead of `motion.*`. `domAnimation`
// carries every feature this site uses (animations, variants, exit,
// hover/tap gestures, whileInView) at roughly half the bundle cost of the
// full `motion` runtime. Purely a payload optimisation — animations are
// byte-identical.

import { LazyMotion, domAnimation } from "framer-motion";

const MotionProvider = ({ children }) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
);

export default MotionProvider;

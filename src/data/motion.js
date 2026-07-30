// ─── Shared motion tokens — data loader ───────────────────────────────
//
// A thin adapter over ./config/motion.json.
//
// WHY THIS EXISTS
// The same two cubic-bezier curves were re-declared as a local `EASE` const in
// five separate components (Navbar, BrandMark, FaqSection, MainServices,
// OurProcess, SectionDivider). Duplicated timing is how a design language
// drifts: one file gets tweaked, the others silently do not. Importing them
// from here means every section eases the same way by construction.
//
//   EASE_SMOOTH    [0.16, 1, 0.3, 1]   — the "expo-out" curve used for menus,
//                                        flyouts and the BrandMark entrance
//   EASE_ENTRANCE  [0.22, 1, 0.36, 1]  — the slightly softer scroll-in curve
//                                        used by section reveals
//   SPRING_FAST    chevron/arrow rotations and small UI nudges
//   SPRING_SNAPPY  hover/tap feedback on buttons and the flip card
//   SPRING_DOCK    the footer's magnetic social dock magnification
//   VIEWPORT_ONCE  framer-motion `viewport` for reveal-once entrances
//   VIEWPORT_REPEAT same, but re-runs every time the element re-enters
//
// Values are byte-identical to what the components previously declared inline,
// so centralising them changes no animation.

import motionConfig from "./config/motion.json";

export const EASE_SMOOTH = motionConfig.easing.smooth;
export const EASE_ENTRANCE = motionConfig.easing.entrance;

export const SPRING_FAST = motionConfig.springs.fast;
export const SPRING_SNAPPY = motionConfig.springs.snappy;
export const SPRING_DOCK = motionConfig.springs.dock;

export const VIEWPORT_ONCE = motionConfig.viewport.once;
export const VIEWPORT_REPEAT = motionConfig.viewport.repeat;

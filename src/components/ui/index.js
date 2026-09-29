// UI primitives barrel → import { Button, Container, FlipCard } from "@/components/ui".
export { default as Button } from "./Button/Button";
export { default as Container } from "./Container/Container";
export { default as FlipCard } from "./FlipCard/FlipCard";
// Shared badge + headline + subheading block (the Hero's header language).
export { default as SectionHeader } from "./SectionHeader/SectionHeader";
// SectionCTA is deliberately NOT exported here. It is imported by path from
// the three deferred sections that use it instead.
//
// WHY: the Hero imports { Container, FlipCard, Button } from this barrel, and
// a barrel re-export pulls the re-exported module into the same chunk. When
// SectionCTA was CSS-only that cost nothing; once it gained framer-motion
// hooks and a motion-wrapped next/link it put 46KB on the INITIAL bundle of
// every route and took mobile from 89 to 86 (TBT 50ms -> 100ms, Speed Index
// 1.6s -> 3.5s). Importing it by path keeps it in the deferred section chunks,
// which already carry framer-motion.
// The "blueprint seam" rule drawn between two sections.
export { default as SectionDivider } from "./SectionDivider/SectionDivider";
// Portal-rendered dialog — used by the Services section's "Learn More".
export { default as Modal } from "./Modal/Modal";
// WebGL fluid trail that follows the pointer — the site's cursor effect,
// mounted once in Layout, never per section. Export the GATE, not the
// simulation: it is what keeps the solver off phones and out of the initial
// bundle. (It replaced a dot-and-ring CustomCursor that used to live here.)
export { default as SplashCursor } from "./SplashCursor/SplashCursorGate";

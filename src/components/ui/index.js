// UI primitives barrel → import { Button, Container, FlipCard } from "@/components/ui".
export { default as Button } from "./Button/Button";
export { default as Container } from "./Container/Container";
export { default as FlipCard } from "./FlipCard/FlipCard";
// Shared badge + headline + subheading block (the Hero's header language).
export { default as SectionHeader } from "./SectionHeader/SectionHeader";
// The "blueprint seam" rule drawn between two sections.
export { default as SectionDivider } from "./SectionDivider/SectionDivider";
// Portal-rendered dialog — used by the Services section's "Learn More".
export { default as Modal } from "./Modal/Modal";
// WebGL fluid trail that follows the pointer — the site's cursor effect,
// mounted once in Layout, never per section. Export the GATE, not the
// simulation: it is what keeps the solver off phones and out of the initial
// bundle. (It replaced a dot-and-ring CustomCursor that used to live here.)
export { default as SplashCursor } from "./SplashCursor/SplashCursorGate";

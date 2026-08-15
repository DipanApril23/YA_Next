// ─── Hero section — data loader ───────────────────────────────────────
//
// WHAT THIS FILE IS
// A thin adapter over two JSON files. It holds NO copy of its own — every
// string lives in ./content/hero.json so it can be edited (or later served by
// a headless CMS) without anyone opening a component.
//
//   ./content/hero.json          copy: eyebrow, headline, CTAs, stats, benefits
//   ./config/heroParticles.json  developer config for the decorative backdrop
//
// WHY THE PARTICLES ARE GENERATED HERE RATHER THAN STORED
// The backdrop is 14 particles × 10 CSS custom properties. Storing 140 derived
// values as content would be unmaintainable and meaningless to an editor, so
// the JSON keeps only the *inputs* (count, sizes, colours, spacing formula) and
// this module expands them. The expansion is deliberately DETERMINISTIC — a
// pure function of the index, never Math.random() — because the page is
// server-prerendered: random values would differ between the server and client
// renders and trigger a React hydration mismatch.
//
// Consumed by: src/components/sections/Hero/Hero.jsx (via the @/data barrel).

import heroContent from "./content/hero.json";
import particleConfig from "./config/heroParticles.json";

export const HERO_CONTENT = heroContent.content;
export const HERO_CTAS = heroContent.ctas;
export const HERO_STATS = heroContent.stats;
/* The reasons-to-choose tick list that used to sit under the CTAs now lives on
   the FlipCard's back face — see src/data/content/flipCard.json → `services`.
   Moving it out is what lets the hero fit its CTAs above the fold. */

/* Expand the particle config into the per-particle custom properties that
   `.hero-particle` in hero.css consumes. Pure and index-based — see above. */
const { count, sizes, colors, formula: f } = particleConfig;

export const HERO_PARTICLES = Array.from({ length: count }, (_, i) => {
  const size = sizes[i % sizes.length];
  const color = colors[i % colors.length];

  return {
    left: `${f.leftBase + ((i * f.leftStep) % f.leftRange)}%`,
    top: `${f.topBase + ((i * f.topStep) % f.topRange)}%`,
    size: `${size}px`,
    color,
    glowBlur: `${size * f.glowBlurSizeFactor + f.glowBlurOffset}px`,
    glowColor: `${color}${f.glowAlphaHex}`,
    duration: `${f.durationBase + ((i * f.durationStep) % f.durationRange)}s`,
    delay: `${(i * f.delayStep) % f.delayRange}s`,
    dx: `${((i % f.dxModulo) - f.dxCentre) * f.dxStep}px`,
    dy: `${((i % f.dyModulo) - f.dyCentre) * f.dyStep}px`,
  };
});

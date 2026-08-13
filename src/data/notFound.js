// ─── 404 page — data loader ───────────────────────────────────────────
//
// A thin adapter over two JSON files:
//   ./content/notFound.json   headline copy, actions, quick links (CMS)
//   ./config/notFound.json    grain params (dev)
//
// WHY THE GRAIN URL IS BUILT HERE
// The overlay is an feTurbulence SVG inlined as a data URL, so it costs no
// request. Assembling it from the three numbers in the config keeps the
// texture tunable without anyone hand-editing a percent-encoded string —
// and building it once at module scope means the encode does not re-run on
// every render.
//
// Consumed by: src/components/sections/NotFound/NotFound.jsx (via @/data).

import notFoundContent from "./content/notFound.json";
import notFoundConfig from "./config/notFound.json";

export const NOT_FOUND_CONTENT = notFoundContent.content;

const { size, baseFrequency, numOctaves } = notFoundConfig.noise;

const NOISE_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'>` +
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' ` +
  `numOctaves='${numOctaves}' stitchTiles='stitch'/></filter>` +
  `<rect width='100%' height='100%' filter='url(#n)'/></svg>`;

export const NOT_FOUND_NOISE_URL = `data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}`;
export const NOT_FOUND_NOISE_SIZE = size;

/* Expand the star config into the per-star custom properties `.nf-star` in
   notFound.css consumes. Index-based and pure — no Math.random — so the field
   is identical on every render and every build, exactly as HERO_PARTICLES is
   built in ./hero.js. (This route is a Server Component, so there is no
   hydration to mismatch; determinism here is about the markup being stable
   and cacheable rather than about React.) */
const { count, sizes, colors, formula: f } = notFoundConfig.stars;

export const NOT_FOUND_STARS = Array.from({ length: count }, (_, i) => {
  const starSize = sizes[i % sizes.length];
  const color = colors[i % colors.length];

  return {
    left: `${f.leftBase + ((i * f.leftStep) % f.leftRange)}%`,
    top: `${f.topBase + ((i * f.topStep) % f.topRange)}%`,
    size: `${starSize}px`,
    color,
    glowBlur: `${starSize * f.glowBlurSizeFactor + f.glowBlurOffset}px`,
    glowColor: `${color}${f.glowAlphaHex}`,
    duration: `${f.durationBase + ((i * f.durationStep) % f.durationRange)}s`,
    delay: `${(i * f.delayStep) % f.delayRange}s`,
    dx: `${((i % f.dxModulo) - f.dxCentre) * f.dxStep}px`,
    dy: `${((i % f.dyModulo) - f.dyCentre) * f.dyStep}px`,
  };
});

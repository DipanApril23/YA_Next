// ─── NotFound ─────────────────────────────────────────────────────────
// The 404 sheet: a red octagonal warning sign on a post that sways, drops
// clean through a hole in the ground, waits a beat, then springs back out
// with an elastic overshoot — on a loop.
//
// NO CLIENT JAVASCRIPT AT ALL. This is a Server Component: no "use client",
// no framer-motion, no GSAP, no animation runtime. The entire scene is one
// inline SVG driven by CSS keyframes, so the page ships as markup plus a
// stylesheet and animates before any bundle would have finished parsing.
// That matters more here than anywhere else on the site — a 404 is a page
// nobody chose to visit, so it has no budget to spend on getting itself
// moving.
//
// IT IS DRAWN, NOT IMPORTED. The motion is modelled on a Lottie reference,
// but the artwork is built here from primitives rather than shipping a
// third-party JSON asset and the ~250KB lottie-web player needed to run one
// animation. Same result, none of the licensing or the payload.
//
// HOW THE SIGN GETS *INTO* THE HOLE
// Three layers in a deliberate order, because a sign that merely slides over
// a black ellipse reads as a sticker, not as something falling in:
//   1. the hole ellipse, painted first, furthest back;
//   2. the sign group, clipped to everything ABOVE the hole's centre line
//      (#nf-floor-clip) so its lower edge is erased exactly at the rim;
//   3. the hole's near lip — the lower half of that same ellipse — painted
//      last, on top, so the sign passes visibly BEHIND the front edge.
// The straight cut from (2) lands precisely on the chord that (3) covers, so
// the seam is never visible.
//
// Reduced motion is honoured in notFound.css: every loop stops and the sign
// simply stands there, upright and above ground.

import Link from "next/link";
import Image from "next/image";
import {
  NOT_FOUND_CONTENT as CONTENT,
  NOT_FOUND_NOISE_URL,
  NOT_FOUND_NOISE_SIZE,
  NOT_FOUND_STARS as STARS,
} from "@/data";
/* The same file the Navbar and Footer import, so a visitor who lands here
   sees the identical mark rather than a second, slightly-off wordmark. */
import brandLogo from "@/assets/logo/brandlogo.webp";
import NotFoundActions from "./NotFoundActions";
import "./notFound.css";

export default function NotFound({ fontClassName = "" }) {
  return (
    <div className={`ya-404 ${fontClassName}`}>
      {/* ── Ambient backdrop ─────────────────────────────────────────── */}
      {/* Deep-space treatment, matching the hero: three slow aurora blooms
          behind a drifting star field. Same palette and same generator as the
          hero's particles, so the two backdrops read as one system. */}
      <div className="nf-backdrop" aria-hidden="true">
        <div className="nf-aurora nf-aurora--1" />
        <div className="nf-aurora nf-aurora--2" />
        <div className="nf-aurora nf-aurora--3" />

        {STARS.map((star, i) => (
          <span
            key={i}
            className="nf-star"
            style={{
              "--s-left": star.left,
              "--s-top": star.top,
              "--s-size": star.size,
              "--s-color": star.color,
              "--s-glow": star.glowBlur,
              "--s-glow-color": star.glowColor,
              "--s-duration": star.duration,
              "--s-delay": star.delay,
              "--s-dx": star.dx,
              "--s-dy": star.dy,
            }}
          />
        ))}

        <div className="nf-vignette" />
        <div
          className="nf-noise"
          style={{
            backgroundImage: `url("${NOT_FOUND_NOISE_URL}")`,
            backgroundSize: `${NOT_FOUND_NOISE_SIZE}px ${NOT_FOUND_NOISE_SIZE}px`,
          }}
        />
      </div>

      {/* ── Brand bar ────────────────────────────────────────────────── */}
      <header className="nf-header">
        <Link href="/" className="nf-brand" aria-label={CONTENT.brandAriaLabel}>
          {/* Height is set in CSS and the width follows the aspect ratio, so
              the static import's intrinsic dimensions still reserve the right
              box and the header never shifts as the logo decodes. `priority`
              because it is above the fold and is the only image on the page. */}
          <Image
            src={brandLogo}
            alt={CONTENT.brandLogoAlt}
            priority
            sizes="200px"
            className="nf-brand-logo"
          />
        </Link>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="nf-main">
        <div className="nf-scene">
          {/* viewBox is cropped tight to the artwork: y starts at 38 (just above
              the sign's highest point during the spring-out overshoot) and ends
              at 300 (below the light pooling on the floor). Every row of empty
              space left in here would be vertical space the layout has to find
              on a short screen. */}
          <svg viewBox="0 38 420 262" className="nf-scene-svg" role="img" aria-label={CONTENT.sceneAlt}>
            <defs>
              {/* Sign face: lit from the top-left, deepening to oxblood. */}
              <linearGradient id="nf-sign-face" x1="0" y1="0" x2="0.35" y2="1">
                <stop offset="0%" stopColor="#ff6b6e" />
                <stop offset="45%" stopColor="#e8232b" />
                <stop offset="100%" stopColor="#a80d14" />
              </linearGradient>

              {/* Post: a cylinder faked with a three-stop metal ramp. */}
              <linearGradient id="nf-post" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5a6473" />
                <stop offset="38%" stopColor="#aeb9c9" />
                <stop offset="62%" stopColor="#7c8797" />
                <stop offset="100%" stopColor="#454e5b" />
              </linearGradient>

              {/* Hole: not flat black — a shaft that falls away from the rim. */}
              <radialGradient id="nf-hole" cx="50%" cy="42%" r="62%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="62%" stopColor="#03060c" />
                <stop offset="100%" stopColor="#0d1524" />
              </radialGradient>

              <radialGradient id="nf-spill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(232,35,43,0.34)" />
                <stop offset="100%" stopColor="rgba(232,35,43,0)" />
              </radialGradient>

              <radialGradient id="nf-shadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>

              {/* Everything above the hole's centre line. See the header note. */}
              <clipPath id="nf-floor-clip">
                <rect x="-60" y="-80" width="540" height="330" />
              </clipPath>
            </defs>

            {/* 1 — red light pooling on the ground */}
            <ellipse className="nf-spill" cx="210" cy="250" rx="150" ry="46" fill="url(#nf-spill)" />

            {/* 2 — the hole */}
            <ellipse cx="210" cy="250" rx="100" ry="27" fill="url(#nf-hole)" />
            <ellipse
              className="nf-rim"
              cx="210"
              cy="250"
              rx="100"
              ry="27"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1.25"
            />

            {/* 3 — contact shadow, tied to how far the sign has fallen */}
            <ellipse className="nf-shadow" cx="210" cy="252" rx="62" ry="15" fill="url(#nf-shadow)" />

            {/* 4 — the sign, clipped at the rim */}
            <g clipPath="url(#nf-floor-clip)">
              <g className="nf-sign">
                <rect x="204" y="168" width="12" height="96" rx="4" fill="url(#nf-post)" />
                {/* post highlight */}
                <rect x="206.5" y="170" width="2.5" height="92" rx="1.25" fill="rgba(255,255,255,0.28)" />

                {/* octagon — outer plate, then the inset white keyline */}
                <polygon
                  className="nf-plate"
                  points="267.3,143.7 233.7,177.3 186.3,177.3 152.7,143.7 152.7,96.3 186.3,62.7 233.7,62.7 267.3,96.3"
                  fill="url(#nf-sign-face)"
                />
                <polygon
                  points="258.0,139.9 229.9,168.0 190.1,168.0 162.0,139.9 162.0,100.1 190.1,72.0 229.9,72.0 258.0,100.1"
                  fill="none"
                  stroke="rgba(255,255,255,0.92)"
                  strokeWidth="3"
                />
                {/* specular sweep across the top-left facets */}
                <polygon
                  points="267.3,96.3 233.7,62.7 186.3,62.7 152.7,96.3 152.7,116 267.3,86"
                  fill="rgba(255,255,255,0.12)"
                />

                <text
                  className="nf-code ya-font-display"
                  x="210"
                  y="120"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {CONTENT.code}
                </text>
              </g>
            </g>

            {/* 5 — the near lip, painted over the sign */}
            <path className="nf-lip" d="M 110 250 A 100 27 0 0 0 310 250 Z" fill="url(#nf-hole)" />
            <path
              className="nf-lip-edge"
              d="M 110 250 A 100 27 0 0 0 310 250"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.25"
            />
          </svg>
        </div>

        <p className="nf-eyebrow ya-font-mono">{CONTENT.eyebrow}</p>
        <h1 className="nf-title ya-font-display">{CONTENT.title}</h1>
        <p className="nf-desc">{CONTENT.description}</p>

        {/* The only client component on this route — see NotFoundActions.jsx
            for why the magnetic springs need one. */}
        <NotFoundActions />
      </main>

      <footer className="nf-footer ya-font-mono">{CONTENT.footerNote}</footer>
    </div>
  );
}

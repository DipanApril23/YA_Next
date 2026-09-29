"use client";

// ─── SectionCTA ───────────────────────────────────────────────────────
// The "Book a Consultation" / "Contact Us" pair that closes each content
// section. Copy and destinations come from @/data (one shared record — see
// src/data/sectionCta.js), so this file owns only the markup and the theme.
//
// SAME MAGNETISM AS THE HERO. The Hero's CTAs are <Button> (ui/Button), and
// every motion value below is that component's, copied rather than approximated
// so the two feel identical: the 0.22 pull factor, the {350, 35} spring, the
// 1.04 hover / 0.97 tap scale, and the per-variant layer timings. The gradient
// fills are literally the same CSS — button.css is imported here, so
// .btn-gradient / .btn-gradient-hover / .btn-glow have ONE definition and a
// change to the brand gradient moves the Hero and these together.
//
// WHY THIS IS NOT JUST <Button>. Button renders a <button>, so the Hero has to
// wrap it in a link — a <button> inside an <a>, which is invalid nesting and
// costs the anchor its keyboard and middle-click behaviour. These are anchors
// from the start: the magnetism is applied to the link itself.
//
// `m.create(Link)` is what lets an internal CTA stay a next/link (client-side
// routing, prefetch) while still taking motion props. External hrefs get a
// plain m.a with target="_blank". Same rule the Hero uses — so a CTA can be
// repointed from the data alone and the right element follows.
//
// THIS MUST NOT BE MOUNTED IN THE APP SHELL. It is deliberately only used by
// deferred sections (Our Process, Case Studies, Testimonials), which already
// load framer-motion on approach. Rendering it in Layout/BrandMark instead
// would pull the motion runtime onto the initial bundle of every route and
// back onto the first paint's critical path.
//
// THEME — "dark" (default) for the near-black sections, "light" for the pale
// ones. It only changes the secondary button, which is the one that reads
// against the page rather than against its own gradient.
//
// USAGE
//   <SectionCTA theme="light" />
//   <SectionCTA theme="dark" align="start" className="ya-cta--flush" />

import { useRef, useState, useCallback } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { SECTION_CTA } from "@/data";
// The gradient layers, shared with the Hero's Button — see the note above.
import "../Button/button.css";
import "./sectionCta.css";

/* Button's spring and pull factor, unchanged. */
const SPRING = { stiffness: 350, damping: 35 };
const PULL = 0.22;

/* A next/link that accepts motion props, so an internal CTA keeps client-side
   routing instead of falling back to a full page load. */
const MotionLink = m.create(Link);

const isExternal = (href) => /^https?:/.test(href);

/* Exported so the closing CTA card (sections/FinalCTA) can reuse the exact
   same magnetism and layer stack under its own layout and sizing, instead of
   growing a second, drifting implementation. `className` replaces the default
   shell classes when a caller needs different metrics; `variant` still picks
   which layer stack is painted. */
export function MagneticCta({ href, variant, className, download, children }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * PULL);
      y.set((e.clientY - rect.top - rect.height / 2) * PULL);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const motionProps = {
    ref,
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.97 },
    className: className || `ya-cta-btn ya-cta-btn--${variant}`,
  };

  const layers =
    variant === "primary" ? (
      <>
        {/* Gradient background */}
        <span aria-hidden className="btn-gradient ya-cta-layer" />

        {/* Hover state — slightly lighter gradient */}
        <m.span
          aria-hidden
          className="btn-gradient-hover ya-cta-layer"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Light sweep */}
        <m.span
          aria-hidden
          className="ya-cta-layer ya-cta-sweep ya-cta-sweep--strong"
          animate={{ x: isHovered ? "220%" : "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Outer glow */}
        <m.span
          aria-hidden
          className="btn-glow ya-cta-glow"
          animate={{ opacity: isHovered ? 0 : 0.55, scaleX: isHovered ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
        />
      </>
    ) : (
      <>
        {/* Hover sweep */}
        <m.span
          aria-hidden
          className="ya-cta-layer ya-cta-sweep"
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />

        {/* Cyan border glow on hover. The resting shadow is themed — on a pale
            section a white inset hairline is invisible, so the light variant
            rests on a dark one instead. */}
        <m.span
          aria-hidden
          className="ya-cta-layer ya-cta-ring"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 1px rgba(6,182,212,0.45), 0 0 20px rgba(6,182,212,0.12)"
              : "inset 0 0 0 1px var(--ya-cta-ring-rest)",
          }}
          transition={{ duration: 0.3 }}
        />
      </>
    );

  const content = (
    <>
      {layers}
      <span className="ya-cta-label">{children}</span>
    </>
  );

  if (isExternal(href)) {
    return (
      <m.a href={href} target="_blank" rel="noopener noreferrer" {...motionProps}>
        {content}
      </m.a>
    );
  }
  /* A same-origin file (a PDF in public/downloads, say) gets a plain <a
     download> rather than next/link: routing a file through the client router
     is meaningless, and without the attribute a PDF opens in the browser's
     viewer instead of saving — which is not what a button labelled "Download"
     should do. */
  if (download) {
    return (
      <m.a href={href} download {...motionProps}>
        {content}
      </m.a>
    );
  }
  return (
    <MotionLink href={href} {...motionProps}>
      {content}
    </MotionLink>
  );
}

export default function SectionCTA({
  theme = "dark",
  align = "center",
  className = "",
  primary = SECTION_CTA.primary,
  secondary = SECTION_CTA.secondary,
}) {
  return (
    <div className={`ya-cta ya-cta--${theme} ya-cta--${align} ${className}`.trim()}>
      <MagneticCta href={primary.href} variant="primary">
        {primary.label}
      </MagneticCta>
      <MagneticCta href={secondary.href} variant="secondary">
        {secondary.label}
      </MagneticCta>
    </div>
  );
}

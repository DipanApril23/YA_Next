"use client";

// ─── FinalCTA ─────────────────────────────────────────────────────────
// The closing card: one dark, lit panel floating on the pale surface the FAQ
// ends on, carrying the page's last ask. It is the final thing a visitor reads
// before the brand statement and the footer.
//
// WHY A CARD AND NOT A FULL-WIDTH BAND. Every other section on this page runs
// edge to edge. Ending on a contained, elevated panel reads as a deliberate
// close rather than "one more section", and the dark surface against the light
// page does the work that a heavier band would otherwise need shouting to do.
//
// ── WHAT MAKES IT LOOK EXPENSIVE ─────────────────────────────────────
// Five cheap layers, stacked, none of them doing much on their own:
//
//   1. aurora    two large blurred colour fields, the Hero's palette and the
//                Hero's slow drift, so the page closes the way it opened
//   2. noise     an inline SVG turbulence at 3% — kills the banding that big
//                soft gradients always show on an 8-bit display
//   3. spotlight a radial highlight that follows the pointer across the card
//   4. rim       a gradient hairline along the top edge, brightest in the
//                middle, which is what sells "lit from above"
//
// A blueprint grid used to sit between the aurora and the noise. It was
// removed: the lattice fought the soft gradient underneath it and made the
// card read as a panel with a texture on it rather than as lit glass.
//
// All four are pointer-events:none decoration behind the content. The
// spotlight is the only one that costs anything at runtime, and it writes two
// custom properties inside a rAF — no React state, no re-render per frame.
//
// ── THE BUTTONS ARE THE HERO'S ───────────────────────────────────────
// <MagneticCta> is the same component the section CTAs use, so the pull, the
// spring and the hover scale match the Hero exactly. Only the shell classes
// differ (this card's buttons are wider and stacked); the layer stack and the
// motion come from there. See components/ui/SectionCTA/SectionCTA.jsx.
//
// PERFORMANCE — mounted through <DeferredSection>, so nothing here is
// downloaded until the visitor is near it. Safe to use framer-motion.

import { useEffect, useRef } from "react";
import { m, useReducedMotion } from "framer-motion";
import { MagneticCta } from "@/components/ui/SectionCTA/SectionCTA";
import { FINAL_CTA as CONTENT } from "@/data";
import "./finalCta.css";

/* The Hero's fadeUp, so the page's first and last blocks arrive the same way. */
const fadeUp = (delay = 0) => ({
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const CheckIcon = ({ className = "" }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3.2 8.4 6.2 11.4 12.8 4.8"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FinalCTA() {
  const cardRef = useRef(null);
  const reduce = useReducedMotion();

  /* Pointer spotlight. Writes --fc-mx / --fc-my on the card and lets CSS do the
     painting, inside a rAF so a fast pointer cannot queue more work than the
     compositor can take. No state, so this never re-renders the tree. */
  useEffect(() => {
    const card = cardRef.current;
    if (!card || reduce) return;
    // A finger cannot hover, so the spotlight is mouse-only.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let px = 0;
    let py = 0;

    const paint = () => {
      raf = 0;
      card.style.setProperty("--fc-mx", px + "%");
      card.style.setProperty("--fc-my", py + "%");
    };

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 100;
      py = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onEnter = () => card.classList.add("fc-lit");
    const onLeave = () => {
      card.classList.remove("fc-lit");
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerenter", onEnter, { passive: true });
    card.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <section className="fc-section" aria-labelledby="final-cta-heading">
      <div className="fc-wrap">
        <m.div
          ref={cardRef}
          className="fc-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, visible: {} }}
        >
          {/* ════════ decoration — all of it behind the content ════════ */}
          <div className="fc-aurora fc-aurora--a" aria-hidden="true" />
          <div className="fc-aurora fc-aurora--b" aria-hidden="true" />
          <div className="fc-noise" aria-hidden="true" />
          <div className="fc-spot" aria-hidden="true" />
          <span className="fc-rim" aria-hidden="true" />

          {/* ════════════════════ content ════════════════════ */}
          <div className="fc-body">
            <m.span variants={fadeUp(0)} className="fc-badge">
              <span className="fc-badge-dot" aria-hidden="true" />
              {CONTENT.badge}
            </m.span>

            <m.h2 variants={fadeUp(0.06)} id="final-cta-heading" className="fc-heading">
              {CONTENT.headline}
              <span className="fc-heading-accent">{CONTENT.headlineAccent}</span>
            </m.h2>

            <m.p variants={fadeUp(0.12)} className="fc-lead">
              {CONTENT.lead}
            </m.p>

            <m.ul variants={fadeUp(0.18)} className="fc-pills">
              {CONTENT.pills.map((pill) => (
                <li key={pill} className="fc-pill">
                  <CheckIcon className="fc-pill-check" />
                  {pill}
                </li>
              ))}
            </m.ul>

            <m.p variants={fadeUp(0.24)} className="fc-eyebrow">
              {CONTENT.eyebrow}
            </m.p>

            <m.div variants={fadeUp(0.3)} className="fc-actions">
              <MagneticCta
                href={CONTENT.primary.href}
                variant="primary"
                className="ya-cta-btn fc-btn fc-btn--primary"
              >
                {CONTENT.primary.label}
                <svg
                  className="fc-btn-arrow"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10h11m0 0-4-4m4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </MagneticCta>

              <MagneticCta
                href={CONTENT.secondary.href}
                variant="secondary"
                className="ya-cta-btn fc-btn fc-btn--secondary"
                /* The collateral is a file, so save it rather than opening it
                   in the browser's PDF viewer. */
                download
              >
                {CONTENT.secondary.label}
                <svg
                  className="fc-btn-arrow"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 3.5v9m0 0 3.4-3.4M10 12.5 6.6 9.1M4 16.5h12"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </MagneticCta>
            </m.div>

            <m.p variants={fadeUp(0.36)} className="fc-trust">
              {CONTENT.trust.map((t) => (
                <span key={t} className="fc-trust-item">
                  <CheckIcon className="fc-trust-check" />
                  {t}
                </span>
              ))}
              <span className="fc-trust-tail">{CONTENT.trustTail}</span>
            </m.p>
          </div>
        </m.div>
      </div>
    </section>
  );
}

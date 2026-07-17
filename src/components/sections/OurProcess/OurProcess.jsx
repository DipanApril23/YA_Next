"use client";

/* ============================================================
   OUR PROCESS — "The Blueprint Spine"
   Young Architects · dark theme · React + GSAP + Framer Motion

   This file owns only structure, animation and the icon lookup:
     · Content, steps and particle data → src/data/ourProcess.js
     · Every style rule                  → ./ourProcess.css
   Per-step colour reaches the CSS purely as data, through the
   `--accent` / `--glow` custom properties set on each <li>.

   Requires: gsap, framer-motion (already project dependencies).
   ============================================================ */

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  OURPROCESS_CONTENT as CONTENT,
  OURPROCESS_STEPS,
  OURPROCESS_PARTICLES,
} from "@/data";
import "./ourProcess.css";

/* Resolves each step's `icon` key (from the data) onto its SVG. Kept in the
   component — like SERVICE_ICONS in MainServices — so the data stays plain. */
const PROCESS_ICONS = {
  consult: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  plan: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M3 12h3M18 12h3M12 18v3" />
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 12h4M12 10v4" />
    </svg>
  ),
  funnel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h18l-7 8.5V19l-4 2v-8.5L3 4z" />
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V13M10 21V9M15 21V12M20 21V5" />
      <path d="M14 5.5 20 5l-.5 6" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
      <path d="M22 11 11 22" opacity="0.45" />
    </svg>
  ),
};

/* Number of measurement ticks under each card, and how many fill per step. */
const TICK_COUNT = 24;
const TICKS_PER_STEP = 5;

/* ── Motion variants (animation behaviour, not content) ──────── */
const EASE = [0.22, 1, 0.36, 1];

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const blurUp = {
  hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const cardIn = (fromLeft) => ({
  hidden: { opacity: 0, y: 60, x: fromLeft ? -28 : 28, scale: 0.96, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE },
  },
});

const numeralIn = (fromLeft) => ({
  hidden: { opacity: 0, x: fromLeft ? 40 : -40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 1, delay: 0.15, ease: EASE },
  },
});

/* ── Component ───────────────────────────────────────────────── */
export default function OurProcess() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const fillRef = useRef(null);
  const dotRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const total = OURPROCESS_STEPS.length;
  const totalLabel = String(total).padStart(2, "0");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(fillRef.current, { scaleY: 1 });
        gsap.set(dotRef.current, { autoAlpha: 0 });
        document
          .querySelectorAll(".op-node")
          .forEach((n) => n.classList.add("is-active"));
        return;
      }

      /* Blueprint spine draws itself as you scroll */
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 72%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );

      /* Glowing pen-tip travels with the drawn line */
      gsap.fromTo(
        dotRef.current,
        { top: "0%" },
        {
          top: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 72%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );

      /* Nodes light up (and pop) as the spine passes them */
      gsap.utils.toArray(".op-node").forEach((node) => {
        ScrollTrigger.create({
          trigger: node,
          start: "top 64%",
          onEnter: () => {
            node.classList.add("is-active");
            gsap.fromTo(
              node,
              { scale: 0.82 },
              { scale: 1, duration: 0.6, ease: "back.out(2.5)" }
            );
          },
          onLeaveBack: () => node.classList.remove("is-active"),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="our-process"
      className="op-section"
      aria-labelledby="process-heading"
    >
      {/* ── Backdrop: aurora field + vignette + grain + particles ── */}
      <div aria-hidden="true" className="op-backdrop">
        <div className="op-aurora op-aurora--1" />
        <div className="op-aurora op-aurora--2" />
        <div className="op-aurora op-aurora--3" />
        <div className="op-vignette" />
        <div className="op-grain" />
        {OURPROCESS_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="op-particle"
            style={{ "--x": p.x, "--y": p.y, "--s": `${p.s}px`, "--d": p.d, "--dl": p.dl }}
          />
        ))}
      </div>

      <div className="op-container">
        {/* ── Header ── */}
        <motion.div
          className="op-header"
          variants={headerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.span variants={blurUp} className="op-badge">
            <span className="op-badge-pulse">
              <span className="op-badge-ping" />
              <span className="op-badge-dot" />
            </span>
            {CONTENT.badge}
          </motion.span>

          <motion.h2 variants={blurUp} id="process-heading" className="op-heading">
            {CONTENT.headingLead}{" "}
            <span className="op-heading-highlight">{CONTENT.headingHighlight}</span>
          </motion.h2>

          <motion.p variants={blurUp} className="op-sub">
            {CONTENT.subheading}
          </motion.p>
        </motion.div>

        {/* ── Blueprint timeline ── */}
        <div ref={timelineRef} className="op-timeline">
          <div aria-hidden="true" className="op-spine-track" />
          <div aria-hidden="true" ref={fillRef} className="op-spine-fill" />
          <div aria-hidden="true" ref={dotRef} className="op-spine-dot" />

          <ol className="op-steps">
            {OURPROCESS_STEPS.map((step, i) => {
              const cardOnLeft = i % 2 === 0;
              const filled = (i + 1) * TICKS_PER_STEP;
              const icon = PROCESS_ICONS[step.icon];
              return (
                <li
                  key={step.num}
                  className="op-step"
                  style={{ "--accent": step.accent, "--glow": step.glow }}
                >
                  {/* Node on the spine: step icon */}
                  <div className="op-node-wrap">
                    <span className="op-node">
                      <span className="op-node-ring" />
                      <span className="op-node-icon">{icon}</span>
                    </span>
                  </div>

                  {/* Ghost numeral + phase annotation (desktop) */}
                  <motion.div
                    className={`op-ghost ${cardOnLeft ? "op-ghost--left" : "op-ghost--right"}`}
                    aria-hidden="true"
                    variants={numeralIn(cardOnLeft)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                  >
                    <span className="op-ghost-num">{step.num}</span>
                    <span className="op-ghost-phase">
                      <span className="op-ghost-line" />
                      {step.phase}
                    </span>
                  </motion.div>

                  {/* Step card: glass + border-beam */}
                  <motion.div
                    className={`op-card-col ${cardOnLeft ? "op-card-col--left" : "op-card-col--right"}`}
                    variants={cardIn(cardOnLeft)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                  >
                    <motion.article
                      className="op-card"
                      whileHover={prefersReduced ? {} : { y: -7 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                      <span aria-hidden="true" className="op-card-edge" />

                      <div className="op-card-body">
                        <span aria-hidden="true" className="op-card-topline" />
                        <span aria-hidden="true" className="op-card-sheen" />
                        <span aria-hidden="true" className="op-card-glow" />

                        <div className="op-card-head">
                          <div className="op-card-icon">
                            <span className="op-card-icon-inner">{icon}</span>
                          </div>
                          <span className="op-card-tag">{step.tag}</span>
                        </div>

                        <p className="op-card-step">Step {step.num}</p>

                        <h3 className="op-card-title">{step.title}</h3>
                        <p className="op-card-desc">{step.desc}</p>

                        {/* Measurement ticks — blueprint detail */}
                        <div className="op-ticks" aria-hidden="true">
                          {Array.from({ length: TICK_COUNT }).map((_, t) => (
                            <span
                              key={t}
                              className={`op-tick ${t < filled ? "op-tick--on" : ""}`}
                            />
                          ))}
                          <span className="op-tick-count">
                            {step.num} / {totalLabel}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

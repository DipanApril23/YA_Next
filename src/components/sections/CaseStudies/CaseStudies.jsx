"use client";

/* ============================================================
   CASE STUDIES — "Proof, Not Promises"
   Young Architects · dark theme · React + GSAP + Framer Motion

   This file owns structure + animation for the whole section, including
   the GalaxyBackground sub-component (nebula/stars/grain backdrop) defined
   below. All styling — cards, sticky stack, and the galaxy backdrop — lives
   in the single ./caseStudies.css, and all content in src/data/caseStudies.js.

   GalaxyBackground's star positions come from a SEEDED pseudo-random
   generator (mulberry32), never Math.random(). Next.js still prerenders
   "use client" components on the server, so true randomness here would
   make the server-rendered stars differ from the client's first render —
   a hydration mismatch. Seeding keeps server and client byte-identical.

   Desktop = sticky sidebar + sticky card stack. Each card sticks at
   the same on-screen spot; the NEXT card simply arrives (fully
   opaque, higher z-index) and covers it, while the outgoing card
   shrinks/dims behind a solid veil. No opacity crossfade of card
   content, so two cards' text can never blend/ghost mid-scroll —
   and because sticky sizes to content (not a forced 100vh), a card
   is never cut off regardless of copy length or screen height.

   Mobile = swipeable / auto-playing slider.

   Interaction: results-index is clickable (jumps to that card);
   the active (front) card tilts gently toward the cursor — a
   SEPARATE inner layer owns that transform so it never fights the
   scroll-driven GSAP scale/recede on the outer card element.

   CARD ANATOMY — hook, then proof, then evidence:
     1. hook     one short human line, set as a pull-quote
     2. summary  one line of what was built — the card's keyword line
     3. shifts   the Before → After ledger: per row, the honest starting
                 state, the stated result, and a bar whose length comes
                 from `fill` in the data and grows as the card scrolls in
   This replaced two dense "Challenge / What We Built" paragraphs. Same
   claims, roughly a third of the words, and the movement is shown rather
   than asserted — a visitor gets the whole story without reading prose.

   HEIGHT IS A HARD BUDGET. A stuck card is only ever visible between
   STICKY_TOP and the fold, so anything taller than (100vh - STICKY_TOP) is
   not "below the fold of the card" — it is never on screen at all. That is
   how the stack row went missing on short windows. The card's vertical
   rhythm compresses at max-height: 840px and again at 700px (see the
   stylesheet) rather than letting the last row fall off the bottom.

   Adding a 4th / 5th case study: add an object to CASESTUDIES_ITEMS
   in the data file. Results index, card stack, and mobile slider
   all read that array's length — nothing here needs to change.
   ============================================================ */

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { m, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/ui";
import { CASESTUDIES_CONTENT as CONTENT, CASESTUDIES_ITEMS as ITEMS } from "@/data";
import "./caseStudies.css";

gsap.registerPlugin(ScrollTrigger);

const C = CONTENT.tokens;
const CARD = CONTENT.card;
const GRAD = CONTENT.gradient;
const GRAD_TEXT = CONTENT.gradientText;
const N = ITEMS.length;

// Distance (px) each card sticks from the top of the viewport. Kept as a
// JS constant (not just CSS) because the GSAP ScrollTrigger math below
// must land on exactly this value — see the "top {STICKY_TOP}px" trigger.
const STICKY_TOP = 96;

// ─── Framer Motion Variants ───────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  },
});

// The ledger bars re-run their fill EVERY time a card comes into view, not
// just the first — someone who scrolls back up should see the same thing they
// saw the first time, and on mobile each slide should fill as it arrives.
// Hence no `once: true` on the viewport, plus an `empty` variant whose
// transition is zero-length: the reset happens off-screen, and animating the
// bars back DOWN would read as a visible rewind to anyone scrolling slowly.
// `grown` is dynamic so each bar resolves its own width and stagger from the
// `custom` prop; the delay is explicit rather than `staggerChildren` because
// the bars are not direct children of the element that owns the variant.
const barVariants = {
  empty: { width: 0, transition: { duration: 0 } },
  grown: ({ fill, i }) => ({
    width: `${fill}%`,
    transition: { duration: 1.1, delay: 0.15 + i * 0.14, ease: [0.16, 1, 0.3, 1] },
  }),
};

const indexListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};
const indexRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// ─── GalaxyBackground — deep-space nebula + starfield backdrop ────
// Self-contained: safe to lift out into src/ui/ later if other sections
// (Hero, MainServices) want the same backdrop. See the file header for
// why star positions use a seeded PRNG instead of Math.random().
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(count, seed) {
  const rand = mulberry32(seed);
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 1.6 + 0.6,
      opacity: rand() * 0.45 + 0.3,
      duration: rand() * 4 + 3,
      delay: rand() * 6,
    });
  }
  return stars;
}

// Computed once at module load — identical on server and client.
const STARS_SMALL = generateStars(85, 1337);
const STARS_BRIGHT = generateStars(16, 4242);

function GalaxyBackground({ parallax = false }) {
  const rootRef = useRef(null);
  const starsRef = useRef(null);
  const nebulaRef = useRef(null);

  useEffect(() => {
    if (!parallax) return;
    const root = rootRef.current;
    if (!root) return;

    const handleMove = (e) => {
      const rect = root.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (starsRef.current) {
        starsRef.current.style.transform = `translate(${px * -14}px, ${py * -14}px)`;
      }
      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `translate(${px * 22}px, ${py * 16}px)`;
      }
    };

    root.addEventListener("mousemove", handleMove);
    return () => root.removeEventListener("mousemove", handleMove);
  }, [parallax]);

  return (
    <div ref={rootRef} aria-hidden="true" className="gx-root">
      <div ref={nebulaRef} className="gx-nebula-layer">
        <div className="gx-blob gx-blob-1" />
        <div className="gx-blob gx-blob-2" />
        <div className="gx-blob gx-blob-3" />
        <div className="gx-blob gx-blob-4" />
      </div>

      <div ref={starsRef} className="gx-star-layer">
        {STARS_SMALL.map((s, i) => (
          <span
            key={`s-${i}`}
            className="gx-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              "--gx-op": s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {STARS_BRIGHT.map((s, i) => (
          <span
            key={`b-${i}`}
            className="gx-star gx-star-bright"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size * 1.8,
              height: s.size * 1.8,
              "--gx-op": s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="gx-grain" />
      <div className="gx-vignette" />
    </div>
  );
}

// ─── Ledger arrow ─────────────────────────────────────────────
// Inherits `currentColor` rather than carrying a gradient, so it can be
// reused on every row without minting a unique <linearGradient> id per card.
function ShiftArrow() {
  return (
    <svg className="cs-arrow" width="17" height="8" viewBox="0 0 17 8" fill="none" aria-hidden="true">
      <path
        d="M0.75 4h13.9M11.7 1l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Card ─────────────────────────────────────────────────────
// See CARD ANATOMY in the file header. Everything below the headline is
// content-driven: rows come from `item.shifts`, and a study with two or four
// of them lays out just as well as one with three.
//
// `compact` is the mobile-slider variant. It only toggles the `is-compact`
// class — every size difference lives in the stylesheet next to its desktop
// default, so the two variants can never drift apart in two files at once.
function Card({ item, compact = false }) {
  // The ledger bars grow every time the card scrolls into view (see
  // barVariants). When the visitor has asked for less motion they start at
  // their final width instead, and `whileInView` then has nothing to change.
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const orbRef1 = useRef(null);
  const orbRef2 = useRef(null);

  // Mouse-tracking parallax glow + a gentle 3D tilt on desktop.
  // The tilt transform lives on tiltRef — an INNER layer, never the
  // outer .cs-glass-card — because that outer element's transform is
  // owned by the scroll-driven GSAP recede animation. Two elements,
  // two independent transforms, no fighting between the systems.
  useEffect(() => {
    if (compact) return;
    const el = cardRef.current;
    const tilt = tiltRef.current;
    if (!el || !tilt) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      if (orbRef1.current) {
        orbRef1.current.style.left = `${px * 100 - 30}%`;
        orbRef1.current.style.top = `${py * 100 - 30}%`;
      }
      if (orbRef2.current) {
        orbRef2.current.style.left = `${px * 100 - 10}%`;
        orbRef2.current.style.top = `${py * 100 + 10}%`;
      }

      tilt.style.transition = "none";
      tilt.style.transform = `perspective(1200px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg)`;
    };

    const handleLeave = () => {
      tilt.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
      tilt.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [compact]);

  return (
    <article
      ref={cardRef}
      className="cs-glass-card"
      aria-label={`${item.label} case study — ${item.title.replace(/\n/g, " ")}`}
      style={{
        // Card text colours travel as custom properties, not as inline
        // `color` on each node: the stylesheet needs to override them on
        // :hover, and an inline colour cannot be overridden by a rule.
        "--cs-ink": C.ink,
        "--cs-copy": C.cardCopy,
        "--cs-label": C.cardLabel,
        "--cs-label-hi": C.cardLabelHi,
        "--cs-accent": C.accent1,
        "--cs-tag": C.tagText,
        position: "relative",
        borderRadius: compact ? 20 : 26,
        overflow: "hidden",
        width: "100%",
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow:
          "0 0 0 1px rgba(168,85,247,0.06)," +
          "0 20px 60px rgba(0,0,0,0.5)," +
          "0 40px 100px rgba(168,85,247,0.1)," +
          "inset 0 1px 0 rgba(255,255,255,0.12)," +
          "inset 0 -1px 0 rgba(0,0,0,0.25)",
      }}
    >
      {/* ── Animated orb glows ── */}
      <div
        ref={orbRef1}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: compact ? 160 : 260,
          height: compact ? 160 : 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.28) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          top: "-20%",
          left: "-10%",
          transition: "left 0.6s ease, top 0.6s ease",
          zIndex: 0,
        }}
      />
      <div
        ref={orbRef2}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: compact ? 120 : 200,
          height: compact ? 120 : 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.22) 0%, transparent 70%)",
          filter: "blur(35px)",
          pointerEvents: "none",
          bottom: "-10%",
          right: "-10%",
          transition: "left 0.8s ease, top 0.8s ease",
          zIndex: 0,
        }}
      />

      {/* ── Glass edge highlight — light catching the top-left of the pane ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 34%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Tilt layer — everything readable lives in here ── */}
      <div ref={tiltRef} className="cs-tilt-layer">
        <div className="cs-rail" style={{ background: GRAD }}>
          <div className="cs-stripe-shimmer" />
        </div>

        <div className={`cs-body${compact ? " is-compact" : ""}`}>
          {/* ── Who this was for ── */}
          <div className="cs-head">
            <p className="cs-eyebrow">
              <span className="cs-eyebrow-client">{item.label}</span>
              <span className="cs-eyebrow-industry"> · {item.industry}</span>
            </p>
            <span className="cs-id">{item.id}</span>
          </div>

          <h3 className="cs-title">{item.title}</h3>

          {/* ── 1. The hook, 2. the build — one accented block, because
                 together they are the card's story; the proof below is not ── */}
          <div className="cs-lede">
            <p className="cs-hook">{item.hook}</p>
            <p className="cs-summary">{item.summary}</p>
          </div>

          {/* ── 3. The ledger — a <dl> because each row genuinely is a term
                 (the metric) and its value (where it ended up). Semantic
                 markup here is also what makes the proof legible to crawlers
                 rather than reading as three loose numbers.

                 The bar lives inside the <dd> alongside the values: a <dl>
                 row may only contain <dt> and <dd>, and the bar is that
                 value drawn rather than a fourth thing. ── */}
          <div className="cs-shift">
            <div className="cs-shift-head">
              <span className="cs-microlabel">{CARD.shiftLabel}</span>
              <span className="cs-microlabel cs-shift-legend">{CARD.shiftLegend}</span>
            </div>

            <m.dl
              className="cs-ledger"
              initial={reduceMotion ? "grown" : "empty"}
              whileInView="grown"
              viewport={{ amount: 0.4 }}
            >
              {item.shifts.map((row, ri) => (
                <div className="cs-row" key={row.metric}>
                  <dt className="cs-row-metric">{row.metric}</dt>
                  <dd className="cs-row-values">
                    <span className="cs-values">
                      <span className="cs-before">{row.before}</span>
                      <ShiftArrow />
                      <span className="cs-sr">to</span>
                      <span className="cs-after" style={GRAD_TEXT}>
                        {row.after}
                      </span>
                    </span>
                    <span className="cs-track" aria-hidden="true">
                      <m.span
                        className="cs-fill"
                        style={{ background: GRAD }}
                        variants={barVariants}
                        custom={{ fill: row.fill, i: ri }}
                      >
                        <span className="cs-fill-head" />
                      </m.span>
                    </span>
                  </dd>
                </div>
              ))}
            </m.dl>
          </div>

          {/* ── What it was built with. Label and tools share one row: stacked,
                 this block was the part that fell off the bottom of the card. ── */}
          <div className="cs-stack">
            <span className="cs-microlabel cs-stack-label">{CARD.stackLabel}</span>
            <div className="cs-tags">
              {item.tags.map((tag) => (
                <span key={tag} className="cs-glass-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="cs-underglow" aria-hidden="true" />
      </div>

      {/* Dims this card as the next one arrives (desktop stack only). */}
      <div className="cs-veil" aria-hidden="true" />
    </article>
  );
}

// ─── Left Panel (Desktop) ─────────────────────────────────────
function LeftPanel({ activeIndex, onJumpTo }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(30px,4vh,48px)" }}>
      <SectionHeader
        theme="dark"
        align="left"
        badge={CONTENT.eyebrow}
        headingLead={CONTENT.title.line1}
        headingRest={CONTENT.title.emphasis}
        subheading={CONTENT.intro}
      />

      {/* results index — click to jump to that card */}
      <div>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: C.muted,
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          {CONTENT.indexLabel}
        </p>

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={indexListVariants}
          style={{ display: "flex", flexDirection: "column", gap: 9 }}
        >
          {ITEMS.map((item, i) => (
            <m.button
              key={item.id}
              type="button"
              variants={indexRowVariants}
              onClick={() => onJumpTo(i)}
              className={`cs-index-row${i === activeIndex ? " is-active" : ""}`}
              style={{ gap: 14 }}
              aria-current={i === activeIndex ? "true" : undefined}
            >
              <div className="cs-prog-track">
                <div className="cs-prog-fill" />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: C.muted,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {item.id}
                </p>
                <p
                  className="cs-index-label"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: 11,
                    color: C.body,
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {item.label}
                </p>
              </div>
            </m.button>
          ))}
        </m.div>
      </div>

      {/* trust pill */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp(0.9)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: "12px 20px",
          boxShadow: "0 2px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: GRAD,
            flexShrink: 0,
            boxShadow: `0 0 10px ${C.accent1}aa`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: 12,
            color: C.body,
            fontWeight: 500,
          }}
        >
          {CONTENT.trust.lead} <strong style={{ color: C.ink }}>{CONTENT.trust.strong}</strong>{" "}
          {CONTENT.trust.tail}
        </span>
      </m.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function CaseStudies() {
  const slideRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const jumpTo = useCallback((i) => {
    slideRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // ── Mobile slider state ──
  const [activeSlide, setActiveSlide] = useState(0);
  const autoPlayTimer = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const restartAutoPlay = useCallback(() => {
    clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % N);
    }, 3500);
  }, []);

  useEffect(() => {
    restartAutoPlay();
    return () => clearInterval(autoPlayTimer.current);
  }, [restartAutoPlay]);

  const goToSlide = useCallback(
    (idx) => {
      setActiveSlide(((idx % N) + N) % N);
      restartAutoPlay();
    },
    [restartAutoPlay]
  );

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current || 0));
      if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
        setActiveSlide((prev) => (dx < 0 ? (prev + 1) % N : (prev - 1 + N) % N));
        restartAutoPlay();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [restartAutoPlay]
  );

  // ── Desktop GSAP: sticky-stack recede + active-index tracking ──
  useEffect(() => {
    const mm = gsap.matchMedia();

    // `isStacked` mirrors the stylesheet: under 700px of window the slides
    // stop being sticky and the cards flow, so there is nothing arriving to
    // cover them and the recede would just be shrinking cards for no reason.
    // Declared as matchMedia conditions rather than read once, so resizing
    // across the threshold rebuilds the triggers instead of stranding them.
    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isStacked: "(min-width: 768px) and (min-height: 700px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
      const { isDesktop, isStacked, reduce } = ctx.conditions;
      if (!isDesktop) return;

      const slides = gsap.utils.toArray(".cs-slide");
      if (!slides.length) return;
      const cards = gsap.utils.toArray(".cs-slide .cs-glass-card");
      const veils = gsap.utils.toArray(".cs-slide .cs-veil");

      slides.forEach((slide, i) => {
        ScrollTrigger.create({
          trigger: slide,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActiveIndex(i),
        });
      });

      if (isStacked && !reduce) {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: slides[i + 1],
                start: "top bottom-=160",
                end: `top ${STICKY_TOP}px`,
                scrub: 0.5,
              },
            })
            .to(card, { scale: 0.94, y: -14, ease: "none" }, 0)
            .to(veils[i], { opacity: 0.55, ease: "none" }, 0);
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div style={{ position: "relative", background: C.bg }}>
      {/* ════════════ MOBILE (< 768px) ════════════ */}
      <div className="cs-mobile-only">
        <section id="cs-mobile" className="cs-texture" style={{ position: "relative", width: "100%", overflow: "hidden", background: C.bg }}>
          <GalaxyBackground />

          <div style={{ position: "relative", zIndex: 1, padding: "clamp(20px,5vw,32px) clamp(18px,5vw,28px) clamp(16px,3vw,22px)" }}>
            <SectionHeader
              theme="dark"
              align="left"
              badge={CONTENT.eyebrow}
              headingLead={CONTENT.title.line1}
              headingRest={CONTENT.title.emphasis}
              subheading={CONTENT.mobileIntro}
            />
          </div>

          <div className="cs-slider-track" style={{ position: "relative", zIndex: 1, overflow: "hidden", width: "100%" }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div style={{ display: "flex", transform: `translateX(-${activeSlide * 100}%)`, transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)", willChange: "transform" }}>
              {ITEMS.map((item) => (
                <div key={item.id} style={{ flex: "0 0 100%", padding: "0 clamp(18px,5vw,28px)", minWidth: 0 }}>
                  <Card item={item} compact />
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, padding: "clamp(14px,3vw,20px) 0 clamp(20px,5vw,32px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {ITEMS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => goToSlide(i)}
                  style={{
                    height: 6,
                    width: i === activeSlide ? 20 : 6,
                    borderRadius: 3,
                    backgroundColor: i === activeSlide ? C.accent1 : "rgba(255,255,255,0.2)",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: "pointer",
                    flexShrink: 0,
                    boxShadow: i === activeSlide ? `0 0 10px ${C.accent1}` : "none",
                  }}
                />
              ))}
            </div>
            <p style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase", color: C.muted, margin: 0 }}>
              {CONTENT.swipeLabel}
            </p>
          </div>
        </section>
      </div>

      {/* ════════════ DESKTOP (≥ 768px) ════════════ */}
      <div className="cs-desktop-only">
        <section id="cs-desktop" className="cs-texture" style={{ position: "relative", width: "100%", background: C.bg }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
            <GalaxyBackground parallax />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 1340,
              margin: "0 auto",
              padding: "clamp(48px,6vh,80px) clamp(32px,4vw,56px) clamp(24px,4vh,48px)",
              display: "grid",
              gridTemplateColumns: "1fr 1.08fr",
              gap: "clamp(48px,5vw,100px)",
            }}
          >
            <div>
              <div className="cs-sidebar-sticky" style={{ top: STICKY_TOP }}>
                <LeftPanel activeIndex={activeIndex} onJumpTo={jumpTo} />
              </div>
            </div>

            <div>
              {ITEMS.map((item, i) => (
                <div
                  key={item.id}
                  ref={(el) => (slideRefs.current[i] = el)}
                  className={`cs-slide${i === N - 1 ? " is-last" : ""}`}
                  style={{ top: STICKY_TOP, zIndex: i + 1 }}
                >
                  {i === 0 ? (
                    <m.div
                      initial={{ opacity: 0, scale: 0.94, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ width: "100%", maxWidth: 620 }}
                    >
                      <Card item={item} />
                    </m.div>
                  ) : (
                    <div style={{ width: "100%", maxWidth: 620 }}>
                      <Card item={item} />
                    </div>
                  )}
                </div>
              ))}
              <div style={{ height: "clamp(40px,6vh,90px)" }} />
            </div>
          </div>

          <div style={{ position: "relative", height: 1, background: GRAD, opacity: 0.2, zIndex: 2 }} />
        </section>
      </div>
    </div>
  );
}
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

   Adding a 4th / 5th case study: add an object to CASESTUDIES_ITEMS
   in the data file. Results index, card stack, and mobile slider
   all read that array's length — nothing here needs to change.
   ============================================================ */

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui";
import { CASESTUDIES_CONTENT as CONTENT, CASESTUDIES_ITEMS as ITEMS } from "@/data";
import "./caseStudies.css";

gsap.registerPlugin(ScrollTrigger);

const C = CONTENT.tokens;
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

// ─── Card ─────────────────────────────────────────────────────
function Card({ item, compact = false }) {
  const pad = compact ? "20px 20px 24px" : "clamp(24px,2.6vw,40px)";
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
    <div
      ref={cardRef}
      className="cs-glass-card"
      style={{
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
        <div
          style={{
            position: "relative",
            height: 3,
            background: GRAD,
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <div className="cs-stripe-shimmer" />
        </div>

        <div style={{ padding: pad, position: "relative", zIndex: 1 }}>
          {/* ── Header row ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              paddingBottom: compact ? 14 : 16,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              marginBottom: compact ? 16 : 18,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                <span style={{ color: C.accent1 }}>{item.label}</span>
                <span style={{ color: C.muted }}> · {item.industry}</span>
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: compact
                    ? "clamp(1.5rem,6vw,1.9rem)"
                    : "clamp(1.9rem,2.4vw,2.6rem)",
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: C.ink,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {item.title}
              </h3>
            </div>

            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.1em",
                padding: "5px 11px",
                borderRadius: 100,
                flexShrink: 0,
                background: "rgba(168,85,247,0.14)",
                backdropFilter: "blur(8px)",
                color: "#d8b4fe",
                border: "1px solid rgba(168,85,247,0.3)",
                fontWeight: 700,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
              }}
            >
              {item.id}
            </span>
          </div>

          {/* ── The Challenge / What We Built — verbatim copy ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: compact ? 10 : 14,
              marginBottom: compact ? 16 : 20,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: compact ? 12.5 : 13.5,
                lineHeight: 1.62,
                color: C.body,
                margin: 0,
              }}
            >
              <span style={{ fontWeight: 700, color: C.accent1 }}>The Challenge: </span>
              {item.challenge}
            </p>
            <p
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: compact ? 12.5 : 13.5,
                lineHeight: 1.62,
                color: C.body,
                margin: 0,
              }}
            >
              <span style={{ fontWeight: 700, color: C.accent2 }}>What We Built: </span>
              {item.built}
            </p>
          </div>

          {/* ── The Result — 3-stat row, each with a small gradient tick ── */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: compact ? 14 : 18,
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: C.muted,
                marginBottom: compact ? 10 : 12,
                fontWeight: 700,
              }}
            >
              The Result
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${item.stats.length}, 1fr)`,
                gap: compact ? 8 : 16,
              }}
            >
              {item.stats.map((s, si) => (
                <div key={si}>
                  <span
                    style={{
                      display: "block",
                      width: 14,
                      height: 2,
                      borderRadius: 2,
                      background: GRAD,
                      marginBottom: 6,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: compact
                        ? "clamp(0.95rem,3.6vw,1.15rem)"
                        : "clamp(1.15rem,1.7vw,1.5rem)",
                      fontWeight: 700,
                      lineHeight: 1.05,
                      ...GRAD_TEXT,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: compact ? 10 : 10.5,
                      lineHeight: 1.35,
                      color: C.body,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tags ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: compact ? 16 : 20 }}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="cs-glass-tag"
                style={{
                  padding: "5px 12px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  color: C.tagText,
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                  transition: "background 0.25s, box-shadow 0.25s, border-color 0.25s",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(168,85,247,0.4), rgba(236,72,153,0.4), transparent)",
            zIndex: 2,
          }}
        />
      </div>

      {/* Dims this card as the next one arrives (desktop stack only). */}
      <div className="cs-veil" aria-hidden="true" />
    </div>
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={indexListVariants}
          style={{ display: "flex", flexDirection: "column", gap: 9 }}
        >
          {ITEMS.map((item, i) => (
            <motion.button
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
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* trust pill */}
      <motion.div
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
      </motion.div>
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

    mm.add("(min-width: 768px)", () => {
      const slides = gsap.utils.toArray(".cs-slide");
      if (!slides.length) return;
      const cards = gsap.utils.toArray(".cs-slide .cs-glass-card");
      const veils = gsap.utils.toArray(".cs-slide .cs-veil");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      slides.forEach((slide, i) => {
        ScrollTrigger.create({
          trigger: slide,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActiveIndex(i),
        });
      });

      if (!reduce) {
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
    });

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
                  className="cs-slide"
                  style={{ top: STICKY_TOP, zIndex: i + 1 }}
                >
                  {i === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ width: "100%", maxWidth: 620 }}
                    >
                      <Card item={item} />
                    </motion.div>
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
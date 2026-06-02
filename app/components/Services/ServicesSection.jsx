"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ─── Design Tokens ────────────────────────────────────────────
const C = {
  bg:      "#F8F7F4",
  card:    "#FFFFFF",
  border:  "rgba(0,0,0,0.07)",
  ink:     "#0F0E0D",
  body:    "#5C5856",
  muted:   "#A09C98",
  accent1: "#7C3AED",
  accent2: "#EC4899",
  tagBg:   "#EDEBF0",
  tagText: "#6B5F7A",
  progBg:  "rgba(124,58,237,0.12)",
  numBg:   "rgba(124,58,237,0.05)",
};

const GRAD      = `linear-gradient(135deg, ${C.accent1} 0%, ${C.accent2} 100%)`;
const GRAD_TEXT = {
  backgroundImage:        GRAD,
  WebkitBackgroundClip:   "text",
  WebkitTextFillColor:    "transparent",
  backgroundClip:         "text",
};

// ─── Services Data ────────────────────────────────────────────
const SERVICES = [
  {
    id: "01", label: "POSITIONING",
    title: "Authority\nWebsites",
    heading: "Designed to make your company feel established before the first conversation.",
    description: "We create premium digital experiences engineered to increase perceived value, strengthen trust, and position brands like category leaders.",
    points: ["Luxury-level UI systems", "Cinematic interactions & motion", "Conversion-focused architecture", "Premium visual positioning"],
    tags: ["Premium UX", "Authority", "Cinematic"],
    stat: { value: "3×", label: "avg. conversion lift" },
  },
  {
    id: "02", label: "GROWTH",
    title: "SEO Growth\nInfrastructure",
    heading: "Organic visibility engineered for long-term acquisition.",
    description: "We build scalable SEO ecosystems combining technical foundations, strategic content architecture, and search-intent systems that compound over time.",
    points: ["Technical SEO systems", "Content architecture", "Intent-driven acquisition", "Long-term search equity"],
    tags: ["SEO", "Growth", "Visibility"],
    stat: { value: "12×", label: "organic traffic growth" },
  },
  {
    id: "03", label: "SYSTEMS",
    title: "AI &\nAutomation",
    heading: "Modern businesses scale through intelligent systems, not operational chaos.",
    description: "We implement AI-powered workflows and operational automations that reduce friction, improve efficiency, and create scalable execution systems.",
    points: ["AI workflow automation", "Operational efficiency", "Intelligent integrations", "Scalable infrastructure"],
    tags: ["Automation", "AI Systems", "Operations"],
    stat: { value: "60%", label: "ops cost reduction" },
  },
];

const N = SERVICES.length;

// ─── Framer Motion Variants ───────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden:  { y: 24, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  },
});

// ─── Card ─────────────────────────────────────────────────────
function Card({ svc, compact = false }) {
  const pad = compact ? "20px 20px 24px" : "clamp(28px,3vw,44px)";

  return (
    <div style={{
      background:   C.card,
      border:       `1px solid ${C.border}`,
      borderRadius: compact ? 20 : 28,
      overflow:     "hidden",
      width:        "100%",
      boxShadow:
        "0 2px 4px rgba(0,0,0,0.02)," +
        "0 16px 48px rgba(15,14,13,0.06)," +
        "0 4px 12px rgba(124,58,237,0.04)",
    }}>

      {/* gradient top stripe */}
      <div style={{ height: 3, background: GRAD }} />

      <div style={{ padding: pad }}>

        {/* ── Header row ── */}
        <div style={{
          display:         "flex",
          alignItems:      "flex-start",
          justifyContent:  "space-between",
          gap:             12,
          paddingBottom:   compact ? 14 : 20,
          borderBottom:    `1px solid ${C.border}`,
          marginBottom:    compact ? 16 : 24,
        }}>
          <div>
            <p style={{
              fontFamily:    "monospace",
              fontSize:      8,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color:         C.accent1,
              marginBottom:  6,
              fontWeight:    700,
            }}>
              {svc.label}
            </p>
            <h3 style={{
              fontFamily:    "'Fraunces', Georgia, serif",
              fontSize:      compact
                               ? "clamp(1.5rem,6vw,1.9rem)"
                               : "clamp(2rem,2.6vw,2.8rem)",
              fontWeight:    700,
              lineHeight:    1.05,
              letterSpacing: "-0.025em",
              color:         C.ink,
              whiteSpace:    "pre-line",
              margin:        0,
            }}>
              {svc.title}
            </h3>
          </div>

          <span style={{
            fontFamily:    "monospace",
            fontSize:      9,
            letterSpacing: "0.1em",
            padding:       "5px 11px",
            borderRadius:  100,
            flexShrink:    0,
            background:    C.numBg,
            color:         C.accent1,
            border:        `1px solid rgba(124,58,237,0.18)`,
            fontWeight:    700,
          }}>
            {svc.id}
          </span>
        </div>

        {/* ── Highlight heading ── */}
        <p style={{
          fontFamily:    "'Outfit', sans-serif",
          fontSize:      compact
                           ? "clamp(13px,3.5vw,14.5px)"
                           : "clamp(15px,1.15vw,17.5px)",
          fontWeight:    600,
          lineHeight:    1.4,
          letterSpacing: "-0.01em",
          color:         C.ink,
          marginBottom:  compact ? 14 : 22,
        }}>
          {svc.heading}
        </p>

        {/* ── Description + bullets ── */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: compact ? "1fr" : "1.1fr 0.9fr",
          gap:                 compact ? 12 : 28,
          marginBottom:        compact ? 16 : 24,
        }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize:   compact ? 12.5 : 13.5,
            lineHeight: 1.65,
            color:      C.body,
            margin:     0,
          }}>
            {svc.description}
          </p>

          <ul style={{
            listStyle:     "none",
            padding:       0,
            margin:        0,
            display:       "flex",
            flexDirection: "column",
            gap:           compact ? 7 : 11,
          }}>
            {svc.points.slice(0, compact ? 3 : 4).map(pt => (
              <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                <span style={{
                  width:       5,
                  height:      5,
                  borderRadius:"50%",
                  flexShrink:  0,
                  marginTop:   compact ? 5 : 7,
                  background:  GRAD,
                }} />
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize:   compact ? 12 : 13,
                  lineHeight: 1.35,
                  color:      C.ink,
                  fontWeight: 500,
                }}>
                  {pt}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Stat pill ── */}
        <div style={{
          display:      "inline-flex",
          alignItems:   "center",
          gap:          12,
          background:   "rgba(124,58,237,0.04)",
          border:       `1px solid rgba(124,58,237,0.1)`,
          borderRadius: 12,
          padding:      compact ? "8px 14px" : "10px 18px",
          marginBottom: compact ? 14 : 22,
        }}>
          <span style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize:   compact
                          ? "clamp(1rem,4vw,1.2rem)"
                          : "clamp(1.2rem,1.8vw,1.5rem)",
            fontWeight: 700,
            ...GRAD_TEXT,
          }}>
            {svc.stat.value}
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize:   compact ? 11 : 12,
            color:      C.body,
            fontWeight: 500,
          }}>
            {svc.stat.label}
          </span>
        </div>

        {/* ── Tags ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {svc.tags.map(tag => (
            <span key={tag} style={{
              padding:       "5px 12px",
              borderRadius:  100,
              background:    C.tagBg,
              color:         C.tagText,
              fontFamily:    "'Outfit', sans-serif",
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── Left Panel (Desktop) ─────────────────────────────────────
function LeftPanel({ bars }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "space-between",
      height:         "100%",
    }}>

      {/* top: headline */}
      <div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp(0)}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}
        >
          <span style={{ display:"block", width:22, height:2, background:GRAD, flexShrink:0 }} />
          <span style={{
            fontFamily:    "monospace",
            fontSize:      9,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color:         C.accent1,
            fontWeight:    700,
          }}>
            Our Capabilities
          </span>
        </motion.div>

        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp(0.06)}
          style={{
            fontFamily:    "'Fraunces', Georgia, serif",
            fontSize:      "clamp(2.6rem,4vw,4.4rem)",
            fontWeight:    700,
            lineHeight:    0.96,
            letterSpacing: "-0.03em",
            color:         C.ink,
            marginBottom:  "clamp(20px,2vw,32px)",
          }}
        >
          Engineering<br />
          <em style={{ fontStyle:"italic", fontWeight:400, ...GRAD_TEXT }}>Digital</em><br />
          Authority
        </motion.h2>

        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp(0.12)}
          style={{
            fontFamily:   "'Outfit', sans-serif",
            fontSize:     "clamp(13px,1vw,15px)",
            lineHeight:   1.75,
            color:        C.body,
            maxWidth:     420,
            marginBottom: "clamp(24px,2.5vw,40px)",
          }}
        >
          Most scale-stage companies don't suffer from a visibility deficiency.
          They struggle with conversion pipelines caused by digital positioning
          architecture. We engineer undisputed industry systems.
        </motion.p>
      </div>

      {/* middle: services index with progress bars */}
      <div>
        <p style={{
          fontFamily:    "monospace",
          fontSize:      8,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color:         C.muted,
          marginBottom:  14,
          fontWeight:    600,
        }}>
          Services Index
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {SERVICES.map((svc, i) => (
            <div key={svc.id} style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div className="prog-track">
                <div className="prog-fill" ref={el => (bars.current[i] = el)} />
              </div>
              <div>
                <p style={{
                  fontFamily:    "monospace",
                  fontSize:      9,
                  letterSpacing: "0.2em",
                  color:         C.muted,
                  fontWeight:    700,
                  margin:        0,
                }}>
                  {svc.id}
                </p>
                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize:   11,
                  color:      C.body,
                  fontWeight: 500,
                  margin:     0,
                }}>
                  {svc.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom: trust pill */}
      <div style={{
        display:     "inline-flex",
        alignItems:  "center",
        gap:         10,
        background:  C.card,
        border:      `1px solid ${C.border}`,
        borderRadius:14,
        padding:     "12px 20px",
        boxShadow:   "0 2px 12px rgba(0,0,0,0.04)",
        alignSelf:   "flex-start",
      }}>
        <div style={{
          width:        8,
          height:       8,
          borderRadius: "50%",
          background:   GRAD,
          flexShrink:   0,
          boxShadow:    `0 0 8px ${C.accent1}66`,
        }} />
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize:   12,
          color:      C.body,
          fontWeight: 500,
        }}>
          Trusted by{" "}
          <strong style={{ color: C.ink }}>40+ scale-stage</strong> companies
        </span>
      </div>

    </div>
  );
}

// ─── Glow Blobs ───────────────────────────────────────────────
function Glows() {
  return (
    <>
      <div style={{
        position:     "absolute",
        top:          -100, left: -100,
        width:        600,  height: 600,
        background:   `radial-gradient(circle, ${C.accent1}0A 0%, transparent 70%)`,
        filter:       "blur(100px)",
        pointerEvents:"none",
        zIndex:       0,
      }} />
      <div style={{
        position:     "absolute",
        bottom:       -80, right: -80,
        width:        500, height: 500,
        background:   `radial-gradient(circle, ${C.accent2}09 0%, transparent 70%)`,
        filter:       "blur(100px)",
        pointerEvents:"none",
        zIndex:       0,
      }} />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ServicesSection() {

  // ── Refs ──────────────────────────────────────────────────
  const deskWrapRef = useRef(null);   // tall wrapper  (desktop)
  const sectionRef  = useRef(null);   // pinned section (desktop)
  const mobWrapRef  = useRef(null);   // tall wrapper  (mobile)
  const mobileRef   = useRef(null);   // pinned section (mobile)

  const deskCards = useRef([]);
  const deskBars  = useRef([]);
  const mobCards  = useRef([]);
  const mobDots   = useRef([]);

  // ── GSAP ──────────────────────────────────────────────────
  useEffect(() => {
    const mm = gsap.matchMedia();

    // ══ MOBILE  (< 768px) ════════════════════════════════════
    mm.add("(max-width: 767px)", () => {
      const cards = mobCards.current.filter(Boolean);
      const dots  = mobDots.current.filter(Boolean);
      if (!cards.length) return;

      // Hard-set initial states (cards already have CSS visibility:hidden
      // via inline style for non-first; GSAP takes over from here)
      gsap.set(cards,    { autoAlpha: 0, y: 50,  scale: 0.95 });
      gsap.set(cards[0], { autoAlpha: 1, y: 0,   scale: 1    });

      // Dots
      gsap.set(dots,    { backgroundColor: C.muted   });
      gsap.set(dots[0], { backgroundColor: C.accent1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:      mobWrapRef.current,
          start:        "top top",
          end:          "bottom bottom",
          scrub:        1.2,
          pin:          mobileRef.current,
          pinSpacing:   false,
          anticipatePin:1,
        },
      });

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const lbl = `m${i}`;
        tl.add(lbl);
        // outgoing card
        tl.to(card, { autoAlpha: 0, y: -55, scale: 0.93, ease: "power2.inOut" }, lbl);
        // incoming card
        tl.to(next, { autoAlpha: 1, y: 0,   scale: 1,    ease: "power2.inOut" }, lbl);
        // dots
        if (dots[i])   tl.to(dots[i],   { backgroundColor: C.muted,   ease: "power2.inOut" }, lbl);
        if (dots[i+1]) tl.to(dots[i+1], { backgroundColor: C.accent1, ease: "power2.inOut" }, lbl);
      });

      return () => ScrollTrigger.getAll().forEach(st => st.kill());
    });

    // ══ DESKTOP (≥ 768px) ════════════════════════════════════
    mm.add("(min-width: 768px)", () => {
      const cards = deskCards.current.filter(Boolean);
      const bars  = deskBars.current.filter(Boolean);
      if (!cards.length) return;

      // Initial states
      gsap.set(cards,    { autoAlpha: 0, y: 60,  scale: 0.95 });
      gsap.set(cards[0], { autoAlpha: 1, y: 0,   scale: 1    });
      gsap.set(bars,     { scaleY: 0, transformOrigin: "top center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:      deskWrapRef.current,
          start:        "top top",
          end:          "bottom bottom",
          scrub:        1.2,
          pin:          sectionRef.current,
          pinSpacing:   false,
          anticipatePin:1,
        },
      });

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        const bar  = bars[i];
        const lbl  = `d${i}`;

        tl.add(lbl);
        if (bar) tl.to(bar, { scaleY: 1, ease: "power1.inOut" }, lbl);

        if (next) {
          tl.to(card, {
            autoAlpha: 0, y: -80, scale: 0.93,
            ease: "power2.inOut",
          }, lbl);
          tl.to(next, {
            autoAlpha: 1, y: 0,   scale: 1,
            ease: "power2.inOut",
          }, lbl);
        }
      });

      return () => ScrollTrigger.getAll().forEach(st => st.kill());
    });

    return () => mm.revert();
  }, []);

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={{ overflowX: "hidden", position: "relative", background: C.bg }}>

      {/* ── Global styles ─────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        #svc-mobile *,
        #svc-desktop * {
          box-sizing: border-box;
        }

        #svc-mobile  p,  #svc-mobile  h2, #svc-mobile  h3,
        #svc-mobile  ul, #svc-mobile  li,
        #svc-desktop p,  #svc-desktop h2, #svc-desktop h3,
        #svc-desktop ul, #svc-desktop li {
          margin: 0;
          padding: 0;
        }

        /* Subtle dot-grid texture overlay */
        .svc-texture::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: radial-gradient(rgba(15,14,13,0.03) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
        }

        /* Progress bar track + fill */
        .prog-track {
          position:   relative;
          width:      3px;
          height:     52px;
          background: ${C.progBg};
          border-radius: 4px;
          overflow:   hidden;
          flex-shrink:0;
        }
        .prog-fill {
          position:        absolute;
          inset:           0;
          background:      ${GRAD};
          border-radius:   4px;
          transform:       scaleY(0);
          transform-origin:top center;
        }

        /* Responsive show/hide */
        .svc-mobile-only  { display: block !important; }
        .svc-desktop-only { display: none  !important; }

        @media (min-width: 768px) {
          .svc-mobile-only  { display: none  !important; }
          .svc-desktop-only { display: flex  !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════
          MOBILE  ENGINE  (< 768 px)
          ──────────────────────────────────────────────────
          mobWrapRef   = tall scroll container (N × 100 vh)
          mobileRef    = pinned viewport section (100 vh)
      ════════════════════════════════════════════════════ */}
      <div
        ref={mobWrapRef}
        className="svc-mobile-only"
        style={{ height: `${N * 100}vh` }}
      >
        <section
          id="svc-mobile"
          ref={mobileRef}
          className="svc-texture"
          style={{
            position:      "relative",
            height:        "100vh",
            width:         "100%",
            overflow:      "hidden",
            display:       "flex",
            flexDirection: "column",
            background:    C.bg,
          }}
        >
          <Glows />

          {/* ── Header strip ── */}
          <div style={{
            position:   "relative",
            zIndex:     1,
            flexShrink: 0,
            padding:    "clamp(20px,5vw,32px) clamp(18px,5vw,28px) clamp(10px,2vw,16px)",
          }}>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0)}
              style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}
            >
              <span style={{ display:"block", width:16, height:2, background:GRAD, flexShrink:0 }} />
              <span style={{
                fontFamily:    "monospace",
                fontSize:      8,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color:         C.accent1,
                fontWeight:    700,
              }}>
                Our Services
              </span>
            </motion.div>

            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0.05)}
              style={{
                fontFamily:    "'Fraunces', Georgia, serif",
                fontSize:      "clamp(1.7rem,7.5vw,2.4rem)",
                fontWeight:    700,
                lineHeight:    1.0,
                letterSpacing: "-0.025em",
                color:         C.ink,
                marginBottom:  8,
              }}
            >
              Engineering{" "}
              <em style={{ fontStyle:"italic", fontWeight:400, ...GRAD_TEXT }}>Digital</em>{" "}
              Authority
            </motion.h2>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0.1)}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize:   "clamp(12px,3.5vw,13.5px)",
                lineHeight: 1.55,
                color:      C.body,
                margin:     0,
              }}
            >
              Most scale-stage companies don't suffer from a visibility deficiency. They struggle with conversion pipelines caused by digital positioning architecture. We engineer undisputed industry systems.
            </motion.p>
          </div>

          {/* ── Card zone ──────────────────────────────────
              All cards share the same layout space.
              Card 0: position relative  (defines container height)
              Card 1+: position absolute (stacked on top, hidden by GSAP)
          ─────────────────────────────────────────────── */}
          <div style={{
            position: "relative",
            zIndex:   1,
            flex:     1,
            minHeight:0,
            display:  "flex",
            alignItems:"center",
          }}>
            <div style={{
              position: "relative",
              width:    "calc(100% - clamp(36px,10vw,56px))",
              margin:   "0 auto",
            }}>

              {/* Reference card (visible, relative-positioned) */}
              <div
                ref={el => (mobCards.current[0] = el)}
                style={{ position: "relative" }}
              >
                <Card svc={SERVICES[0]} compact />
              </div>

              {/* Remaining cards (hidden, absolute-positioned) */}
              {SERVICES.slice(1).map((svc, j) => {
                const i = j + 1;
                return (
                  <div
                    key={svc.id}
                    ref={el => (mobCards.current[i] = el)}
                    style={{
                      position:   "absolute",
                      top:        0,
                      left:       0,
                      right:      0,
                      opacity:    0,
                      visibility: "hidden",
                    }}
                  >
                    <Card svc={svc} compact />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Pagination dots + scroll hint ── */}
          <div style={{
            position:  "relative",
            zIndex:    1,
            flexShrink:0,
            padding:   "8px 0 clamp(12px,3vw,20px)",
            textAlign: "center",
          }}>
            <div style={{ display:"flex", gap:7, justifyContent:"center", marginBottom:10 }}>
              {SERVICES.map((_, i) => (
                <div
                  key={i}
                  ref={el => (mobDots.current[i] = el)}
                  style={{
                    height:          6,
                    width:           6,
                    borderRadius:    3,
                    backgroundColor: i === 0 ? C.accent1 : C.muted,
                    transition:      "width 0.3s ease",
                  }}
                />
              ))}
            </div>
            <p style={{
              fontFamily:    "monospace",
              fontSize:      8,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         C.muted,
              margin:        0,
            }}>
              Scroll to unfold ↓
            </p>
          </div>

        </section>
      </div>

      {/* ════════════════════════════════════════════════════
          DESKTOP  ENGINE  (≥ 768 px)
          ──────────────────────────────────────────────────
          deskWrapRef = tall scroll container (N × 110 vh)
          sectionRef  = pinned viewport section (100 vh)
      ════════════════════════════════════════════════════ */}
      <div
        ref={deskWrapRef}
        className="svc-desktop-only"
        style={{ height: `${N * 110}vh`, flexDirection: "column" }}
      >
        <section
          id="svc-desktop"
          ref={sectionRef}
          className="svc-texture"
          style={{
            position:  "relative",
            height:    "100vh",
            width:     "100%",
            overflow:  "hidden",
            display:   "flex",
            alignItems:"stretch",
            background:C.bg,
          }}
        >
          <Glows />

          {/* ── 2-column content grid ── */}
          <div style={{
            position:            "relative",
            zIndex:              1,
            width:               "100%",
            maxWidth:            1340,
            margin:              "0 auto",
            padding:             "clamp(48px,6vh,72px) clamp(32px,4vw,56px)",
            display:             "grid",
            gridTemplateColumns: "1fr 1.08fr",
            gap:                 "clamp(48px,5vw,100px)",
            alignItems:          "stretch",
          }}>

            {/* Left panel */}
            <LeftPanel bars={deskBars} />

            {/* ── Right: card stack ──────────────────────────
                Card 0: position relative  (sizes the column)
                Card 1+: position absolute (layered on top)
            ──────────────────────────────────────────────── */}
            <div style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              overflow:       "hidden",
            }}>
              <div style={{
                position: "relative",
                width:    "100%",
                maxWidth: 580,
              }}>

                {/* Reference card */}
                <div
                  ref={el => (deskCards.current[0] = el)}
                  style={{ position: "relative" }}
                >
                  <Card svc={SERVICES[0]} />
                </div>

                {/* Hidden stacked cards */}
                {SERVICES.slice(1).map((svc, j) => {
                  const i = j + 1;
                  return (
                    <div
                      key={svc.id}
                      ref={el => (deskCards.current[i] = el)}
                      style={{
                        position:   "absolute",
                        top:        0,
                        left:       0,
                        right:      0,
                        opacity:    0,
                        visibility: "hidden",
                      }}
                    >
                      <Card svc={svc} />
                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* bottom gradient separator */}
          <div style={{
            position:  "absolute",
            bottom:    0,
            left:      0,
            right:     0,
            height:    1,
            background:GRAD,
            opacity:   0.15,
            zIndex:    2,
          }} />

        </section>
      </div>

    </div>
  );
}
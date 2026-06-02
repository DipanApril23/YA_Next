"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ─── Design Tokens ───────────────────────────────────────────
const C = {
  bg:        "#F8F7F4",
  card:      "#FFFFFF",
  border:    "rgba(0,0,0,0.07)",
  ink:       "#0F0E0D",
  body:      "#5C5856",
  muted:     "#A09C98",
  accent1:   "#7C3AED",
  accent2:   "#EC4899",
  tagBg:     "#EDEBF0",
  tagText:   "#6B5F7A",
  progBg:    "rgba(124,58,237,0.1)",
  numBg:     "rgba(124,58,237,0.05)",
};

const GRAD = `linear-gradient(135deg, ${C.accent1} 0%, ${C.accent2} 100%)`;

const GRAD_TEXT = {
  backgroundImage: GRAD,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ─── Services Data ────────────────────────────────────────────
const SERVICES = [
  {
    id: "01",
    label: "POSITIONING",
    title: "Authority\nWebsites",
    heading: "Designed to make your company feel established before the first conversation.",
    description: "We create premium digital experiences engineered to increase perceived value, strengthen trust, and position brands like category leaders.",
    points: ["Luxury-level UI systems", "Cinematic interactions & motion", "Conversion-focused architecture", "Premium visual positioning"],
    tags: ["Premium UX", "Authority", "Cinematic"],
    stat: { value: "3×", label: "avg. conversion lift" },
  },
  {
    id: "02",
    label: "GROWTH",
    title: "SEO Growth\nInfrastructure",
    heading: "Organic visibility engineered for long-term acquisition.",
    description: "We build scalable SEO ecosystems combining technical foundations, strategic content architecture, and search-intent systems that compound over time.",
    points: ["Technical SEO systems", "Content architecture", "Intent-driven acquisition", "Long-term search equity"],
    tags: ["SEO", "Growth", "Visibility"],
    stat: { value: "12×", label: "organic traffic growth" },
  },
  {
    id: "03",
    label: "SYSTEMS",
    title: "AI &\nAutomation",
    heading: "Modern businesses scale through intelligent systems, not operational chaos.",
    description: "We implement AI-powered workflows and operational automations that reduce friction, improve efficiency, and create scalable execution systems.",
    points: ["AI workflow automation", "Operational efficiency", "Intelligent integrations", "Scalable infrastructure"],
    tags: ["Automation", "AI Systems", "Operations"],
    stat: { value: "60%", label: "ops cost reduction" },
  },
];

// ─── Animation Variants ───────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden:  { y: 24, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  },
});

// ─── Service Card ─────────────────────────────────────────────
function Card({ svc, compact = false }) {
  const pad = compact ? "20px 20px 22px" : "clamp(28px, 3vw, 44px)";

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: compact ? 20 : 28,
      overflow: "hidden",
      width: "100%",
      boxShadow:
        "0 2px 4px rgba(0,0,0,0.02), 0 16px 48px rgba(15,14,13,0.06), 0 4px 12px rgba(124,58,237,0.04)",
    }}>

      {/* Top gradient stripe */}
      <div style={{ height: 3, background: GRAD }} />

      <div style={{ padding: pad }}>

        {/* ── Header Row ── */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: 12,
          paddingBottom: compact ? 14 : 20,
          borderBottom: `1px solid ${C.border}`,
          marginBottom: compact ? 16 : 24,
        }}>
          <div>
            <p style={{
              fontFamily: "monospace", fontSize: 8, letterSpacing: "0.32em",
              textTransform: "uppercase", color: C.accent1,
              marginBottom: 6, fontWeight: 700,
            }}>
              {svc.label}
            </p>
            <h3 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: compact
                ? "clamp(1.5rem, 6vw, 1.9rem)"
                : "clamp(2rem, 2.6vw, 2.8rem)",
              fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em",
              color: C.ink, whiteSpace: "pre-line", margin: 0,
            }}>
              {svc.title}
            </h3>
          </div>

          <span style={{
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em",
            padding: "5px 11px", borderRadius: 100, flexShrink: 0,
            background: C.numBg, color: C.accent1,
            border: `1px solid rgba(124,58,237,0.18)`, fontWeight: 700,
          }}>
            {svc.id}
          </span>
        </div>

        {/* ── Highlight Heading ── */}
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: compact
            ? "clamp(13px, 3.5vw, 14.5px)"
            : "clamp(15px, 1.15vw, 17.5px)",
          fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.01em",
          color: C.ink, marginBottom: compact ? 14 : 22,
        }}>
          {svc.heading}
        </p>

        {/* ── Description + Points ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr" : "1.1fr 0.9fr",
          gap: compact ? 12 : 28,
          marginBottom: compact ? 16 : 24,
        }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: compact ? 12.5 : 13.5,
            lineHeight: 1.65, color: C.body, margin: 0,
          }}>
            {svc.description}
          </p>

          <ul style={{
            listStyle: "none", padding: 0, margin: 0,
            display: "flex", flexDirection: "column",
            gap: compact ? 7 : 11,
          }}>
            {svc.points.slice(0, compact ? 3 : 4).map(pt => (
              <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                  marginTop: compact ? 5 : 7, background: GRAD,
                }} />
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: compact ? 12 : 13,
                  lineHeight: 1.35, color: C.ink, fontWeight: 500,
                }}>
                  {pt}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Stat Highlight ── */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "rgba(124,58,237,0.04)",
          border: `1px solid rgba(124,58,237,0.1)`,
          borderRadius: 12,
          padding: compact ? "8px 14px" : "10px 18px",
          marginBottom: compact ? 14 : 22,
        }}>
          <span style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: compact
              ? "clamp(1rem, 4vw, 1.2rem)"
              : "clamp(1.2rem, 1.8vw, 1.5rem)",
            fontWeight: 700, ...GRAD_TEXT,
          }}>
            {svc.stat.value}
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: compact ? 11 : 12,
            color: C.body, fontWeight: 500,
          }}>
            {svc.stat.label}
          </span>
        </div>

        {/* ── Tags ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {svc.tags.map(tag => (
            <span key={tag} style={{
              padding: "5px 12px", borderRadius: 100,
              background: C.tagBg, color: C.tagText,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.04em",
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

// ─── Left Panel (Desktop Only) ────────────────────────────────
function LeftPanel({ bars }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      justifyContent: "space-between", height: "100%",
    }}>

      {/* Top: headline */}
      <div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp(0)}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}
        >
          <span style={{ display: "block", width: 22, height: 2, background: GRAD, flexShrink: 0 }} />
          <span style={{
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.38em",
            textTransform: "uppercase", color: C.accent1, fontWeight: 700,
          }}>
            Our Capabilities
          </span>
        </motion.div>

        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp(0.06)}
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(2.6rem, 4vw, 4.4rem)",
            fontWeight: 700, lineHeight: 0.96, letterSpacing: "-0.03em",
            color: C.ink, marginBottom: "clamp(20px, 2vw, 32px)",
          }}
        >
          Engineering<br />
          <em style={{ fontStyle: "italic", fontWeight: 400, ...GRAD_TEXT }}>Digital</em><br />
          Authority
        </motion.h2>

        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp(0.12)}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(13px, 1vw, 15px)",
            lineHeight: 1.75, color: C.body, maxWidth: 420,
            marginBottom: "clamp(24px, 2.5vw, 40px)",
          }}
        >
          Most scale-stage companies don't suffer from a visibility deficiency. They
          struggle with conversion pipelines caused by digital positioning architecture.
          We engineer undisputed industry systems.
        </motion.p>
      </div>

      {/* Middle: progress index */}
      <div>
        <p style={{
          fontFamily: "monospace", fontSize: 8, letterSpacing: "0.3em",
          textTransform: "uppercase", color: C.muted, marginBottom: 14, fontWeight: 600,
        }}>
          Services Index
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SERVICES.map((svc, i) => (
            <div key={svc.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="prog-track">
                <div className="prog-fill" ref={el => (bars.current[i] = el)} />
              </div>
              <div>
                <p style={{
                  fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em",
                  color: C.muted, fontWeight: 700, margin: 0,
                }}>
                  {svc.id}
                </p>
                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 11,
                  color: C.body, fontWeight: 500, margin: 0,
                }}>
                  {svc.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: trust pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "12px 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)", alignSelf: "flex-start",
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: GRAD, flexShrink: 0, boxShadow: `0 0 8px ${C.accent1}66`,
        }} />
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: C.body, fontWeight: 500 }}>
          Trusted by <strong style={{ color: C.ink }}>40+ scale-stage</strong> companies
        </span>
      </div>

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ServicesSection() {
  const sectionRef  = useRef(null);
  const deskWrapRef = useRef(null);
  const mobileRef   = useRef(null);
  const mobWrapRef  = useRef(null);

  const deskCards = useRef([]);
  const deskBars  = useRef([]);
  const mobCards  = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ── Mobile < 768px ──────────────────────────────────────────
    mm.add("(max-width: 767px)", () => {
      const cards = mobCards.current.filter(Boolean);
      if (!cards.length) return;

      gsap.set(cards,    { y: 40, autoAlpha: 0, scale: 0.96, filter: "blur(6px)", pointerEvents: "none" });
      gsap.set(cards[0], { y: 0,  autoAlpha: 1, scale: 1,    filter: "blur(0px)", pointerEvents: "auto" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mobWrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: mobileRef.current,
          anticipatePin: 1,
          pinSpacing: false,
        },
      });

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const lbl = `m${i}`;
        tl.add(lbl);
        tl.to(card, { y: -50, autoAlpha: 0, scale: 0.92, filter: "blur(6px)", pointerEvents: "none", ease: "power1.inOut" }, lbl);
        tl.to(next, { y: 0,   autoAlpha: 1, scale: 1,    filter: "blur(0px)", pointerEvents: "auto", ease: "power1.inOut" }, lbl);
      });
    });

    // ── Desktop ≥ 768px ─────────────────────────────────────────
    mm.add("(min-width: 768px)", () => {
      const cards = deskCards.current.filter(Boolean);
      const bars  = deskBars.current.filter(Boolean);
      if (!cards.length) return;

      gsap.set(cards,    { y: 60, autoAlpha: 0, scale: 0.96, filter: "blur(10px)", pointerEvents: "none" });
      gsap.set(cards[0], { y: 0,  autoAlpha: 1, scale: 1,    filter: "blur(0px)",  pointerEvents: "auto" });
      gsap.set(bars, { scaleY: 0, transformOrigin: "top center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: deskWrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: sectionRef.current,
          anticipatePin: 1,
          pinSpacing: false,
        },
      });

      cards.forEach((_, i) => {
        const next = cards[i + 1];
        const bar  = bars[i];
        const lbl  = `d${i}`;

        tl.add(lbl);
        if (bar) tl.to(bar, { scaleY: 1, ease: "none" }, lbl);

        if (next) {
          tl.to(cards[i], { y: -80, autoAlpha: 0, scale: 0.92, filter: "blur(8px)",  pointerEvents: "none", ease: "power2.inOut" }, lbl);
          tl.to(next,     { y: 0,   autoAlpha: 1, scale: 1,    filter: "blur(0px)",  pointerEvents: "auto", ease: "power2.inOut" }, lbl);
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div style={{ overflowX: "hidden", position: "relative", background: C.bg }}>

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        #svc-mobile *, #svc-desktop * { box-sizing: border-box; }

        #svc-mobile p,  #svc-desktop p,
        #svc-mobile h2, #svc-desktop h2,
        #svc-mobile h3, #svc-desktop h3,
        #svc-mobile ul, #svc-desktop ul,
        #svc-mobile li, #svc-desktop li { margin: 0; padding: 0; }

        .svc-texture::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(rgba(15,14,13,0.035) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
        }

        .prog-track {
          position: relative; width: 3px; height: 52px;
          background: ${C.progBg}; border-radius: 4px;
          overflow: hidden; flex-shrink: 0;
        }
        .prog-fill {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          background: ${GRAD}; border-radius: 4px;
          transform: scaleY(0); transform-origin: top center;
        }

        /* Responsive visibility */
        .svc-mobile-only  { display: block; }
        .svc-desktop-only { display: none;  }

        @media (min-width: 768px) {
          .svc-mobile-only  { display: none !important; }
          .svc-desktop-only { display: flex !important; }
        }
      `}</style>

      {/* ══ MOBILE ENGINE (<768px) ══════════════════════════════ */}
      <div
        ref={mobWrapRef}
        className="svc-mobile-only"
        style={{ height: `${SERVICES.length * 100}vh` }}
      >
        <section
          id="svc-mobile"
          ref={mobileRef}
          className="svc-texture"
          style={{
            position: "relative",
            height: "100vh", width: "100%", overflow: "hidden",
            display: "flex", flexDirection: "column",
            background: C.bg,
          }}
        >
          {/* Ambient glows */}
          <div style={{ position: "absolute", top: -80, left: -60, width: 320, height: 320, background: `radial-gradient(circle, ${C.accent1}0F 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: -60, right: -60, width: 280, height: 280, background: `radial-gradient(circle, ${C.accent2}0B 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

          {/* Header strip */}
          <div style={{
            position: "relative", zIndex: 1, flexShrink: 0,
            padding: "clamp(18px,4vw,28px) clamp(18px,5vw,28px) clamp(10px,2vw,16px)",
          }}>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0)}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
            >
              <span style={{ display: "block", width: 16, height: 2, background: GRAD, flexShrink: 0 }} />
              <span style={{
                fontFamily: "monospace", fontSize: 8, letterSpacing: "0.32em",
                textTransform: "uppercase", color: C.accent1, fontWeight: 700,
              }}>
                Our Services
              </span>
            </motion.div>

            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0.05)}
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "clamp(1.7rem, 7.5vw, 2.3rem)",
                fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.025em",
                color: C.ink, marginBottom: 8,
              }}
            >
              Engineering{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, ...GRAD_TEXT }}>Digital</em>{" "}
              Authority
            </motion.h2>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp(0.1)}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(12px, 3.5vw, 13.5px)",
                lineHeight: 1.5, color: C.body, margin: 0,
              }}
            >
              Most scale-stage companies don't suffer from a visibility deficiency.
              We engineer undisputed industry systems.
            </motion.p>
          </div>

          {/* Card zone — fills remaining height, cards centered */}
          <div style={{ position: "relative", zIndex: 1, flex: 1, minHeight: 0 }}>
            {SERVICES.map((svc, i) => (
              <div
                key={svc.id}
                ref={el => (mobCards.current[i] = el)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "clamp(18px,5vw,28px)",
                  right: "clamp(18px,5vw,28px)",
                  transform: "translateY(-50%)",
                  opacity:       i === 0 ? 1 : 0,
                  pointerEvents: i === 0 ? "auto" : "none",
                  visibility:    i === 0 ? "visible" : "hidden",
                }}
              >
                <Card svc={svc} compact />
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "relative", zIndex: 1, flexShrink: 0,
            paddingBottom: "clamp(10px, 2.5vw, 18px)", textAlign: "center",
          }}>
            <p style={{
              fontFamily: "monospace", fontSize: 8, letterSpacing: "0.28em",
              textTransform: "uppercase", color: C.muted, margin: 0,
            }}>
              Scroll to unfold ↓
            </p>
          </div>
        </section>
      </div>

      {/* ══ DESKTOP ENGINE (≥768px) ══════════════════════════════ */}
      <div
        ref={deskWrapRef}
        className="svc-desktop-only"
        style={{ height: `${SERVICES.length * 110}vh`, flexDirection: "column" }}
      >
        <section
          id="svc-desktop"
          ref={sectionRef}
          className="svc-texture"
          style={{
            position: "relative",
            height: "100vh", width: "100%", overflow: "hidden",
            display: "flex", alignItems: "stretch",
            background: C.bg,
          }}
        >
          {/* Ambient glows */}
          <div style={{ position: "absolute", top: -100, left: -100, width: 600, height: 600, background: `radial-gradient(circle, ${C.accent1}08 0%, transparent 70%)`, filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: -80, right: -80, width: 500, height: 500, background: `radial-gradient(circle, ${C.accent2}07 0%, transparent 70%)`, filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

          {/* Content grid */}
          <div style={{
            position: "relative", zIndex: 1,
            width: "100%", maxWidth: 1340, margin: "0 auto",
            padding: "clamp(48px,6vh,72px) clamp(32px,4vw,56px)",
            display: "grid",
            gridTemplateColumns: "1fr 1.08fr",
            gap: "clamp(48px,5vw,100px)",
            alignItems: "stretch",
          }}>
            <LeftPanel bars={deskBars} />

            {/* Right: card stack */}
            <div style={{
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.id}
                  ref={el => (deskCards.current[i] = el)}
                  style={{
                    position: "absolute",
                    width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity:       i === 0 ? 1 : 0,
                    pointerEvents: i === 0 ? "auto" : "none",
                    visibility:    i === 0 ? "visible" : "hidden",
                  }}
                >
                  <div style={{ width: "100%", maxWidth: 580 }}>
                    <Card svc={svc} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom separator line */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 1, background: GRAD, opacity: 0.15, zIndex: 2,
          }} />
        </section>
      </div>

    </div>
  );
}

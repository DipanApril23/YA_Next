"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Design Tokens ───────────────────────────────────────────
const C = {
  bg: "#F8F7F4",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.07)",
  ink: "#0F0E0D",
  body: "#5C5856",
  muted: "#A09C98",
  accent1: "#7C3AED",
  accent2: "#EC4899",
  tagBg: "#EDEBF0",
  tagText: "#6B5F7A",
  progBg: "rgba(124,58,237,0.1)",
  numBg: "rgba(124,58,237,0.05)",
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

// ─── Shared Card Component ───────────────────────────────────
function Card({ svc }) {
  return (
    <div className="svc-card-container">
      <div className="svc-card-stripe" />
      <div className="svc-card-body">
        
        {/* Header Row */}
        <div className="svc-card-header">
          <div>
            <p className="svc-card-label">{svc.label}</p>
            <h3 className="svc-card-title">{svc.title}</h3>
          </div>
          <span className="svc-card-id">{svc.id}</span>
        </div>

        {/* Highlight Heading */}
        <p className="svc-card-heading">{svc.heading}</p>

        {/* Description + Points Grid */}
        <div className="svc-card-details">
          <p className="svc-card-desc">{svc.description}</p>
          <ul className="svc-card-points">
            {svc.points.map((pt) => (
              <li key={pt} className="svc-card-point-item">
                <span className="svc-card-bullet" />
                <span className="svc-card-point-text">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stat Box */}
        <div className="svc-card-stat-box">
          <span className="svc-card-stat-val">{svc.stat.value}</span>
          <span className="svc-card-stat-lbl">{svc.stat.label}</span>
        </div>

        {/* Tags wrapper */}
        <div className="svc-card-tags">
          {svc.tags.map((tag) => (
            <span key={tag} className="svc-card-tag">
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ServicesSection() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);
  const barsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    const bars = barsRef.current.filter(Boolean);
    if (!cards.length) return;

    // Set initial structural stack behaviors
    gsap.set(cards, { y: 60, autoAlpha: 0, scale: 0.96, filter: "blur(8px)", pointerEvents: "none" });
    gsap.set(cards[0], { y: 0, autoAlpha: 1, scale: 1, filter: "blur(0px)", pointerEvents: "auto" });
    gsap.set(bars, { scaleY: 0, transformOrigin: "top center" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: pinRef.current,
        anticipatePin: 1,
      },
    });

    cards.forEach((_, i) => {
      const next = cards[i + 1];
      const bar = bars[i];
      const lbl = `step_${i}`;

      tl.add(lbl);
      if (bar) tl.to(bar, { scaleY: 1, ease: "none" }, lbl);

      if (next) {
        tl.to(cards[i], { y: -60, autoAlpha: 0, scale: 0.94, filter: "blur(8px)", pointerEvents: "none", ease: "power2.inOut" }, lbl);
        tl.to(next, { y: 0, autoAlpha: 1, scale: 1, filter: "blur(0px)", pointerEvents: "auto", ease: "power2.inOut" }, lbl);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", background: C.bg, width: "100%", height: `${SERVICES.length * 120}vh` }}>
      
      {/* ── Injection of Clean CSS Framework Tokens ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        .svc-section * { box-sizing: border-box; margin: 0; padding: 0; }

        .svc-section {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          background: ${C.bg};
        }

        .svc-texture::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(rgba(15,14,13,0.035) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
        }

        .svc-layout-grid {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1340px;
          margin: 0 auto;
          padding: clamp(20px, 4vh, 60px) clamp(16px, 4vw, 56px);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(24px, 4vh, 80px);
          align-items: center;
        }

        @media (min-width: 768px) {
          .svc-layout-grid {
            grid-template-columns: 1fr 1.05fr;
            height: 100%;
          }
        }

        /* Left Side Panels Layout */
        .svc-left-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: auto;
          gap: clamp(20px, 3vh, 40px);
        }

        @media (min-width: 768px) {
          .svc-left-panel {
            justify-content: space-between;
            height: 100%;
          }
        }

        .svc-meta-tag {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .svc-meta-line {
          display: block; width: 22px; height: 2px; background: ${GRAD};
        }

        .svc-meta-txt {
          font-family: monospace; font-size: 9px; letter-spacing: 0.38em;
          text-transform: uppercase; color: ${C.accent1}; font-weight: 700;
        }

        .svc-main-headline {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(1.8rem, 4.5vw, 4.2rem);
          font-weight: 700; lineHeight: 1.02; letter-spacing: -0.025em;
          color: ${C.ink}; margin-bottom: 12px;
        }

        .svc-main-desc {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(13px, 1.4vw, 15px);
          line-height: 1.65; color: ${C.body}; max-width: 460px;
        }

        /* Progress Index Elements */
        .svc-index-container {
          display: none;
        }

        @media (min-width: 768px) {
          .svc-index-container {
            display: flex; flex-direction: column; gap: 12px;
          }
        }

        .svc-index-hdr {
          font-family: monospace; font-size: 8px; letter-spacing: 0.3em;
          text-transform: uppercase; color: ${C.muted}; margin-bottom: 4px; font-weight: 600;
        }

        .svc-track-row {
          display: flex;举align-items: center; gap: 14px;
        }

        .svc-prog-track {
          position: relative; width: 3px; height: 44px;
          background: ${C.progBg}; border-radius: 4px; overflow: hidden;
        }

        .svc-prog-fill {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: ${GRAD}; border-radius: 4px;
        }

        .svc-trust-pill {
          display: inline-flex; align-items: center; gap: 10px;
          background: ${C.card}; border: 1px solid ${C.border};
          border-radius: 14px; padding: 10px 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04); align-self: flex-start;
        }

        /* Right Stack Area Layout Fixes */
        .svc-right-stack {
          position: relative;
          width: 100%;
          height: clamp(380px, 55vh, 600px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .svc-right-stack {
            height: 100%;
          }
        }

        /* Global Structural Card Definitions for All Screens */
        .svc-card-container {
          background: ${C.card};
          border: 1px solid ${C.border};
          border-radius: clamp(16px, 2.5vw, 24px);
          overflow: hidden;
          width: 100%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02), 0 16px 48px rgba(15,14,13,0.06), 0 4px 12px rgba(124,58,237,0.04);
        }

        .svc-card-stripe {
          height: 3px; background: ${GRAD};
        }

        .svc-card-body {
          padding: clamp(16px, 3.5vw, 36px);
        }

        .svc-card-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; padding-bottom: clamp(10px, 2vw, 16px);
          border-bottom: 1px solid ${C.border}; margin-bottom: clamp(12px, 2vw, 20px);
        }

        .svc-card-label {
          font-family: monospace; font-size: 8px; letter-spacing: 0.32em;
          text-transform: uppercase; color: ${C.accent1}; margin-bottom: 4px; font-weight: 700;
        }

        .svc-card-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(1.3rem, 3.2vw, 2.4rem);
          font-weight: 700; line-height: 1.1; letter-spacing: -0.02em;
          color: ${C.ink}; white-space: pre-line;
        }

        .svc-card-id {
          font-family: monospace; font-size: 9px; letter-spacing: 0.1em;
          padding: 4px 10px; border-radius: 100%; background: ${C.numBg};
          color: ${C.accent1}; border: 1px solid rgba(124,58,237,0.15); font-weight: 700;
        }

        .svc-card-heading {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(13px, 1.4vw, 16px);
          font-weight: 600; line-height: 1.4; color: ${C.ink};
          margin-bottom: clamp(12px, 2vw, 20px);
        }

        .svc-card-details {
          display: grid; grid-template-columns: 1fr; gap: 12px;
          margin-bottom: clamp(14px, 2.2vw, 24px);
        }

        @media (min-width: 992px) {
          .svc-card-details {
            grid-template-columns: 1.1fr 0.9fr; gap: 24px;
          }
        }

        .svc-card-desc {
          font-family: 'Outfit', sans-serif; font-size: clamp(12px, 1.2vw, 13.5px);
          line-height: 1.6; color: ${C.body};
        }

        .svc-card-points {
          list-style: none; display: flex; flex-direction: column; gap: 8px;
        }

        .svc-card-point-item {
          display: flex; align-items: flex-start; gap: 8px;
        }

        .svc-card-bullet {
          width: 5px; height: 5px; border-radius: 50%; background: ${GRAD}; flex-shrink: 0; margin-top: 6px;
        }

        .svc-card-point-text {
          font-family: 'Outfit', sans-serif; font-size: clamp(11.5px, 1.1vw, 13px);
          line-height: 1.3; color: ${C.ink}; font-weight: 500;
        }

        .svc-card-stat-box {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(124,58,237,0.03); border: 1px solid rgba(124,58,237,0.08);
          border-radius: 10px; padding: 6px 14px; margin-bottom: clamp(14px, 2vw, 22px);
        }

        .svc-card-stat-val {
          font-family: 'Fraunces', Georgia, serif; font-size: clamp(1.1rem, 1.6vw, 1.4rem);
          font-weight: 700; background: ${GRAD}; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
        }

        .svc-card-stat-lbl {
          font-family: 'Outfit', sans-serif; font-size: clamp(11px, 1vw, 12px); color: ${C.body}; font-weight: 500;
        }

        .svc-card-tags {
          display: flex; flex-wrap: wrap; gap: 6px;
        }

        .svc-card-tag {
          padding: 4px 10px; border-radius: 100px; background: ${C.tagBg}; color: ${C.tagText};
          font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase;
        }

        .svc-scroll-hint {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          font-family: monospace; font-size: 8px; letter-spacing: 0.25em;
          text-transform: uppercase; color: ${C.muted}; z-index: 2;
        }
        @media (min-width: 768px) { .svc-scroll-hint { display: none; } }
      `}</style>

      {/* ── Fixed Target Viewport Container ── */}
      <section ref={pinRef} className="svc-section svc-texture">
        
        {/* Decorative Radial Background Layers */}
        <div style={{ position: "absolute", top: -100, left: -100, width: "clamp(300px, 40vw, 600px)", height: "clamp(300px, 40vw, 600px)", background: `radial-gradient(circle, ${C.accent1}0A 0%, transparent 70%)`, filter: "blur(8px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: "clamp(260px, 35vw, 500px)", height: "clamp(260px, 35vw, 500px)", background: `radial-gradient(circle, ${C.accent2}08 0%, transparent 70%)`, filter: "blur(8px)", pointerEvents: "none" }} />

        <div className="svc-layout-grid">
          
          {/* Left Block Content Info Column */}
          <div className="svc-left-panel">
            <div>
              <div className="svc-meta-tag">
                <span className="svc-meta-line" />
                <span className="svc-meta-txt">Our Capabilities</span>
              </div>
              <h2 className="svc-main-headline">
                Engineering<br />
                <em style={{ fontStyle: "italic", fontWeight: 400, ...GRAD_TEXT }}>Digital</em><br />
                Authority
              </h2>
              <p className="svc-main-desc">
                Most scale-stage companies don't suffer from a visibility deficiency. They
                struggle with conversion pipelines caused by digital positioning architecture.
                We engineer undisputed industry systems.
              </p>
            </div>

            {/* Desktop Left Stepper Metrics */}
            <div className="svc-index-container">
              <p className="svc-index-hdr">Services Index</p>
              {SERVICES.map((svc, i) => (
                <div key={svc.id} className="svc-track-row">
                  <div className="svc-prog-track">
                    <div className="svc-prog-fill" ref={(el) => (barsRef.current[i] = el)} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", color: C.muted, fontWeight: 700 }}>{svc.id}</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: C.body, fontWeight: 500 }}>{svc.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scale Proof Tag */}
            <div className="svc-trust-pill">
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: GRAD, boxShadow: `0 0 8px ${C.accent1}66` }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: C.body, fontWeight: 500 }}>
                Trusted by <strong style={{ color: C.ink }}>40+ scale-stage</strong> companies
              </span>
            </div>
          </div>

          {/* Right Card Transitions Controller Block */}
          <div className="svc-right-stack">
            {SERVICES.map((svc, i) => (
              <div
                key={svc.id}
                ref={(el) => (cardsRef.current[i] = el)}
                style={{
                  position: "absolute",
                  width: "100%",
                  maxWidth: "560px",
                  marginBottom: 40,
                }}
              >
                <Card svc={svc} />
              </div>
            ))}
          </div>

        </div>

        <div className="svc-scroll-hint">Scroll to unfold ↓</div>
      </section>

    </div>
  );
}
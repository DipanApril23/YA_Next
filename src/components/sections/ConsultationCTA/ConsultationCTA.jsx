"use client";

/* ============================================================
   SECTION 3A — MID-PAGE CTA · CONSULTATION BOOKING
   Young Architects · Light Theme · "Growth Blueprint" concept
   Stack: Next.js (app router) · Tailwind · Framer Motion · GSAP
   ------------------------------------------------------------
   npm i gsap framer-motion
   Drop in: components/ConsultationCTA.jsx
   Right panel = live GoHighLevel embed (YA Services Form).
   ============================================================ */

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/components/ui";
import {
  CONSULTATION_CTA_CONTENT as CONTENT,
  CONSULTATION_CTA_FORM as FORM,
} from "@/data";
import "./consultationCta.css";
// Rendered at the foot of this section (not a standalone page section).
import OurPartners from "../OurPartners/OurPartners";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Content & config live in the data layer (src/data/consultationCta.js) so the
   CMS/backend owns the copy; this file owns only structure, animation and the
   blueprint illustrations. The iframe src is built from the form config. */
const GHL_FORM_URL = `${FORM.widgetBaseUrl}/${FORM.id}`;

/* ================================ component =============================== */

export default function ConsultationCTA() {
  const sectionRef = useRef(null);
  const traceRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  /* ---------------- GSAP: blueprint drafting sequence on enter ------------ */
  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.set(".ya-sk, .ya-sk-tip, .ya-sk-label, .ya-grid", { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
      });

      // 1 · pen traces the blueprint frame
      const trace = traceRef.current;
      if (trace) {
        const len = trace.getTotalLength();
        gsap.set(trace, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        tl.to(trace, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0);
      }

      // 2 · corner ticks snap in
      tl.fromTo(
        ".ya-tick",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.06, ease: "back.out(2.5)" },
        0.55
      );

      // 3 · grid sheet develops
      tl.fromTo(".ya-grid", { opacity: 0 }, { opacity: 1, duration: 0.9 }, 0.4);

      // 4 · panel content assembles
      tl.fromTo(
        ".ya-panel-item",
        { y: 22, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, stagger: 0.09 },
        0.7
      );

      // 5 · growth sketch draws itself (bars → arrow → dimension line)
      gsap.utils.toArray(".ya-sk").forEach((p, i) => {
        const l = p.getTotalLength();
        gsap.set(p, { strokeDasharray: l, strokeDashoffset: l, opacity: 1 });
        tl.to(p, { strokeDashoffset: 0, duration: 0.65, ease: "power2.out" }, 1.05 + i * 0.14);
      });
      tl.fromTo(
        ".ya-sk-tip",
        { scale: 0, opacity: 0, transformOrigin: "center" },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)" },
        2.1
      );
      tl.fromTo(
        ".ya-sk-label",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, stagger: 0.08 },
        2.0
      );

      // 6 · form panel slides in (clearProps → no stacking-context bugs)
      tl.fromTo(
        ".ya-form-panel",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, clearProps: "transform,opacity" },
        0.85
      );

      // ambient float for the two blobs
      gsap.to(".ya-blob-a", { y: -26, x: 14, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".ya-blob-b", { y: 22, x: -16, duration: 8.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* ================================ render ================================ */

  return (
    <section
      ref={sectionRef}
      id="book-consultation"
      className="relative isolate overflow-hidden bg-[#F5F7FE] px-4 pt-8 pb-20 sm:px-6 md:pt-12 md:pb-28 lg:px-8"
    >
      {/* --- ambient background: node network + soft blobs (matches site) --- */}
      <BackgroundNetwork />
      <div className="ya-blob-a pointer-events-none absolute -left-32 top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-gradient-to-tr from-sky-300/40 via-indigo-300/30 to-transparent blur-3xl" />
      <div className="ya-blob-b pointer-events-none absolute -right-40 bottom-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tl from-pink-300/40 via-purple-300/30 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* ------------------------------ heading ----------------------------- */}
        <SectionHeader
          className="mx-auto max-w-3xl"
          theme="light"
          badge={CONTENT.badge}
          headingLead={CONTENT.headingLead}
          headingRest={CONTENT.headingHighlight}
          subheading={CONTENT.subheading}
        />

        {/* --------------------------- blueprint card -------------------------- */}
        <div className="relative mx-auto mt-12 max-w-6xl md:mt-16">
          {/* gradient halo behind card */}
          <div className="pointer-events-none absolute -inset-[2px] -z-10 rounded-[2rem] bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 opacity-60 blur-lg md:rounded-[2.5rem]" />

          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(80,60,180,0.35)] ring-1 ring-slate-900/5 md:rounded-[2.5rem] lg:grid-cols-[1.02fr_1.2fr]">
            {/* ======================= LEFT · BLUEPRINT PANEL ==================== */}
            <div className="relative overflow-hidden bg-[#101226] p-8 sm:p-10 lg:p-12">
              {/* blueprint grid sheet */}
              <div className="ya-grid pointer-events-none absolute inset-0 opacity-0" />
              {/* traced frame */}
              <svg
                className="pointer-events-none absolute inset-3 h-[calc(100%-24px)] w-[calc(100%-24px)]"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  ref={traceRef}
                  d="M4 1 H96 A3 3 0 0 1 99 4 V96 A3 3 0 0 1 96 99 H4 A3 3 0 0 1 1 96 V4 A3 3 0 0 1 4 1 Z"
                  stroke="url(#yaTraceGrad)"
                  strokeWidth="0.5"
                 
                  vectorEffect="non-scaling-stroke"
                />
                <defs>
                  <linearGradient id="yaTraceGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8" />
                    <stop offset="0.5" stopColor="#A855F7" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              {/* drafting corner ticks */}
              {[
                "left-5 top-5 border-l-2 border-t-2",
                "right-5 top-5 border-r-2 border-t-2",
                "bottom-5 left-5 border-b-2 border-l-2",
                "bottom-5 right-5 border-b-2 border-r-2",
              ].map((pos) => (
                <span key={pos} className={`ya-tick absolute h-4 w-4 border-cyan-300/70 ${pos}`} />
              ))}
              {/* glow blobs inside panel */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

              <div className="relative flex h-full flex-col">
                <div className="ya-panel-item flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">
                    {CONTENT.panel.ref}
                  </span>
                  <span className="rounded-full border border-pink-400/40 bg-pink-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-pink-300">
                    {CONTENT.panel.badge}
                  </span>
                </div>

                <h3 className="ya-panel-item mt-8 text-2xl font-bold leading-snug text-white sm:text-[1.7rem]">
                  {CONTENT.panel.headingLine1}
                  <br className="hidden sm:block" /> {CONTENT.panel.headingLine2}{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {CONTENT.panel.headingHighlight}
                  </span>
                </h3>

                <ul className="mt-8 space-y-5 sm:mt-10">
                  {CONTENT.points.map((p) => (
                    <li key={p.num} className="ya-panel-item flex gap-4">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] font-mono text-[11px] font-bold text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        {p.num}
                      </span>
                      <div>
                        <p className="text-[15px] font-semibold text-white">{p.title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-slate-400">{p.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* --- module A · growth curve card (fills the flexible middle) --- */}
                <div className="ya-panel-item mt-8 flex flex-1 flex-col justify-center">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-cyan-300/70">
                        {CONTENT.growthCard.caption}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-pink-400" /> {CONTENT.growthCard.legend}
                      </span>
                    </div>
                    <GrowthSketch />
                  </div>

                  {/* --- module B · everything under one roof --- */}
                  <div className="mt-6">
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
                      {CONTENT.growthCard.stackLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CONTENT.services.map(({ color, label }) => (
                        <span
                          key={label}
                          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[11.5px] font-semibold text-slate-300 transition-colors duration-300 hover:border-white/25 hover:text-white"
                        >
                          <span className="cta-dot h-1.5 w-1.5 rounded-full" style={{ "--dot": color }} />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- stats row (from site: hero metrics) --- */}
                <div className="ya-panel-item mt-8 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  {CONTENT.stats.map((s) => (
                    <div key={s.label} className="px-3 text-center">
                      <p className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="ya-panel-item mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
                  <div className="flex -space-x-2">
                    {["from-sky-400 to-blue-500", "from-purple-400 to-fuchsia-500", "from-pink-400 to-rose-500"].map(
                      (g) => (
                        <span
                          key={g}
                          className={`h-8 w-8 rounded-full border-2 border-[#101226] bg-gradient-to-br ${g}`}
                        />
                      )
                    )}
                  </div>
                  <p className="text-[12.5px] leading-snug text-slate-400">
                    <span className="font-semibold text-white">{CONTENT.socialProof.strong}</span>{" "}
                    {CONTENT.socialProof.rest}
                  </p>
                </div>
              </div>
            </div>

            {/* ==================== RIGHT · GOHIGHLEVEL FORM ===================== */}
            <div className="ya-form-panel relative flex flex-col p-3 sm:p-6 lg:p-8">
              <iframe
                src={GHL_FORM_URL}
                id={`inline-${FORM.id}`}
                title={FORM.title}
                className="cta-form-iframe w-full flex-1 rounded-2xl border-0"
                style={{ "--cta-form-min-h": `${FORM.minHeight}px` }}
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name={FORM.name}
                data-height={FORM.minHeight}
                data-layout-iframe-id={`inline-${FORM.id}`}
                data-form-id={FORM.id}
              />
              <Script src={FORM.embedScript} strategy="lazyOnload" />

              {/* trust microcopy */}
              <p className="mt-4 flex items-start justify-center gap-2 px-2 pb-2 text-center text-[12.5px] leading-relaxed text-slate-400 sm:px-4">
                <svg width="14" height="14" viewBox="0 0 20 20" className="mt-0.5 shrink-0 text-amber-500">
                  <path
                    d="M10 2a4 4 0 0 0-4 4v2H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 17h10a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 15 8h-1V6a4 4 0 0 0-4-4Zm-2 6V6a2 2 0 1 1 4 0v2H8Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{CONTENT.trustNote}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Agency-style "platforms we build with" logo strip — lives at the
            foot of this section rather than as its own page block. */}
        <OurPartners />
      </div>
    </section>
  );
}

/* ------------- growth sketch · blueprint of the YA logo chart ------------- */
/* Ascending bars + growth arrow (the brand mark) drawn as a technical
   elevation: dimension line below, measure ticks, drafting labels.        */

function GrowthSketch() {
  return (
    <svg
      viewBox="0 0 340 190"
      fill="none"
      className="h-auto w-full max-w-[340px] opacity-90"
      aria-hidden="true"
    >
      {/* baseline */}
      <path className="ya-sk" d="M28 148 H312" stroke="rgba(148,163,184,0.5)" strokeWidth="1.2" />

      {/* ascending bars (drawn as outlines, blueprint style) */}
      <path className="ya-sk" d="M44 148 V118 A4 4 0 0 1 48 114 H72 A4 4 0 0 1 76 118 V148" stroke="#38BDF8" strokeWidth="1.5" />
      <path className="ya-sk" d="M100 148 V96 A4 4 0 0 1 104 92 H128 A4 4 0 0 1 132 96 V148" stroke="#818CF8" strokeWidth="1.5" />
      <path className="ya-sk" d="M156 148 V70 A4 4 0 0 1 160 66 H184 A4 4 0 0 1 188 70 V148" stroke="#A855F7" strokeWidth="1.5" />
      <path className="ya-sk" d="M212 148 V40 A4 4 0 0 1 216 36 H240 A4 4 0 0 1 244 40 V148" stroke="#EC4899" strokeWidth="1.5" />

      {/* growth arrow over the bars */}
      <path
        className="ya-sk"
        d="M40 126 L100 104 L152 78 L228 30 L282 14"
        stroke="url(#yaSkGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
       
      />
      <path className="ya-sk" d="M262 10 L284 13 L272 32" stroke="url(#yaSkGrad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* arrow-tip pulse */}
      <circle className="ya-sk-tip" cx="284" cy="13" r="5" fill="#EC4899" />
      <circle className="ya-sk-tip" cx="284" cy="13" r="10" stroke="#EC4899" strokeWidth="1" fill="none" />

      {/* dimension line + ticks (drafting detail) */}
      <path className="ya-sk" d="M44 166 H244" stroke="rgba(103,232,249,0.45)" strokeWidth="1" strokeDasharray="4 4" />
      {[44, 100, 156, 212, 244].map((x) => (
        <path key={x} className="ya-sk" d={`M${x} 161 V171`} stroke="rgba(103,232,249,0.55)" strokeWidth="1" />
      ))}

      {/* drafting labels */}
      <text className="ya-sk-label" x="44" y="184" fill="rgba(148,163,184,0.75)" fontSize="8.5" fontFamily="monospace" letterSpacing="2">
        MONTH 1
      </text>
      <text className="ya-sk-label" x="196" y="184" fill="rgba(148,163,184,0.75)" fontSize="8.5" fontFamily="monospace" letterSpacing="2">
        MONTH 6
      </text>
      <text className="ya-sk-label" x="252" y="152" fill="rgba(236,72,153,0.85)" fontSize="8.5" fontFamily="monospace" letterSpacing="2">
        YOU
      </text>

      <defs>
        <linearGradient id="yaSkGrad" x1="40" y1="130" x2="284" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.55" stopColor="#A855F7" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* --------------------- background node network (light) -------------------- */

function BackgroundNetwork() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-20 h-full w-full opacity-[0.5]"
    >
      <defs>
        <pattern id="yaNet" width="140" height="140" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.6" fill="#93A6F5" opacity="0.5" />
          <circle cx="110" cy="70" r="1.6" fill="#C4A6F5" opacity="0.45" />
          <circle cx="55" cy="120" r="1.6" fill="#93C8F5" opacity="0.45" />
          <path d="M20 20 L110 70 L55 120" stroke="#AEB9F0" strokeWidth="0.6" opacity="0.35" fill="none" />
          <path d="M110 70 L160 40" stroke="#AEB9F0" strokeWidth="0.6" opacity="0.3" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#yaNet)" />
    </svg>
  );
}
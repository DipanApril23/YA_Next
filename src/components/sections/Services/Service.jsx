"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ServiceCards from "./ServiceCards";
// Host-app dependency — swap for your own Container/Button if re-using elsewhere.
import { Container, Button } from "@/components/ui";
import {
  SERVICE_STATS,
  SERVICE_PARTICLES,
  SERVICE_SECTION,
  SERVICES_SECTION_CONTENT as CONTENT,
} from "@/data";
import serviceWire from "@/assets/image/service-wire.webp";
import "./service.css";

// ── Floating Particle ─────────────────────────────────────────────────────────
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -28, 0], opacity: [0.15, 0.45, 0.15], scale: [1, 1.3, 1] }}
    transition={{ duration: style.duration || 6, repeat: Infinity, ease: "easeInOut", delay: style.delay || 0 }}
  />
);

// ── Stat Pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ value, label, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85, y: 12 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
    className="sv-stat flex flex-col items-center justify-center px-4 py-3 rounded-2xl border flex-1"
    style={{ borderColor: `${color}33` }}
  >
    <span className="text-xl sm:text-2xl font-black tracking-tight" style={{ color }}>
      {value}
    </span>
    <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold tracking-widest uppercase mt-0.5">
      {label}
    </span>
  </motion.div>
);

// ─── Main Service Section ─────────────────────────────────────────────────────
const Service = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const spring = useSpring(bgY, { stiffness: 80, damping: 20 });

  const particles = SERVICE_PARTICLES;

  return (
    <div
      ref={sectionRef}
      className="sv-section relative w-full overflow-hidden"
    >
      {/* ── Ambient blobs ─── */}
      <motion.div style={{ y: spring }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[140px]"  />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-pink-600/5 blur-[100px]" />
      </motion.div>

      {/* ── Particles ─── */}
      {particles.map((p, i) => <Particle key={i} style={p} />)}

      {/* ── Grid overlay ─── */}
      <div
        className="sv-grid absolute inset-0 pointer-events-none opacity-[0.025]"
      />

      <Container>
        <article className="relative z-10 py-20 sm:py-28 flex flex-col gap-14 sm:gap-20">

          {/* ══ 1. Section header — centered ════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center gap-4 text-center"
          >
            {/* Label chip */}
            <div
              className="sv-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase"
            >
              <span className="sv-badge-dot w-1.5 h-1.5 rounded-full animate-pulse" />
              {CONTENT.badge}
            </div>

            <h2 className="text-[30px] sm:text-[42px] md:text-[54px] font-black leading-[1.1] tracking-tight max-w-3xl">
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                {CONTENT.headingLead}
                {CONTENT.headingLeadTrail}
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#ff007f] via-purple-500 to-[#00f5d4] bg-clip-text text-transparent">
                {CONTENT.headingRest}
              </span>
            </h2>

            <p className="text-neutral-400 max-w-xl text-sm sm:text-base leading-relaxed">
              {CONTENT.intro}
            </p>
          </motion.div>

           <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="sv-rule w-full h-px rounded-full"
          />

          {/* ══ 2. Two-column: LEFT info  |  RIGHT image ════════════════════ */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* ─ LEFT: tagline + description + stats + small CTA ─ */}
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
              className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-6"
            >
              {/* Tagline */}
              <div className="space-y-3 text-center lg:text-left">
                <h3 className="text-2xl sm:text-[28px] md:text-[34px] font-black leading-tight font-poppins">
                  <span className="bg-gradient-to-r from-[#00b4db] to-[#00f5d4] bg-clip-text text-transparent">
                    {CONTENT.tagline.line1}
                  </span>
                  <br />
                  <span className="text-white">{CONTENT.tagline.line2}</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#ff007f] via-purple-400 to-[#a855f7] bg-clip-text text-transparent">
                    {CONTENT.tagline.line3}
                  </span>
                </h3>

                <p className="text-neutral-400 leading-relaxed text-sm sm:text-[15px] max-w-md mx-auto lg:mx-0">
                  {CONTENT.description}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 max-w-xs sm:max-w-sm w-full justify-center lg:justify-start">
                {SERVICE_STATS.map((s) => (
                  <StatPill key={s.label} value={s.value} label={s.label} color={s.color} delay={s.delay} />
                ))}
              </div>

              {/* Small CTA button — uses shared Button component */}
              <Button
                className="!w-auto !mt-0 self-center lg:self-start px-5 py-2 text-sm"
              >
                {CONTENT.ctaLabel}
              </Button>
            </motion.div>

            {/* ─ RIGHT: service-wire image ─ */}
            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay: 0.12 }}
              className="hidden lg:flex lg:w-1/2 items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Glow behind image */}
                <div
                  className="sv-image-glow absolute inset-0 rounded-full blur-[80px] pointer-events-none"
                />
                <Image
                  src={serviceWire}
                  alt={SERVICE_SECTION.wireImageAlt}
                  width={480}
                  height={480}
                  sizes="(max-width: 1024px) 0px, 460px"
                  className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                />
              </motion.div>
            </motion.div>

          </div>

          {/* ── Divider ─── */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="sv-rule w-full h-px rounded-full"
          />

          {/* ══ 3. ServiceCards — full width below ══════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className="w-full"
          >
            <ServiceCards />
          </motion.section>

        </article>
      </Container>
    </div>
  );
};

export default Service;

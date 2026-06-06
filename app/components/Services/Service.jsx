"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ServiceCards from "./ServiceCards";
import { Container, Button } from "..";
import serviceWire from "../../assets/image/service-wire.webp";

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
    className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl border flex-1"
    style={{ background: "rgba(255,255,255,0.03)", borderColor: `${color}33` }}
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

  const particles = [
    { width: 6, height: 6, top: "10%", left: "6%",  background: "#ff007f", filter: "blur(1px)", duration: 7,  delay: 0   },
    { width: 4, height: 4, top: "25%", left: "93%", background: "#00f5d4", filter: "blur(1px)", duration: 9,  delay: 1.5 },
    { width: 8, height: 8, top: "62%", left: "4%",  background: "#a855f7", filter: "blur(2px)", duration: 6,  delay: 0.8 },
    { width: 5, height: 5, top: "78%", left: "90%", background: "#ff007f", filter: "blur(1px)", duration: 8,  delay: 2   },
    { width: 3, height: 3, top: "48%", left: "50%", background: "#00f5d4", filter: "blur(0px)", duration: 5,  delay: 3   },
    { width: 6, height: 6, top: "88%", left: "20%", background: "#a855f7", filter: "blur(1px)", duration: 10, delay: 1   },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(180deg,#010208 0%,#060612 60%,#010208 100%)" }}
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
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container>
        <article id="services" className="relative z-10 py-20 sm:py-28 flex flex-col gap-14 sm:gap-20">

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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: "#00f5d4", borderColor: "rgba(0,245,212,0.3)", background: "rgba(0,245,212,0.07)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00f5d4", boxShadow: "0 0 6px #00f5d4" }} />
              Our Expertise
            </div>

            <h2 className="text-[30px] sm:text-[42px] md:text-[54px] font-black leading-[1.1] tracking-tight max-w-3xl">
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                Premium Services{" "}
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#ff007f] via-purple-500 to-[#00f5d4] bg-clip-text text-transparent">
                Built to Scale
              </span>
            </h2>

            <p className="text-neutral-400 max-w-xl text-sm sm:text-base leading-relaxed">
              Streamline development, marketing, and design operations with our
              custom-made solutions engineered for enterprise-grade growth.
            </p>
          </motion.div>

           <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-px rounded-full"
            style={{ background: "linear-gradient(90deg,transparent,rgba(0,245,212,0.25),rgba(168,85,247,0.25),transparent)" }}
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
                    Create a new way
                  </span>
                  <br />
                  <span className="text-white">to enhance your</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#ff007f] via-purple-400 to-[#a855f7] bg-clip-text text-transparent">
                    business needs
                  </span>
                </h3>

                <p className="text-neutral-400 leading-relaxed text-sm sm:text-[15px] max-w-md mx-auto lg:mx-0">
                  Stay organised and improve. Streamline custom development,
                  marketing, design, and other business operations of your
                  enterprise. Let us help enhance the bottom line with our
                  custom-made solutions.
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 max-w-xs sm:max-w-sm w-full justify-center lg:justify-start">
                <StatPill value="20+" label="Services" color="#ff007f" delay={0}    />
                <StatPill value="3"   label="Domains"  color="#00f5d4" delay={0.08} />
                <StatPill value="∞"   label="Growth"   color="#a855f7" delay={0.16} />
              </div>

              {/* Small CTA button — uses shared Button component */}
              <Button
                className="!w-auto !mt-0 self-center lg:self-start px-5 py-2 text-sm"
              >
                Click to Explore →
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
                  className="absolute inset-0 rounded-full blur-[80px] pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.25) 0%, rgba(0,245,212,0.15) 60%, transparent 100%)" }}
                />
                <Image
                  src={serviceWire}
                  alt="Young Architects service network"
                  width={480}
                  height={480}
                  className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                  priority
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
            className="w-full h-px rounded-full"
            style={{ background: "linear-gradient(90deg,transparent,rgba(0,245,212,0.25),rgba(168,85,247,0.25),transparent)" }}
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
"use client";

import React, { useRef } from "react";
// import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ServiceCards from "./ServiceCards";
import { Container, Button } from "..";

// ── Floating Particle ─────────────────────────────────────────────────────────
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{
      y: [0, -30, 0],
      opacity: [0.15, 0.45, 0.15],
      scale: [1, 1.3, 1],
    }}
    transition={{
      duration: style.duration || 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: style.delay || 0,
    }}
  />
);

// ── Stat Pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ value, label, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className="flex flex-col items-center justify-center px-5 py-4 rounded-2xl border"
    style={{
      background: "rgba(255,255,255,0.03)",
      borderColor: `${color}33`,
    }}
  >
    <span
      className="text-2xl sm:text-3xl font-black tracking-tight"
      style={{ color }}
    >
      {value}
    </span>
    <span className="text-[10px] sm:text-xs text-neutral-500 font-semibold tracking-widest uppercase mt-0.5">
      {label}
    </span>
  </motion.div>
);

// ─── Main Service Section ─────────────────────────────────────────────────────
const Service = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const spring = useSpring(bgY, { stiffness: 80, damping: 20 });

  const particles = [
    { width: 6, height: 6, top: "12%", left: "8%",  background: "#ff007f", filter: "blur(1px)", duration: 7, delay: 0   },
    { width: 4, height: 4, top: "28%", left: "92%", background: "#00f5d4", filter: "blur(1px)", duration: 9, delay: 1.5 },
    { width: 8, height: 8, top: "60%", left: "5%",  background: "#a855f7", filter: "blur(2px)", duration: 6, delay: 0.8 },
    { width: 5, height: 5, top: "75%", left: "88%", background: "#ff007f", filter: "blur(1px)", duration: 8, delay: 2   },
    { width: 3, height: 3, top: "45%", left: "50%", background: "#00f5d4", filter: "blur(0px)", duration: 5, delay: 3   },
    { width: 6, height: 6, top: "85%", left: "22%", background: "#a855f7", filter: "blur(1px)", duration: 10,delay: 1   },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(180deg, #010208 0%, #060612 60%, #010208 100%)" }}
    >
      {/* ── Ambient background blobs ──────────────────────────── */}
      <motion.div style={{ y: spring }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10  blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-pink-600/5 blur-[100px]" />
      </motion.div>

      {/* ── Floating particles ────────────────────────────────── */}
      {particles.map((p, i) => (
        <Particle key={i} style={p} />
      ))}

      {/* ── Mesh grid overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container>
        <article id="services" className="relative z-10 py-20 sm:py-28 flex flex-col gap-16 sm:gap-20">

          {/* ── Section header ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center gap-4 text-center"
          >
            {/* Label chip */}
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase"
              style={{
                color: "#00f5d4",
                borderColor: "rgba(0,245,212,0.3)",
                background: "rgba(0,245,212,0.07)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#00f5d4", boxShadow: "0 0 6px #00f5d4" }}
              />
              Our Expertise
            </div>

            <h2 className="text-[32px] sm:text-[44px] md:text-[56px] font-black leading-[1.1] tracking-tight max-w-3xl">
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                Premium Services{" "}
              </span>
              <br className="hidden sm:block" />
              <span
                className="bg-gradient-to-r from-[#ff007f] via-purple-500 to-[#00f5d4] bg-clip-text text-transparent"
              >
                Built to Scale
              </span>
            </h2>

            <p className="text-neutral-400 max-w-xl text-sm sm:text-base leading-relaxed">
              Streamline development, marketing, and design operations with our
              custom-made solutions engineered for enterprise-grade growth.
            </p>
          </motion.div>

          {/* ── Two-column info + cards layout ────────────────── */}
          <div className="flex flex-col gap-12 xl:flex-row xl:items-start xl:gap-16">

            {/* LEFT: Sticky info panel */}
            <motion.section
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
              className="w-full xl:w-[38%] xl:sticky xl:top-28 flex flex-col gap-8 font-poppins"
            >
              {/* Heading block */}
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-[30px] md:text-[36px] font-black leading-tight">
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

                <p className="text-neutral-400 font-normal leading-relaxed text-sm sm:text-[15px]">
                  Stay organised and improve. Streamline custom development,
                  marketing, design, and other business operations of your
                  enterprise. Let us help enhance the bottom line with our
                  custom-made solutions.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <StatPill value="20+" label="Services"  color="#ff007f" />
                <StatPill value="3"   label="Domains"   color="#00f5d4" />
                <StatPill value="∞"   label="Growth"    color="#a855f7" />
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="shadow-[0_0_24px_rgba(255,0,127,0.3)]">
                  Click to Explore →
                </Button>
                {/* <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold text-neutral-300 hover:text-white transition-colors duration-200"
                  style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}
                >
                  Book Consultation →
                </motion.a> */}
              </div>

              {/* Wireframe visual */}
              {/* <motion.div
                whileHover={{ scale: 1.03, opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="hidden xl:block opacity-30 transition-opacity duration-500 mt-2"
              >
                <Image
                  className="w-[70%] object-contain filter drop-shadow-[0_0_20px_rgba(157,78,221,0.2)]"
                  src="https://youngarchitects.in/assets/image/service-wire.webp"
                  alt="service-wireframe"
                  width={300}
                  height={300}
                />
              </motion.div> */}
            </motion.section>

            {/* RIGHT: Interactive card stack */}
            <motion.section
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              className="w-full xl:w-[62%]"
            >
              <ServiceCards />
            </motion.section>
          </div>

        </article>
      </Container>
    </div>
  );
};

export default Service;
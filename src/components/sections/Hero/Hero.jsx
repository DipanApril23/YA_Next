"use client";

// ─── Hero ─────────────────────────────────────────────────────────────
// Dark landing section: headline, lead copy, CTAs, benefits checklist, the
// FlipCard, and a deterministic particle field. Content → src/data/hero.js,
// styles → hero.css. Client component (scroll parallax via Framer Motion).

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { Container, FlipCard, Button } from "@/components/ui";
import {
  HERO_STATS as STATS,
  HERO_BENEFITS as BENEFITS,
  HERO_PARTICLES as PARTICLES,
  HERO_CTAS as CTAS,
  HERO_CONTENT as CONTENT,
} from "@/data";
import "./hero.css";

/* ── Animation variants ── */
const fadeUp = (delay = 0) => ({
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const flipCardIn = {
  initial: { opacity: 0, y: 35, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: 0.35, duration: 1.05, ease: [0.22, 1, 0.36, 1] },
};

/* Maps a particle from HERO_PARTICLES onto the custom properties `.hero-particle` reads. */
const particleVars = (p) => ({
  "--p-left": p.left,
  "--p-top": p.top,
  "--p-size": p.size,
  "--p-color": p.color,
  "--p-glow-blur": p.glowBlur,
  "--p-glow-color": p.glowColor,
  "--p-duration": p.duration,
  "--p-delay": p.delay,
  "--p-dx": p.dx,
  "--p-dy": p.dy,
});

const Hero = () => {
  const sectionRef = useRef(null);

  /* Desktop parallax is only applied after mount so server and client render
     identically (avoids a hydration mismatch from reading window during render). */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Parallax motion values (framer-motion runtime values, not style rules) */
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -45]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero relative min-h-screen w-full overflow-hidden pt-12 md:pt-4"
    >
      {/* ════════════════ BACKGROUND LAYERS ════════════════ */}
      <motion.div
        style={{ y: blobY }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="hero-aurora-1" />
        <div className="hero-aurora-2" />
        <div className="hero-aurora-3" />
      </motion.div>

      {/* Perspective grid floor */}
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[52%]"
        aria-hidden
      >
        <div className="hero-grid" />
      </motion.div>

      {/* Noise grain overlay */}
      <div aria-hidden className="hero-noise pointer-events-none absolute inset-0" />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden
          className="hero-particle pointer-events-none absolute rounded-full hidden sm:block"
          style={particleVars(p)}
        />
      ))}

      {/* ════════════════ MAIN LAYOUT ════════════════ */}
      <Container>
        <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-12 py-20 md:flex-row md:gap-6 md:py-24">
          {/* ── LEFT COLUMN ── */}
          <motion.div
            style={{ y: isDesktop ? contentY : 0 }}
            className="flex w-full flex-col items-center text-center gap-5 sm:gap-6 md:w-[55%] md:items-start md:text-left md:pr-6 lg:pr-12"
          >
            {/* Status chip */}
            <motion.div
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
              className="hero-chip inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="hero-chip-dot h-1.5 w-1.5 rounded-full" />
              <span className="text-[11px] xs:text-xs font-medium text-cyan-400/90 tracking-wider">
                {CONTENT.eyebrow}
              </span>
            </motion.div>

            {/*
              Headline + brand + lead paragraph paint on first server render (no
              opacity:0 / JS-gated entrance), so the LCP text isn't delayed. Their
              entrance is a CSS transform-only slide (`hero-rise`) that holds
              opacity at 1 and runs at paint time.
            */}
            <div className="w-full flex flex-col gap-1">
              <div className="hero-rise hero-rise-1">
                <h1 className="hero-grad-text hero-headline font-black leading-[1.1] md:leading-[1.03] tracking-tight pb-1">
                  {CONTENT.headlineLead}
                </h1>
              </div>

              <div className="hero-rise hero-rise-2">
                <h1 className="hero-headline font-black leading-[1.1] md:leading-[1.03] tracking-tight text-white">
                  {CONTENT.headlineMain}
                </h1>
              </div>
            </div>

            {/* Brand name */}
            <div className="hero-rise hero-rise-3">
              <h2 className="hero-pink-text font-black uppercase tracking-widest text-[15px] sm:text-lg md:text-xl lg:text-2xl">
                {CONTENT.brand}
              </h2>
            </div>

            {/* Lead paragraph */}
            <p className="hero-rise hero-rise-4 max-w-[38rem] text-sm sm:text-base text-white/75 font-medium leading-relaxed">
              {CONTENT.leadBefore}
              <strong>{CONTENT.leadStrong}</strong>
              {CONTENT.leadAfter}
            </p>

            {/* ── CTAs ── */}
            <motion.div
              variants={fadeUp(1.1)}
              initial="hidden"
              animate="visible"
              className="w-full px-4 sm:px-0 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4"
            >
              {CTAS.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cta.narrow ? "hero-cta hero-cta--narrow" : "hero-cta"}
                >
                  <Button variant={cta.variant} className="w-full mt-0">
                    {cta.label}
                  </Button>
                </a>
              ))}
            </motion.div>

            {/* Benefits checklist */}
            <motion.ul
              variants={fadeUp(1.25)}
              initial="hidden"
              animate="visible"
              className="hero-benefits pt-2"
            >
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="hero-benefit">
                  <span className="hero-benefit-check" aria-hidden>
                    <Check strokeWidth={3.5} />
                  </span>
                  <span className="hero-benefit-text">{benefit}</span>
                </li>
              ))}
            </motion.ul>

            {/* Stats row */}
            <motion.div
              variants={fadeUp(1.4)}
              initial="hidden"
              animate="visible"
              className="flex gap-6 sm:gap-10 pt-4"
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center md:items-start">
                  <span className="hero-stat-value font-black text-xl sm:text-2xl md:text-3xl">
                    {s.value}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white/30 mt-1">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Closing line */}
            <motion.p
              variants={fadeUp(0.9)}
              initial="hidden"
              animate="visible"
              className="max-w-[38rem] text-sm sm:text-base text-white/50 font-medium leading-relaxed"
            >
              <strong>{CONTENT.closing}</strong>
            </motion.p>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            initial={flipCardIn.initial}
            animate={flipCardIn.animate}
            transition={flipCardIn.transition}
            className="flex w-full items-center justify-center md:w-[45%] max-w-sm sm:max-w-md md:max-w-none px-4 sm:px-0"
          >
            <FlipCard />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container, FlipCard, Button } from "@/components/ui";
import { HERO_STATS as STATS, HERO_TAGS as TAGS, HERO_PARTICLES as PARTICLES } from "@/data";
import "./hero.css";

/* ── Animation variants ── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};

const lineUp = {
  hidden: { y: 90, opacity: 0, filter: "blur(14px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  },
});

/* ══════════════════════════════════
    HERO COMPONENT
══════════════════════════════════ */
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

  /* Parallax values */
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -45]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <>
      <section
        ref={sectionRef}
        id="home"
        className="relative min-h-screen w-full overflow-hidden pt-12 md:pt-4"
        style={{ background: "#03030a" }}
      >
        {/* ════════════════ BACKGROUND LAYERS ════════════════ */}
        <motion.div
          style={{ y: blobY }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="hero-aurora-1 absolute"
            style={{
              left: "5%",
              top: "10%",
              width: "clamp(360px,45vw,580px)",
              height: "clamp(360px,45vw,580px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(6,182,212,0.75) 0%, transparent 68%)",
              filter: "blur(72px)",
              opacity: 0.18,
            }}
          />
          <div
            className="hero-aurora-2 absolute"
            style={{
              right: "8%",
              top: "20%",
              width: "clamp(400px,50vw,660px)",
              height: "clamp(400px,50vw,660px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(59,130,246,0.9) 0%, transparent 65%)",
              filter: "blur(90px)",
              opacity: 0.14,
            }}
          />
          <div
            className="hero-aurora-3 absolute"
            style={{
              left: "25%",
              bottom: "5%",
              width: "clamp(340px,42vw,520px)",
              height: "clamp(340px,42vw,520px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(168,85,247,0.75) 0%, rgba(236,72,153,0.5) 50%, transparent 70%)",
              filter: "blur(80px)",
              opacity: 0.17,
            }}
          />
        </motion.div>

        {/* Perspective grid floor */}
        <motion.div
          style={{ y: gridY }}
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[52%]"
          aria-hidden
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage: [
                "linear-gradient(rgba(6,182,212,0.35) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(6,182,212,0.35) 1px, transparent 1px)",
              ].join(","),
              backgroundSize: "55px 55px",
              transform: "perspective(550px) rotateX(56deg) translateY(12%)",
              transformOrigin: "bottom center",
              maskImage:
                "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 80%)",
              opacity: 0.13,
            }}
          />
        </motion.div>

        {/* Noise grain overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            opacity: 0.035,
            mixBlendMode: "soft-light",
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute rounded-full hidden sm:block"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2 + 3}px ${p.size}px ${p.color}33`,
              animation: `heroParticle ${p.dur}s ease-in-out ${p.delay}s infinite`,
              "--pdx": `${p.dx}px`,
              "--pdy": `${p.dy}px`,
            }}
          />
        ))}

        {/* ════════════════ MAIN LAYOUT ════════════════ */}
        <Container>
          <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-12 py-20 md:flex-row md:gap-6 md:py-24">
            {/* ── LEFT COMPONENT COLUMN ── */}
            <motion.div
              style={{ y: isDesktop ? contentY : 0 }}
              className="flex w-full flex-col items-center text-center gap-5 sm:gap-6 md:w-[55%] md:items-start md:text-left md:pr-6 lg:pr-12"
            >
              {/* Status chip */}
              <motion.div
                variants={fadeUp(0.1)}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 backdrop-blur-sm"
                style={{
                  borderColor: "rgba(6,182,212,0.28)",
                  background: "rgba(6,182,212,0.07)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#06b6d4",
                    boxShadow: "0 0 8px #06b6d4",
                    animation: "heroPing 2.4s ease-in-out infinite",
                  }}
                />
                <span className="text-[11px] xs:text-xs font-medium text-cyan-400/90 tracking-wider">
                  AI-Powered Digital Agency · Kolkata
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="w-full flex flex-col gap-1 overflow-hidden"
              >
                <div style={{ overflow: "hidden" }}>
                  <motion.h1
                    variants={lineUp}
                    className="hero-grad-text font-black leading-[1.1] md:leading-[1.03] tracking-tight pb-1"
                    style={{ fontSize: "clamp(1.95rem, 5vw, 3.8rem)" }}
                  >
                    Build a Digital Presence {"\u2014"}
                  </motion.h1>
                </div>

                <div style={{ overflow: "hidden" }}>
                  <motion.h1
                    variants={lineUp}
                    className="font-black leading-[1.1] md:leading-[1.03] tracking-tight text-white"
                    style={{ fontSize: "clamp(1.95rem, 5vw, 3.8rem)" }}
                  >
                    That Makes People Trust You Before They Even Contact You.
                  </motion.h1>
                </div>
              </motion.div>

              {/* Brand name */}
              <motion.h2
                variants={fadeUp(0.72)}
                initial="hidden"
                animate="visible"
                className="hero-pink-text font-black uppercase tracking-widest text-[15px] sm:text-lg md:text-xl lg:text-2xl"
              >
                ⚡ Young Architects
              </motion.h2>

              {/* Paragraph Copywriting */}
              <motion.p
                variants={fadeUp(0.9)}
                initial="hidden"
                animate="visible"
                className="max-w-[38rem] text-sm sm:text-base text-white/50 font-medium leading-relaxed"
              >
                From{" "}
                <strong>
                  websites and SaaS products plus SEO to authority positioning
                  and lead generation systems
                </strong>{" "}
                — Young Architects helps law firms, SaaS brands, investigators,
                agencies, and growing businesses turn their online presence into
                a predictable client acquisition engine.
              </motion.p>

              {/* ── CTA BUTTONS — STACKED ON MOBILE, ROW ON DESKTOP ── */}
              <motion.div
                variants={fadeUp(1.1)}
                initial="hidden"
                animate="visible"
                className="w-full px-4 sm:px-0 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4"
              >
                <a
                  href="https://calendly.com/yafoundations/45min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto sm:min-w-[210px]"
                >
                  {/* mt-0 overrides the default mt-4 inside your custom Button component */}
                  <Button className="w-full mt-0">Book Consultation</Button>
                </a>
                <a
                  href="https://youngarchitects.in/assets/YA_Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto sm:min-w-[180px]"
                >
                  <Button variant="secondary" className="w-full mt-0">
                    View Policy
                  </Button>
                </a>
              </motion.div>
              <motion.div
                variants={fadeUp(1.1)}
                initial="hidden"
                animate="visible"
                className="w-full px-4 sm:px-0 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 mt-[-18px]"
              >
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto sm:min-w-[210px]"
                >
                  {/* mt-0 overrides the default mt-4 inside your custom Button component */}
                  <Button className="w-full mt-0">
                    See How We Build Growth Systems
                  </Button>
                </a>
              </motion.div>

              {/* Service tags */}
              <motion.div
                variants={fadeUp(1.25)}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap justify-center md:justify-start gap-2 pt-2"
              >
                {TAGS.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 background-white/5 text-white/40 backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeUp(1.4)}
                initial="hidden"
                animate="visible"
                className="flex gap-6 sm:gap-10 pt-4"
              >
                {STATS.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center md:items-start"
                  >
                    <span
                      className="font-black text-xl sm:text-2xl md:text-3xl"
                      style={{
                        background: "linear-gradient(135deg, #06b6d4, #a855f7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {s.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white/30 mt-1">
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
              <motion.p
                variants={fadeUp(0.9)}
                initial="hidden"
                animate="visible"
                className="max-w-[38rem] text-sm sm:text-base text-white/50 font-medium leading-relaxed"
              >
                <strong>
                  Helping businesses build authority, visibility, and
                  conversion-focused digital ecosystems.
                </strong>
              </motion.p>
            </motion.div>

            {/* ── RIGHT COMPONENT COLUMN ── */}
            <motion.div
              initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.35,
                duration: 1.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex w-full items-center justify-center md:w-[45%] max-w-sm sm:max-w-md md:max-w-none px-4 sm:px-0"
            >
              <FlipCard />
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Hero;

"use client";

// ─── Hero ─────────────────────────────────────────────────────────────
// Dark landing section: headline, lead copy, CTAs, benefits checklist, the
// FlipCard, and a deterministic particle field. Content → src/data/hero.js,
// styles → hero.css. Client component (scroll parallax).
//
// PERFORMANCE — no framer-motion here. Every entrance is a CSS animation
// (`hero-rise` / `hero-fade` / `hero-card-in` in hero.css) with the same
// distances, durations, easings and delays the old Framer variants used, so
// the choreography is identical — but it runs at paint time instead of
// waiting for JS to hydrate. That is what fixes the mobile LCP: the copy no
// longer sits at opacity:0 until the bundle arrives. The scroll parallax is
// a ~20-line rAF handler writing transforms straight to the layer refs.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Container, FlipCard, Button } from "@/components/ui";
import {
  HERO_STATS as STATS,
  HERO_PARTICLES as PARTICLES,
  HERO_CTAS as CTAS,
  HERO_CONTENT as CONTENT,
} from "@/data";
import "./hero.css";

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
  const blobRef = useRef(null);
  const gridRef = useRef(null);
  const contentRef = useRef(null);

  /* Scroll parallax. Same mapping the Framer motion-values produced:
     progress p = scrollY / sectionHeight (section starts at page top), then
     blobs 0→40px, grid 0→90px, content 0→-45px over the first 60% (desktop
     only, as before). Transform-only writes inside rAF — no layout reads on
     the scroll path, so no forced reflows. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let height = Math.max(section.offsetHeight, 1);
    let raf = 0;

    const apply = () => {
      raf = 0;
      const p = Math.min(Math.max(window.scrollY / height, 0), 1);
      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(0, ${p * 40}px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${p * 90}px, 0)`;
      }
      if (contentRef.current) {
        const y =
          window.innerWidth > 768 ? Math.min(p / 0.6, 1) * -45 : 0;
        contentRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      height = Math.max(section.offsetHeight, 1);
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero relative min-h-screen w-full overflow-hidden pt-12 md:pt-4"
    >
      {/* ════════════════ BACKGROUND LAYERS ════════════════ */}
      <div
        ref={blobRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="hero-aurora-1" />
        <div className="hero-aurora-2" />
        <div className="hero-aurora-3" />
      </div>

      {/* Perspective grid floor */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[52%]"
        aria-hidden
      >
        <div className="hero-grid" />
      </div>

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
        {/* `hero-row` / `hero-col` are hooks for the short-viewport rules in
            hero.css — they tighten this padding and gap so the CTAs stay above
            the fold on a short screen. They carry no styles otherwise. */}
        <div className="hero-row relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-12 py-20 md:flex-row md:gap-6 md:py-24">
          {/* ── LEFT COLUMN ── */}
          <div
            ref={contentRef}
            className="hero-col flex w-full flex-col items-center text-center gap-5 sm:gap-6 md:w-[55%] md:items-start md:text-left md:pr-6 lg:pr-12"
          >
            {/* Status chip */}
            <div className="hero-fade hero-fade--chip hero-chip inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 backdrop-blur-sm">
              <span className="hero-chip-dot h-1.5 w-1.5 rounded-full" />
              <span className="text-[11px] xs:text-xs font-medium text-cyan-400/90 tracking-wider">
                {CONTENT.eyebrow}
              </span>
            </div>

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
            <div className="hero-fade hero-fade--ctas w-full px-4 sm:px-0 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
              {/* A new tab is right for the booking calendar — it takes the
                  visitor off-site — and wrong for an on-site page, which should
                  also route client-side rather than reload the whole app. The
                  href decides, so a CTA can be repointed from @/data alone. */}
              {CTAS.map((cta) => {
                const external = /^https?:/.test(cta.href);
                const Tag = external ? "a" : Link;
                return (
                  <Tag
                    key={cta.label}
                    href={cta.href}
                    className={cta.narrow ? "hero-cta hero-cta--narrow" : "hero-cta"}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Button variant={cta.variant} className="w-full mt-0">
                      {cta.label}
                    </Button>
                  </Tag>
                );
              })}
            </div>

            {/* The reasons-to-choose tick list used to sit here, between the
                CTAs and the stats. It has moved to the FlipCard's back face
                (src/data/content/flipCard.json → `services`): six rows of copy
                pushed the CTAs below the fold on every laptop, which is the
                one thing the hero cannot afford to hide. */}

            {/* Stats row */}
            <div className="hero-fade hero-fade--stats flex gap-6 sm:gap-10 pt-4">
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
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="hero-card-in flex w-full items-center justify-center md:w-[45%] max-w-sm sm:max-w-md md:max-w-none px-4 sm:px-0">
            <FlipCard />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;

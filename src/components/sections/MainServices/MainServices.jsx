"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Database,
  Facebook,
  LayoutTemplate,
  PenTool,
  Search,
  Target,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui";
import { MAIN_SERVICES, MAIN_SERVICES_CONTENT as CONTENT } from "@/data";
import "./mainServices.css";

/* Resolves the `icon` name from the data onto a component. */
const SERVICE_ICONS = {
  LayoutTemplate,
  Search,
  Bot,
  PenTool,
  Facebook,
  Target,
  Users,
  Database,
};

/*
  Theme + bento config per card, in data order.
  theme → gradient/text palette      cut  → chamfered clip-path corners
  tall  → spans 2 rows on desktop    wide → spans 4 of 6 columns on desktop

  Desktop bento rhythm (6 cols):
  [ c1(2) | c2(2) | c3(2, tall) ]
  [ c4(4, wide)   |  ...c3      ]
  [ c5(2) | c6(2) | c7(2, tall) ]
  [ c8(4, wide)   |  ...c7      ]
*/
const CARD_CONFIG = [
  { theme: "mint" },
  { theme: "violet", cut: true },
  { theme: "solar", tall: true },
  { theme: "ocean", wide: true },
  { theme: "prism" },
  { theme: "void" },
  { theme: "teal", tall: true },
  { theme: "rose", cut: true, wide: true },
];

const AUTOPLAY_MS = 3400;
const RESUME_AFTER_MS = 5000;

/* ── Entry animation ── */
const fadeUp = {
  hidden: { y: 26, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardIn = {
  hidden: { y: 36, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const MainServices = () => {
  const scrollerRef = useRef(null);
  const railFillRef = useRef(null);
  const [counter, setCounter] = useState(1);
  const total = MAIN_SERVICES.length;

  /*
    Mobile/tablet vertical auto-scroller.
    - Snap-scrolls one card at a time every AUTOPLAY_MS.
    - Any user interaction pauses it; it resumes after RESUME_AFTER_MS idle.
    - Only runs while the scroller is on screen, only below 1024px,
      and never when the user prefers reduced motion.
    - The progress rail + counter track manual scrolling too.
  */
  useEffect(() => {
    const el = scrollerRef.current;
    const fill = railFillRef.current;
    if (!el || !fill) return;

    const mqMobile = window.matchMedia("(max-width: 1023px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cells = Array.from(el.querySelectorAll(".ux-cell"));
    if (!cells.length) return;

    let paused = false;
    let idleTimer = null;
    let inView = false;
    let raf = 0;

    const nearestIndex = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      cells.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - center);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = el.scrollWidth - el.clientWidth;
        fill.style.transform = `scaleX(${max > 0 ? el.scrollLeft / max : 0})`;
        setCounter(nearestIndex() + 1);
      });
    };

    const pause = () => {
      paused = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        paused = false;
      }, RESUME_AFTER_MS);
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    const interactionEvents = ["pointerdown", "wheel", "touchstart", "keydown"];
    el.addEventListener("scroll", onScroll, { passive: true });
    interactionEvents.forEach((ev) =>
      el.addEventListener(ev, pause, { passive: true })
    );

    const timer = setInterval(() => {
      if (!mqMobile.matches || mqReduced.matches || paused || !inView) return;
      const next = (nearestIndex() + 1) % cells.length;
      const card = cells[next];
      el.scrollTo({
        left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
        behavior: "smooth",
      });
    }, AUTOPLAY_MS);

    onScroll();

    return () => {
      clearInterval(timer);
      clearTimeout(idleTimer);
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      interactionEvents.forEach((ev) => el.removeEventListener(ev, pause));
    };
  }, []);

  return (
    <section id="services" className="ms-section">
      <div aria-hidden className="ms-network" />
      <div aria-hidden className="ms-glow ms-glow--left" />
      <div aria-hidden className="ms-glow ms-glow--right" />

      <div className="ms-inner">
        <Container>
          {/* ── Header ── */}
          <motion.header
            className="ms-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <h2 className="ms-heading">
              <span className="ms-heading-lead">{CONTENT.headingLead}</span>{" "}
              <span className="ms-heading-rest">{CONTENT.headingRest}</span>
            </h2>
            <p className="ms-sub">{CONTENT.subheading}</p>
          </motion.header>

          {/* ── Bento grid (desktop) / vertical auto-scroller (mobile & tablet) ── */}
          <div className="ux-scroller">
            <div className="ux-scroll-vp" ref={scrollerRef}>
              <motion.ul
                className="ux-grid"
                variants={gridStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {MAIN_SERVICES.map((service, i) => {
                  const cfg = CARD_CONFIG[i % CARD_CONFIG.length];
                  const Icon = SERVICE_ICONS[service.icon] || LayoutTemplate;

                  const cellClasses = [
                    "ux-cell",
                    cfg.wide ? "ux-cell--wide" : "",
                    cfg.tall ? "ux-cell--tall" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const parentClasses = [
                    "ux-parent",
                    `ux-parent--${cfg.theme}`,
                    cfg.cut ? "ux-parent--cut" : "",
                    cfg.wide ? "ux-parent--wide" : "",
                    service.featured ? "ux-parent--featured" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <motion.li key={service.id} variants={cardIn} className={cellClasses}>
                      <div className={parentClasses}>
                        <div className="ux-card">
                          <div aria-hidden className="ux-glass" />

                          {service.comingSoon && (
                            <span
                              aria-hidden
                              className="ux-diamond ux-diamond--corner"
                            />
                          )}

                          {/* Copy floats at Z26 above the glass */}
                          <div className="ux-content">
                            <span className="ux-title">{service.title}</span>
                            <span className="ux-text">
                              {service.description}
                              {service.note && (
                                <>
                                  {" "}
                                  <strong>{service.note.strong}</strong>
                                  {service.note.rest}
                                </>
                              )}
                            </span>
                          </div>

                          {/* Concentric circle stack — solid badge on top */}
                          <div aria-hidden className="ux-logo">
                            <span className="ux-circle" />
                            <span className="ux-circle" />
                            <span className="ux-circle" />
                            <span className="ux-circle" />
                            <span className="ux-circle">
                              <Icon strokeWidth={2} />
                            </span>
                          </div>

                          {/* Bottom bar — CTA pops toward the viewer on hover */}
                          <div className="ux-bottom">
                            {service.comingSoon ? (
                              <span className="ux-soon">
                                <span aria-hidden className="ux-diamond" />
                                {CONTENT.comingSoonLabel}
                              </span>
                            ) : (
                              <a href={service.href} className="ux-more">
                                {CONTENT.exploreLabel}
                                <svg
                                  aria-hidden
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>

            {/* Progress rail + counter — mobile/tablet scroller only */}
            <div aria-hidden className="ux-rail">
              <span className="ux-rail-fill" ref={railFillRef} />
            </div>
            <p className="ux-counter" aria-live="polite">
              {counter} / {total}
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default MainServices;
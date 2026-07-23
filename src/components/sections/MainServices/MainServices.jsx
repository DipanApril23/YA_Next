"use client";

// ─── Main Services — "3 Houses" ───────────────────────────────────────
// Development House + Creative House side by side, Marketing House spanning
// full width with a 2×2 grid of nested sub-groups. Dark "void" 3D glass
// style on every card.
//
// LOADING / ENTRANCE — "Raising the Houses":
//   1. Card tips up from the ground (rotateX 26° → 0) while rising + fading
//   2. Orbit rings spring-pop, ring by ring, ending on the icon badge
//   3. Kicker → title → tagline → list items cascade in
//   4. A light-beam sheen sweeps across the card once to "seal" it
// Transform/opacity only (GPU-cheap, no filters = no text blur); runs once
// per card on scroll into view; collapses to plain fades under
// prefers-reduced-motion.
//
// ARCHITECTURE NOTE: Framer writes inline `transform`, which would override
// the CSS translateZ() that gives rings/CTA their 3D depth + hover climbs.
// So every 3D-positioned element (.house-orb, .house-more) stays a plain
// element, and Framer animates a separate inner/outer wrapper.
//
// Content → src/data/mainServices.js · styles → mainServices.css

import { motion, useReducedMotion } from "framer-motion";
import {
  Code2,
  Megaphone,
  Palette,
  PenTool,
  Search,
  Target,
  Users,
} from "lucide-react";
import { Container, SectionHeader } from "@/components/ui";
import { MAIN_SERVICES, MAIN_SERVICES_CONTENT as CONTENT } from "@/data";
import "./mainServices.css";

/* Resolves `icon` names from the data onto components. */
const SERVICE_ICONS = {
  Code2,
  Palette,
  Megaphone,
  Search,
  Target,
  PenTool,
  Users,
};

const EASE = [0.22, 1, 0.36, 1];

/* The header's own entrance now lives in <SectionHeader>. */

/* ── Grid: stagger the three houses ── */
const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
};

/* ── 1) The house is "raised" — tips up from the ground plane ── */
const cardRaise = {
  hidden: {
    opacity: 0,
    y: 90,
    rotateX: 26,
    scale: 0.94,
    transformPerspective: 1300,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transformPerspective: 1300,
    transition: { duration: 0.95, ease: EASE },
  },
};

/* ── 2) Orbit rings spring-pop, outermost first, badge last ── */
const ringPop = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.4 + i * 0.1,
      type: "spring",
      stiffness: 240,
      damping: 19,
    },
  }),
};

/* ── 3) Copy cascade ── */
const copyIn = (delay) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.55, ease: EASE },
  },
});

const listStagger = (delay) => ({
  hidden: {},
  visible: { transition: { delayChildren: delay, staggerChildren: 0.045 } },
});

const itemIn = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

const groupIn = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

/* ── 4) Light-beam sheen seals the card ── */
const sheenSweep = {
  hidden: { x: "-160%", opacity: 0 },
  visible: {
    x: "340%",
    opacity: [0, 0.9, 0],
    transition: { delay: 0.85, duration: 1.05, ease: "easeInOut" },
  },
};

/* Plain-fade fallbacks for prefers-reduced-motion */
const justFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
const noop = { hidden: {}, visible: {} };

/*
  Concentric circle stack + solid icon badge.
  .house-orb  (plain)  → owns CSS translateZ depth + hover climbs
  .house-circle (motion, fills orb) → owns the entrance spring-pop
*/
const CircleStack = ({ Icon, ring }) => (
  <div aria-hidden className="house-logo">
    {[0, 1, 2, 3].map((i) => (
      <span key={i} className="house-orb">
        <motion.span className="house-circle" variants={ring} custom={i} />
      </span>
    ))}
    <span className="house-orb">
      <motion.span className="house-circle" variants={ring} custom={4}>
        <Icon strokeWidth={2} />
      </motion.span>
    </span>
  </div>
);

/*
  Bottom bar. The <a> stays plain so the CSS hover pop (translateZ 42px)
  survives; the motion wrapper only handles the entrance fade-up.
*/
const ExploreCta = ({ href, label, variants }) => (
  <div className="house-bottom">
    <motion.span className="house-more-anim" variants={variants}>
      <a href={href} className="house-more">
        {label}
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
    </motion.span>
  </div>
);

const ServiceItem = ({ item, variants }) => (
  <motion.li className="house-item" variants={variants}>
    <span aria-hidden className="house-tick" />
    <span>
      {item.label}
      {item.comingSoon && (
        <span className="house-soon">
          <span aria-hidden className="house-diamond" />
          {CONTENT.comingSoonLabel}
        </span>
      )}
    </span>
  </motion.li>
);

const MainServices = () => {
  const reduceMotion = useReducedMotion();

  /* Swap the choreography for plain fades under reduced motion. */
  const vCard = reduceMotion ? justFade : cardRaise;
  const vRing = reduceMotion ? justFade : ringPop;
  const vItem = reduceMotion ? justFade : itemIn;
  const vGroup = reduceMotion ? justFade : groupIn;
  const vSheen = reduceMotion ? noop : sheenSweep;
  const vCopy = (d) => (reduceMotion ? justFade : copyIn(d));
  const vList = (d) => (reduceMotion ? noop : listStagger(d));

  return (
    <section id="services" className="ms-section">
      <div aria-hidden className="ms-network" />
      <div aria-hidden className="ms-glow ms-glow--left" />
      <div aria-hidden className="ms-glow ms-glow--right" />

      <div className="ms-inner">
        <Container>
          {/* ── Header ── */}
          <SectionHeader
            className="ms-header"
            theme="light"
            badge={CONTENT.badge}
            headingLead={CONTENT.headingLead}
            headingRest={CONTENT.headingRest}
            subheading={CONTENT.subheading}
          />

          {/* ── 3-house grid ── */}
          <motion.ul
            className="house-grid"
            variants={reduceMotion ? noop : gridStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {MAIN_SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.icon] || Code2;
              const isWide = Boolean(service.wide);

              return (
                <motion.li
                  key={service.id}
                  variants={vCard}
                  className={
                    isWide ? "house-cell house-cell--wide" : "house-cell"
                  }
                >
                  <div className={isWide ? "house house--wide" : "house"}>
                    <div className="house-card">
                      <div aria-hidden className="house-glass" />
                      <CircleStack Icon={Icon} ring={vRing} />

                      {/* Copy — flat (Z0) so glyphs stay pixel-crisp */}
                      <div className="house-content">
                        <motion.span
                          className="house-kicker"
                          variants={vCopy(0.25)}
                        >
                          {service.kicker}
                        </motion.span>
                        <motion.h3
                          className="house-title"
                          variants={vCopy(0.32)}
                        >
                          {service.title}
                        </motion.h3>
                        <motion.p
                          className="house-tagline"
                          variants={vCopy(0.4)}
                        >
                          <strong>{service.taglineStrong}</strong>{" "}
                          {service.tagline}
                        </motion.p>

                        {/* Development & Creative — cascading checklist */}
                        {service.items && (
                          <motion.ul
                            className="house-list"
                            variants={vList(0.5)}
                          >
                            {service.items.map((item) => (
                              <ServiceItem
                                key={item.label}
                                item={item}
                                variants={vItem}
                              />
                            ))}
                          </motion.ul>
                        )}

                        {/* Marketing — 2×2 sub-group panels rise in turn */}
                        {service.groups && (
                          <motion.div
                            className="house-groups"
                            variants={vList(0.45)}
                          >
                            {service.groups.map((group) => {
                              const GroupIcon =
                                SERVICE_ICONS[group.icon] || Search;
                              return (
                                <motion.div
                                  key={group.label}
                                  className="house-group"
                                  variants={vGroup}
                                  whileHover={
                                    reduceMotion ? undefined : { y: -4 }
                                  }
                                >
                                  <p className="house-group-label">
                                    <GroupIcon
                                      aria-hidden
                                      strokeWidth={2.2}
                                      className="house-group-icon"
                                    />
                                    {group.label}
                                  </p>
                                  <motion.ul
                                    className="house-list house-list--group"
                                    variants={vList(0.1)}
                                  >
                                    {group.items.map((label) => (
                                      <ServiceItem
                                        key={label}
                                        item={{ label }}
                                        variants={vItem}
                                      />
                                    ))}
                                  </motion.ul>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </div>

                      <ExploreCta
                        href={service.href}
                        label={service.ctaLabel}
                        variants={vCopy(0.6)}
                      />

                      {/* Light-beam sheen — sweeps once to seal the card */}
                      <div aria-hidden className="house-sheen-wrap">
                        <motion.span
                          className="house-sheen"
                          variants={vSheen}
                        />
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </Container>
      </div>
    </section>
  );
};

export default MainServices;
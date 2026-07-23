"use client";

/**
 * Testimonials — social proof marquee (id="testimonials").
 *
 * Design ported 1:1 from the Elogix/Expendesk `TestimonialsSection`.
 *
 * Two `MarqueeRow`s scroll in opposite directions (left/right) at different
 * speeds. The scrolling itself is pure CSS (`ya-marquee-*` keyframes in
 * ./testimonials.css); each row duplicates its items once so the loop is
 * seamless, and hovering/touching a row pauses it via `animationPlayState`.
 * Cards are equal-height (an `h-full` chain) and render a gradient-initial
 * `Avatar` unless an optional `avatarImage` is provided.
 *
 * Content → src/data/testimonials.js. The display-only `avatarGradient` is
 * assigned here from TESTIMONIAL_GRADIENTS, keyed by id, because it is a
 * styling concern rather than something a CMS/backend would ever own.
 */

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeader } from "@/components/ui";
import {
  TESTIMONIALS_CONTENT as CONTENT,
  TESTIMONIALS_ITEMS as ITEMS,
} from "@/data";
import "./testimonials.css";

// ─────────────────────────────────────────────────────────────────────────────
// DATA  —  content from @/data; gradients are a display concern kept here.
// ─────────────────────────────────────────────────────────────────────────────

const TESTIMONIAL_GRADIENTS = {
  "1":  "from-violet-500 to-purple-700",
  "2":  "from-fuchsia-500 to-pink-600",
  "3":  "from-indigo-500 to-blue-600",
  "4":  "from-emerald-500 to-teal-600",
  "5":  "from-orange-500 to-amber-600",
  "6":  "from-violet-500 to-indigo-600",
  "7":  "from-rose-500 to-pink-600",
  "8":  "from-cyan-500 to-blue-600",
  "9":  "from-purple-500 to-violet-700",
  "10": "from-violet-600 to-fuchsia-600",
  "11": "from-teal-500 to-emerald-600",
  "12": "from-amber-500 to-orange-600",
};

const testimonialsData = ITEMS.map((t) => ({
  ...t,
  avatarImage: t.avatarImage ?? undefined,
  metric: t.metric ?? undefined,
  avatarGradient: TESTIMONIAL_GRADIENTS[t.id] ?? "from-slate-500 to-slate-700",
}));

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function QuoteGlyph({ className }) {
  // Solid editorial quotation mark — used as a faint decorative glyph inside cards.
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M12.7 6.2C8 8.2 4.8 12.6 4.8 18.3c0 4.4 2.7 7.5 6.4 7.5 3.3 0 5.7-2.5 5.7-5.6 0-3.1-2.1-5.3-5-5.3-.6 0-1.3.1-1.6.2.5-2.6 3-5.4 6-6.8l-3.6-2.1Zm14 0C22 8.2 18.8 12.6 18.8 18.3c0 4.4 2.7 7.5 6.4 7.5 3.3 0 5.7-2.5 5.7-5.6 0-3.1-2.1-5.3-5-5.3-.6 0-1.3.1-1.6.2.5-2.6 3-5.4 6-6.8l-3.6-2.1Z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${
            i < count ? "text-amber-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function Avatar({ t }) {
  const ring =
    "h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-white/70";

  if (t.avatarImage) {
    return (
      <div className={ring}>
        {/*
          Plain <img> is intentional: avatar photos are optional (every
          testimonial currently uses the gradient-initials fallback below), and
          real photos would come from an unknown external host that isn't in
          next.config.mjs `images.remotePatterns`. Swap for next/image and
          allowlist the host once real photo URLs are wired up.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatarImage}
          alt={t.author}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${ring} flex items-center justify-center bg-gradient-to-br ${t.avatarGradient} text-xs font-bold tracking-wide text-white`}
      aria-hidden="true"
    >
      {t.avatar}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    // flex-shrink-0 keeps width fixed; h-full lets it stretch to the tallest
    // card in its row so EVERY card in a row is the same height.
    <div className="group relative mx-2.5 h-full w-[300px] flex-shrink-0 select-none sm:mx-3 sm:w-[336px] lg:w-[360px]">
      {/* Hover glow */}
      <div
        className="
          pointer-events-none absolute -inset-1 rounded-[26px] opacity-0 blur-xl
          transition-opacity duration-500
          bg-gradient-to-br from-violet-400/40 via-fuchsia-400/30 to-indigo-400/40
          group-hover:opacity-100
        "
        aria-hidden="true"
      />

      {/* Gradient ring (1px border) — h-full so the visible card fills the slot */}
      <div
        className="
          relative h-full rounded-[22px] p-px transition-all duration-500 ease-out
          bg-gradient-to-br from-white/90 via-white/40 to-violet-200/50
          shadow-[0_8px_30px_-12px_rgba(76,29,149,0.18)]
          group-hover:-translate-y-1.5
          group-hover:from-violet-300/80 group-hover:via-white/60 group-hover:to-fuchsia-300/60
          group-hover:shadow-[0_24px_48px_-16px_rgba(109,40,217,0.35)]
        "
      >
        {/* Glass body — solid-ish white (no backdrop-filter) so text stays
            razor-sharp while the row is animating. */}
        <article className="relative flex h-full flex-col overflow-hidden rounded-[21px] bg-white/95 p-5 antialiased sm:p-6">
          {/* top inner highlight */}
          <div
            className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
            aria-hidden="true"
          />
          {/* faint decorative quote glyph */}
          <QuoteGlyph className="pointer-events-none absolute -right-1 -top-2 h-14 w-14 text-violet-500/[0.07] transition-colors duration-500 group-hover:text-violet-500/[0.12]" />

          {/* Stars */}
          <StarRating count={t.rating} />

          {/* Quote — full text, no truncation. Darker for clear readability. */}
          <blockquote className="relative mb-5 mt-3 text-[13.5px] font-medium leading-relaxed text-gray-700 sm:text-sm">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          {/* Footer — mt-auto pushes it to the bottom of every card */}
          <div className="mt-auto border-t border-violet-900/[0.08] pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar t={t} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight text-gray-900">
                    {t.author}
                  </p>
                  <p className="truncate text-[11px] text-gray-500">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>

              {/* Metric badge */}
              {t.metric && (
                <div className="flex-shrink-0 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/70 px-3 py-2 text-right shadow-sm">
                  <p className="bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-sm font-black leading-none text-transparent">
                    {t.metric.value}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[9px] leading-none text-violet-500">
                    {t.metric.label}
                  </p>
                </div>
              )}
            </div>

            <p className="mt-2.5 pl-[3.25rem] text-[10px] text-gray-400">
              {t.companyType}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

// ── Marquee row ────────────────────────────────────────────────────────────

function MarqueeRow({ items, direction, duration }) {
  const [paused, setPaused] = useState(false);
  const track = [...items, ...items]; // duplicate for seamless loop
  const animCls = direction === "left" ? "ya-marquee-left" : "ya-marquee-right";

  return (
    <div
      className="flex overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* items-stretch (default) + the cards' h-full chain = equal-height cards.
          py-6 gives the hover-lift + glow room so they aren't clipped. */}
      <div
        className={`flex items-stretch py-6 will-change-transform ${animCls}`}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {track.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Decorative avatar cluster for the bottom "Join 100+ businesses" pill —
// gradient + initials so the circles read as real customers, not empty dots.
const AVATAR_BADGES = [
  { gradient: "from-violet-500 to-purple-700", initials: "AS" },
  { gradient: "from-fuchsia-500 to-pink-600", initials: "RB" },
  { gradient: "from-emerald-500 to-teal-600", initials: "SG" },
  { gradient: "from-orange-500 to-amber-600", initials: "IQ" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Split the dataset in half: first half scrolls left, second half right.
  // Computed (not hardcoded) so adding/removing testimonials just works.
  const mid = Math.ceil(testimonialsData.length / 2);
  const row1 = testimonialsData.slice(0, mid);
  const row2 = testimonialsData.slice(mid);

  const [rowCfg1, rowCfg2] = CONTENT.rows;
  const surface = CONTENT.surface;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden pb-20 pt-0 md:pb-20"
      style={{ backgroundColor: surface }}
    >
      {/* The seam above this section is drawn by <SectionDivider> in page.js,
          which owns every section boundary on the page. */}

      {/* ── Background: glow blobs ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/3 h-[700px] w-[700px] rounded-full bg-violet-300/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-fuchsia-300/12 blur-[90px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/10 blur-[100px]" />
      </div>

      {/* ── Background: dot grid (masked so it fades at the edges) ───────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ─────────────────── HEADER ───────────────────────────────────── */}
      <div className="relative mx-auto mb-12 mt-12 max-w-7xl px-4 text-center sm:mb-16 sm:px-6 lg:px-8">
        <SectionHeader
          theme="light"
          badge={CONTENT.badge}
          headingLead={CONTENT.headingLead}
          headingRest={CONTENT.headingRest}
          subheading={CONTENT.subheading}
        />
      </div>

      {/* ─────────────────── MARQUEE ROWS (contained, not full-bleed) ────
          Mobile/tablet get side gutters via px-5 / sm:px-8 so the cards
          don't run edge-to-edge; lg returns to px-4 because max-w-7xl
          already creates the desktop gutter. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.42 }}
        className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-4"
      >
        <MarqueeRow
          items={row1}
          direction={rowCfg1.direction}
          duration={rowCfg1.duration}
        />
        <MarqueeRow
          items={row2}
          direction={rowCfg2.direction}
          duration={rowCfg2.duration}
        />

        {/* Edge fade masks — anchored to the container edges */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24"
          style={{ backgroundImage: `linear-gradient(to right, ${surface}, transparent)` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24"
          style={{ backgroundImage: `linear-gradient(to left, ${surface}, transparent)` }}
          aria-hidden="true"
        />
      </motion.div>

      {/* ─────────────────── BOTTOM CTA ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.56 }}
        className="relative mt-14 flex flex-col items-center gap-5 px-4 text-center sm:mt-16"
      >
        <div className="flex items-center gap-3 rounded-full border border-violet-200/50 bg-white/60 px-5 py-2.5 shadow-sm backdrop-blur-md">
          <div className="flex -space-x-2">
            {AVATAR_BADGES.map((a, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${a.gradient} border-2 border-white text-[10px] font-bold tracking-wide text-white`}
                aria-hidden="true"
              >
                {a.initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {CONTENT.bottomCta.pre}{" "}
            <span className="font-semibold text-gray-700">
              {CONTENT.bottomCta.highlight}
            </span>{" "}
            {CONTENT.bottomCta.post}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

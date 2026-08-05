"use client";

// ─── ServiceCards ─────────────────────────────────────────────────────
// The interactive part of the Services section: a tabbed, swipeable deck of
// service cards with a "Learn More" modal.
//
// TWO VIEW MODES
//   stack  a fanned 3D card stack (four slots, 0 = front); advancing rotates
//          the deck and AnimatePresence interpolates every card to its new slot
//   grid   a flat responsive grid, used on smaller screens
//
// HOW THE STACK ANIMATION WORKS
// Each card is keyed by its SERVICE INDEX, not its slot. So when the deck
// advances, the surviving cards keep their key and simply animate to the next
// slot's offset (framer-motion tweens x/y/rotate/scale for free); only the
// departing front card runs `exit`, and only the new back card runs `initial`.
// The slot offsets themselves are data — CARD_OFFSETS in
// src/data/config/serviceTabs.json.
//
// Catalogue + tab definitions + copy all come from the @/data barrel; this
// file owns structure and animation only.

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import {
  SERVICES_CATALOGUE as services,
  SERVICE_TABS as TABS,
  CARD_OFFSETS as OFFSETS,
  SERVICES_SECTION_CONTENT as CONTENT,
} from "@/data";
import { Modal } from "@/components/ui";

/* ─── Feature chips — desktop only ────────────────────────────────────────────
   The deck runs the full width of the container, which is roughly three times
   the width of the phone card the layout was designed at. Everything below
   `md` keeps that portrait design; from `md` the face turns landscape (logo
   panel beside the copy, see CardFace) and these chips fill the room the wider
   column opens up. The third chip waits for `lg` — in the narrower `md` column
   it wraps onto a line of its own and reads as clutter.

   Two sources, in order:

     1. `highlights` on the service — an explicit list, for entries whose
        points are written as plain sentences and cannot be compressed to a
        chip without mangling them.
     2. the `learnMore` points, most of which the catalogue writes as
        "Label - explanation". The label alone is a ready-made 2-4 word
        feature, so those services need no extra copy at all.

   A point in neither form is skipped rather than truncated mid-sentence, and
   fewer than two survivors renders no row at all — one lonely chip reads as a
   mistake. So a service that grows a new point, or a whole new tab, keeps
   working without touching this file. */
/* 30 characters is the measured ceiling for a label that still reads as a
   CHIP. Past it the catalogue is really writing a sentence fragment
   ("Instagram, Facebook & LinkedIn post design"), which fills the row and
   defeats the point; skipping those and taking the next qualifying point
   keeps every one of the 20 services chipped. */
const CHIP_LABEL = /^(.{3,30}?)\s+[-–—]\s+/;
const MAX_CHIPS = 3;
const MIN_CHIPS = 2;

const featureChips = (service) => {
  if (service.highlights?.length >= MIN_CHIPS) return service.highlights.slice(0, MAX_CHIPS);

  const chips = [];
  for (const point of service.learnMore?.points ?? []) {
    const label = point.match(CHIP_LABEL)?.[1]?.trim();
    if (label) chips.push(label);
    if (chips.length === MAX_CHIPS) break;
  }
  return chips.length >= MIN_CHIPS ? chips : [];
};

// ─── Card content (only rendered for the front card) ─────────────────────────
// PORTRAIT ON PHONES, LANDSCAPE FROM `md`. The deck is as wide as the section,
// so a stacked logo-over-text face has to stretch its 120px of content down a
// 430px card — `justify-between` then banks all of that slack into one hole
// between the description and the footer. From `md` the logo banner becomes a
// full-height panel on the LEFT, the copy sits beside it and is centred rather
// than pushed apart, and the chips above use the width that opens up. Nothing
// below `md` changes: the phone card was already right.
//
// The switch is at `md` (768px) and not `lg` because this project redefines the
// breakpoints in globals.css — `lg` is 992px here, and a card is already 840px
// wide and half empty by then.
const CardFace = ({ service, accent, glow, onLearnMore }) => {
  const chips = featureChips(service);

  return (
    <div
      className="relative w-full h-full rounded-[28px] border flex flex-col md:flex-row overflow-hidden"
      style={{
        background: "linear-gradient(145deg,rgba(18,18,28,0.97) 0%,rgba(10,10,20,0.99) 100%)",
        borderColor: `${accent}55`,
        boxShadow: `0 0 0 1px ${accent}22, 0 28px 70px rgba(0,0,0,0.75), 0 0 50px ${glow}`,
      }}
    >
      {/* ── Logo panel — a banner across the top, a column down the side ──
          Sizing lives in classes rather than the style prop so the `lg` rules
          can win; only the accent-derived colours stay inline. */}
      <div
        className="relative flex w-full shrink-0 items-center justify-center border-b h-[clamp(130px,28%,165px)] md:h-full md:w-[36%] md:max-w-[420px] md:border-b-0 md:border-r"
        style={{
          background: `linear-gradient(135deg, ${accent}1a 0%, rgba(8,8,18,0.7) 100%)`,
          borderColor: `${accent}22`,
        }}
      >
        {/* Soft glow behind logo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 55%, ${accent}28, transparent 70%)` }}
        />

        {/* Service logo — large, centred, clearly readable */}
        <Image
          src={service.logo}
          alt={service.title}
          width={220}
          height={140}
          sizes="(max-width: 640px) 60vw, (max-width: 992px) 220px, 300px"
          className="relative z-10 h-auto w-auto max-h-[110px] max-w-[80%] object-contain md:max-h-[130px] lg:max-h-[150px]"
        />
      </div>

      {/* Category badge — pinned to the CARD's corner, so it stays top-right
          when the logo panel moves to the side. */}
      <span
        className="absolute top-3 right-3 z-20 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border"
        style={{ color: accent, borderColor: `${accent}44`, background: "rgba(8,8,18,0.88)" }}
      >
        {service.category}
      </span>

      {/* ── Body + Footer ── */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 md:justify-center md:gap-5 md:p-7 lg:gap-6 lg:p-9">
        {/* Body */}
        <div className="space-y-2 md:space-y-3 lg:space-y-3.5">
          <h3
            className="text-white text-base sm:text-lg md:text-xl lg:text-[26px] font-extrabold tracking-tight leading-snug capitalize"
            style={{ textShadow: `0 0 20px ${accent}44` }}
          >
            {service.title}
          </h3>
          {/* The clamp is a phone measure — at this width the copy is two lines. */}
          <p className="text-neutral-400 text-xs sm:text-sm lg:text-[15px] leading-relaxed line-clamp-3 md:line-clamp-none md:max-w-2xl">
            {service.description}
          </p>

          {chips.length > 0 && (
            <ul className="hidden flex-wrap gap-2 pt-1 md:flex">
              {chips.map((chip, i) => (
                <li
                  key={chip}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold leading-none text-white/75 ${
                    i === 2 ? "hidden lg:block" : ""
                  }`}
                  style={{ borderColor: `${accent}33`, background: `${accent}0f` }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div
          className="pt-4 mt-3 md:mt-0 md:max-w-2xl flex items-center justify-between border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={onLearnMore}
            className="group/btn flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-200"
            style={{ color: accent }}
          >
            <span className="group-hover/btn:underline underline-offset-4">Learn More</span>
            <span className="inline-block transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Back-card placeholder (no content, just the layered panel look) ──────────
const CardBack = ({ accent }) => (
  <div
    className="w-full h-full rounded-[28px] border"
    style={{
      background: "linear-gradient(145deg,rgba(18,18,28,0.95) 0%,rgba(10,10,20,0.97) 100%)",
      borderColor: "rgba(255,255,255,0.06)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}
  />
);

// ─── The Interactive Card Stack ───────────────────────────────────────────────
const CardStack = ({ serviceList, accent, glow, onLearnMore }) => {
  const [frontIndex, setFrontIndex] = useState(0);
  const [direction, setDirection] = useState(1); // +1 = next, -1 = prev
  const n = serviceList.length;

  // Build the 4 visible card slots (0 = front, 3 = furthest back)
  // key = the actual service index so AnimatePresence can track enter/exit
  const slots = Array.from({ length: Math.min(4, n) }, (_, slot) => ({
    serviceIndex: (frontIndex + slot) % n,
    slot,
  }));

  const go = (dir) => {
    setDirection(dir);
    setFrontIndex((p) => (p + dir + n) % n);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">

      {/* ── Stack viewport ───────────────────────────────────
          The deck is absolutely positioned, so this height IS the card height.
          Below `lg` it tracks the viewport, as a portrait card should. From
          `lg` the face is landscape and its content needs about 230px, so the
          card stops growing: the old 430px was height the copy could not fill
          and the visible result was a hole above the footer. */}
      <div className="relative w-full h-[clamp(320px,44vw,400px)] md:h-[330px] lg:h-[350px]">
        {/* Ambient glow behind deck */}
        <div
          className="absolute -inset-10 rounded-full blur-[90px] pointer-events-none"
          style={{ background: glow, opacity: 0.2 }}
        />

        {/*
          AnimatePresence tracks each card by `key` (= serviceIndex).
          When frontIndex advances by 1:
            • The old front card (serviceIndex = old frontIndex) EXITS  → flies left
            • Cards that were slots 1,2,3 stay (same key) but move to slots 0,1,2
              → Framer Motion interpolates their x/y/rotate/scale automatically
            • A brand-new card at the new deepest slot ENTERS → fades in from behind
        */}
        <AnimatePresence initial={false} custom={direction}>
          {/* Render back→front so the front card paints on top */}
          {[...slots].reverse().map(({ serviceIndex, slot }) => {
            const o = OFFSETS[slot];
            const isFront = slot === 0;

            return (
              <motion.div
                key={serviceIndex}
                custom={direction}
                /*
                 * initial  – only runs when this key is BRAND NEW (entering back card)
                 * animate  – runs whenever slot changes (cards shuffle forward)
                 * exit     – only runs for the removed key (the departing front card)
                 */
                initial={(dir) => ({
                  // New back card appears from behind the current deepest card
                  x: OFFSETS[3].x + (dir > 0 ? 10 : -10),
                  y: OFFSETS[3].y + 8,
                  rotate: OFFSETS[3].rotate + (dir > 0 ? 3 : -3),
                  scale: OFFSETS[3].scale - 0.05,
                  opacity: 0,
                  zIndex: 10,
                })}
                animate={{
                  x: o.x,
                  y: o.y,
                  rotate: o.rotate,
                  scale: o.scale,
                  opacity: o.opacity,
                  zIndex: o.zIndex,
                }}
                exit={(dir) => ({
                  // Front card flies off in the chosen direction
                  x: dir > 0 ? -320 : 320,
                  y: 60,
                  rotate: dir > 0 ? -28 : 28,
                  scale: 0.78,
                  opacity: 0,
                  zIndex: 60,
                  transition: {
                    duration: 0.45,
                    ease: [0.4, 0, 0.2, 1],
                  },
                })}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 32,
                  mass: 0.9,
                }}
                style={{ position: "absolute", inset: 0 }}
              >
                {isFront ? (
                  <CardFace
                    service={serviceList[serviceIndex]}
                    accent={accent}
                    glow={glow}
                    onLearnMore={() => onLearnMore(serviceList[serviceIndex])}
                  />
                ) : (
                  <CardBack accent={accent} />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Controls ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 mt-2">
        {/* Prev */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => go(-1)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center text-base font-bold transition-colors"
          style={{ borderColor: `${accent}44`, color: accent, background: `${accent}10` }}
        >
          ‹
        </motion.button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {serviceList.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > frontIndex ? 1 : -1); setFrontIndex(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === frontIndex ? "22px" : "7px",
                height:     "7px",
                background: i === frontIndex ? accent : "rgba(255,255,255,0.2)",
                boxShadow:  i === frontIndex ? `0 0 8px ${accent}` : "none",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => go(1)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center text-base font-bold transition-colors"
          style={{ borderColor: `${accent}44`, color: accent, background: `${accent}10` }}
        >
          ›
        </motion.button>

        {/* Counter */}
        <span className="text-xs font-mono text-neutral-500 ml-1 tabular-nums">
          {String(frontIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(n).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

// ─── Grid Preview ─────────────────────────────────────────────────────────────
const ServiceGrid = ({ serviceList, accent, glow, onLearnMore }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
      {serviceList.map((service, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.055, duration: 0.38 }}
          onHoverStart={() => setHovered(i)}
          onHoverEnd={() => setHovered(null)}
          className="relative rounded-[20px] border flex flex-col p-5 cursor-pointer overflow-hidden"
          style={{
            background:   "linear-gradient(145deg,rgba(15,15,25,0.95),rgba(8,8,18,0.98))",
            borderColor:  hovered === i ? `${accent}55` : "rgba(255,255,255,0.07)",
            boxShadow:    hovered === i ? `0 0 30px ${glow}, 0 8px 24px rgba(0,0,0,0.5)` : "0 4px 16px rgba(0,0,0,0.3)",
            transition:   "border-color 0.25s,box-shadow 0.25s",
          }}
          onClick={() => onLearnMore(service)}
        >
          {/* Shimmer sweep */}
          {hovered === i && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 0.07 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
              style={{ skewX: "-20deg" }}
            />
          )}
          <div className="flex flex-col flex-1 gap-4">
            {/* Banner Logo */}
            <div
              className="relative w-full rounded-xl flex items-center justify-center flex-shrink-0 p-4"
              style={{
                background: `linear-gradient(135deg, ${accent}15 0%, rgba(8,8,18,0.7) 100%)`,
                border: `1px solid ${accent}22`,
                minHeight: "120px"
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{ background: `radial-gradient(ellipse at 50% 50%, ${accent}28, transparent 70%)` }}
              />
              <Image
                className="w-auto h-16 sm:h-20 object-contain relative z-10"
                src={service.logo}
                alt={service.title}
                width={200}
                height={100}
                sizes="(max-width: 640px) 50vw, 200px"
              />
            </div>

            {/* Full Description */}
            <div className="min-w-0 flex-1">
              <p className="text-neutral-300 text-sm leading-relaxed transition-colors duration-200">
                {service.description}
              </p>
            </div>

            {/* Learn More link */}
            <div
              className="pt-3 border-t flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200"
              style={{ borderColor: "rgba(255,255,255,0.06)", color: hovered === i ? accent : "rgba(255,255,255,0.5)" }}
            >
              <span>Learn More</span>
              <span className={`inline-block transition-transform ${hovered === i ? "translate-x-1" : ""}`}>→</span>
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-full"
            style={{ background: accent }}
            initial={{ width: "0%" }}
            animate={{ width: hovered === i ? "100%" : "0%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Animated Tab Selector ────────────────────────────────────────────────────
// WHY THIS IS MORE THAN THREE BUTTONS
// A segmented control whose inactive segments are dim grey text reads as a
// LABEL rather than a control, so a non-technical visitor never discovers that
// two more categories exist. Four cues fix that, strongest first:
//
//   1. INFORMATION SCENT — every tab carries its own service COUNT, so an
//      unopened tab advertises what is behind it ("Marketing 9"). A number is
//      the cheapest possible promise of unseen content.
//   2. UNSEEN MARKERS — a pulsing accent dot sits on any tab the visitor has
//      not opened yet and vanishes once they have. An open loop wants closing,
//      and the marker keeps signalling long after any entrance animation ends.
//   3. AN ENTRANCE NUDGE — when the group scrolls into view the unopened tabs
//      lift once and a light sweeps the whole control, so peripheral vision
//      registers "three objects, all alive". It plays twice, then never again:
//      repeating motion stops being information and becomes noise.
//   4. A REAL BUTTON SKIN — inactive tabs keep a visible chip, border and a
//      hover lift in their own accent colour, so they read as pressable rather
//      than disabled. This is the cue that carries once the motion is over.
//
// The written hint above the group is a training wheel: it is removed the
// moment the visitor switches a tab for the first time, because by then they
// have proved they understand and the words are just clutter.
//
// IT IS A COACH-MARK, NOT A CAPTION. As dim grey 9.5px type it was invisible
// against the near-black section — present in the DOM, absent to the eye, and
// a cue nobody can read is not a cue. It now reads as a deliberate object: a
// glass pill in the ACTIVE TAB'S accent, an icon tile, the count as its own
// badge, and a caret on the underside that points at the control it is
// describing. The accent tie is what makes it belong to the tabs rather than
// float above them, and the caret is what makes "switch" mean "switch THAT".
// Everything that moves is finite or stops on reduced motion.
//
// All motion is skipped under prefers-reduced-motion; the chip skin, counts
// and dots survive, so nothing above depends on animation to be discoverable.
const TabSelector = ({
  tabs,
  activeTab,
  onTabChange,
  counts,
  seenTabs,
  showHint,
  copy,
}) => {
  const groupRef = useRef(null);
  const btnRefs = useRef([]);
  const [hovered, setHovered] = useState(null);

  const reduceMotion = useReducedMotion();
  const inView = useInView(groupRef, { once: true, amount: 0.6 });
  const nudge = inView && !reduceMotion;

  /* The hint borrows the live tab's accent so it reads as part of the control.
     The fallback only matters if a tab id ever stops matching the catalogue. */
  const accent = tabs.find((t) => t.id === activeTab)?.color ?? "#a855f7";

  /* Copy carries the count as a {count} token so it can be lifted out and set
     as its own badge — the number is the strongest part of the sentence. Split
     rather than replace, so a rewrite may move the token, and a rewrite that
     drops it entirely just renders the line with no badge. */
  const [hintLead, hintTail] = copy.hint.split("{count}");

  // ← → move between tabs, as a tablist is expected to.
  const handleKeyDown = (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const from = tabs.findIndex((t) => t.id === activeTab);
    const to = (from + dir + tabs.length) % tabs.length;
    onTabChange(tabs[to].id);
    btnRefs.current[to]?.focus();
  };

  return (
    <div className="flex w-full flex-col items-center gap-2.5 sm:w-auto sm:items-start">

      {/* ── Training-wheel coach-mark (removed after the first switch) ── */}
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.22 } }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="m-0 w-full text-center sm:w-auto sm:text-left"
          >
            {/* The pill. Bobs three times on arrival and then holds still —
                motion that never stops reads as decoration, not instruction. */}
            <motion.span
              animate={reduceMotion ? {} : { y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: 2, ease: "easeInOut", delay: 0.5 }}
              className="relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md"
              style={{
                borderColor: `${accent}59`,
                background: `linear-gradient(135deg, ${accent}24 0%, rgba(10,10,20,0.9) 60%)`,
                boxShadow: `0 0 0 1px ${accent}14, 0 8px 24px ${accent}2e`,
              }}
            >
              {/* Shimmer, clipped by its own layer so it cannot touch the caret.
                  Long pause between passes: it is a glint, not a strobe. */}
              {!reduceMotion && (
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                  <motion.span
                    className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-140%", "440%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3.6, ease: "easeInOut" }}
                  />
                </span>
              )}

              {/* Icon tile — same language as the navbar's menu-row icons. */}
              <motion.span
                aria-hidden="true"
                className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                style={{ color: accent, borderColor: `${accent}3d`, background: `${accent}1f` }}
                animate={reduceMotion ? {} : { scale: [1, 0.86, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <MousePointerClick size={12} strokeWidth={2.6} />
              </motion.span>

              {/* The count, lifted out of the sentence — a number is the
                  strongest promise of unseen content this line can make. */}
              {hintTail !== undefined && (
                <span
                  className="relative hidden rounded-full px-1.5 py-px font-mono text-[10px] font-bold leading-none tabular-nums sm:inline-block"
                  style={{ color: accent, background: `${accent}24`, border: `1px solid ${accent}47` }}
                >
                  {tabs.length}
                </span>
              )}

              <span className="relative hidden text-[11px] font-bold uppercase leading-none tracking-[0.11em] text-white/90 sm:inline">
                {hintTail ?? hintLead}
              </span>
              <span className="relative text-[10.5px] font-bold uppercase leading-none tracking-[0.11em] text-white/90 sm:hidden">
                {copy.hintCompact}
              </span>

              {/* Caret — turns "switch" into "switch THAT". Centred under the
                  pill on phones, over the first tab once the group is
                  left-aligned. */}
              <span
                aria-hidden="true"
                className="absolute -bottom-[5px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r sm:left-7 sm:translate-x-0"
                style={{ borderColor: `${accent}59`, background: "rgb(12,12,22)" }}
              />
            </motion.span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── The control ── */}
      <div
        ref={groupRef}
        role="tablist"
        aria-label={copy.ariaLabel}
        onKeyDown={handleKeyDown}
        className="relative grid w-full grid-cols-3 gap-1 rounded-2xl border p-1.5 sm:flex sm:w-auto sm:items-center sm:gap-2"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* One-shot sweep: tells the eye the whole group is one live control.
            Clipped by its own wrapper so it never cuts off the unseen dots.

            The x values look oversized because a translateX percentage is
            relative to THE BAND'S OWN WIDTH, not the control's. The band is
            w-1/3, so clearing the full width needs 300%, not 100% — anything
            less leaves the highlight parked on screen when the run ends. */}
        {nudge && (
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <motion.span
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "320%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.15, delay: 0.35, ease: [0.4, 0, 0.2, 1], repeat: 1, repeatDelay: 2.1 }}
              className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/[0.14] to-transparent"
              style={{ skewX: "-18deg" }}
            />
          </span>
        )}

        {tabs.map((tab, i) => {
          const isActive = tab.id === activeTab;
          const isSeen = seenTabs.includes(tab.id);
          const isHot = hovered === tab.id && !isActive;

          return (
            <motion.button
              key={tab.id}
              ref={(el) => { btnRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`service-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls="services-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onHoverStart={() => setHovered(tab.id)}
              onHoverEnd={() => setHovered(null)}
              whileHover={isActive ? undefined : { y: -2, transition: { duration: 0.18, ease: "easeOut" } }}
              whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
              /* Unopened tabs lift twice on entry, then rest. The stagger and
                 repeat live INSIDE this value, never on a shared `transition`
                 prop — there they would also delay the hover and tap lifts. */
              animate={
                nudge && !isActive && !isSeen
                  ? {
                      y: [0, -5, 0],
                      transition: {
                        duration: 0.55,
                        delay: 0.45 + i * 0.13,
                        repeat: 1,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      },
                    }
                  : { y: 0, transition: { duration: 0.2, ease: "easeOut" } }
              }
              /* Explicit property list, not the blanket `transition` utility:
                 that one includes `transform`, which would fight the y-lift
                 framer-motion drives on this same element. */
              className="relative flex w-full flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-bold capitalize leading-tight select-none transition-[color,background-color,border-color,box-shadow] duration-200 min-[400px]:text-[11px] min-[500px]:text-xs sm:w-auto sm:flex-row sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-sm"
              style={{
                color: isActive || isHot ? "#fff" : "rgba(255,255,255,0.62)",
                background: isActive
                  ? "transparent"
                  : isHot
                    ? `${tab.color}1f`
                    : "rgba(255,255,255,0.045)",
                border: `1px solid ${
                  isActive ? "transparent" : isHot ? `${tab.color}66` : "rgba(255,255,255,0.10)"
                }`,
                boxShadow: isHot ? `0 8px 20px ${tab.glow}` : "none",
              }}
            >
              {/* Active pill — unchanged, still shared via layoutId */}
              {isActive && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg,${tab.color}22,${tab.color}44)`,
                    border: `1px solid ${tab.color}55`,
                    boxShadow: `0 0 20px ${tab.glow}`,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              {/* Unseen marker — the cue that outlives the entrance animation */}
              {!isActive && !isSeen && (
                <span className="absolute -right-0.5 -top-0.5 z-20 flex h-2 w-2" aria-hidden="true">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 motion-reduce:animate-none"
                    style={{ background: tab.color }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: tab.color, boxShadow: `0 0 8px ${tab.color}` }}
                  />
                </span>
              )}

              <span className="relative z-10">{tab.label}</span>

              {/* Information scent: how much is waiting behind this tab */}
              <span
                className="relative z-10 rounded-full px-1.5 py-px font-mono text-[9px] font-bold leading-none tabular-nums transition-colors duration-200 sm:text-[10px]"
                style={{
                  color: isActive ? "#fff" : tab.color,
                  background: isActive ? "rgba(255,255,255,0.16)" : `${tab.color}1f`,
                  border: `1px solid ${isActive ? "rgba(255,255,255,0.20)" : `${tab.color}3d`}`,
                }}
              >
                {counts[tab.id] ?? 0}
              </span>

              {!isActive && !isSeen && <span className="sr-only">{copy.unseenLabel}</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Root ServiceCards Component ──────────────────────────────────────────────
const DEFAULT_TAB = "development";

const ServiceCards = () => {
  const modalRootRef = useRef(null);
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB);
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState("stack");

  /* Which categories the visitor has actually opened. Drives the "unseen" dots
     and the entrance nudge — the tab we land on counts as already seen. */
  const [seenTabs, setSeenTabs] = useState([DEFAULT_TAB]);
  const hasSwitched = seenTabs.length > 1;

  const activeTab = TABS.find((t) => t.id === activeTabId);
  const activeServiceList = (services[activeTabId] || []).map((s) => ({ ...s, category: activeTabId }));

  /* How many cards sit behind each tab — the promise printed on the tab. */
  const tabCounts = useMemo(
    () => Object.fromEntries(TABS.map((t) => [t.id, (services[t.id] || []).length])),
    [],
  );

  const handleLearnMore = (service) => {
    setSelectedService(service);
    if (modalRootRef.current) modalRootRef.current.toggle();
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTabId) return;
    setActiveTabId(tabId);
    setSeenTabs((prev) => (prev.includes(tabId) ? prev : [...prev, tabId]));
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10">

      {/* ── Tab + View Toggle ────────────────────────────── */}
      {/* `items-end` keeps the view toggle level with the bottom of the tab
          group whether or not the hint line above it is still showing. */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <TabSelector
          tabs={TABS}
          activeTab={activeTabId}
          onTabChange={handleTabChange}
          counts={tabCounts}
          seenTabs={seenTabs}
          showHint={!hasSwitched}
          copy={CONTENT.tabs}
        />

        <div
          className="flex shrink-0 items-center gap-1 p-1 rounded-xl border"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {[
            {
              mode: "stack",
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
              label: CONTENT.viewModes.stack
            },
            {
              mode: "grid",
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
              label: CONTENT.viewModes.grid
            }
          ].map(
            ({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-200"
                style={{
                  background:   viewMode === mode ? `${activeTab.color}25` : "transparent",
                  color:        viewMode === mode ? activeTab.color : "rgba(255,255,255,0.35)",
                  border:       viewMode === mode ? `1px solid ${activeTab.color}40` : "1px solid transparent",
                }}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Cards Area ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTabId}-${viewMode}`}
          id="services-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${activeTabId}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {viewMode === "stack" ? (
            <CardStack
              serviceList={activeServiceList}
              accent={activeTab.color}
              glow={activeTab.glow}
              onLearnMore={handleLearnMore}
            />
          ) : (
            <ServiceGrid
              serviceList={activeServiceList}
              accent={activeTab.color}
              glow={activeTab.glow}
              onLearnMore={handleLearnMore}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Count badge ──────────────────────────────────── */}
      <div className="flex justify-center">
        <span
          className="text-xs font-mono px-4 py-2 rounded-full border"
          style={{ color: activeTab.color, borderColor: `${activeTab.color}33`, background: `${activeTab.color}0a` }}
        >
          {activeServiceList.length} services in {activeTab.label}
        </span>
      </div>

      {/* ── Modal ────────────────────────────────────────── */}
      <Modal ref={modalRootRef}>
        {selectedService && (() => {
          const accent = activeTab.color;
          const glow   = activeTab.glow;
          return (
            <div className="space-y-6">

              {/* ── Service header ── */}
              <div className="flex items-center gap-4 pb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                {/* Logo */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                  style={{ background: `${accent}14`, border: `1px solid ${accent}33` }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${accent}55, transparent 70%)`, opacity: 0.4 }}
                  />
                  <Image
                    className="w-9 h-9 object-contain relative z-10"
                    src={selectedService.logo}
                    alt={selectedService.title}
                    width={80}
                    height={80}
                    sizes="36px"
                  />
                </div>

                {/* Title + tab pill */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <span
                    className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border"
                    style={{ color: accent, borderColor: `${accent}33`, background: `${accent}0f` }}
                  >
                    {selectedService.category}
                  </span>
                  <h3
                    className="text-white text-lg sm:text-xl font-extrabold capitalize leading-tight"
                    style={{ textShadow: `0 0 18px ${accent}44` }}
                  >
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* ── Intro ── */}
              <p
                className="text-sm sm:text-base font-semibold leading-relaxed"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #a855f7)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {selectedService.learnMore?.intro}
              </p>

              {/* ── Points ── */}
              <ul className="space-y-3">
                {selectedService.learnMore?.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {/* Accent dot */}
                    <span
                      className="mt-[5px] w-[6px] h-[6px] rounded-full flex-shrink-0"
                      style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
                    />
                    <span className="text-neutral-300 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              {/* ── Conclusion ── */}
              <div
                className="rounded-2xl p-4 border"
                style={{ background: `${accent}08`, borderColor: `${accent}22` }}
              >
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed italic">
                  {selectedService.learnMore?.conclusion}
                </p>
              </div>

            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default ServiceCards;

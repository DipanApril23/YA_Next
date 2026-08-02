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

// ─── Card content (only rendered for the front card) ─────────────────────────
const CardFace = ({ service, accent, glow, onLearnMore }) => (
  <div
    className="w-full h-full rounded-[28px] border flex flex-col overflow-hidden"
    style={{
      background: "linear-gradient(145deg,rgba(18,18,28,0.97) 0%,rgba(10,10,20,0.99) 100%)",
      borderColor: `${accent}55`,
      boxShadow: `0 0 0 1px ${accent}22, 0 28px 70px rgba(0,0,0,0.75), 0 0 50px ${glow}`,
    }}
  >
    {/* ── Full-width logo banner ── */}
    <div
      className="relative w-full flex items-center justify-center flex-shrink-0"
      style={{
        height: "clamp(130px, 28%, 165px)",
        background: `linear-gradient(135deg, ${accent}1a 0%, rgba(8,8,18,0.7) 100%)`,
        borderBottom: `1px solid ${accent}22`,
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
        sizes="(max-width: 640px) 60vw, 220px"
        className="object-contain relative z-10"
        style={{ maxHeight: "110px", width: "auto", maxWidth: "80%" }}
      />

      {/* Category badge top-right */}
      <span
        className="absolute top-3 right-3 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border"
        style={{ color: accent, borderColor: `${accent}44`, background: "rgba(8,8,18,0.88)" }}
      >
        {service.category}
      </span>
    </div>
    {/* ── Body + Footer ── */}
    <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
      {/* Body */}
      <div className="space-y-2">
        <h3
          className="text-white text-base sm:text-lg font-extrabold tracking-tight leading-snug capitalize"
          style={{ textShadow: `0 0 20px ${accent}44` }}
        >
          {service.title}
        </h3>
        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
          {service.description}
        </p>
      </div>

      {/* Footer */}
      <div
        className="pt-4 mt-3 flex items-center justify-between border-t"
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

      {/* ── Stack viewport ─────────────────────────────────── */}
      <div
        className="relative w-full"
        style={{ height: "clamp(320px, 50vw, 430px)" }}
      >
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

      {/* ── Training-wheel hint (removed after the first switch) ── */}
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-1.5 px-1 text-center text-[9.5px] font-bold uppercase tracking-[0.13em] text-white/45 min-[400px]:text-[10px] sm:text-left sm:text-[11px]"
          >
            <motion.span
              aria-hidden="true"
              className="shrink-0 text-white/60"
              animate={reduceMotion ? {} : { scale: [1, 0.86, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <MousePointerClick size={13} strokeWidth={2.4} />
            </motion.span>
            <span className="hidden sm:inline">
              {copy.hint.replace("{count}", tabs.length)}
            </span>
            <span className="sm:hidden">{copy.hintCompact}</span>
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

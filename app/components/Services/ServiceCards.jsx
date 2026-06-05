"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "../../assets";
import { Modal } from "..";

// ─── Tab Configuration ────────────────────────────────────────────────────────
const TABS = [
  { id: "marketing",   label: "Marketing",   color: "#ff007f", glow: "rgba(255,0,127,0.35)"  },
  { id: "development", label: "Development", color: "#00f5d4", glow: "rgba(0,245,212,0.35)"  },
  { id: "designing",   label: "Designing",   color: "#a855f7", glow: "rgba(168,85,247,0.35)" },
];

// ─── Fanning offsets (stack positions 0=front … 3=back) ──────────────────────
const OFFSETS = [
  { x: 0,  y: 0,  rotate: 0,   scale: 1,    zIndex: 50, opacity: 1    },
  { x: 18, y: 14, rotate: 5,   scale: 0.95, zIndex: 40, opacity: 0.85 },
  { x: 32, y: 24, rotate: 9,   scale: 0.90, zIndex: 30, opacity: 0.65 },
  { x: 44, y: 32, rotate: 12,  scale: 0.85, zIndex: 20, opacity: 0.45 },
];

// ─── Card content (only rendered for the front card) ─────────────────────────
const CardFace = ({ service, accent, glow, onLearnMore }) => (
  <div
    className="w-full h-full rounded-[28px] border flex flex-col justify-between p-6 sm:p-8"
    style={{
      background: "linear-gradient(145deg,rgba(18,18,28,0.97) 0%,rgba(10,10,20,0.99) 100%)",
      borderColor: `${accent}55`,
      boxShadow: `0 0 0 1px ${accent}22, 0 28px 70px rgba(0,0,0,0.75), 0 0 50px ${glow}`,
    }}
  >
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center relative overflow-hidden flex-shrink-0"
        style={{ borderColor: `${accent}33`, background: `${accent}10` }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 40% 40%, ${accent}88, transparent 70%)` }}
        />
        <Image
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain relative z-10"
          src={service.logo}
          alt={service.title}
          width={80}
          height={80}
        />
      </div>
      <span
        className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border flex-shrink-0"
        style={{ color: accent, borderColor: `${accent}33`, background: `${accent}0f` }}
      >
        {service.category}
      </span>
    </div>

    {/* Body */}
    <div className="flex-1 mt-5 space-y-3">
      <h3
        className="text-white text-lg sm:text-xl font-extrabold tracking-tight leading-snug capitalize"
        style={{ textShadow: `0 0 20px ${accent}44` }}
      >
        {service.title}
      </h3>
      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-4">
        {service.description}
      </p>
    </div>

    {/* Footer */}
    <div
      className="pt-5 mt-4 flex items-center justify-between border-t"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {serviceList.map((service, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.055, duration: 0.38 }}
          onHoverStart={() => setHovered(i)}
          onHoverEnd={() => setHovered(null)}
          className="relative rounded-2xl border p-5 cursor-pointer overflow-hidden"
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
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
            >
              <Image className="w-6 h-6 object-contain" src={service.logo} alt={service.title} width={48} height={48} />
            </div>
            <div className="min-w-0 flex-1">
              <h4
                className="text-sm font-bold capitalize leading-tight truncate transition-colors duration-200"
                style={{ color: hovered === i ? accent : "white" }}
              >
                {service.title}
              </h4>
              <p className="text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                {service.description}
              </p>
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
const TabSelector = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex items-center justify-center">
    <div
      className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl border"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold capitalize select-none transition-colors duration-200"
            style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}
          >
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
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  </div>
);

// ─── Root ServiceCards Component ──────────────────────────────────────────────
const ServiceCards = () => {
  const modalRootRef = useRef(null);
  const [activeTabId, setActiveTabId] = useState("development");
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState("stack");

  const activeTab = TABS.find((t) => t.id === activeTabId);
  const activeServiceList = (services[activeTabId] || []).map((s) => ({ ...s, category: activeTabId }));

  const handleLearnMore = (service) => {
    setSelectedService(service);
    if (modalRootRef.current) modalRootRef.current.toggle();
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTabId) return;
    setActiveTabId(tabId);
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10">

      {/* ── Tab + View Toggle ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <TabSelector tabs={TABS} activeTab={activeTabId} onTabChange={handleTabChange} />

        <div
          className="flex items-center gap-1 p-1 rounded-xl border"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {[{ mode: "stack", icon: "⊞", label: "Stack" }, { mode: "grid", icon: "⊟", label: "Grid" }].map(
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
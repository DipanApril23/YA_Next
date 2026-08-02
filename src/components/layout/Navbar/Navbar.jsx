"use client";

// ─── Navbar ───────────────────────────────────────────────────────────
// Fixed, pill-shaped top navigation. Design language from the Elogix navbar
// (pill, scroll-shrink + shadow, gradient scroll-progress bar, hover-intent
// menus, icon tiles + growing accent bar, shimmer CTA) — themed dark.
//
// INFINITE-DEPTH MENU ENGINE
// The menu is fully recursive and handles ANY nesting depth from the silo
// tree in src/data/nav.js. There is no special-cased "mega menu": one
// <FlyoutPanel> renders a level; a branch item opens the next level as a
// CASCADING FLYOUT (premium-agency pattern) that appears below on the first
// level and always to the RIGHT on every deeper level — consistent for every
// top item (Digital Marketing Solutions AND Industry) — flipping left only if
// it would run off-screen. The first-level panel anchors to the trigger's near
// edge (right-of-centre triggers anchor right) so the rightward cascade always
// has room. A pure-leaf list longer than four rows wraps into columns of four.
// Opens on hover (with intent delay) AND on click, so it works for mouse,
// trackpad and keyboard.
//
// HOW IT STAYS ON SCREEN AT EVERY WIDTH
// The deepest branch of the silo (Industry → Legal & Compliance → a vertical →
// its eight service pages) is THREE panels wide, which does not fit at 1180px
// if every panel takes its full 19rem. So a panel is never sized on its own:
// when a row is about to open, it measures the room left on the cascade side
// and DIVIDES it between the panels still to come (`panelDepth` says how many),
// clamped to a readable minimum. Every level therefore shrinks together and the
// last one lands inside the viewport instead of flipping back over its own
// ancestors. Only when even a shared slice would be unreadable does a panel
// flip to the other side. A leaf list adds columns solely with room to spare,
// and its height is capped to what is left below the row. All of it is measured
// from the row BEFORE the panel mounts, so the panel is correct on its first
// frame — no post-render reposition, no visible jump.
//
// On mobile the same tree renders as a nested ACCORDION with single-open
// behaviour at every level: opening one item auto-closes its siblings. Deeper
// levels indent less and tighten their padding, so a fourth-level label still
// gets a readable line on a small phone.
//
// Uses framer-motion's lightweight `m` (the app is wrapped in <LazyMotion>).

import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState, useRef, useCallback, createContext, useContext } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Sparkles } from "lucide-react";

import { NAV_ITEMS, NAV_CONTENT, EASE_SMOOTH, SPRING_FAST } from "@/data";
import brandLogo from "@/assets/logo/brandlogo.webp";
import "./navbar.css";

/* Timing comes from the shared motion tokens (src/data/config/motion.json) so
   every menu in the site eases identically. */
const SMOOTH_EASE = EASE_SMOOTH;
const FAST_SPRING = SPRING_FAST;

const hasChildren = (n) => Boolean(n?.children?.length);

/* Lets any leaf, at any depth, close the whole open menu tree when clicked. */
const MenuCloseContext = createContext(() => {});

/* Cascade direction. Every sublist opens to the RIGHT (consistent for every
   top item), so the value is always "right"; a per-panel flip flips a single
   panel left only if it would otherwise run off-screen. Room for the rightward
   cascade is created by anchoring the first-level panel (see `align`). */
const MenuSideContext = createContext("right");

/* ─────────────────────────── panel geometry ───────────────────────────
   Pixels, because the panels are measured and placed in pixels. Keep these in
   step with the classes they mirror — the comment on each says which. */
const PANEL_MAX = 304; // 19rem  — a full-width single column
const PANEL_MIN = 208; // 13rem  — narrower than this a row stops being readable
const COL_W = 264; // 16.5rem — one column of a multi-column leaf panel
const COL_GAP = 4; // gap-1 between those columns
const SHELL_PAD = 16; // p-2, both sides
const CASCADE_GAP = 6; // pl-1.5 / pr-1.5 — the hover bridge to a sub-panel
const EDGE = 12; // breathing room against the viewport edge
const COL_MAX = 4; // rows per column before a pure-leaf list wraps
const MAX_VH = 0.78; // tallest a scrolling panel may get

const clampW = (w) => Math.max(PANEL_MIN, Math.min(PANEL_MAX, Math.floor(w)));

/* What one panel may take when `levels` panels have to share `room`. */
const share = (room, levels) => (room - (levels - 1) * CASCADE_GAP) / levels;

/* How many panels deep a branch goes. The cascade budgets width for all of them
   up front so the last level never has to overlap its ancestors. Cached on the
   items array — the silo is built once at module load, so this runs once. */
const depthCache = new WeakMap();
function panelDepth(items) {
  const cached = depthCache.get(items);
  if (cached) return cached;
  let d = 1;
  for (const item of items) {
    if (hasChildren(item)) d = Math.max(d, 1 + panelDepth(item.children));
  }
  depthCache.set(items, d);
  return d;
}

const toColumns = (arr, size) => {
  const cols = [];
  for (let i = 0; i < arr.length; i += size) cols.push(arr.slice(i, i + size));
  return cols;
};

/* Columns are a bonus, never a cause of overflow: a leaf list wraps into at
   most ceil(n / COL_MAX) columns, and only as many as `room` actually holds. */
function fitColumns(room, colW, count) {
  const wanted = Math.ceil(count / COL_MAX);
  if (wanted < 2) return 1;
  const fits = Math.floor((room - SHELL_PAD + COL_GAP) / (colW + COL_GAP));
  return Math.max(1, Math.min(wanted, fits));
}

/* ─────────────────────────── shared row content ─────────────────────────── */
function RowInner({ item, branch, compact }) {
  const Icon = item.icon;
  return (
    <>
      {/* Growing accent bar on hover */}
      <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out group-hover:h-[70%] group-data-[open=true]:h-[70%]" />

      {Icon && (
        <span
          className={`mt-0.5 flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-sm transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-[0_4px_12px_rgba(139,92,246,0.25)] group-hover:scale-110 group-hover:-rotate-6 ${compact ? "h-7 w-7" : "h-8 w-8"}`}
        >
          <Icon className={`text-violet-300 ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
        </span>
      )}

      <span className="flex min-w-0 flex-1 flex-col gap-0.5 pr-1">
        <span className="flex items-center gap-1.5">
          <span className={`font-semibold leading-snug text-white/90 transition-colors duration-200 group-hover:text-white ${compact ? "text-[12px]" : "text-[12.5px]"}`}>
            {item.label}
          </span>
          {item.comingSoon && (
            <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-px text-[8.5px] font-bold uppercase tracking-wider text-white/40">
              Soon
            </span>
          )}
        </span>
        {item.desc && <span className="text-[10.5px] leading-snug text-white/45">{item.desc}</span>}
      </span>

      {/* Branch → chevron pointing to its flyout; leaf → arrow; soon → nothing */}
      {branch ? (
        <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-white/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-violet-300 group-data-[open=true]:text-violet-300" />
      ) : (
        !item.comingSoon && (
          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 -translate-x-1 translate-y-1 text-violet-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
        )
      )}
    </>
  );
}

/* ─────────────────────────── one recursive row ───────────────────────────
   A leaf (Link / inert coming-soon), or a branch that opens a nested flyout
   on hover-intent + click, sized and sided from a measurement of the row. */
function FlyoutRow({ item, depth }) {
  const branch = hasChildren(item);
  const close = useContext(MenuCloseContext);
  const side = useContext(MenuSideContext); // "left" | "right" — chosen at the top

  const [open, setOpen] = useState(false);
  const [box, setBox] = useState(null); // { left, width, room, maxH }
  const rowRef = useRef(null);
  const openT = useRef(null);
  const closeT = useRef(null);

  const clearTimers = () => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
  };

  /* Measured from the ROW — which is already on screen — at the moment the menu
     is asked to open, so the sub-panel is placed and sized on its first frame.
     The room left on the cascade side is divided between every panel still to
     come below this one, so the whole chain shrinks together and stays inside
     the viewport rather than the last level flipping back over its ancestors. */
  const place = useCallback(() => {
    const el = rowRef.current;
    if (!el || !branch) return;

    const r = el.getBoundingClientRect();
    const { innerWidth: vw, innerHeight: vh } = window;
    const levels = panelDepth(item.children);

    const roomRight = vw - r.right - CASCADE_GAP - EDGE;
    const roomLeft = r.left - CASCADE_GAP - EDGE;
    const preferLeft = side === "left";
    const preferred = preferLeft ? roomLeft : roomRight;
    const other = preferLeft ? roomRight : roomLeft;

    // Flip only as a last resort: the cascade side cannot seat a readable panel
    // and the other side genuinely does better.
    const left =
      share(preferred, levels) < PANEL_MIN && other > preferred ? !preferLeft : preferLeft;
    const room = left ? roomLeft : roomRight;

    setBox({
      left,
      room,
      width: clampW(share(room, levels)),
      maxH: Math.min(Math.round(vh * MAX_VH), vh - r.top - EDGE),
    });
  }, [branch, item.children, side]);

  const scheduleOpen = () => {
    if (!branch) return;
    clearTimers();
    openT.current = setTimeout(() => {
      place();
      setOpen(true);
    }, 70);
  };
  const scheduleClose = () => {
    if (!branch) return;
    clearTimers();
    closeT.current = setTimeout(() => setOpen(false), 120);
  };
  const toggle = () => {
    if (!open) place();
    setOpen((o) => !o);
  };
  useEffect(() => () => clearTimers(), []);

  const rowCls =
    "group relative flex w-full items-start gap-2.5 rounded-[14px] px-2.5 py-2.5 text-left transition-colors duration-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 data-[open=true]:bg-white/[0.06]";

  if (!branch) {
    if (item.comingSoon || !item.href) {
      return (
        <div className={`${rowCls} cursor-default`} aria-disabled="true">
          <RowInner item={item} branch={false} compact />
        </div>
      );
    }
    return (
      <Link href={item.href} onClick={close} className={rowCls}>
        <RowInner item={item} branch={false} compact />
      </Link>
    );
  }

  // Before the first measurement, fall back to the cascade side.
  const openLeft = box ? box.left : side === "left";

  return (
    <div ref={rowRef} className="relative" onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        data-open={open}
        className={rowCls}
      >
        <RowInner item={item} branch compact />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, x: openLeft ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: openLeft ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: SMOOTH_EASE }}
            // top-aligned to the row; opens toward the cascade side. The side
            // padding is part of the element so there's no dead hover gap.
            className={`absolute top-0 z-50 ${openLeft ? "right-full pr-1.5" : "left-full pl-1.5"}`}
          >
            <FlyoutPanel
              items={item.children}
              depth={depth + 1}
              width={box?.width}
              room={box?.room}
              maxH={box?.maxH}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────── one panel (a level) ───────────────────────────
   `width` is the slice of the viewport this level was budgeted (see the header
   note); `room` is everything still free on its side, which decides how many
   columns a pure-leaf list may wrap into; `maxH` is what is left below the row.

   A panel that contains flyout rows may NOT clip (its children escape it), so
   only leaf-only lists get a scroll cap — this keeps infinite depth working. */
function FlyoutPanel({ items, depth, width = PANEL_MAX, room = PANEL_MAX, maxH }) {
  const anyBranch = items.some(hasChildren);
  const colW = Math.min(width, COL_W);
  const cols = anyBranch ? 1 : fitColumns(room, colW, items.length);
  const shell =
    "rounded-[20px] border border-white/10 bg-[#0d0d11] p-2 shadow-[0_20px_48px_rgba(139,92,246,0.16),0_10px_24px_rgba(0,0,0,0.55)]";

  if (cols > 1) {
    return (
      <div className={`${shell} flex max-w-[calc(100vw-1.5rem)] gap-1 overflow-visible`} role="menu">
        {toColumns(items, Math.ceil(items.length / cols)).map((col, i) => (
          <div key={i} className="flex flex-col" style={{ width: colW }}>
            {col.map((child) => (
              <FlyoutRow key={child.label} item={child} depth={depth} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${shell} max-w-[calc(100vw-1.5rem)] ${
        anyBranch ? "overflow-visible" : "overflow-y-auto overscroll-contain"
      }`}
      style={{ width, maxHeight: anyBranch ? undefined : maxH }}
      role="menu"
    >
      {items.map((child) => (
        <FlyoutRow key={child.label} item={child} depth={depth} />
      ))}
    </div>
  );
}

/* ─────────────────────────── top-level dropdown ───────────────────────────
   The first level opens BELOW the nav item, anchored to its near edge: a
   right-of-centre trigger anchors RIGHT (panel extends left) so the rightward
   cascade has room; a left-of-centre trigger anchors LEFT. Deeper rows then
   cascade to the right via FlyoutRow. `box` is measured on the trigger. */
function TopDropdown({ item, isOpen, box }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <m.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: SMOOTH_EASE }}
          className={`absolute top-full z-50 mt-3.5 ${box?.align === "right" ? "right-0" : "left-0"}`}
        >
          <FlyoutPanel
            items={item.children}
            depth={0}
            width={box?.width}
            room={box?.room}
            maxH={box?.maxH}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── mobile: single-open list ───────────────────────────
   Each level owns one `openKey`; opening a sibling closes the others. Recurses
   for infinite depth. Past the second level the indent tightens — four levels
   down the label needs the width more than the tree needs its guide rail. */
function MobileList({ items, depth, onNavigate }) {
  const [openKey, setOpenKey] = useState(null);
  const nest =
    depth === 0
      ? "space-y-0.5"
      : `mb-1.5 space-y-0.5 border-l border-white/10 pl-1.5 ${depth === 1 ? "ml-3" : "ml-1.5"}`;

  return (
    <div className={nest}>
      {items.map((item) => (
        <MobileNode
          key={item.label}
          item={item}
          depth={depth}
          isOpen={openKey === item.label}
          onToggle={() => setOpenKey((k) => (k === item.label ? null : item.label))}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

function MobileNode({ item, depth, isOpen, onToggle, onNavigate }) {
  const Icon = item.icon;
  const branch = hasChildren(item);

  // Deep rows trade padding and half a point of type for line length.
  const pad = depth >= 2 ? "gap-2 px-2" : "gap-2.5 px-3";
  const type = depth >= 3 ? "text-[12px]" : "text-[12.5px]";

  if (!branch) {
    const inner = (
      <>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-violet-300/80" />}
        <span className={`flex-1 font-medium leading-snug text-white/75 ${type}`}>{item.label}</span>
        {item.comingSoon ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-px text-[8.5px] font-bold uppercase tracking-wider text-white/40">
            Soon
          </span>
        ) : (
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-violet-400/70" />
        )}
      </>
    );
    const rowCls = `group flex items-center rounded-xl py-2 transition-colors duration-200 hover:bg-white/5 ${pad}`;
    return item.comingSoon || !item.href ? (
      <div className={`${rowCls} cursor-default`}>{inner}</div>
    ) : (
      <Link href={item.href} onClick={onNavigate} className={rowCls}>
        {inner}
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`group flex w-full items-center rounded-xl py-2.5 text-left transition-colors duration-200 hover:bg-white/5 ${pad}`}
      >
        {Icon && depth > 0 && <Icon className="h-3.5 w-3.5 shrink-0 text-violet-300/80" />}
        <span
          className={`flex-1 font-semibold leading-snug text-white/85 group-hover:text-white ${depth === 0 ? "text-[13px]" : type}`}
        >
          {item.label}
        </span>
        <m.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={FAST_SPRING}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isOpen ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-white/40"}`}
        >
          <ChevronDown className="h-3 w-3" />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: SMOOTH_EASE }}
            className="overflow-hidden"
          >
            {/* Nested level — its own single-open state (siblings auto-close). */}
            <MobileList items={item.children} depth={depth + 1} onNavigate={onNavigate} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────── navbar ─────────────────────────── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [box, setBox] = useState(null); // { align, width, room, maxH }

  const navRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const { scrollYProgress } = useScroll();

  /* First-level anchoring, measured on the trigger. A right-of-centre trigger
     anchors RIGHT: the panel then grows leftward and the whole gap between the
     trigger and the viewport edge stays free for the rightward cascade, so that
     panel may take its full width. Anchored LEFT it eats into that gap instead
     and has to share it with the levels below (`panelDepth`). */
  const measureTrigger = useCallback((el, item) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const { innerWidth: vw, innerHeight: vh } = window;
    const alignRight = r.left + r.width / 2 > vw / 2;
    const room = alignRight ? r.right - EDGE : vw - r.left - EDGE;

    setBox({
      align: alignRight ? "right" : "left",
      room,
      width: clampW(alignRight ? room : share(room, panelDepth(item.children))),
      maxH: Math.min(Math.round(vh * MAX_VH), vh - r.bottom - 14 - EDGE),
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on outside click.
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close everything on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // A resize invalidates every measurement the open cascade was built from, and
  // crossing into desktop makes the drawer redundant — drop both.
  useEffect(() => {
    const onResize = () => {
      setOpenDropdown(null);
      if (window.innerWidth >= 1180) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openMenu = useCallback(
    (item, el) => {
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
      measureTrigger(el, item);
      setOpenDropdown(item.label);
    },
    [measureTrigger],
  );
  const closeMenu = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 140);
  }, []);
  const closeAll = useCallback(() => setOpenDropdown(null), []);
  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Scroll progress bar */}
      <m.div
        className="fixed inset-x-0 top-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        style={{ scaleX: scrollYProgress }}
      />

      <header ref={navRef} className="nav-drop fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
        {/* ── Pill container ── */}
        <m.div
          animate={{
            height: scrolled ? 56 : 68,
            backgroundColor: scrolled || mobileOpen ? "rgba(10, 10, 12, 0.96)" : "rgba(10, 10, 12, 0.78)",
            boxShadow: scrolled
              ? "0 8px 32px -4px rgba(139,92,246,0.2), 0 2px 12px -2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)"
              : "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
          transition={{ duration: 0.4, ease: SMOOTH_EASE }}
          className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 backdrop-blur-2xl sm:px-5"
        >
          {/* ── Logo ── */}
          <Link href={NAV_CONTENT.brandHref} className="group relative z-20 flex items-center">
            <m.div animate={{ scale: scrolled ? 0.93 : 1 }} transition={{ duration: 0.3 }} className="relative">
              <Image
                src={brandLogo}
                alt={NAV_CONTENT.brandLogoAlt}
                priority
                sizes="150px"
                className={`object-contain transition-all duration-300 ${scrolled ? "h-[34px] w-auto" : "h-[40px] w-auto"}`}
              />
            </m.div>
          </Link>

          {/* ── Desktop nav ── */}
          <MenuCloseContext.Provider value={closeAll}>
           <MenuSideContext.Provider value="right">
            <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 min-[1180px]:flex">
              {NAV_ITEMS.map((item) => {
                const branch = hasChildren(item);
                const isOpen = openDropdown === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={(e) => branch && openMenu(item, e.currentTarget)}
                    onMouseLeave={closeMenu}
                  >
                    {branch ? (
                      <button
                        onClick={(e) => {
                          measureTrigger(e.currentTarget, item);
                          setOpenDropdown((cur) => (cur === item.label ? null : item.label));
                        }}
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                        className="nav-underline-item group relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-medium text-white/70 transition-colors duration-200 hover:text-white"
                      >
                        <span>{item.label}</span>
                        <m.span animate={{ rotate: isOpen ? 180 : 0 }} transition={FAST_SPRING}>
                          <ChevronDown className="h-3.5 w-3.5 text-white/40 transition-colors duration-200 group-hover:text-violet-300" />
                        </m.span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="nav-underline-item group relative block whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-medium text-white/70 transition-colors duration-200 hover:text-white"
                      >
                        <span>{item.label}</span>
                      </Link>
                    )}

                    {/* Pointer arrow — centered on the trigger for either anchor. */}
                    {branch && isOpen && (
                      <span className="pointer-events-none absolute left-1/2 top-full z-[60] mt-[9px] h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-[#0d0d11]" />
                    )}
                    {branch && <TopDropdown item={item} isOpen={isOpen} box={box} />}
                  </div>
                );
              })}
            </nav>
           </MenuSideContext.Provider>
          </MenuCloseContext.Provider>

          {/* ── Desktop CTA ── */}
          <div className="hidden items-center pr-0.5 min-[1180px]:flex">
            <m.a
              whileHover={{ scale: 1.03, y: -0.5 }}
              whileTap={{ scale: 0.97 }}
              animate={{ paddingTop: scrolled ? "7px" : "9px", paddingBottom: scrolled ? "7px" : "9px" }}
              transition={FAST_SPRING}
              href={NAV_CONTENT.cta.href}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 px-5 text-[12.5px] font-semibold text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)]"
            >
              <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                {NAV_CONTENT.cta.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </m.a>
          </div>

          {/* ── Hamburger → Cross ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={NAV_CONTENT.menuToggleLabel}
            aria-expanded={mobileOpen}
            className="relative z-[90] flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:bg-white/5 min-[1180px]:hidden"
          >
            <div className="relative flex h-3 w-4 flex-col justify-between">
              <m.span animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="h-[2px] w-4 origin-center rounded-full bg-white" />
              <m.span animate={mobileOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }} className="h-[2px] w-4 rounded-full bg-white" />
              <m.span animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="h-[2px] w-4 origin-center rounded-full bg-white" />
            </div>
          </button>

          {/* ── Mobile drawer ── */}
          <AnimatePresence>
            {mobileOpen && (
              <m.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.22, ease: SMOOTH_EASE }}
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-white/10 bg-[#0d0d11f2] p-2.5 shadow-[0_20px_50px_rgba(139,92,246,0.16),0_6px_20px_rgba(0,0,0,0.6)] backdrop-blur-2xl min-[1180px]:hidden"
              >
                <div className="max-h-[68vh] overflow-y-auto overscroll-contain pr-0.5">
                  <MobileList items={NAV_ITEMS} depth={0} onNavigate={closeDrawer} />
                </div>

                <div className="mt-2 border-t border-white/10 pt-2">
                  <a
                    href={NAV_CONTENT.cta.href}
                    onClick={closeDrawer}
                    className="group relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 py-2.5 text-[12.5px] font-semibold text-white shadow-lg shadow-purple-500/20"
                  >
                    <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative z-10">{NAV_CONTENT.cta.label}</span>
                    <Sparkles className="relative z-10 h-3.5 w-3.5 text-pink-200" />
                  </a>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </header>
    </>
  );
}

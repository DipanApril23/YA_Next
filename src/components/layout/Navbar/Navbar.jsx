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
// On mobile the same tree renders as a nested ACCORDION with single-open
// behaviour at every level: opening one item auto-closes its siblings.
//
// Uses framer-motion's lightweight `m` (the app is wrapped in <LazyMotion>).

import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence, useScroll } from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Sparkles } from "lucide-react";

import { NAV_ITEMS, NAV_CONTENT } from "@/data";
import brandLogo from "@/assets/logo/brandlogo.webp";
import "./navbar.css";

const SMOOTH_EASE = [0.16, 1, 0.3, 1];
const FAST_SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.6 };

const hasChildren = (n) => Boolean(n?.children?.length);

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Lets any leaf, at any depth, close the whole open menu tree when clicked. */
const MenuCloseContext = createContext(() => {});

/* Cascade direction. Every sublist opens to the RIGHT (consistent for every
   top item), so the value is always "right"; a per-panel flip flips a single
   panel left only if it would otherwise run off-screen. Room for the rightward
   cascade is created by anchoring the first-level panel (see `align`). */
const MenuSideContext = createContext("right");

/* Max rows per column before a pure-leaf list wraps into the next column. */
const COL_MAX = 4;
const toColumns = (arr, size) => {
  const cols = [];
  for (let i = 0; i < arr.length; i += size) cols.push(arr.slice(i, i + size));
  return cols;
};

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
   on hover-intent + click, positioned to the side and flipped on overflow. */
function FlyoutRow({ item, depth }) {
  const branch = hasChildren(item);
  const close = useContext(MenuCloseContext);
  const side = useContext(MenuSideContext); // "left" | "right" — chosen at the top

  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const flyoutRef = useRef(null);
  const openT = useRef(null);
  const closeT = useRef(null);

  // Base direction from the cascade side; `flip` inverts it only if that side
  // would overflow the viewport.
  const openLeft = side === "left" ? !flip : flip;

  const clearTimers = () => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
  };
  const scheduleOpen = () => {
    if (!branch) return;
    clearTimers();
    openT.current = setTimeout(() => setOpen(true), 70);
  };
  const scheduleClose = () => {
    if (!branch) return;
    clearTimers();
    closeT.current = setTimeout(() => setOpen(false), 120);
  };
  useEffect(() => () => clearTimers(), []);

  // If the chosen side overflows the viewport, flip to the other side (once).
  useIsoLayoutEffect(() => {
    if (!open || !flyoutRef.current) return;
    const r = flyoutRef.current.getBoundingClientRect();
    const overflow = side === "left" ? r.left < 8 : r.right > window.innerWidth - 8;
    if (overflow) setFlip(true);
  }, [open, side]);

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

  return (
    <div className="relative" onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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
            ref={flyoutRef}
            initial={{ opacity: 0, x: openLeft ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: openLeft ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: SMOOTH_EASE }}
            // top-aligned to the row; opens toward the cascade side. The side
            // padding is part of the element so there's no dead hover gap.
            className={`absolute top-0 z-50 ${openLeft ? "right-full pr-1.5" : "left-full pl-1.5"}`}
          >
            <FlyoutPanel items={item.children} depth={depth + 1} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────── one panel (a level) ───────────────────────────
   A panel that contains flyout rows may NOT clip (its children escape it), so
   only leaf-only lists get a scroll cap — this keeps infinite depth working.
   A pure-leaf list longer than COL_MAX rows becomes a multi-column mega-panel:
   at most four rows per column, wrapping into the next column. */
function FlyoutPanel({ items, depth }) {
  const anyBranch = items.some(hasChildren);
  const columned = !anyBranch && items.length > COL_MAX;
  const shell =
    "rounded-[20px] border border-white/10 bg-[#0d0d11] p-2 shadow-[0_20px_48px_rgba(139,92,246,0.16),0_10px_24px_rgba(0,0,0,0.55)]";

  if (columned) {
    return (
      <div className={`${shell} flex max-w-[calc(100vw-1.5rem)] gap-1 overflow-visible`} role="menu">
        {toColumns(items, COL_MAX).map((col, i) => (
          <div key={i} className="flex w-[16.5rem] flex-col">
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
      className={`${shell} w-[min(19rem,calc(100vw-1.5rem))] ${
        anyBranch ? "overflow-visible" : "max-h-[78vh] overflow-y-auto overscroll-contain"
      }`}
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
   cascade to the right via FlyoutRow. */
function TopDropdown({ item, isOpen, align }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <m.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: SMOOTH_EASE }}
          className={`absolute top-full z-50 mt-3.5 ${align === "right" ? "right-0" : "left-0"}`}
        >
          <FlyoutPanel items={item.children} depth={0} />
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── mobile: single-open list ───────────────────────────
   Each level owns one `openKey`; opening a sibling closes the others. Recurses
   for infinite depth. */
function MobileList({ items, depth, onNavigate }) {
  const [openKey, setOpenKey] = useState(null);
  return (
    <div className={depth === 0 ? "space-y-0.5" : "mb-1.5 ml-3 space-y-0.5 border-l border-white/10 pl-1.5"}>
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

  if (!branch) {
    const inner = (
      <>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-violet-300/80" />}
        <span className="flex-1 text-[12.5px] font-medium text-white/75">{item.label}</span>
        {item.comingSoon ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-px text-[8.5px] font-bold uppercase tracking-wider text-white/40">
            Soon
          </span>
        ) : (
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-violet-400/70" />
        )}
      </>
    );
    const rowCls = "group flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-white/5";
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
        className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/5"
      >
        {Icon && depth > 0 && <Icon className="h-3.5 w-3.5 shrink-0 text-violet-300/80" />}
        <span className={`flex-1 font-semibold text-white/85 group-hover:text-white ${depth === 0 ? "text-[13px]" : "text-[12.5px]"}`}>
          {item.label}
        </span>
        <m.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={FAST_SPRING}
          className={`flex h-5 w-5 items-center justify-center rounded-full ${isOpen ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-white/40"}`}
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
  const [align, setAlign] = useState("left");

  const navRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const { scrollYProgress } = useScroll();

  // First-level panel anchoring: right-of-centre trigger anchors RIGHT (panel
  // extends left, leaving room for the rightward cascade); else anchors LEFT.
  const pickAlign = useCallback((el) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAlign(r.left + r.width / 2 > window.innerWidth / 2 ? "right" : "left");
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

  // Auto-close the mobile drawer if the viewport grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1180px)");
    const onChange = (e) => e.matches && setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const openMenu = useCallback((label, el) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    pickAlign(el);
    setOpenDropdown(label);
  }, [pickAlign]);
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
                    onMouseEnter={(e) => branch && openMenu(item.label, e.currentTarget)}
                    onMouseLeave={closeMenu}
                  >
                    {branch ? (
                      <button
                        onClick={(e) => {
                          pickAlign(e.currentTarget);
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
                    {branch && <TopDropdown item={item} isOpen={isOpen} align={align} />}
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
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-white/10 bg-[#0d0d11f2] p-2.5 shadow-[0_20px_50px_rgba(139,92,246,0.16),0_6px_20px_rgba(0,0,0,0.6)] backdrop-blur-2xl min-[1180px]:hidden"
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

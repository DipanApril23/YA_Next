"use client";

// ─── Navbar ───────────────────────────────────────────────────────────
// Fixed, pill-shaped top navigation. Design language ported from the Elogix
// navbar (pill container, scroll-shrink + shadow, gradient scroll-progress
// bar, hover-intent dropdowns with a growing accent bar + icon tiles,
// multi-column mega-menu, shimmer CTA, mobile accordion drawer) — themed dark
// to match the site and the white-wordmark logo.
//
// Data-driven + RECURSIVE: it renders the silo tree from src/data/nav.js to
// any depth. A node with `children` whose children ALSO have children becomes
// a columned MEGA-MENU (Digital Marketing Solutions, Industry); a flat list
// becomes a simple 1/2-column dropdown; on mobile everything collapses into a
// nested accordion. See NAV_ITEMS for the structure.
//
// Uses framer-motion's lightweight `m` (the app is wrapped in <LazyMotion>).
// The header's entrance is a CSS animation (nav-drop) so the bar paints from
// the server HTML without waiting for hydration.

import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";

import { NAV_ITEMS, NAV_CONTENT } from "@/data";
import brandLogo from "@/assets/logo/brandlogo.webp";
import "./navbar.css";

const SMOOTH_EASE = [0.16, 1, 0.3, 1];
const FAST_SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.6 };

/* A node is a menu if it has children; a menu is a MEGA-menu when at least one
   of its children is itself a menu (i.e. the tree is ≥ 3 levels deep here). */
const hasChildren = (n) => Boolean(n?.children?.length);
const isMega = (n) => hasChildren(n) && n.children.some(hasChildren);

/* ─────────────────────────── desktop: leaf row ─────────────────────────── */
/* One clickable entry inside a dropdown/mega-menu — icon tile, label, optional
   description, hover accent bar + arrow. `compact` shrinks it for dense lists. */
function LeafRow({ item, compact = false }) {
  const Icon = item.icon;

  const body = (
    <>
      {/* Growing accent bar on hover */}
      <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out group-hover:h-[70%]" />

      {Icon && (
        <span
          className={`mt-0.5 flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-sm transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-[0_4px_12px_rgba(139,92,246,0.25)] group-hover:scale-110 group-hover:-rotate-6 ${compact ? "h-7 w-7" : "h-8 w-8"}`}
        >
          <Icon className={`text-violet-300 ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
        </span>
      )}

      <span className="flex min-w-0 flex-1 flex-col gap-0.5 pr-1">
        <span className="flex items-center gap-1.5">
          <span
            className={`font-semibold leading-snug text-white/90 transition-colors duration-200 group-hover:text-white ${compact ? "text-[12px]" : "text-[12.5px]"}`}
          >
            {item.label}
          </span>
          {item.comingSoon && (
            <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-px text-[8.5px] font-bold uppercase tracking-wider text-white/40">
              Soon
            </span>
          )}
        </span>
        {item.desc && (
          <span className="text-[10.5px] leading-snug text-white/45">{item.desc}</span>
        )}
      </span>

      {!item.comingSoon && (
        <ArrowUpRight
          className={`mt-0.5 shrink-0 -translate-x-1 translate-y-1 text-violet-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`}
        />
      )}
    </>
  );

  const cls =
    "group relative flex w-full items-start gap-2.5 overflow-hidden rounded-[14px] px-2.5 py-2.5 transition-colors duration-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50";

  // Coming-soon items are informational, not navigable.
  if (item.comingSoon || !item.href) {
    return (
      <div className={`${cls} cursor-default`} aria-disabled="true">
        {body}
      </div>
    );
  }
  return (
    <Link href={item.href} className={cls}>
      {body}
    </Link>
  );
}

/* ─────────────────────────── desktop: mega column ─────────────────────────── */
/* One group inside a mega-menu: a header, then its items. An item that itself
   has children (e.g. "…for Law Firms") is rendered as a labelled sub-group. */
function MegaColumn({ group }) {
  const Icon = group.icon;
  return (
    <div className="flex min-w-0 flex-col">
      {/* Group header */}
      <div className="flex items-center gap-2.5 px-2.5 pb-2 pt-1">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10">
            <Icon className="h-4 w-4 text-violet-300" />
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="text-[12px] font-bold uppercase tracking-wide text-white">
            {group.label}
          </span>
          {group.desc && (
            <span className="text-[10px] leading-snug text-white/40">{group.desc}</span>
          )}
        </span>
      </div>

      <div className="mx-2.5 mb-1 h-px bg-white/10" />

      <div className="flex flex-col">
        {group.children.map((child) =>
          hasChildren(child) ? (
            <div key={child.label} className="mt-0.5">
              <p className="flex items-center gap-1 px-2.5 pb-0.5 pt-1.5 text-[10.5px] font-bold uppercase tracking-wider text-violet-300/80">
                {child.icon && <child.icon className="h-3 w-3" />}
                {child.label}
              </p>
              <div className="flex flex-col border-l border-white/10 pl-1.5 ml-3">
                {child.children.map((leaf) => (
                  <LeafRow key={leaf.label} item={leaf} compact />
                ))}
              </div>
            </div>
          ) : (
            <LeafRow key={child.label} item={child} compact />
          )
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── desktop: dropdown panel ─────────────────────────── */
function DesktopPanel({ item, isOpen }) {
  const mega = isMega(item);
  const items = item.children;
  const twoCol = !mega && items.length > 4;

  // Width scales with content: mega panels are wider (one column per group).
  // NOTE: these must be complete static strings so Tailwind's JIT generates
  // them — never interpolate the arbitrary value. All clamp to the viewport
  // width so a wide panel can never cause horizontal overflow.
  let widthCls;
  if (mega) {
    widthCls =
      items.length >= 3
        ? "w-[min(48rem,calc(100vw-2rem))]"
        : "w-[min(34rem,calc(100vw-2rem))]";
  } else if (twoCol) {
    widthCls = "w-[min(34rem,calc(100vw-2rem))]";
  } else {
    widthCls = "w-[min(22rem,calc(100vw-2rem))]";
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <m.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: SMOOTH_EASE }}
          className={`absolute left-1/2 top-full z-50 mt-3.5 -translate-x-1/2 ${widthCls}`}
        >
          {/* Pointer arrow */}
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-[#0d0d11]" />

          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0d0d11] p-2 shadow-[0_20px_48px_rgba(139,92,246,0.16),0_6px_20px_rgba(0,0,0,0.5)]">
            {mega ? (
              <div
                className="grid gap-x-1"
                style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
              >
                {items.map((group, i) => (
                  <div key={group.label} className="relative">
                    {i > 0 && (
                      <span className="pointer-events-none absolute inset-y-1 -left-0.5 w-px bg-white/10" />
                    )}
                    <MegaColumn group={group} />
                  </div>
                ))}
              </div>
            ) : twoCol ? (
              <div className="relative grid grid-cols-2 gap-x-1">
                <span className="pointer-events-none absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-white/10" />
                {items.map((leaf) => (
                  <LeafRow key={leaf.label} item={leaf} compact />
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {items.map((leaf) => (
                  <LeafRow key={leaf.label} item={leaf} />
                ))}
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── mobile: recursive accordion node ─────────────────────────── */
function MobileNode({ item, depth, onNavigate }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  const branch = hasChildren(item);

  if (!branch) {
    // Leaf — a link, or an inert coming-soon row.
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
    const rowCls =
      "group flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-white/5";
    return item.comingSoon || !item.href ? (
      <div className={`${rowCls} cursor-default`}>{inner}</div>
    ) : (
      <Link href={item.href} onClick={onNavigate} className={rowCls}>
        {inner}
      </Link>
    );
  }

  // Branch — expandable.
  return (
    <div className="overflow-hidden rounded-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/5"
      >
        {Icon && depth > 0 && (
          <Icon className="h-3.5 w-3.5 shrink-0 text-violet-300/80" />
        )}
        <span
          className={`flex-1 font-semibold text-white/85 group-hover:text-white ${depth === 0 ? "text-[13px]" : "text-[12.5px]"}`}
        >
          {item.label}
        </span>
        <m.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={FAST_SPRING}
          className={`flex h-5 w-5 items-center justify-center rounded-full ${open ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-white/40"}`}
        >
          <ChevronDown className="h-3 w-3" />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: SMOOTH_EASE }}
            className="overflow-hidden"
          >
            <div className="mb-1.5 ml-3 space-y-0.5 border-l border-white/10 pl-1.5">
              {item.children.map((child) => (
                <MobileNode
                  key={child.label}
                  item={child}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
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

  const navRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const { scrollYProgress } = useScroll();

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

  // Close the drawer if the viewport grows to desktop width (edge case: rotate
  // / resize while the mobile menu is open).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1180px)");
    const onChange = (e) => e.matches && setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const openMenu = useCallback((label) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  }, []);
  const closeMenu = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 110);
  }, []);
  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Scroll progress bar */}
      <m.div
        className="fixed inset-x-0 top-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        ref={navRef}
        className="nav-drop fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8"
      >
        {/* ── Pill container ── */}
        <m.div
          animate={{
            height: scrolled ? 56 : 68,
            backgroundColor:
              scrolled || mobileOpen ? "rgba(10, 10, 12, 0.96)" : "rgba(10, 10, 12, 0.78)",
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
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 min-[1180px]:flex">
            {NAV_ITEMS.map((item) => {
              const branch = hasChildren(item);
              const isOpen = openDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => branch && openMenu(item.label)}
                  onMouseLeave={closeMenu}
                >
                  {branch ? (
                    <button className="nav-underline-item group relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-medium text-white/70 transition-colors duration-200 hover:text-white">
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

                  {branch && <DesktopPanel item={item} isOpen={isOpen} />}
                </div>
              );
            })}
          </nav>

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
                <div className="max-h-[68vh] space-y-0.5 overflow-y-auto overscroll-contain pr-0.5">
                  {NAV_ITEMS.map((item) => (
                    <MobileNode key={item.label} item={item} depth={0} onNavigate={closeDrawer} />
                  ))}
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

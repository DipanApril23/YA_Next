"use client";

import Link from "next/link";
import Image from "next/image";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

import { NAV_ITEMS, NAV_CONTENT } from "@/data";
import MobileSideBar from "./MobileSidebar";
import Button from "@/components/ui/Button/Button";
import brandLogo from "@/assets/logo/brandlogo.webp";
import "./navbar.css";

/* ───────────────────────── animation variants ───────────────────────── */

const SMOOTH_EASE = [0.16, 1, 0.3, 1];

const FAST_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.6,
};

/* ───────────────────────── desktop dropdown subcomponent ───────────────────────── */

function NavDropdown({ items, isOpen }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: SMOOTH_EASE }}
          className="absolute left-1/2 top-full z-50 mt-3.5 w-64 -translate-x-1/2"
        >
          <div className="absolute -top-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-[#0d0d11]" />

          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0d0d11] p-1.5 shadow-[0_20px_48px_rgba(139,92,246,0.15),0_6px_20px_rgba(0,0,0,0.4)]">
            {items.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="group flex items-center gap-3 rounded-[16px] px-3 py-2.5 transition-all duration-200 hover:bg-white/5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-sm transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-[0_4px_12px_rgba(139,92,246,0.3)] group-hover:scale-105">
                    <Icon className="h-3.5 w-3.5 text-purple-400" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-white/90">
                      {item.label}
                    </span>

                    <span className="text-[10.5px] leading-tight text-white/50">
                      {item.desc}
                    </span>
                  </div>

                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 -translate-x-1 translate-y-1 text-purple-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── main component ───────────────────────── */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrollPct, setScrollPct] = useState(0);

  const navRef = useRef(null);
  const dropdownTimeout = useRef(null);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrollPct(value);
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ✅ FIXED OUTSIDE CLICK HANDLER */

  useEffect(() => {
    const handler = (e) => {
      const mobileMenu = document.querySelector(
        "[data-mobile-menu='true']"
      );

      if (mobileMenu && mobileMenu.contains(e.target)) {
        return;
      }

      if (navRef.current && navRef.current.contains(e.target)) {
        return;
      }

      setOpenDropdown(null);
      setMobileOpen(false);
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const openMenu = useCallback((label) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }

    setOpenDropdown(label);
  }, []);

  const closeMenu = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 100);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}

      <motion.div
        className="fixed inset-x-0 top-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        style={{ scaleX: scrollPct }}
      />

      <motion.header
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: SMOOTH_EASE,
        }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8"
      >
        <motion.div
          animate={{
            height: scrolled ? 54 : 66,

            backgroundColor:
              scrolled || mobileOpen
                ? "rgba(10, 10, 12, 0.95)"
                : "rgba(10, 10, 12, 0.75)",

            boxShadow: scrolled
              ? "0 8px 32px -4px rgba(139,92,246,0.2), 0 2px 12px -2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)"
              : "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
          transition={{
            duration: 0.4,
            ease: SMOOTH_EASE,
          }}
          className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 backdrop-blur-2xl"
        >
          {/* ✅ LOGO SECTION UPDATED */}

          <Link
            href={NAV_CONTENT.brandHref}
            className="group relative z-20 flex items-center"
          >
            <motion.div
              animate={{
                scale: scrolled ? 0.93 : 1,
              }}
              transition={{
                duration: 0.3,
              }}
              className="relative"
            >
              <Image
                src={brandLogo}
                alt={NAV_CONTENT.brandLogoAlt}
                priority
                className={`
                  object-contain transition-all duration-300
                  ${scrolled
                    ? "h-[34px] w-auto"
                    : "h-[42px] w-auto"}
                `}
              />
            </motion.div>
          </Link>

          {/* Desktop Nav - Breakpoint updated to 1100px */}

          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 min-[1100px]:flex">
            {NAV_ITEMS.map((item) => {
              const hasDropdown = Boolean(item.dropdown?.length);

              const isOpen = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={closeMenu}
                >
                  {hasDropdown ? (
                    <button className="nav-underline-item group relative flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/70 transition-colors duration-200 hover:text-white">
                      <span>{item.label}</span>

                      <motion.div
                        animate={{
                          rotate: isOpen ? 180 : 0,
                        }}
                        transition={FAST_SPRING}
                      >
                        <ChevronDown className="h-3.5 w-3.5 text-white/40 transition-colors duration-200 group-hover:text-purple-400" />
                      </motion.div>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="nav-underline-item group relative block rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      <span>{item.label}</span>
                    </a>
                  )}

                  {hasDropdown && item.dropdown && (
                    <div
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={closeMenu}
                    >
                      <NavDropdown
                        items={item.dropdown}
                        isOpen={isOpen}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ✅ REUSABLE DYNAMIC CTA BUTTON - Breakpoint updated to 1100px */}

          <div className="hidden items-center pr-0.5 min-[1100px]:flex">
            <Button
              as="a"
              href={NAV_CONTENT.cta.href}
              animate={{
                paddingTop: scrolled ? "7px" : "9px",
                paddingBottom: scrolled ? "7px" : "9px",
                fontSize: scrolled ? "12px" : "12.5px",
              }}
              transition={FAST_SPRING}
              className="group relative overflow-hidden !rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 px-5 font-semibold text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] !mt-0 !w-auto"
            >
              <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                {NAV_CONTENT.cta.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Button>
          </div>

          {/* Mobile Toggle - Breakpoint updated to 1100px */}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={NAV_CONTENT.menuToggleLabel}
            className="relative z-[90] flex h-8.5 w-8.5 items-center justify-center rounded-xl transition-all duration-300 hover:bg-white/5 min-[1100px]:hidden"
          >
            <div className="relative flex h-3 w-4 flex-col justify-between">
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 5 }
                    : { rotate: 0, y: 0 }
                }
                className="h-[2px] w-4 origin-center rounded-full bg-white"
              />

              <motion.span
                animate={
                  mobileOpen
                    ? { opacity: 0, scale: 0 }
                    : { opacity: 1, scale: 1 }
                }
                className="h-[2px] w-4 rounded-full bg-white"
              />

              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -5 }
                    : { rotate: 0, y: 0 }
                }
                className="h-[2px] w-4 origin-center rounded-full bg-white"
              />
            </div>
          </button>
        </motion.div>
      </motion.header>

      {/* Mobile Sidebar */}

      <MobileSideBar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MagneticButton — Premium magnetic CTA component
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * JavaScript (JSX) port of the original TypeScript component, using framer
 * motion's lightweight `m` element (the app is wrapped in a <LazyMotion>
 * provider). Visual layers, springs and behaviour are unchanged.
 *
 * VARIANTS
 *   primary    Blue → Purple → Pink gradient    main CTAs
 *   glow       Deep navy → Cyan gradient        hero sections, dark bg
 *   secondary  Glassmorphism + cyan ring        paired secondary CTA
 *   ghost      Transparent + white hover fill   nav links, tertiary actions
 *   outline    Bordered → fills gradient        light/mixed backgrounds
 *   danger     Red gradient                     destructive actions
 *
 * SIZES
 *   xs  sm  md  lg  xl  2xl   ← or override freely via className
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useCallback } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { SPRING_SNAPPY } from "@/data";

// Internal class utility (no external dep needed)
const cx = (...c) => c.filter(Boolean).join(" ");

// Size token map
const SIZES = {
  xs:    { pad: "px-3 py-1.5",  text: "text-xs",   gap: "gap-1.5", r: "rounded-lg"   },
  sm:    { pad: "px-4 py-2",    text: "text-sm",   gap: "gap-2",   r: "rounded-xl"   },
  md:    { pad: "px-5 py-2.5",  text: "text-sm",   gap: "gap-2",   r: "rounded-xl"   },
  lg:    { pad: "px-6 py-3",    text: "text-base", gap: "gap-2.5", r: "rounded-xl"   },
  xl:    { pad: "px-8 py-4",    text: "text-lg",   gap: "gap-3",   r: "rounded-2xl"  },
  "2xl": { pad: "px-10 py-5",   text: "text-xl",   gap: "gap-3",   r: "rounded-2xl"  },
};

// Variant config
const VARIANTS = {
  primary: {
    cls:    "border-transparent",
    bgBase: "linear-gradient(135deg,#1d4ed8 0%,#6d28d9 50%,#be185d 100%)",
    bgHov:  "linear-gradient(135deg,#3b82f6 0%,#8b5cf6 50%,#ec4899 100%)",
    glow:   "linear-gradient(135deg,#2563eb,#7c3aed,#db2777)",
    sh:     0.22,
  },
  glow: {
    cls:    "border-transparent",
    bgBase: "linear-gradient(135deg,#0c4a6e 0%,#1e3a8a 50%,#1e1b4b 100%)",
    bgHov:  "linear-gradient(135deg,#0e7490 0%,#2563eb 50%,#4338ca 100%)",
    glow:   "linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%)",
    sh:     0.16,
  },
  secondary: {
    cls:    "border-white/15 bg-white/5 backdrop-blur-md",
    bgBase: null,
    bgHov:  null,
    glow:   null,
    sh:     0.13,
  },
  ghost: {
    cls:    "border-transparent",
    bgBase: null,
    bgHov:  null,
    glow:   null,
    sh:     0.10,
  },
  outline: {
    cls:    "border-blue-500/50",
    bgBase: null,
    bgHov:  "linear-gradient(135deg,#1d4ed8 0%,#6d28d9 50%,#be185d 100%)",
    glow:   null,
    sh:     0.20,
  },
  danger: {
    cls:    "border-transparent",
    bgBase: "linear-gradient(135deg,#7f1d1d 0%,#991b1b 100%)",
    bgHov:  "linear-gradient(135deg,#dc2626 0%,#ef4444 100%)",
    glow:   "linear-gradient(135deg,#dc2626,#f87171)",
    sh:     0.18,
  },
};

// Loading spinner (internal)
const Spinner = () => (
  <m.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    width="15"
    height="15"
    aria-hidden="true"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </m.svg>
);

const MagneticButton = React.forwardRef(function MagneticButton(
  {
    children,
    variant         = "primary",
    size            = "md",
    href,
    external        = false,
    icon,
    iconPosition    = "right",
    loading         = false,
    magnetStrength  = 0.25,
    fullWidth       = false,
    className       = "",
    disabled,
    onClick,
    ...rest
  },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef ?? localRef;

  const [hovered, setHovered] = useState(false);

  // ── Spring-based magnetic translation ─────────────────────────────────
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 20, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 260, damping: 20, mass: 0.8 });

  const isDisabled = disabled || loading;

  // Track cursor relative to button center → drive spring values
  const handleMove = useCallback(
    (e) => {
      if (isDisabled) return;
      const el = e.currentTarget;
      const br = el.getBoundingClientRect();
      mx.set((e.clientX - br.left - br.width  / 2) * magnetStrength);
      my.set((e.clientY - br.top  - br.height / 2) * magnetStrength);
    },
    [isDisabled, magnetStrength, mx, my]
  );

  // Spring returns to zero on leave
  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  // ── Token lookup ───────────────────────────────────────────────────────
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size]       ?? SIZES.md;

  // ── Base button class string ───────────────────────────────────────────
  const btnCls = cx(
    "relative inline-flex items-center justify-center",
    "select-none border",
    "font-semibold tracking-wide text-white",
    "transition-colors duration-200",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-blue-400/70",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    // Size tokens
    s.pad, s.text, s.r,
    // Variant base classes (bg, border, backdrop)
    v.cls,
    // Modifiers
    fullWidth  ? "w-full"                        : "",
    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    // User overrides (highest specificity)
    className,
  );

  // ── Visual layer stack ─────────────────────────────────────────────────
  const layers = (
    <>
      {/* ①  AMBIENT GLOW */}
      {v.glow && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute rounded-[inherit]"
          style={{
            inset:      "-3px",
            background: v.glow,
            filter:     "blur(18px)",
            zIndex:     -1,
          }}
          animate={{
            opacity: hovered ? 0.60 : 0.20,
            scale:   hovered ? 1.07 : 1.00,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* ②  BASE GRADIENT */}
      {v.bgBase && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: v.bgBase }}
        />
      )}

      {/* ③  HOVER GRADIENT */}
      {v.bgHov && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: v.bgHov }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.28 }}
        />
      )}

      {/* ④  SECONDARY — CYAN RING */}
      {variant === "secondary" && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          animate={{
            boxShadow: hovered
              ? "inset 0 0 0 1px rgba(6,182,212,0.55), 0 0 30px rgba(6,182,212,0.18)"
              : "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
          transition={{ duration: 0.28 }}
        />
      )}

      {/* ⑤  GHOST — WHITE FILL */}
      {variant === "ghost" && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: "rgba(255,255,255,0.07)" }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
        />
      )}

      {/* ⑥  SHIMMER SWEEP */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{ zIndex: 2 }}
      >
        <m.span
          className="absolute top-0 h-full"
          style={{
            width:      "55%",
            background: `linear-gradient(90deg,transparent,rgba(255,255,255,${v.sh}),transparent)`,
          }}
          animate={{ left: hovered ? "130%" : "-60%" }}
          transition={{ duration: 0.52, ease: "easeInOut" }}
        />
      </span>

      {/* ⑦  CONTENT: spinner · icon · label */}
      <span
        className={cx("relative flex items-center", s.gap)}
        style={{ zIndex: 3 }}
      >
        {loading && <Spinner />}

        {!loading && icon && iconPosition === "left" && (
          <m.span
            className="flex items-center"
            animate={{ x: hovered ? -1 : 0 }}
            transition={SPRING_SNAPPY}
          >
            {icon}
          </m.span>
        )}

        <span>{children}</span>

        {!loading && icon && iconPosition === "right" && (
          <m.span
            className="flex items-center"
            animate={{ x: hovered ? 2 : 0 }}
            transition={SPRING_SNAPPY}
          >
            {icon}
          </m.span>
        )}
      </span>
    </>
  );

  // ── Shared magnetic motion props ───────────────────────────────────────
  const magneticProps = {
    style:        { x: sx, y: sy },
    onMouseMove:  handleMove,
    onMouseEnter: () => !isDisabled && setHovered(true),
    onMouseLeave: handleLeave,
    whileHover:   isDisabled ? undefined : { scale: 1.048 },
    whileTap:     isDisabled ? undefined : { scale: 0.965 },
    transition: {
      type:      "spring",
      stiffness: 380,
      damping:   22,
      mass:      0.6,
    },
  };

  // ── Render: Link ───────────────────────────────────────────────────────
  if (href) {
    return (
      <m.div
        {...magneticProps}
        style={{
          x:       sx,
          y:       sy,
          display: fullWidth ? "block" : "inline-block",
        }}
      >
        <Link
          href={href}
          className={btnCls}
          onClick={onClick}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {layers}
        </Link>
      </m.div>
    );
  }

  // ── Render: Button ─────────────────────────────────────────────────────
  return (
    <m.button
      ref={ref}
      {...magneticProps}
      className={btnCls}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      {layers}
    </m.button>
  );
});

MagneticButton.displayName = "MagneticButton";

export { MagneticButton };
export default MagneticButton;

"use client";

// ─── Button ───────────────────────────────────────────────────────────
// Animated CTA button (magnetic hover, light sweep, glow) in two variants:
// "primary" (gradient) and "secondary" (glass). Gradient layers → button.css.

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import classNames from "classnames";
import "./button.css";

const Button = ({ children, className, variant = "primary", onClick, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 35 });
  const springY = useSpring(y, { stiffness: 350, damping: 35 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.22);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  /* ─── SECONDARY / GLASS ─── */
  if (variant === "secondary") {
    return (
      <motion.button
        ref={ref}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={classNames(
          "relative mt-4 w-full overflow-hidden rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-center font-semibold text-white backdrop-blur-sm transition-colors duration-300",
          className
        )}
        {...props}
      >
        <span className="relative z-10 tracking-wide">{children}</span>

        {/* Hover sweep */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />

        {/* Cyan border glow on hover */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 1px rgba(6,182,212,0.45), 0 0 20px rgba(6,182,212,0.12)"
              : "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    );
  }

  /* ─── PRIMARY / GRADIENT ─── */
  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={classNames(
        "relative mt-4 w-full overflow-hidden rounded-xl px-6 py-3 text-center font-bold text-white",
        className
      )}
      {...props}
    >
      {/* Gradient background */}
      <span
        aria-hidden
        className="btn-gradient pointer-events-none absolute inset-0 rounded-xl"
      />

      {/* Hover state — slightly lighter gradient */}
      <motion.span
        aria-hidden
        className="btn-gradient-hover pointer-events-none absolute inset-0 rounded-xl"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Light sweep */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{ x: isHovered ? "220%" : "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Outer glow */}
      <motion.span
        aria-hidden
        className="btn-glow pointer-events-none absolute -bottom-1 left-6 right-6 h-2 rounded-full blur-md"
        animate={{ opacity: isHovered ? 0 : 0.55, scaleX: isHovered ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
      />

      <span className="relative z-10 tracking-wide">{children}</span>
    </motion.button>
  );
};

export default Button;
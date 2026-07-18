"use client";

// ─── FlipCard ─────────────────────────────────────────────────────────
// 3D flip business card used in the Hero. Front = brand + services list,
// back = QR + contact. Content → FLIPCARD_* (src/data/flipCard.js); styles →
// flipcard.css. Client component (pointer-tilt via Framer Motion).

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import {
  FLIPCARD_SERVICES as SERVICES,
  FLIPCARD_QR_CORNERS as QR_CORNERS,
  FLIPCARD_DEFAULTS,
} from "@/data";
import "./flipcard.css";

/* Idle float applied to the whole card */
const FLOAT = {
  animate: { y: [0, -13, 0], rotate: [-0.4, 0.4, -0.4] },
  transition: {
    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

/* Maps a service from FLIPCARD_SERVICES onto the properties `.fc-service*` reads. */
const serviceVars = (svc) => ({
  "--svc-color": svc.color,
  "--svc-tint-bg": svc.tintBg,
  "--svc-tint-border": svc.tintBorder,
  "--svc-tint-icon": svc.tintIcon,
  "--svc-pulse-duration": svc.pulseDuration,
});

const FlipCard = ({
  frontLogo = FLIPCARD_DEFAULTS.frontLogo,
  backLogo = FLIPCARD_DEFAULTS.backLogo,
  qrCode = FLIPCARD_DEFAULTS.qrCode,
  phoneNumbers = FLIPCARD_DEFAULTS.phoneNumbers,
  email = FLIPCARD_DEFAULTS.email,
  servicesTitle = FLIPCARD_DEFAULTS.servicesTitle,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const tiltRef = useRef(null);

  /* ── Mouse-tracking tilt ────────────────────────────────────── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), {
    stiffness: 160,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 160,
    damping: 28,
  });

  const onMouseMove = useCallback(
    (e) => {
      if (!tiltRef.current) return;
      const r = tiltRef.current.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width - 0.5);
      rawY.set((e.clientY - r.top) / r.height - 0.5);
    },
    [rawX, rawY]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const handleFlip = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
    setIsFlipped((v) => !v);
  };

  return (
    <div className="fc-root">
      {/* ── Glow + rings wrapper ─────────────────────────────── */}
      <div className="fc-stage">
        <div aria-hidden className="fc-glow" />
        <div aria-hidden className="fc-ring-outer" />
        <div aria-hidden className="fc-ring-inner" />

        <motion.div
          ref={tiltRef}
          className="fc-tilt"
          onClick={handleFlip}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 1100 }}
          animate={FLOAT.animate}
          transition={FLOAT.transition}
        >
          {/* ── Flip container ────────────────────────────── */}
          <motion.div
            className="fc-flip"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ══════════ FRONT FACE ══════════ */}
            <div className="fc-face">
              <div aria-hidden className="fc-edge fc-edge--top fc-edge--cyan-purple" />
              <div aria-hidden className="fc-shimmer fc-shimmer--front" />

              {/* Logo */}
              <div className="fc-logo fc-logo--front">
                <Image
                  src={frontLogo}
                  alt="Young Architects"
                  fill
                  sizes="(max-width: 768px) 60vw, 283px"
                  className="object-cover"
                />
              </div>

              {/* Contact */}
              <div className="fc-contact">
                <div className="fc-contact-divider" />
                {phoneNumbers.map((phone) => (
                  <p key={phone} className="fc-phone">
                    {phone}
                  </p>
                ))}
                <p className="fc-email">{email}</p>
              </div>

              {/* QR */}
              <div className="fc-qr">
                <Image src={qrCode} alt="QR Code" fill sizes="144px" className="object-cover" />
                {QR_CORNERS.map((corner) => (
                  <span key={corner} aria-hidden className={`fc-qr-corner fc-qr-corner--${corner}`} />
                ))}
              </div>

              <div aria-hidden className="fc-edge fc-edge--bottom fc-edge--purple-soft" />
            </div>

            {/* ══════════ BACK FACE ══════════ */}
            <div className="fc-face fc-face--back">
              <div aria-hidden className="fc-edge fc-edge--top fc-edge--purple" />
              <div aria-hidden className="fc-shimmer fc-shimmer--back" />

              {/* Logo */}
              <div className="fc-logo fc-logo--back">
                <Image
                  src={backLogo}
                  alt="Young Architects"
                  fill
                  sizes="(max-width: 768px) 60vw, 270px"
                  className="object-cover"
                />
              </div>

              {/* Services header */}
              <div className="fc-services-header">
                <p className="fc-services-title">{servicesTitle}</p>
                <div className="fc-services-divider" />
              </div>

              {/* Services list */}
              <div className="fc-services-list">
                {SERVICES.map((svc) => (
                  <motion.div
                    key={svc.label}
                    className="fc-service"
                    style={serviceVars(svc)}
                    whileHover={{ x: 6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <span className="fc-service-icon">{svc.icon}</span>
                    <span className="fc-service-label">{svc.label}</span>
                    <span className="fc-service-dot" />
                  </motion.div>
                ))}
              </div>

              <div aria-hidden className="fc-edge fc-edge--bottom fc-edge--cyan-soft" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── "Tap to flip" indicator ─────────────────────────── */}
      <motion.button
        onClick={handleFlip}
        className="fc-flip-btn"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Click to flip card"
      >
        <svg
          className="fc-flip-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
        <span className="fc-flip-label">{isFlipped ? "Flip Back" : "Flip Card"}</span>
      </motion.button>
    </div>
  );
};

export default FlipCard;

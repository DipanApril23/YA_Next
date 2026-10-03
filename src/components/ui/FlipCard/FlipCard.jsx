"use client";

// ─── FlipCard ─────────────────────────────────────────────────────────
// 3D flip business card used in the Hero.
//
//   resting face   "Why Choose Us" — the logo, six reasons-to-choose, and the
//                  prompt that tells the visitor the card turns
//   flip side      the same logo, both phone numbers, the email and the QR
//
// THE RESTING FACE IS THE PITCH, NOT THE CONTACT DETAILS. It used to be the
// other way round: the card opened on a phone number, which is the thing a
// visitor wants LAST — after they have a reason to call. The reasons now greet
// them and the contact details are one flip away, which is also why the prompt
// below the list exists: a card that turns has to say so, or most visitors
// never find the other side.
//
// BOTH FACES USE THE SAME LOGO FILE. The back used to carry a different,
// older mark; two logos on one card reads as a mistake. See
// content/flipCard.json → defaults.logo.
//
// Content → FLIPCARD_* (src/data/flipCard.js); styles → flipcard.css.
// Client component (pointer-tilt via Framer Motion).

import { useState, useRef, useCallback } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import {
  FLIPCARD_REASONS as REASONS,
  FLIPCARD_QR_CORNERS as QR_CORNERS,
  FLIPCARD_DEFAULTS,
  SPRING_SNAPPY,
} from "@/data";
import "./flipcard.css";

/* Alt text / labels come from the same defaults object as the imagery. */
const DEFAULTS = FLIPCARD_DEFAULTS;

/* Idle float applied to the whole card */
const FLOAT = {
  animate: { y: [0, -13, 0], rotate: [-0.4, 0.4, -0.4] },
  transition: {
    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

/* Maps a reason from FLIPCARD_REASONS onto the properties `.fc-service*` reads. */
const serviceVars = (svc) => ({
  "--svc-color": svc.color,
  "--svc-tint-bg": svc.tintBg,
  "--svc-tint-border": svc.tintBorder,
  "--svc-tint-icon": svc.tintIcon,
  "--svc-pulse-duration": svc.pulseDuration,
});

const FlipCard = ({
  logo = FLIPCARD_DEFAULTS.logo,
  qrCode = FLIPCARD_DEFAULTS.qrCode,
  phoneNumbers = FLIPCARD_DEFAULTS.phoneNumbers,
  email = FLIPCARD_DEFAULTS.email,
  reasonsTitle = FLIPCARD_DEFAULTS.reasonsTitle,
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

        <m.div
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
          <m.div
            className="fc-flip"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ══════════ RESTING FACE · WHY CHOOSE US ══════════ */}
            <div className="fc-face">
              <div aria-hidden className="fc-edge fc-edge--top fc-edge--cyan-purple" />
              <div aria-hidden className="fc-shimmer fc-shimmer--front" />

              {/* Logo — `object-contain` inside a padded circle, so the
                  wordmark clears the curve instead of running into it. */}
              <div className="fc-logo fc-logo--mark">
                <Image
                  src={logo}
                  alt={DEFAULTS.logoAlt}
                  fill
                  sizes="(max-width: 768px) 34vw, 150px"
                  className="object-contain"
                />
              </div>

              {/* Reasons header */}
              <div className="fc-services-header">
                <p className="fc-services-title">{reasonsTitle}</p>
                <div className="fc-services-divider" />
              </div>

              {/* Reasons list */}
              <div className="fc-services-list">
                {REASONS.map((svc) => (
                  <m.div
                    key={svc.label}
                    className="fc-service"
                    style={serviceVars(svc)}
                    whileHover={{ x: 6, scale: 1.02 }}
                    transition={SPRING_SNAPPY}
                  >
                    <span className="fc-service-icon" aria-hidden>
                      <Check strokeWidth={3.5} />
                    </span>
                    <span className="fc-service-label">{svc.label}</span>
                    <span className="fc-service-dot" />
                  </m.div>
                ))}
              </div>

              {/* Flip prompt — the only thing telling a visitor the card has
                  another side. The arrow loops, and the whole row pulses, so
                  it reads as an invitation rather than a caption. */}
              <div className="fc-prompt" aria-hidden="true">
                <span className="fc-prompt-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                </span>
                <span className="fc-prompt-label">{DEFAULTS.flipPrompt}</span>
              </div>

              <div aria-hidden className="fc-edge fc-edge--bottom fc-edge--purple-soft" />
            </div>

            {/* ══════════ FLIP SIDE · CONTACT DETAILS ══════════ */}
            <div className="fc-face fc-face--back">
              <div aria-hidden className="fc-edge fc-edge--top fc-edge--purple" />
              <div aria-hidden className="fc-shimmer fc-shimmer--back" />

              {/* Same logo, same fitting — larger here because this face
                  carries far less copy. */}
              <div className="fc-logo fc-logo--mark fc-logo--lg">
                <Image
                  src={logo}
                  alt={DEFAULTS.logoAlt}
                  fill
                  sizes="(max-width: 768px) 48vw, 215px"
                  className="object-contain"
                />
              </div>

              {/* Contact */}
              <div className="fc-contact">
                <div className="fc-contact-divider" />
                <p className="fc-contact-title">{DEFAULTS.backTitle}</p>
                {phoneNumbers.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`} className="fc-phone">
                    {phone}
                  </a>
                ))}
                <a href={`mailto:${email}`} className="fc-email">
                  {email}
                </a>
              </div>

              {/* QR */}
              <div className="fc-qr">
                <Image src={qrCode} alt={DEFAULTS.qrAlt} fill sizes="144px" className="object-cover" />
                {QR_CORNERS.map((corner) => (
                  <span key={corner} aria-hidden className={`fc-qr-corner fc-qr-corner--${corner}`} />
                ))}
              </div>

              <div aria-hidden className="fc-edge fc-edge--bottom fc-edge--cyan-soft" />
            </div>
          </m.div>
        </m.div>

        {/* ── Flip control ─────────────────────────────────────
            ABOVE the card, not under it. Sitting below the stage it added
            ~46px of height and fell past the fold, so the only affordance for
            the back face was invisible until you scrolled — the card read as a
            static image and most visitors never discovered it turned. Anchored
            over the card's top edge it costs no layout height and rides at the
            top of the card, which is the first part of it on screen.

            The slot does the positioning and the button only scales, because
            framer writes `transform` for whileHover/whileTap — a translate for
            centring would be overwritten the moment the pointer arrived.

            It also sits OUTSIDE .fc-tilt on purpose: inside, it would inherit
            the 3D tilt and the float, and a control that pitches away from the
            pointer is harder to hit than one that holds still. */}
        <div className="fc-flip-slot">
          <m.button
            onClick={handleFlip}
            className="fc-flip-btn"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            aria-label={DEFAULTS.flipAriaLabel}
          >
            <svg
              className="fc-flip-icon"
              width="14"
              height="14"
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
          </m.button>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;

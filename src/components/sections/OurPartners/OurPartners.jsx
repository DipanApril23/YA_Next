"use client";

// ─── Our Partners — "platforms we build with" logo strip ──────────────
// Embedded at the foot of the Consultation CTA (rendered by ConsultationCTA,
// NOT mounted on the page directly): two auto-scrolling marquee rows
// of dark "platform" chips. Content (header copy + the platform rows) →
// src/data/ourPartners.js; styles → ourPartners.css. Client component
// (Framer Motion reveal). Per-chip accent + per-row speed reach the CSS as
// data through the --chip-accent / --marquee-duration custom properties.
//
// Framing: "Platforms We Build With", NOT "Certified Partners" — no
// partner-badge claims. Real logos: drop an SVG/PNG in /public/partners/ and
// set `logo` on the entry in the data file; until then a monogram shows.

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/ui";
import {
  OURPARTNERS_CONTENT as CONTENT,
  OURPARTNERS_ROW_ONE,
  OURPARTNERS_ROW_TWO,
} from "@/data";
import "./ourPartners.css";

function LogoChip({ item }) {
  return (
    <li className="yaPartners__chip">
      {item.logo ? (
        <span className="yaPartners__logoWrap">
          <Image
            src={item.logo}
            alt={`${item.name} logo`}
            width={28}
            height={28}
            className="yaPartners__logoImg"
          />
        </span>
      ) : (
        <span
          className="yaPartners__monogram"
          style={{ "--chip-accent": item.accent }}
          aria-hidden="true"
        >
          {item.monogram}
        </span>
      )}
      <span className="yaPartners__chipName">{item.name}</span>
    </li>
  );
}

/* Number of identical copies of the list rendered inside the track. The CSS
   animates the track by exactly one copy-width (translateX(-100% / COPIES),
   i.e. -25%), so the loop point always sits on a copy boundary — pixel-perfect
   at any width. Rendering several copies (not just two) guarantees the strip
   is never wider than the content still on screen at the seam, which is what
   kills the blank gap on wide viewports where one copy is narrower than the
   container.
   ⚠️ Keep in sync with the -25% in @keyframes yaPartnersScroll (ourPartners.css). */
const MARQUEE_COPIES = 4;

/* One marquee row. Speed and direction are set by `rowClass`
   (a .yaPartners__row--N modifier) entirely in ourPartners.css — no timing
   values live in the JSX. Only the first copy is exposed to assistive tech;
   the rest are aria-hidden duplicates (also hidden under reduced-motion). */
function MarqueeRow({ items, rowClass }) {
  const list = (ariaHidden, key) => (
    <ul
      key={key}
      className="yaPartners__group"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item, i) => (
        <LogoChip key={`${item.name}-${i}`} item={item} />
      ))}
    </ul>
  );

  return (
    <div className={`yaPartners__row ${rowClass}`}>
      <div className="yaPartners__track">
        {Array.from({ length: MARQUEE_COPIES }, (_, c) =>
          list(c > 0, `copy-${c}`)
        )}
      </div>
    </div>
  );
}

export default function OurPartners() {
  return (
    <div className="yaPartners" id="partners" aria-label="Platforms we build with">
      <div className="yaPartners__inner">
        {/* ── Headline block ─────────────────────────────── */}
        <SectionHeader
          className="yaPartners__head"
          theme="light"
          size="sm"
          headingLead={CONTENT.titleLead}
          headingRest={CONTENT.titleHighlight}
          subheading={CONTENT.subheading}
        />

        {/* ── Scrolling logo strip ────────────────────────── */}
        <motion.div
          className="yaPartners__marquees"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <MarqueeRow items={OURPARTNERS_ROW_ONE} rowClass="yaPartners__row--1" />
          <MarqueeRow items={OURPARTNERS_ROW_TWO} rowClass="yaPartners__row--2" />
        </motion.div>
      </div>
    </div>
  );
}

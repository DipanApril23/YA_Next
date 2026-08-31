"use client";

/**
 * FaqSection — accordion of common questions (id="faq").
 *
 * Single-open accordion: the active item gets a violet accent bar, soft glow and
 * an animated height reveal (AnimatePresence); the toggle "+" rotates to "×".
 * Buttons carry aria-expanded/aria-controls for accessibility, and a FAQPage
 * JSON-LD script is emitted for rich search results. A "Still have questions?"
 * row linking to the consultation form closes the section. All copy comes from
 * the data layer (src/data/content/faq.json, via @/data) — nothing to edit here.
 *
 * JSX port of the original TSX, using framer-motion's lightweight `m` element
 * (the app is wrapped in a <LazyMotion> provider) — same design, smaller runtime.
 */

import { useRef, useState } from "react";
import { m, AnimatePresence, useInView } from "framer-motion";
import { Sparkles, Plus, MessageCircle } from "lucide-react";
import ScrollBeamDivider from "./ScrollBeamDivider";
import MagneticButton from "@/components/ui/MagneticButton/MagneticButton";
import { FAQ_CONTENT, FAQ_ITEMS, FAQ_SUPPORT, EASE_ENTRANCE as EASE } from "@/data";
import "./faqSection.css";

/* Answers may contain **bold** keyword phrases. Split on the markers and wrap
   the emphasised segments in <strong>; everything else renders as plain text. */
function renderAnswer(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((seg, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-slate-700">
        {seg}
      </strong>
    ) : (
      seg
    )
  );
}

/* FAQPage structured data for search engines. The bold markers are stripped
   so the structured-data text stays clean (no literal ** in rich results). */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer.replace(/\*\*/g, "") },
  })),
};

export default function FaqSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex((cur) => (cur === i ? -1 : i));

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#ECECF4] via-[#F4F3FC] to-white pb-16 pt-0 md:pb-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <ScrollBeamDivider />

      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-1/4 h-[24rem] w-[24rem] rounded-full bg-violet-400/8 blur-[100px]" />
        <div className="absolute -right-28 bottom-0 h-[20rem] w-[20rem] rounded-full bg-fuchsia-400/7 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center">
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="mt-16 inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 shadow-sm backdrop-blur-md md:mt-20"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-bold tracking-wide text-violet-800">
              {FAQ_CONTENT.badge}
            </span>
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
            className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.9rem]"
          >
            {FAQ_CONTENT.headline.plain}{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              {FAQ_CONTENT.headline.accent}
            </span>
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
            className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-500 sm:text-base"
          >
            {FAQ_CONTENT.subheading}
          </m.p>
        </div>

        {/* ── Accordion ── */}
        <div className="mt-10 flex flex-col gap-3 md:mt-12">
          {FAQ_ITEMS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <m.div
                key={faq.id}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.22 + i * 0.08, duration: 0.5, ease: EASE }}
                className={[
                  "relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300",
                  isOpen
                    ? "border-violet-200/80 bg-white/95 shadow-[0_10px_36px_rgba(124,58,237,0.12)]"
                    : "border-white/80 bg-white/70 shadow-sm hover:border-violet-200/50 hover:bg-white/85",
                ].join(" ")}
              >
                {/* Active accent bar */}
                <div
                  className="faq-accent-bar absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full transition-opacity duration-300"
                  style={{ opacity: isOpen ? 1 : 0 }}
                />

                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 sm:gap-4 sm:px-6 sm:py-5"
                >
                  {/* Number chip */}
                  <span
                    className={[
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10.5px] font-black transition-all duration-300 sm:h-8 sm:w-8 sm:rounded-xl sm:text-[11.5px]",
                      isOpen
                        ? "text-white shadow-md"
                        : "bg-violet-50 text-violet-500 ring-1 ring-violet-100",
                    ].join(" ")}
                    style={
                      isOpen
                        ? {
                            background: "linear-gradient(135deg, #7c3aed, #d946ef)",
                            boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                          }
                        : undefined
                    }
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={[
                      "flex-1 text-[13.5px] font-bold leading-snug tracking-tight transition-colors duration-200 sm:text-[15.5px]",
                      isOpen ? "text-slate-900" : "text-slate-700",
                    ].join(" ")}
                  >
                    {faq.question}
                  </span>

                  {/* Plus → × toggle */}
                  <m.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={[
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-8 sm:w-8",
                      isOpen
                        ? "bg-violet-100 text-violet-600"
                        : "bg-slate-100/80 text-slate-400",
                    ].join(" ")}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.6} />
                  </m.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      key="answer"
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-5 pl-[52px] text-[13px] font-medium leading-relaxed text-slate-500 sm:px-6 sm:pb-6 sm:pl-[72px] sm:text-[14.5px]">
                        {renderAnswer(faq.answer)}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            );
          })}
        </div>

        {/* ── Still have questions ── */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.55, ease: EASE }}
          className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-white/80 bg-white/70 px-6 py-6 text-center shadow-sm backdrop-blur-xl sm:flex-row sm:px-8 sm:text-left md:mt-12"
        >
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <span
              className="faq-support-icon flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-extrabold tracking-tight text-slate-900">
                {FAQ_SUPPORT.heading}
              </p>
              <p className="mt-0.5 text-[12.5px] font-medium text-slate-500">
                {FAQ_SUPPORT.subtext}
              </p>
            </div>
          </div>
          <MagneticButton
            href={FAQ_SUPPORT.buttonHref}
            variant="primary"
            className="shrink-0 rounded-full px-6 py-3 text-sm shadow-lg shadow-violet-300/40"
          >
            {FAQ_SUPPORT.buttonLabel}
          </MagneticButton>
        </m.div>

      </div>
    </section>
  );
}

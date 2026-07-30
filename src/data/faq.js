// ─── FAQ section — data loader ────────────────────────────────────────
//
// A thin adapter over ./content/faq.json.
//
// ANSWER MARKUP CONVENTION
// Inside an answer, **text wrapped in double asterisks** renders bold. The
// component splits on the asterisks at render time; the same string is reused
// for the FAQPage structured data with the markers stripped, so a search
// result never shows a stray `**`. Keep the pairs balanced when editing.
//
// The FAQ renders at the foot of the Testimonials section (id="faq").
//
// Consumed by: src/components/sections/Faq/FaqSection.jsx (via the @/data barrel).

import faqContent from "./content/faq.json";

export const FAQ_CONTENT = {
  badge: faqContent.badge,
  headline: faqContent.headline,
  subheading: faqContent.subheading,
};

export const FAQ_ITEMS = faqContent.faqs;
export const FAQ_SUPPORT = faqContent.support;

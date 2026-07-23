// ─── Central data barrel ──────────────────────────────────────────────
// Every piece of content/config the UI renders is exported from here, so
// components never carry inline data.

// JSON content collections
export { default as about } from "./json/about.json";
export { default as students } from "./json/students.json";
export { default as works } from "./json/works.json";
export { default as courses } from "./json/courses.json";
export { default as testimonials } from "./json/testimonials.json";

// Structured UI data
export { NAV_ITEMS, NAV_CONTENT } from "./nav";
export { MAIN_SERVICES, MAIN_SERVICES_CONTENT } from "./mainServices";
export { OURPROCESS_CONTENT, OURPROCESS_STEPS, OURPROCESS_PARTICLES } from "./ourProcess";
export { CONSULTATION_CTA_CONTENT, CONSULTATION_CTA_FORM } from "./consultationCta";
export {
  OURPARTNERS_CONTENT,
  OURPARTNERS_ROW_ONE,
  OURPARTNERS_ROW_TWO,
} from "./ourPartners";
export { CASESTUDIES_CONTENT, CASESTUDIES_ITEMS } from "./caseStudies";
export { TESTIMONIALS_CONTENT, TESTIMONIALS_ITEMS } from "./testimonials";
export { WHYCHOOSE_CONTENT } from "./whyChoose";
export { NOT_FOUND_CONTENT } from "./notFound";
export {
  HERO_CONTENT,
  HERO_CTAS,
  HERO_STATS,
  HERO_BENEFITS,
  HERO_PARTICLES,
} from "./hero";
export { FLIPCARD_SERVICES, FLIPCARD_QR_CORNERS, FLIPCARD_DEFAULTS } from "./flipCard";
export {
  FOOTER_CONTENT,
  FOOTER_QUICK_LINKS,
  FOOTER_OTHER_LINKS,
  FOOTER_CONTACT,
} from "./footer";

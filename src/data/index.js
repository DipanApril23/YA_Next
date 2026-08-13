// ─── Central data barrel ──────────────────────────────────────────────
//
// The single import surface for every piece of content the UI renders:
//
//     import { HERO_CONTENT, NAV_ITEMS } from "@/data";
//
// Components never reach into a JSON file directly. They import from here, and
// the loader modules beside this file are the only code that knows where a
// value physically lives — so content can be moved (JSON today, a headless CMS
// tomorrow) without a single component changing.
//
// ── HOW THE DATA LAYER IS ORGANISED ──────────────────────────────────
//
//   data/content/*.json   EDITABLE COPY. Everything a marketer or a CMS owns:
//                         headlines, body text, links, catalogue entries,
//                         testimonials. This is the folder that gets handed to
//                         the backend team for the WordPress/ACF build — each
//                         file maps onto one ACF group or repeater, and every
//                         file opens with a `$comment` describing its shape.
//
//   data/config/*.json    DEVELOPER CONFIG. Design tokens, animation timings,
//                         decorative particle positions, tab ids. Not copy, not
//                         translatable, and NOT part of the CMS handover.
//
//   data/*.js             THIN LOADERS. Import the JSON, do the small amount of
//                         work JSON cannot express — resolve icon names to
//                         React components, derive colour tints, expand a
//                         particle formula — and re-export under stable names.
//                         These names are the contract the components code
//                         against and should stay stable.
//
// The split matters: an editor should never meet a hex value or a cubic-bezier
// curve, and a CMS record should never carry a Tailwind class.

// ── Site chrome ──────────────────────────────────────────────────────
export { NAV_ITEMS, NAV_CONTENT } from "./nav";
export { NAV_ICONS } from "./navIcons";
export {
  FOOTER_CONTENT,
  FOOTER_COLUMNS,
  FOOTER_SOCIALS,
  FOOTER_CONTACT,
  FOOTER_LEGAL,
} from "./footer";

// ── Page sections (in page order) ────────────────────────────────────
export {
  HERO_CONTENT,
  HERO_CTAS,
  HERO_STATS,
  HERO_BENEFITS,
  HERO_PARTICLES,
} from "./hero";
export { OURPROCESS_CONTENT, OURPROCESS_STEPS, OURPROCESS_PARTICLES } from "./ourProcess";
export {
  SERVICE_TABS,
  CARD_OFFSETS,
  SERVICE_STATS,
  SERVICE_PARTICLES,
  SERVICE_SECTION,
  SERVICES_SECTION_CONTENT,
  SERVICES_CATALOGUE,
  ALL_SERVICES,
  getServicesByTab,
  SERVICES_SEO_CONTENT,
  SERVICES_SEO_ORGANIZATION,
} from "./services";
export { CONSULTATION_CTA_CONTENT, CONSULTATION_CTA_FORM } from "./consultationCta";
export {
  OURPARTNERS_CONTENT,
  OURPARTNERS_ROW_ONE,
  OURPARTNERS_ROW_TWO,
} from "./ourPartners";
export { CASESTUDIES_CONTENT, CASESTUDIES_ITEMS } from "./caseStudies";
export { TESTIMONIALS_CONTENT, TESTIMONIALS_ITEMS, TESTIMONIALS_AVATARS } from "./testimonials";
export { FAQ_CONTENT, FAQ_ITEMS, FAQ_SUPPORT } from "./faq";
export { BRANDMARK_CONTENT } from "./brandMark";

// ── Sections built but not currently mounted on any page ─────────────
export { MAIN_SERVICES, MAIN_SERVICES_CONTENT } from "./mainServices";
export { WHYCHOOSE_CONTENT } from "./whyChoose";

// ── Shared UI ────────────────────────────────────────────────────────
export { FLIPCARD_SERVICES, FLIPCARD_QR_CORNERS, FLIPCARD_DEFAULTS } from "./flipCard";
export {
  EASE_SMOOTH,
  EASE_ENTRANCE,
  SPRING_FAST,
  SPRING_SNAPPY,
  SPRING_DOCK,
  VIEWPORT_ONCE,
  VIEWPORT_REPEAT,
} from "./motion";

// ── Routes ───────────────────────────────────────────────────────────
export {
  NOT_FOUND_CONTENT,
  NOT_FOUND_NOISE_URL,
  NOT_FOUND_NOISE_SIZE,
  NOT_FOUND_STARS,
} from "./notFound";

// ── Legacy image manifests (data/json/) ──────────────────────────────
// Flat URL maps predating the content/ + config/ split. `about` is still read
// by the WhyChoose section; `students`, `works`, `courses` and the old
// `testimonials` manifest are no longer referenced by any component and are
// kept only so nothing is silently deleted. They can be removed once you have
// confirmed no upcoming page needs them.
export { default as about } from "./json/about.json";
export { default as students } from "./json/students.json";
export { default as works } from "./json/works.json";
export { default as courses } from "./json/courses.json";
export { default as testimonials } from "./json/testimonials.json";

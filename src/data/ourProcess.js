// ─── Our Process section: content, steps & backdrop particles ─────────
//
// Everything the OurProcess section renders as *content* lives here — no
// copy, arrays, or tuning numbers inside the component. The component owns
// only structure, animation, and the icon lookup (PROCESS_ICONS in
// OurProcess.jsx). All styling lives in ourProcess.css; per-step colour is
// handed to the CSS as *data* through the `accent` / `glow` fields below,
// which the component forwards as the `--accent` / `--glow` custom props.
//
// See ./OurProcess/README.md → "The data layer" for the full contract.

/* ── Header copy ─────────────────────────────────────────────── */
export const OURPROCESS_CONTENT = {
  badge: "Our Process",
  headingLead: "Simple Process for",
  // Passed to SectionHeader as `headingRest` — the solid half of the headline.
  headingHighlight: "Seamless Results",
  subheading:
    "Follow our easy, step-by-step approach to get the perfect solution for your needs. From understanding your goals to delivering results, we make it quick and hassle-free.",
};

/* ── The five steps ──────────────────────────────────────────────
   num     two-digit label — shown as the ghost numeral + the "x / 05" counter
   phase   uppercase annotation beside the ghost numeral (desktop only)
   title   card heading
   desc    card body copy
   tag     small pill in the card header
   icon    key resolved by PROCESS_ICONS in OurProcess.jsx
   accent  per-step hue — forwarded to the CSS via the `--accent` custom prop
   glow    soft aura colour — forwarded to the CSS via the `--glow` custom prop
────────────────────────────────────────────────────────────────── */
export const OURPROCESS_STEPS = [
  {
    num: "01",
    phase: "PHASE 01 · DISCOVERY",
    title: "Initial Business Consultation Call",
    desc: "A brief call with our marketing experts to understand your business goals in depth.",
    tag: "Free · 30 min",
    icon: "consult",
    accent: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
  },
  {
    num: "02",
    phase: "PHASE 02 · STRATEGY",
    title: "Customized Marketing Plan",
    desc: "A tailored marketing plan is created and shared during a consultation call — built around your goals, market, and budget.",
    tag: "Your growth blueprint",
    icon: "plan",
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
  },
  {
    num: "03",
    phase: "PHASE 03 · BUILD",
    title: "Deploying the Marketing Funnel",
    desc: "A fail-proof marketing funnel is developed and deployed in the business to meet its goals — website, campaigns, and automation working as one.",
    tag: "Web · Ads · Automation",
    icon: "funnel",
    accent: "#3b82f6",
    glow: "rgba(59,130,246,0.4)",
  },
  {
    num: "04",
    phase: "PHASE 04 · OPTIMIZE",
    title: "Optimization and Scaling",
    desc: "The deployed funnel is optimized regularly with an aim to scale the results — winners get budget, waste gets cut.",
    tag: "Data-driven, weekly",
    icon: "scale",
    accent: "#06b6d4",
    glow: "rgba(6,182,212,0.4)",
  },
  {
    num: "05",
    phase: "PHASE 05 · REVENUE",
    title: "Closing More Sales",
    desc: "Once the system is set and optimized, focus shifts to closing more sales — with every lead captured, followed up, and accounted for.",
    tag: "Leads → Customers",
    icon: "close",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.4)",
  },
];

/* ── Backdrop particles ──────────────────────────────────────────
   Fixed, deterministic positions so the server and client render identical
   markup (no hydration mismatch). The component forwards each field to the
   CSS as a custom property on the particle span:
     x → --x   position from the left      d  → --d   float duration
     y → --y   position from the top       dl → --dl  float delay
     s → --s   diameter (px)
────────────────────────────────────────────────────────────────── */
export const OURPROCESS_PARTICLES = [
  { x: "8%", y: "18%", s: 3, d: "9s", dl: "0s" },
  { x: "22%", y: "72%", s: 2, d: "12s", dl: "1.2s" },
  { x: "36%", y: "34%", s: 2, d: "10s", dl: "2.4s" },
  { x: "58%", y: "12%", s: 3, d: "11s", dl: "0.8s" },
  { x: "71%", y: "58%", s: 2, d: "13s", dl: "3.1s" },
  { x: "84%", y: "26%", s: 3, d: "9.5s", dl: "1.8s" },
  { x: "91%", y: "76%", s: 2, d: "12.5s", dl: "0.4s" },
  { x: "14%", y: "48%", s: 2, d: "10.5s", dl: "2.9s" },
  { x: "47%", y: "86%", s: 3, d: "11.5s", dl: "1.5s" },
  { x: "66%", y: "40%", s: 2, d: "9.8s", dl: "3.6s" },
];

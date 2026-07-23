/* ─────────────────────────────────────────────────────────────
   caseStudies.js — Case Studies content + dark glass tokens
   Young Architects · Section 3C copy (Challenge / Built / Result)
   Consumed by: src/components/sections/CaseStudies/CaseStudies.jsx
   Re-exported through the @/data barrel (src/data/index.js) — export
   names are unchanged (CASESTUDIES_CONTENT / CASESTUDIES_ITEMS) so
   nothing else needs to change.

   ⚠ Numbers wrapped in [XX] are placeholders from the approved copy
   deck's own note: "replace with your three strongest real results
   before publishing — the homepage carries your best proof."

   To add a 4th / 5th case study later: just push another object onto
   CASESTUDIES_ITEMS below, same shape. The results index, the card
   stack, and the mobile slider all read this array's length — nothing
   else in the component needs to change.
   ───────────────────────────────────────────────────────────── */

const TOKENS = {
  bg: "#060610",
  surface: "#0b0b16",
  ink: "#f4f4fb",
  body: "#a7abc2",
  muted: "#5c6080",
  accent1: "#a855f7", // purple — "The Challenge"
  accent2: "#ec4899", // pink   — "What We Built"
  accent3: "#38bdf8",
  tagText: "#cbb6f2",
};

const GRADIENT = "linear-gradient(135deg, #4f46e5 0%, #a855f7 50%, #ec4899 100%)";

const GRADIENT_TEXT = {
  background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export const CASESTUDIES_CONTENT = {
  tokens: TOKENS,
  gradient: GRADIENT,
  gradientText: GRADIENT_TEXT,

  eyebrow: "Case Studies",

  // Rendered as: line1 (plain) + emphasis (gradient italic).
  // "Growth We've Built for" + "Businesses Like Yours"
  title: {
    line1: "Growth We've Built for",
    emphasis: "Businesses Like Yours",
  },

  intro:
    "Real problems, engineered systems, measurable outcomes — see how three very different businesses grew with one connected system.",
  mobileIntro:
    "Real problems, engineered systems, measurable outcomes — three businesses we've helped grow.",

  indexLabel: "Results Index",
  swipeLabel: "Swipe to explore →",

  trust: {
    lead: "Trusted by",
    strong: "local businesses",
    tail: "across Kolkata",
  },
};

export const CASESTUDIES_ITEMS = [
  {
    id: "01",
    label: "Dental Clinic",
    industry: "Healthcare · Local Business",
    title: "From Missed Calls\nto Full Calendar",
    challenge:
      "Strong reputation offline, invisible online — missed calls and zero Google presence meant patients quietly went elsewhere.",
    built:
      "A conversion-focused website, local SEO, Google Ads for treatment searches, and AI-powered WhatsApp booking that answers 24/7.",
    stats: [
      { value: "[XX]", label: "Appointment enquiries / month" },
      { value: "[XX]%", label: "Booked outside clinic hours" },
      { value: "Page 1", label: "Rankings for [XX] keywords" },
    ],
    tags: ["Website", "Local SEO", "Google Ads", "AI WhatsApp"],
  },
  {
    id: "02",
    label: "Fashion Retailer",
    industry: "E-commerce · D2C",
    title: "Turning Followers\nInto Sales",
    challenge:
      "A loyal Instagram following that liked everything and bought nothing — no funnel connecting content to checkout.",
    built:
      "A full funnel: refreshed e-commerce site, catalogue ads with retargeting, story-driven social content, and abandoned-cart automation.",
    stats: [
      { value: "+[XX]%", label: "Online sales in [XX] months" },
      { value: "[X.X]x", label: "Return on ad spend" },
      { value: "[XX]%", label: "Abandoned carts recovered" },
    ],
    tags: ["E-commerce", "Retargeting", "Social Content", "Automation"],
  },
  {
    id: "03",
    label: "B2B Services Firm",
    industry: "B2B · Professional Services",
    title: "Finds Its\nSecond Engine",
    challenge:
      "Two decades of referral-driven growth had plateaued — and every referral now Googled them first, finding almost nothing.",
    built:
      "An authority website, bottom-funnel SEO, LinkedIn thought leadership, and automated lead nurture for every enquiry.",
    stats: [
      { value: "[XX]", label: "Inbound enquiries / month" },
      { value: "[XX]%", label: "Converting to proposals" },
      { value: "2nd", label: "Growth engine beside referrals" },
    ],
    tags: ["Authority Site", "SEO", "LinkedIn", "Lead Nurture"],
  },
];
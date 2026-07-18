// ─── Mid-page CTA · Consultation booking: content & config ────────────
//
// PURE, SERIALIZABLE CONTENT — no imports, no computed values, no JSX.
// Every field below is a plain string / number / array-of-objects, so this
// file maps 1:1 onto a headless-CMS record (WordPress ACF) and can be handed
// to the backend team as JSON without them ever reading the component.
//
// What is intentionally NOT here (it's presentation, not content, so it lives
// in ConsultationCTA.jsx per the "no styling in data" rule):
//   • the blueprint illustrations — GrowthSketch & BackgroundNetwork (SVG)
//   • decorative class lists — avatar gradients, corner-tick positions
// Per-item brand colours ARE content, so they stay here and are forwarded to
// the CSS as the `--dot` custom property.

/* ── GoHighLevel embed configuration ─────────────────────────────
   The booking form is an external GoHighLevel (GHL) widget embedded in an
   <iframe>. `id` is the GHL form id; the iframe src is built as
   `${widgetBaseUrl}/${id}`. `minHeight` is the form's fixed pixel height. */
export const CONSULTATION_CTA_FORM = {
  id: "eXiJlucpqyxkUimRwzww",
  widgetBaseUrl: "https://link.youngarchitects.in/widget/form",
  embedScript: "https://link.youngarchitects.in/js/form_embed.js",
  title: "YA Services Form",
  name: "YA Services Form",
  minHeight: 919,
};

/* ── Section copy ────────────────────────────────────────────── */
export const CONSULTATION_CTA_CONTENT = {
  // Eyebrow chip above the heading
  badge: "Book your free consultation",

  // Main heading — `headingHighlight` renders inside the gradient span
  headingLead: "Your Competitors Are Already Online.",
  headingHighlight: "Let’s Make Sure You’re Ahead of Them.",

  subheading:
    "Fill in the form below to book your free consultation — we’ll review your business and show you the fastest paths to more customers.",

  /* Left "blueprint" panel.
     The heading is split across a responsive line break: line1 <br> line2 +
     highlight → "One call. A clear plan / for your growth." */
  panel: {
    ref: "Growth Blueprint · Ref 3A",
    badge: "Free · 30 min",
    headingLine1: "One call. A clear plan",
    headingLine2: "for",
    headingHighlight: "your growth.",
  },

  /* What the call covers — numbered list in the blueprint panel. */
  points: [
    { num: "01", title: "Business review", desc: "We look at your current online presence, honestly." },
    { num: "02", title: "Fastest paths mapped", desc: "The 2–3 quickest routes to more customers, for you." },
    { num: "03", title: "Your growth blueprint", desc: "A clear plan you keep — whether we work together or not." },
  ],

  /* Captions around the growth-curve sketch (the sketch itself is drawn in
     the component). */
  growthCard: {
    caption: "Growth Curve · Fig 01",
    legend: "You, month 6",
    stackLabel: "Everything under one roof",
  },

  /* Service chips. `color` is brand content and is forwarded to CSS as the
     `--dot` custom property on each chip's dot. */
  services: [
    { color: "#38BDF8", label: "Websites" },
    { color: "#67E8F9", label: "SEO" },
    { color: "#818CF8", label: "Google Ads" },
    { color: "#A855F7", label: "Meta Ads" },
    { color: "#D946EF", label: "Social Media" },
    { color: "#EC4899", label: "AI Automation" },
  ],

  /* Proof stats row. */
  stats: [
    { value: "10+", label: "Projects Delivered" },
    { value: "30+", label: "Happy Clients" },
    { value: "4.1★", label: "Client Rating" },
  ],

  /* Avatar caption — `strong` is bold, `rest` follows in muted text. */
  socialProof: {
    strong: "30+ local businesses",
    rest: "already growing with their blueprint.",
  },

  // Reassurance line under the form
  trustNote:
    "Your details are safe with us. No spam, no pushy sales calls — just a genuine conversation about growing your business.",
};

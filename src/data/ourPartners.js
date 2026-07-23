// ─── Our Partners (Section 3B): header copy + platform rows ───────────
//
// PURE, SERIALIZABLE CONTENT — plain strings/arrays only, so this maps 1:1
// onto a headless-CMS "Platforms" repeater and can be handed to the backend
// as JSON. Each platform entry:
//   name      display label + chip text
//   monogram  fallback glyph shown until a real logo is provided
//   accent    brand colour — forwarded to the CSS as the `--chip-accent` var
//   logo      path to an SVG/PNG in /public/partners/ (e.g. "/partners/google.svg");
//             null → the styled monogram fallback renders instead
//
// ⚠️ Framing is "Platforms We Build With", NOT "Certified Partners". Only
//    claim a partner badge you actually hold (e.g. Google Partner, Meta
//    Business Partner) with verifiable status; client logos need permission.

export const OURPARTNERS_CONTENT = {
  titleLead: "Platforms & Partners",
  // Rendered as the shared SectionHeader's gradient lead (.ya-sh-lead).
  titleHighlight: "We Build With",
  subheading:
    "We work on the world's leading marketing platforms — so your business runs on the best.",
};

export const OURPARTNERS_ROW_ONE = [
  { name: "Google", monogram: "G", accent: "#4285F4", logo: null },
  { name: "Meta", monogram: "M", accent: "#0081FB", logo: null },
  { name: "GoHighLevel", monogram: "GH", accent: "#3ABEFF", logo: null },
  { name: "WordPress", monogram: "W", accent: "#21759B", logo: null },
  { name: "Next.js", monogram: "N", accent: "#7C7FF2", logo: null },
  { name: "Meta Ads", monogram: "∞", accent: "#E94CA8", logo: null },
];

export const OURPARTNERS_ROW_TWO = [
  { name: "Supabase", monogram: "S", accent: "#3ECF8E", logo: null },
  { name: "n8n", monogram: "n8n", accent: "#EA4B71", logo: null },
  { name: "OpenAI", monogram: "AI", accent: "#8B7CF6", logo: null },
  { name: "Cloudflare", monogram: "C", accent: "#F6821F", logo: null },
  { name: "Hostinger", monogram: "H", accent: "#673DE6", logo: null },
  { name: "Google Ads", monogram: "Ad", accent: "#34A853", logo: null },
];

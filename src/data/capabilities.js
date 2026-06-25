// ─── Capabilities section: design tokens + services ───────────────────

export const CAPABILITY_TOKENS = {
  bg: "#F8F7F4",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.07)",
  ink: "#0F0E0D",
  body: "#5C5856",
  muted: "#A09C98",
  accent1: "#7C3AED",
  accent2: "#EC4899",
  tagBg: "#EDEBF0",
  tagText: "#6B5F7A",
  progBg: "rgba(124,58,237,0.12)",
  numBg: "rgba(124,58,237,0.05)",
};

export const CAPABILITY_GRADIENT = `linear-gradient(135deg, ${CAPABILITY_TOKENS.accent1} 0%, ${CAPABILITY_TOKENS.accent2} 100%)`;

export const CAPABILITY_GRADIENT_TEXT = {
  backgroundImage: CAPABILITY_GRADIENT,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export const CAPABILITY_SERVICES = [
  {
    id: "01",
    label: "POSITIONING",
    title: "Authority\nWebsites",
    heading: "Designed to make your company feel established before the first conversation.",
    description: "We create premium digital experiences engineered to increase perceived value, strengthen trust, and position brands like category leaders.",
    points: ["Luxury-level UI systems", "Cinematic interactions & motion", "Conversion-focused architecture", "Premium visual positioning"],
    tags: ["Premium UX", "Authority", "Cinematic"],
    stat: { value: "3×", label: "avg. conversion lift" },
  },
  {
    id: "02",
    label: "GROWTH",
    title: "SEO Growth\nInfrastructure",
    heading: "Organic visibility engineered for long-term acquisition.",
    description: "We build scalable SEO ecosystems combining technical foundations, strategic content architecture, and search-intent systems that compound over time.",
    points: ["Technical SEO systems", "Content architecture", "Intent-driven acquisition", "Long-term search equity"],
    tags: ["SEO", "Growth", "Visibility"],
    stat: { value: "12×", label: "organic traffic growth" },
  },
  {
    id: "03",
    label: "SYSTEMS",
    title: "AI &\nAutomation",
    heading: "Modern businesses scale through intelligent systems, not operational chaos.",
    description: "We implement AI-powered workflows and operational automations that reduce friction, improve efficiency, and create scalable execution systems.",
    points: ["AI workflow automation", "Operational efficiency", "Intelligent integrations", "Scalable infrastructure"],
    tags: ["Automation", "AI Systems", "Operations"],
    stat: { value: "60%", label: "ops cost reduction" },
  },
];

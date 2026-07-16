// ─── FlipCard: service list + default card content ────────────────────

const SERVICE_ENTRIES = [
  { icon: "✦", label: "AI Solutions & Automation", color: "#06b6d4" },
  { icon: "◈", label: "Web & App Development", color: "#3b82f6" },
  { icon: "▲", label: "Digital Marketing & SEO", color: "#a855f7" },
  { icon: "⟳", label: "Digital Transformation", color: "#ec4899" },
  { icon: "◉", label: "Cloud & Infrastructure", color: "#22d3ee" },
];

/*
  Accent tints and the pulse duration are derived here so the component stays
  presentational — every value below is consumed by `.fc-service*` in
  flipcard.css via custom properties.
*/
export const FLIPCARD_SERVICES = SERVICE_ENTRIES.map((svc, i) => ({
  ...svc,
  tintBg: `${svc.color}12`,
  tintBorder: `${svc.color}22`,
  tintIcon: `${svc.color}20`,
  pulseDuration: `${2 + i * 0.3}s`,
}));

// Decorative bracket markers overlaid on the QR code.
export const FLIPCARD_QR_CORNERS = ["tl", "tr", "bl", "br"];

export const FLIPCARD_DEFAULTS = {
  frontLogo: "https://youngarchitects.in/assets/image/logo.webp",
  backLogo: "https://youngarchitects.in/assets/image/logo2.webp",
  qrCode: "https://youngarchitects.in/assets/image/qr.webp",
  phoneNumbers: ["+91 9883952010", "+91 9804569051"],
  email: "yafoundations@gmail.com",
  servicesTitle: "Our Services",
};

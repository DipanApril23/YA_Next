// ─── Hero section: stats, tags, particles ─────────────────────────────

export const HERO_STATS = [
  { value: "10+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "4.1★", label: "Client Rating" },
];

export const HERO_TAGS = ["AI Solutions", "Web Dev", "SEO", "Automation", "Cloud"];

// Deterministic particle positions so server and client render identically
// (avoids a hydration mismatch from random values).
export const HERO_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${10 + ((i * 6.2) % 82)}%`,
  top: `${12 + ((i * 9.7) % 75)}%`,
  size: [3, 2, 4, 2, 3][i % 5],
  color: ["#06b6d4", "#a855f7", "#3b82f6", "#22d3ee", "#ec4899"][i % 5],
  dur: 12 + ((i * 1.9) % 11),
  delay: (i * 1.4) % 8,
  dx: ((i % 5) - 2) * 18,
  dy: ((i % 4) - 2) * 14,
}));

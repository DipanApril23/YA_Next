// ─── Hero section: copy, CTAs, stats, tags, particles ─────────────────

export const HERO_CONTENT = {
  eyebrow: "AI-Powered Digital Agency · Kolkata",
  headlineLead: "The AI Digital Marketing Agency",
  headlineMain: " in Kolkata tailored for Local Businesses",
  brand: "⚡ Young Architects",
  leadBefore: "Every ",
  leadStrong:
    "great structure starts with a blueprint — and so does every great business. Young Architects is a digital marketing agency in Kolkata",
  leadAfter:
    " that engineers your entire growth system: Websites that convert, SEO that gets you found, Ads that pay for themselves, and AI automation that follows up with every lead while you focus on your business. ",
  closing:
    "We're not here to sell you likes and impressions. We're here to build you customers — with the smartest tools of 2026 and the discipline of good architecture. Book a free consultation and let's draw up your growth blueprint.",
};

/*
  `narrow` selects the `.hero-cta--narrow` width modifier in hero.css — the data
  carries intent, the stylesheet owns the actual widths.
*/
export const HERO_CTAS = [
  {
    label: "Book Consultation",
    href: "https://calendly.com/yafoundations/45min",
    variant: "primary",
  },
  {
    label: "View Policy",
    href: "https://youngarchitects.in/assets/YA_Policy.pdf",
    variant: "secondary",
    narrow: true,
  },
];

export const HERO_STATS = [
  { value: "10+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "4.1★", label: "Client Rating" },
];

// Rendered as a green tick checklist (`.hero-benefits` in hero.css).
export const HERO_BENEFITS = [
  "AI-Powered Marketing — Smarter, Faster, Measurable",
  "Everything Under One Roof: Web, SEO, Ads, Content & Automation",
  "Built for Local Businesses — Strategies That Fit Kolkata's Market",
  "Results You Can Count: Leads, Sales & ROI, Not Vanity Metrics",
  "Transparent Reporting in Plain Language",
  "No Long Lock-In Contracts",
];

const PARTICLE_COUNT = 14;
const PARTICLE_SIZES = [3, 2, 4, 2, 3];
const PARTICLE_COLORS = ["#06b6d4", "#a855f7", "#3b82f6", "#22d3ee", "#ec4899"];

/*
  Deterministic particle values so server and client render identically (avoids a
  hydration mismatch from random values). Every value here is consumed by the
  `.hero-particle` CSS rule via custom properties — the component passes data only.
*/
export const HERO_PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const size = PARTICLE_SIZES[i % PARTICLE_SIZES.length];
  const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];

  return {
    left: `${10 + ((i * 6.2) % 82)}%`,
    top: `${12 + ((i * 9.7) % 75)}%`,
    size: `${size}px`,
    color,
    glowBlur: `${size * 2 + 3}px`,
    glowColor: `${color}33`,
    duration: `${12 + ((i * 1.9) % 11)}s`,
    delay: `${(i * 1.4) % 8}s`,
    dx: `${((i % 5) - 2) * 18}px`,
    dy: `${((i % 4) - 2) * 14}px`,
  };
});

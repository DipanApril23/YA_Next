// ─── Main Services section (light theme) ──────────────────────────────

export const MAIN_SERVICES_CONTENT = {
  // Eyebrow chip above the heading — echoes the hero badge for a consistent look.
  badge: "Our Expertise · Kolkata & Beyond",
  headingLead: "OUR MAIN SERVICES",
  headingRest: "— Complete Digital Marketing Services in Kolkata",
  subheading:
    "Whatever your business needs to grow online, it's here — designed, built, and managed by one team that knows your goals inside out.",
  exploreLabel: "Explore",
  comingSoonLabel: "Coming Soon",
};

/*
  ADDING THE CARD ILLUSTRATIONS
  ─────────────────────────────
  Each card renders `image` when present, and falls back to the gradient + `icon`
  tile when it's null. To use the real artwork:

    1. Drop the file in  src/assets/mainServices/
    2. Import it at the top of this file:
         import webDesign from "@/assets/mainServices/web-design.webp";
    3. Set it on the service:
         image: webDesign,
         imageAlt: "Custom website design illustration",

  No JSX changes are needed. Square-ish artwork (~1:1) with a transparent or
  white background suits the light cards best.

  `icon`     — a lucide-react name; resolved by SERVICE_ICONS in MainServices.jsx
  `featured` — draws the persistent cyan glow ring
  `comingSoon` — swaps the Explore link for the amber "Coming Soon" marker
*/
export const MAIN_SERVICES = [
  {
    id: "1",
    title: "Custom Website Design & Development",
    description:
      "Websites built from scratch around your brand and your customers — fast, and engineered to turn visitors into sales.",
    icon: "LayoutTemplate",
    image: null,
    imageAlt:
      "Isometric browser window showing a website wireframe beside a code editor",
    href: "#contact",
  },
  {
    id: "2",
    title: "SEO Services",
    description:
      "Get found by customers already searching for what you sell, with technical SEO that climbs rankings and keeps them.",
    icon: "Search",
    image: null,
    imageAlt: "SEO services",
    href: "#contact",
  },
  {
    id: "3",
    title: "AI Automation",
    description:
      "Chatbots, instant lead follow-up and appointment booking on autopilot — responding 24/7, even while you sleep.",
    icon: "Bot",
    image: null,
    imageAlt: "AI automation",
    href: "#contact",
    featured: true,
  },
  {
    id: "4",
    title: "Content Marketing",
    description:
      "Blogs, videos, and campaigns that answer what your customers are searching for — building the trust that turns readers into buyers.",
    icon: "PenTool",
    image: null,
    imageAlt: "Content marketing",
    href: "#contact",
  },
  {
    id: "5",
    title: "Facebook Ads",
    description:
      "Laser-targeted campaigns across Facebook & Instagram that turn scrolls into sales.",
    icon: "Facebook",
    image: null,
    imageAlt: "Facebook advertising",
    href: "#contact",
  },
  {
    id: "6",
    title: "Google Ads",
    description:
      "Show up at the exact moment customers search for you. High-intent PPC that drives calls and enquiries.",
    icon: "Target",
    image: null,
    imageAlt: "Google advertising",
    href: "#contact",
  },
  {
    id: "7",
    title: "Social Media Marketing",
    description:
      "Consistent social content and community management that turn your channels into your hardest-working salespeople.",
    icon: "Users",
    image: null,
    imageAlt: "Social media marketing",
    href: "#contact",
  },
  {
    id: "8",
    title: "Custom CRM for Your Business",
    description:
      "Your leads, pipeline, and customer data in one system built around how your business actually works.",
    note: { strong: "Launching Soon", rest: " — ask us on your call." },
    icon: "Database",
    image: null,
    imageAlt: "Custom CRM",
    comingSoon: true,
  },
];

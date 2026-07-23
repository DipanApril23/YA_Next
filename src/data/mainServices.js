// ─── Main Services section — "3 Houses" layout (V2.0 · 19-07-2026) ────
// Development House + Creative House side by side, Marketing House spanning
// full width below with a 2×2 grid of sub-groups. Every card renders in the
// dark "void" 3D glass style. Icons resolved by SERVICE_ICONS in
// MainServices.jsx (lucide-react names).

export const MAIN_SERVICES_CONTENT = {
  badge: "Our Expertise · Kolkata & Beyond",
  headingLead: "OUR MAIN SERVICES",
  headingRest: "— Complete Digital Marketing Services in Kolkata",
  subheading:
    "Whatever your business needs to grow online, it's here — designed, built, and managed by one team that knows your goals inside out.",
  comingSoonLabel: "Coming Soon",
};

export const MAIN_SERVICES = [
  {
    id: "development",
    kicker: "House 01 · Build",
    title: "Development House",
    icon: "Code2",
    taglineStrong: "We build the structures your business runs on.",
    tagline:
      "Websites, online stores, web applications, and intelligent automation — custom-coded, lightning-fast, and engineered to work as hard as you do, around the clock.",
    items: [
      { label: "Custom Business Websites" },
      { label: "E-Commerce Development" },
      { label: "Web Application Development" },
      { label: "Website Maintenance & Support" },
      { label: "AI Chatbots & Customer Support" },
      { label: "Lead Capture & Follow-Up Automation" },
      { label: "Appointment Booking Automation" },
      { label: "Workflow & Operations Automation" },
      { label: "Custom AI Integrations" },
      { label: "Custom CRM for Your Industry", comingSoon: true },
    ],
    ctaLabel: "Explore Development",
    href: "#website-development", // → Website Development tab
  },
  {
    id: "design",
    kicker: "House 02 · Design",
    title: "Creative House",
    icon: "Palette",
    taglineStrong: "We make your brand impossible to ignore.",
    tagline:
      "From the interface your customers tap to the reels they can't scroll past — design that looks beautiful, feels effortless, and quietly guides every visitor toward action.",
    items: [
      { label: "UI/UX Design" },
      { label: "Website Redesign & Revamp" },
      { label: "Social Media Strategy & Branding" },
      { label: "Ad Creatives & Design Copywriting" },
      { label: "Content Creation: Reels, Graphics & Carousels" },
      { label: "Custom Logo Designing" },
      { label: "Video Scripts & Visual Content" },
    ],
    ctaLabel: "Explore Design",
    href: "#creative-designing", // → Creative Designing tab
  },
  {
    id: "marketing",
    kicker: "House 03 · Grow",
    title: "Marketing House",
    icon: "Megaphone",
    wide: true,
    taglineStrong: "We fill what we build with customers.",
    tagline:
      "Search, ads, content, and social — full-funnel marketing that gets you found, gets you chosen, and proves its worth in leads and sales, not vanity metrics.",
    groups: [
      {
        label: "Search & SEO",
        icon: "Search",
        items: [
          "On-Page SEO",
          "Off-Page SEO & Link Building",
          "Technical SEO",
          "Local SEO",
          "SEO Content Writing",
          "SEO Audits & Reporting",
        ],
      },
      {
        label: "Paid Advertising",
        icon: "Target",
        items: [
          "Google Search Ads",
          "Google Local & Maps Ads",
          "Display & Remarketing Ads",
          "Google Shopping Ads",
          "YouTube Ads",
          "Landing Pages, Tracking & Optimization",
          "Facebook & Instagram Campaign Strategy & Setup",
          "Audience Targeting & Retargeting",
          "Lead Generation Campaigns",
          "E-Commerce & Catalogue Ads",
          "Ads Tracking, Reporting & Optimization",
        ],
      },
      {
        label: "Content & Email",
        icon: "PenTool",
        items: [
          "Content Strategy & Planning",
          "SEO Blog Writing",
          "Website & Landing Page Copy",
          "Email Newsletters & Nurture Content",
          "Marketing Automation",
        ],
      },
      {
        label: "Social Media",
        icon: "Users",
        items: [
          "Instagram Marketing",
          "LinkedIn Marketing",
          "Social Media Content",
          "Community Management & Engagement",
          "Analytics & Growth Reporting",
        ],
      },
    ],
    ctaLabel: "Explore Marketing",
    href: "#marketing", // → SEO / Google Ads / Content / Social tabs
  },
];
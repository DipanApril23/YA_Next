// ─── Testimonials section — social-proof marquee content ──────────────
//
// ⚠️⚠️ SAMPLE COPY — NOT REAL CLIENTS ⚠️⚠️
// Every entry below is placeholder scaffolding written to fill the design.
// The names, companies and metrics are FICTIONAL. Replace all twelve with
// genuine client quotes (with written permission) before this page goes
// live — publishing invented testimonials as real is both misleading and,
// in most markets, illegal advertising.
//
// SHAPE — one object per card, consumed by
// src/components/sections/Testimonials/Testimonials.jsx:
//   id           stable key; also selects the avatar gradient in the component
//   quote        the testimonial body (keep ≤ ~40 words so cards stay even)
//   author       person's name
//   role         job title
//   company      company name
//   companyType  small grey line under the footer, e.g. "Retail · 40 staff"
//   avatar       2-letter initials for the gradient disc
//   avatarImage  optional photo URL; null → the initials disc renders
//   rating       1–5, drives the star row
//   metric       optional { value, label } badge; null → badge is omitted
//
// The section splits ITEMS in half: first half scrolls left, second half
// scrolls right. Add or remove entries freely — the split is computed.

// Header copy follows the official Section 3D copy deck, and the header
// markup mirrors the `ms-` header language from MainServices (badge pill with
// a pulsing dot → shimmering gradient lead → solid rest → muted subheading)
// so every section on the page introduces itself the same way.
export const TESTIMONIALS_CONTENT = {
  badge: "Client Stories · Kolkata & Beyond",

  // Rendered as: headingLead (shimmering gradient) + headingRest (solid).
  // headingLead is the official headline from the copy deck.
  headingLead: "WHAT OUR CLIENTS SAY",
  headingRest: "— Businesses That Grew With Us",

  subheading:
    "Real words from real owners — on the websites we've built, the leads we've generated, and the hours of manual work we've automated away.",

  bottomCta: {
    pre: "Join",
    highlight: "100+ businesses",
    post: "already growing with us",
  },

  // Per-row marquee config. direction = scroll direction; duration = seconds
  // for one full loop (higher = slower).
  rows: [
    { direction: "left", duration: 58 },
    { direction: "right", duration: 50 },
  ],

  // Section surface colour — also used for the left/right edge-fade masks,
  // so keep these in sync if the background changes.
  surface: "#ECECF4",
};

export const TESTIMONIALS_ITEMS = [
  {
    id: "1",
    quote:
      "We came for a website and stayed for everything else. One team handling our site, Google, ads and follow-ups — and every month I can see exactly what it earned us.",
    author: "Ananya Sen",
    role: "Owner",
    company: "Sen Home Furnishings",
    companyType: "Retail · 40 employees",
    avatar: "AS",
    avatarImage: null,
    rating: 5,
    metric: { value: "3.4×", label: "Return on Ad Spend" },
  },
  {
    id: "2",
    quote:
      "The AI follow-up system alone changed our business. Enquiries get answered in seconds now — at midnight, on Sundays, always. We stopped losing customers we never knew we were losing.",
    author: "Dr. Rohit Banerjee",
    role: "Director",
    company: "Meridian Dental Care",
    companyType: "Healthcare · 3 clinics",
    avatar: "RB",
    avatarImage: null,
    rating: 5,
    metric: { value: "24/7", label: "Lead Response" },
  },
  {
    id: "3",
    quote:
      "Plenty of agencies promised us the world. Young Architects promised a plan — and then actually followed it, reported honestly and delivered. That's rarer than it should be.",
    author: "Suparna Ghosh",
    role: "Founder",
    company: "Northline Interiors",
    companyType: "B2B Services · 25 employees",
    avatar: "SG",
    avatarImage: null,
    rating: 5,
    metric: null,
  },
  {
    id: "4",
    quote:
      "We went from page four to the top three results for the searches that actually bring us business. The enquiry volume genuinely doubled inside one quarter.",
    author: "Imran Qureshi",
    role: "Managing Partner",
    company: "Qureshi Legal Associates",
    companyType: "Professional Services · 18 employees",
    avatar: "IQ",
    avatarImage: null,
    rating: 5,
    metric: { value: "Top 3", label: "Local Rankings" },
  },
  {
    id: "5",
    quote:
      "Our old site looked fine and sold nothing. The rebuild was designed around how people actually buy — and the difference showed up in the very first month's numbers.",
    author: "Priyanka Dutta",
    role: "Co-Founder",
    company: "Kalka Apparel",
    companyType: "E-Commerce · D2C brand",
    avatar: "PD",
    avatarImage: null,
    rating: 5,
    metric: { value: "+68%", label: "Online Orders" },
  },
  {
    id: "6",
    quote:
      "What I value most is the reporting. Every month I get a plain-English summary of what was spent, what it returned and what happens next. No jargon, no hiding.",
    author: "Vikram Agarwal",
    role: "Director",
    company: "Agarwal Steel Traders",
    companyType: "Manufacturing · 120 employees",
    avatar: "VA",
    avatarImage: null,
    rating: 5,
    metric: null,
  },
  {
    id: "7",
    quote:
      "The automation work quietly removed about fifteen hours of admin a week from my team. That alone paid for the engagement several times over.",
    author: "Nandini Roy",
    role: "Operations Head",
    company: "Bluecrest Logistics",
    companyType: "Logistics · 90 employees",
    avatar: "NR",
    avatarImage: null,
    rating: 5,
    metric: { value: "15 hrs", label: "Saved / Week" },
  },
  {
    id: "8",
    quote:
      "They rebuilt our booking flow and the drop-offs basically vanished. People now finish in two steps what used to take five — and they stopped calling us confused.",
    author: "Arindam Basu",
    role: "Founder & CEO",
    company: "TrailHead Travel",
    companyType: "Travel · 30 employees",
    avatar: "AB",
    avatarImage: null,
    rating: 5,
    metric: { value: "−52%", label: "Drop-Off Rate" },
  },
  {
    id: "9",
    quote:
      "We had data everywhere and insight nowhere. Now there is one dashboard the whole leadership team trusts, and our Monday meetings take half the time.",
    author: "Meghna Chatterjee",
    role: "Chief Operating Officer",
    company: "Ardent Consulting",
    companyType: "Strategy Consulting · 60 employees",
    avatar: "MC",
    avatarImage: null,
    rating: 5,
    metric: null,
  },
  {
    id: "10",
    quote:
      "Onboarding was smooth and nobody on my team needed training. Within the first month we could clearly see which campaigns were worth keeping and which to cut.",
    author: "Saurav Mitra",
    role: "Marketing Lead",
    company: "Vertex Build Solutions",
    companyType: "Construction Tech · 75 employees",
    avatar: "SM",
    avatarImage: null,
    rating: 5,
    metric: { value: "1 week", label: "Time to Live" },
  },
  {
    id: "11",
    quote:
      "The content strategy finally gave us something to say. We publish consistently now, and a real share of our new enquiries name an article as how they found us.",
    author: "Farah Siddiqui",
    role: "Brand Manager",
    company: "Lumen Wellness",
    companyType: "Wellness · 45 employees",
    avatar: "FS",
    avatarImage: null,
    rating: 5,
    metric: { value: "4×", label: "Organic Traffic" },
  },
  {
    id: "12",
    quote:
      "One team owns the website, the ads, the SEO and the automations — so nothing gets blamed on someone else. That single point of accountability is worth the fee by itself.",
    author: "Kaushik Nandy",
    role: "Managing Director",
    company: "Nandy Group",
    companyType: "Diversified · 200+ employees",
    avatar: "KN",
    avatarImage: null,
    rating: 5,
    metric: { value: "1", label: "Unified Team" },
  },
];

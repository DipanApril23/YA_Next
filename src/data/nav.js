// ─── Navigation: silo tree + brand/CTA labels ────────────────────────
// The site's information architecture as a RECURSIVE tree — mirrors the
// approved silo map (youngarchitects.in). Each node is:
//   { label, href?, icon?, desc?, comingSoon?, children? }
// A node with `children` is a menu; a leaf has an `href`. The Navbar renders
// this to any depth: simple dropdowns for flat lists, a columned mega-menu
// where a child itself has children (Digital Marketing Solutions, Industry),
// and a nested accordion on mobile. Icons are lucide-react components attached
// here so the JSX stays presentational.

import {
  Eye,
  Target,
  Users,
  ShieldCheck,
  Rocket,
  TrendingUp,
  Award,
  Magnet,
  Filter,
  UserPlus,
  Scale,
  Gavel,
  Code,
  Code2,
  Search,
  Plus,
  Shield,
  SearchCheck,
  Cloud,
  Zap,
  PenTool,
  Facebook,
  Megaphone,
  Database,
  LayoutGrid,
  HeartPulse,
  GraduationCap,
  Building2,
  Palette,
  Share2,
  BookOpen,
  Briefcase,
  FileText,
  CalendarDays,
} from "lucide-react";

// Chrome around the menu: brand link, CTA and control labels.
export const NAV_CONTENT = {
  brandHref: "#home",
  brandLogoAlt: "Young Architects Logo",
  menuToggleLabel: "Toggle menu",
  // "Contact Us" from the silo lives here as the primary CTA (right side).
  cta: { href: "#book-consultation", label: "Contact Us" },
};

export const NAV_ITEMS = [
  { label: "Home", href: "#home", icon: Rocket },

  {
    label: "About Us",
    children: [
      { label: "Our Vision", href: "#vision", icon: Eye, desc: "Where we're headed" },
      { label: "Our Mission", href: "#mission", icon: Target, desc: "What drives us daily" },
      { label: "Our Team", href: "#team", icon: Users, desc: "Meet the people behind it" },
    ],
  },

  {
    label: "Digital Marketing Solutions",
    children: [
      {
        label: "Digital Authority System",
        icon: ShieldCheck,
        desc: "Build a brand people trust",
        children: [
          { label: "Digital Launch Engine", href: "#digital-launch-engine", icon: Rocket, desc: "Get online, fast" },
          { label: "Digital Growth Engine", href: "#digital-growth-engine", icon: TrendingUp, desc: "Scale what works" },
          { label: "Digital Authority Engine", href: "#digital-authority-engine", icon: Award, desc: "Own your category" },
        ],
      },
      {
        label: "Lead Generation System",
        icon: Magnet,
        desc: "Turn attention into pipeline",
        children: [
          { label: "Digital Conversion Engine", href: "#digital-conversion-engine", icon: Filter, desc: "Convert more visitors" },
          { label: "Digital Lead Engine", href: "#digital-lead-engine", icon: UserPlus, desc: "A steady flow of leads" },
        ],
      },
    ],
  },

  {
    label: "Industry",
    children: [
      {
        label: "Legal & Compliance Marketing",
        icon: Scale,
        desc: "Growth for regulated firms",
        children: [
          {
            label: "Digital Marketing Agency for Law Firms",
            href: "#law-firms",
            icon: Gavel,
            children: [
              { label: "Website Development Agency for Law Firms", href: "#law-firms-web", icon: Code },
              { label: "SEO Agency for Law Firms", href: "#law-firms-seo", icon: Search },
              { label: "+ 7 Services & CRM", href: "#law-firms-more", icon: Plus, comingSoon: true },
            ],
          },
          { label: "Digital Marketing Agency for Security Companies", href: "#security-companies", icon: Shield },
          { label: "Digital Marketing Agency for Investigators", href: "#investigators", icon: SearchCheck },
        ],
      },
      {
        label: "SaaS Digital Marketing",
        icon: Cloud,
        desc: "Full-funnel growth for SaaS",
        children: [
          { label: "Website Design and Development for SaaS", href: "#saas-web", icon: Code2 },
          { label: "SEO for SaaS", href: "#saas-seo", icon: Search },
          { label: "Marketing Automation for SaaS", href: "#saas-automation", icon: Zap },
          { label: "Content Marketing for SaaS", href: "#saas-content", icon: PenTool },
          { label: "Facebook Ads for SaaS", href: "#saas-facebook", icon: Facebook },
          { label: "Google Ads for SaaS", href: "#saas-google", icon: Megaphone },
          { label: "Custom CRM for SaaS", href: "#saas-crm", icon: Database },
        ],
      },
      {
        label: "More Industries",
        icon: LayoutGrid,
        desc: "Rolling out next",
        children: [
          { label: "Healthcare Marketing", href: "#healthcare", icon: HeartPulse, comingSoon: true },
          { label: "Education Marketing", href: "#education", icon: GraduationCap, comingSoon: true },
          { label: "Real Estate Marketing", href: "#real-estate", icon: Building2, comingSoon: true },
        ],
      },
    ],
  },

  {
    label: "Our Services",
    children: [
      { label: "Website Development Agency in Kolkata", href: "#service-web", icon: Code, desc: "Sites that convert" },
      { label: "SEO Agency in Kolkata", href: "#service-seo", icon: Search, desc: "Rank where it counts" },
      { label: "Marketing Automation Agency in Kolkata", href: "#service-automation", icon: Zap, desc: "Systems that follow up" },
      { label: "Creative Designing Agency in Kolkata", href: "#service-design", icon: Palette, desc: "Design that stands out" },
      { label: "Content Marketing Agency in Kolkata", href: "#service-content", icon: PenTool, desc: "Content that compounds" },
      { label: "Facebook Ads Agency in Kolkata", href: "#service-facebook", icon: Facebook, desc: "Meta ads that pay back" },
      { label: "Google Ads Agency in Kolkata", href: "#service-google", icon: Megaphone, desc: "Intent-driven traffic" },
      { label: "Social Media Marketing Agency in Kolkata", href: "#service-social", icon: Share2, desc: "Presence that grows" },
    ],
  },

  {
    label: "Insights",
    children: [
      { label: "Blog", href: "#blog", icon: BookOpen, desc: "Latest marketing insights" },
      { label: "Case Studies", href: "#case-studies", icon: Briefcase, desc: "Real-world success stories" },
      { label: "White Paper", href: "#whitepapers", icon: FileText, desc: "Research & deep dives" },
      { label: "News & Events", href: "#news", icon: CalendarDays, desc: "What's happening at YA" },
    ],
  },
];

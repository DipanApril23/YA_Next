import {
  Home,
  Sparkles,
  Shield,
  Globe,
  Briefcase,
  Bot,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  FileText,
  FolderKanban,
  PhoneCall,
  Target,
  Eye,
  ShieldCheck,
  Landmark,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Home",
    dropdown: [
      {
        icon: Home,
        label: "Who Are We",
        desc: "Learn about our agency",
        href: "#home",
      },
      {
        icon: Sparkles,
        label: "Our Services",
        desc: "Premium digital solutions",
        href: "#services",
      },
      {
        icon: ShieldCheck,
        label: "Why Choose Us",
        desc: "Why brands trust us",
        href: "#wcu",
      },
      {
        icon: FolderKanban,
        label: "Our Works",
        desc: "Explore our recent projects",
        href: "#works",
      },
      {
        icon: GraduationCap,
        label: "Upskill Courses",
        desc: "Career-focused training",
        href: "#courses",
      },
      {
        icon: PhoneCall,
        label: "Contact For Enquiry",
        desc: "Get in touch with us",
        href: "#contact",
      },
    ],
  },

  {
    label: "Packages",
    dropdown: [
      {
        icon: Globe,
        label: "Google Reputation Builder",
        desc: "Boost your local authority",
        href: "#grb",
      },
      {
        icon: Briefcase,
        label: "Local Lead Booster",
        desc: "Generate quality leads",
        href: "#llb",
      },
      {
        icon: Bot,
        label: "Silent AI Closer",
        desc: "AI-powered conversion system",
        href: "#ai-closer",
      },
      {
        icon: Sparkles,
        label: "Social Trust System",
        desc: "Build trust through content",
        href: "#social-trust",
      },
      {
        icon: Target,
        label: "Our Mission",
        desc: "Purpose behind our growth systems",
        href: "#mission",
      },
    ],
  },

  {
    label: "About Us",
    dropdown: [
      {
        icon: Users,
        label: "Our Team",
        desc: "Meet our creative experts",
        href: "#team",
      },
      {
        icon: Target,
        label: "Our Mission",
        desc: "Driving digital transformation",
        href: "#mission",
      },
      {
        icon: Eye,
        label: "Our Vision",
        desc: "Building future-first brands",
        href: "#vision",
      },
    ],
  },

  {
    label: "Industry",
    dropdown: [
      {
        icon: Landmark,
        label: "Legal",
        desc: "Growth systems for law firms",
        href: "#legal",
      },
      {
        icon: GraduationCap,
        label: "Education",
        desc: "Scale modern education brands",
        href: "#education",
      },
      {
        icon: Building2,
        label: "Finance",
        desc: "Digital growth for finance firms",
        href: "#finance",
      },
      {
        icon: Shield,
        label: "Security",
        desc: "Online visibility for security brands",
        href: "#security",
      },
      {
        icon: Briefcase,
        label: "Investigation",
        desc: "Digital presence for investigation agencies",
        href: "#investigation",
      },
    ],
  },

  {
    label: "Insights",
    dropdown: [
      {
        icon: BookOpen,
        label: "Blog",
        desc: "Latest marketing insights",
        href: "#blog",
      },
      {
        icon: FileText,
        label: "Case Studies",
        desc: "Real-world success stories",
        href: "#case-studies",
      },
      {
        icon: FileText,
        label: "White Papers",
        desc: "Industry research & reports",
        href: "#whitepapers",
      },
    ],
  },
];
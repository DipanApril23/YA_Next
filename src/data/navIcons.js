// ─── Navbar icon registry ─────────────────────────────────────────────
//
// WHY THIS FILE EXISTS
// The navbar silo lives in ./content/nav.json so it can be edited (and later
// served by a headless CMS) without touching code. JSON cannot hold a React
// component, so each node stores its icon as a KEY — the lucide-react
// component's name — and this map turns that key back into a component.
//
// It is the only place where the nav data touches React, which is exactly what
// keeps nav.json handover-ready.
//
// ADDING AN ICON
//   1. import it from lucide-react below and add it to NAV_ICONS
//   2. reference it by that exact name in content/nav.json, e.g. "icon": "Gavel"
// An unknown key renders no icon rather than crashing (see resolveNavIcons in
// ./nav.js), so a typo degrades gracefully instead of breaking the menu.
//
// Imports are explicit (not `import * as icons`) so the bundler tree-shakes
// everything else out of lucide-react — importing the whole set would ship
// roughly a thousand unused components.

import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Cloud,
  Code,
  Code2,
  Database,
  Eye,
  Facebook,
  FileText,
  Filter,
  Gavel,
  GraduationCap,
  HeartPulse,
  LayoutGrid,
  Magnet,
  Megaphone,
  Palette,
  PenTool,
  Plus,
  Rocket,
  Scale,
  Search,
  SearchCheck,
  Share2,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

export const NAV_ICONS = {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Cloud,
  Code,
  Code2,
  Database,
  Eye,
  Facebook,
  FileText,
  Filter,
  Gavel,
  GraduationCap,
  HeartPulse,
  LayoutGrid,
  Magnet,
  Megaphone,
  Palette,
  PenTool,
  Plus,
  Rocket,
  Scale,
  Search,
  SearchCheck,
  Share2,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
};

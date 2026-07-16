// ─── Footer: brand copy, links, contact details ───────────────────────

export const FOOTER_CONTENT = {
  brand: {
    href: "#home",
    ariaLabel: "Go to Home",
    logo: "https://youngarchitects.in/assets/logo/brandlogo.webp",
    logoAlt: "Young Architects logo",
  },
  // Rendered as separate lines (each followed by a line break).
  blurbLines: [
    "Drive your business forward with",
    "expert consultancy, SaaS solutions, and digital transformation.",
  ],
  blurbStrong: "Let's build something impactful—connect with us today.",
  trustLine: "Trusted by growing businesses across Kolkata & beyond.",
  headings: {
    quickLinks: "Quick Links",
    others: "Others",
    contact: "Contact Details",
  },
  addressLabel: "Address",
  // `{year}` is replaced at render time with the current year.
  copyright: "Copyright © {year} Young Architects. All Rights Reserved.",
};

export const FOOTER_QUICK_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/contact-us", label: "Contact Us" },
];

export const FOOTER_OTHER_LINKS = [
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

export const FOOTER_CONTACT = {
  phones: [
    { href: "tel:+919883952010", label: "+91 9883952010" },
    { href: "tel:+919432274587", label: "+91 9432274587" },
  ],
  email: { href: "mailto:yafoundations@gmail.com", label: "yafoundations@gmail.com" },
  socials: [
    { href: "https://www.linkedin.com/company/young-aarchitects", label: "LinkedIn", icon: "Linkedin" },
    { href: "#", label: "Facebook", icon: "Facebook" },
    { href: "#", label: "Instagram", icon: "Instagram" },
  ],
};

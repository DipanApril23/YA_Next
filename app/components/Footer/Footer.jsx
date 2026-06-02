import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";
import { Container } from "../shared";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <Container>
        <article className="py-10 sm:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.4fr] lg:gap-12">
            {/* Column 1 - Brand */}
            <div>
              <Link
                href="#home"
                aria-label="Go to Home"
                className="inline-flex items-center"
              >
                <Image
                  src="https://youngarchitects.in/assets/logo/brandlogo.webp"
                  alt="Young Architects logo"
                  width={260}
                  height={90}
                  priority
                  quality={100}
                  sizes="(max-width: 640px) 100vw, 260px"
                  className="h-auto w-full max-w-55 sm:max-w-65 select-none"
                />
              </Link>
              <br />
              <span className="mt-8 max-w-sm  leading-8 text-white">
                Drive your business forward with <br />
                expert consultancy, SaaS solutions, and digital transformation.{" "}
                <br />
                <strong>
                  Let&apos;s build something impactful—connect with us today.
                </strong>
              </span>
              <br />
              <span className="text-sm text-gray-400">
                Trusted by growing businesses across Kolkata & beyond.
              </span>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-2xl font-extrabold uppercase tracking-wide">
                Quick Links
              </h3>

              <ul className="mt-10 space-y-8">
                {[
                  { href: "/about-us", label: "About Us" },
                  { href: "/services", label: "Our Services" },
                  { href: "/contact-us", label: "Contact Us" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-4 text-lg font-semibold text-white/95 transition hover:text-secondary-light"
                    >
                      <span className="text-secondary-light transition group-hover:translate-x-1">
                        ~
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Others */}
            <div>
              <h3 className="text-2xl font-extrabold uppercase tracking-wide">
                Others
              </h3>

              <ul className="mt-10 space-y-8">
                {[
                  { href: "/disclaimer", label: "Disclaimer" },
                  {
                    href: "/terms-and-conditions",
                    label: "Terms & Conditions",
                  },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-4 text-lg font-semibold text-white/95 transition hover:text-secondary-light"
                    >
                      <span className="text-secondary-light transition group-hover:translate-x-1">
                        ~
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h3 className="text-2xl font-extrabold uppercase tracking-wide">
                Contact Details
              </h3>

              <div className="mt-10 space-y-6 text-base font-semibold text-white">
                <div className="flex items-start gap-4 hover:text-secondary-light">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-secondary-light" />
                  <span className="leading-8 hover:text-secondary-dark">
                    Address
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 shrink-0 text-secondary-light" />

                  <div className="flex items-center gap-3">
                    <a
                      href="tel:+919883952010"
                      className="transition hover:text-secondary-light"
                    >
                      +91 9883952010
                    </a>

                    <span className="text-white/50">|</span>

                    <a
                      href="tel:+919432274587"
                      className="transition hover:text-secondary-light"
                    >
                      +91 9432274587
                    </a>
                  </div>
                </div>

                <a
                  href="mailto:yafoundations@gmail.com"
                  className="flex items-center gap-4 break-all transition hover:text-secondary-light"
                >
                  <Mail className="h-5 w-5 shrink-0 text-secondary-light" />
                  yafoundations@gmail.com
                </a>
                <div className="flex items-center gap-4 py-4">
                  <a
                    href="https://www.linkedin.com/company/young-aarchitects"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="transition hover:text-secondary-dark"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="transition hover:text-secondary-dark"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="transition hover:text-secondary-dark"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-12 border-t border-white/15 pt-6">
            <p className="text-sm text-white/70">
              Copyright &copy; {new Date().getFullYear()} Young Architects. All
              Rights Reserved.
            </p>
          </div>
        </article>
      </Container>
    </footer>
  );
};

export default Footer;

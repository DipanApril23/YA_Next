import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, Linkedin, Facebook, Instagram } from "lucide-react";
import { Container } from "@/components/ui";
import {
  FOOTER_CONTENT as CONTENT,
  FOOTER_QUICK_LINKS,
  FOOTER_OTHER_LINKS,
  FOOTER_CONTACT,
} from "@/data";

const SOCIAL_ICONS = { Linkedin, Facebook, Instagram };

const LINK_CLASS =
  "group inline-flex items-center gap-4 text-lg font-semibold text-white/95 transition hover:text-secondary-light";

/* Shared markup for the Quick Links / Others columns. */
const LinkColumn = ({ heading, links }) => (
  <div>
    <h3 className="text-2xl font-extrabold uppercase tracking-wide">{heading}</h3>

    <ul className="mt-10 space-y-8">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className={LINK_CLASS}>
            <span className="text-secondary-light transition group-hover:translate-x-1">~</span>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const copyright = CONTENT.copyright.replace("{year}", new Date().getFullYear());

  return (
    <footer className="cv-section bg-black text-white">
      <Container>
        <article className="py-10 sm:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.4fr] lg:gap-12">
            {/* Column 1 - Brand */}
            <div>
              <Link
                href={CONTENT.brand.href}
                aria-label={CONTENT.brand.ariaLabel}
                className="inline-flex items-center"
              >
                <Image
                  src={CONTENT.brand.logo}
                  alt={CONTENT.brand.logoAlt}
                  width={260}
                  height={90}
                  loading="lazy"
                  quality={100}
                  sizes="(max-width: 640px) 100vw, 260px"
                  className="h-auto w-full max-w-55 sm:max-w-65 select-none"
                />
              </Link>
              <br />
              <span className="mt-8 max-w-sm leading-8 text-white">
                {CONTENT.blurbLines.map((line) => (
                  <Fragment key={line}>
                    {line} <br />
                  </Fragment>
                ))}
                <strong>{CONTENT.blurbStrong}</strong>
              </span>
              <br />
              <span className="text-sm text-gray-400">{CONTENT.trustLine}</span>
            </div>

            {/* Column 2 - Quick Links */}
            <LinkColumn heading={CONTENT.headings.quickLinks} links={FOOTER_QUICK_LINKS} />

            {/* Column 3 - Others */}
            <LinkColumn heading={CONTENT.headings.others} links={FOOTER_OTHER_LINKS} />

            {/* Column 4 - Contact */}
            <div>
              <h3 className="text-2xl font-extrabold uppercase tracking-wide">
                {CONTENT.headings.contact}
              </h3>

              <div className="mt-10 space-y-6 text-base font-semibold text-white">
                <div className="flex items-start gap-4 hover:text-secondary-light">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-secondary-light" />
                  <span className="leading-8 hover:text-secondary-dark">
                    {CONTENT.addressLabel}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 shrink-0 text-secondary-light" />

                  <div className="flex items-center gap-3">
                    {FOOTER_CONTACT.phones.map((phone, i) => (
                      <Fragment key={phone.href}>
                        {i > 0 && <span className="text-white/50">|</span>}
                        <a href={phone.href} className="transition hover:text-secondary-light">
                          {phone.label}
                        </a>
                      </Fragment>
                    ))}
                  </div>
                </div>

                <a
                  href={FOOTER_CONTACT.email.href}
                  className="flex items-center gap-4 break-all transition hover:text-secondary-light"
                >
                  <Mail className="h-5 w-5 shrink-0 text-secondary-light" />
                  {FOOTER_CONTACT.email.label}
                </a>

                <div className="flex items-center gap-4 py-4">
                  {FOOTER_CONTACT.socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="transition hover:text-secondary-dark"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-12 border-t border-white/15 pt-6">
            <p className="text-sm text-white/70">{copyright}</p>
          </div>
        </article>
      </Container>
    </footer>
  );
};

export default Footer;

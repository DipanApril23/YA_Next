// ─── ComingSoon ───────────────────────────────────────────────────────
// The page every menu destination renders until its real page is built.
//
// ONE DESIGN, 67 PAGES. Everything structural is shared so the whole set
// reads as one system; only three things change per page, and all three are
// read from the nav item the URL matched rather than authored twice:
//
//   heading      the menu row's own `label`
//   standfirst   the menu row's own `desc` (many rows already have one)
//   medallion    the menu row's own lucide `icon`
//
// So a page is titled by exactly the words the visitor clicked, and adding a
// menu item produces a finished page with no new file.
//
// IT IS A SERVER COMPONENT. The medallion, its orbit ring and the scan sweep
// are CSS; lucide's icons are plain SVG with no hooks. <MagneticButton> is a
// client component, but it needs no wrapper here — unlike the 404, this route
// lives inside the app shell, so MotionProvider's <LazyMotion> is already an
// ancestor and its springs work as they do everywhere else on the site.
//
// The navbar, the closing BrandMark and the footer all come from
// src/app/(site)/layout.js, which is why nothing renders them here.

import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton/MagneticButton";
import { COMING_SOON_CONTENT as CONTENT } from "@/data";
import { NAV_ICONS } from "@/data/navIcons";
import "./comingSoon.css";

export default function ComingSoon({ route }) {
  const { label, desc, trail, icon } = route;
  /* An unknown icon key renders the medallion empty rather than crashing —
     the same graceful degradation resolveNavIcons gives the menu. */
  const Icon = icon ? NAV_ICONS[icon] : null;

  return (
    <section className="cs-section">
      <div className="cs-backdrop" aria-hidden="true">
        <div className="cs-aurora cs-aurora--1" />
        <div className="cs-aurora cs-aurora--2" />
        <div className="cs-grid" />
      </div>

      <div className="cs-inner">
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        {/* Every ancestor is a real route (group nodes get pages too — see
            navRoutes.js), so each crumb is a working link rather than dead
            text a visitor cannot act on. */}
        <nav className="cs-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">{CONTENT.homeLabel}</Link>
            </li>
            {trail.map((crumb) => (
              <li key={crumb.path ?? crumb.label}>
                {crumb.path ? (
                  <Link href={crumb.path}>{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </li>
            ))}
            <li aria-current="page">
              <span className="cs-crumb-current">{label}</span>
            </li>
          </ol>
        </nav>

        {/* ── Medallion ──────────────────────────────────────────────── */}
        <div className="cs-medallion" aria-hidden="true">
          <span className="cs-medallion-orbit" />
          <span className="cs-medallion-core">{Icon ? <Icon strokeWidth={1.5} /> : null}</span>
        </div>

        <span className="cs-badge">
          <span className="cs-badge-dot" aria-hidden="true" />
          {CONTENT.badge}
        </span>

        <h1 className="cs-title">{label}</h1>

        <p className="cs-standfirst">{desc ?? CONTENT.fallbackDesc}</p>

        <p className="cs-body">{CONTENT.body}</p>

        {/* ── Actions ────────────────────────────────────────────────── */}
        <div className="cs-actions">
          {CONTENT.actions.map((action) => (
            <MagneticButton
              key={action.href}
              href={action.href}
              variant={action.variant}
              className="rounded-full px-7 py-3 text-sm"
            >
              {action.label}
            </MagneticButton>
          ))}
        </div>

        {/* ── Meanwhile ──────────────────────────────────────────────── */}
        {/* The page has nothing of its own to offer yet, so it hands the
            visitor back to the parts of the site that are finished. */}
        <div className="cs-meanwhile">
          <span className="cs-meanwhile-label">{CONTENT.meanwhileLabel}</span>
          <ul>
            {CONTENT.meanwhile.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="cs-meanwhile-link">
                  {item.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

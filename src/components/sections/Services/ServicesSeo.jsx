// ─── ServicesSeo ──────────────────────────────────────────────────────
// SERVER component (no "use client"): a crawlable, screen-reader-friendly
// representation of the entire services catalogue, plus Schema.org
// structured data.
//
// WHY THIS EXISTS
// The visible <Service> section is a client component that (a) mounts only
// when scrolled near and (b) shows one card at a time behind tabs + a modal.
// That is great UX but means a search engine (or a no-JS crawler) sees almost
// none of the copy — measured: 1 of 20 service names, 0 "learn more" detail.
//
// This block fixes that WITHOUT touching the visual design. It is:
//   • server-rendered → present in the raw HTML, no JS or scroll required
//   • `sr-only`       → visually hidden (1px, clipped) so sighted users never
//                       see it — the interactive deck is unchanged on screen
//   • semantic        → real <h2>/<h3>/<h4>, <p>, <ul> so the copy is indexed
//                       and screen-reader users get a clean linear catalogue
//
// It is NOT cloaking: every word here is the same content a visitor can reach
// by clicking through the tabs and "Learn More" — this just also exposes it
// to crawlers and assistive tech. Edit the copy in services.json only.

import servicesData from "./services.json";
import { SERVICE_TABS } from "./serviceCards.data";

// Flatten all tabs into one ordered list, tagging each with its category label.
const ALL_SERVICES = SERVICE_TABS.flatMap((tab) =>
  (servicesData[tab.id] || []).map((s) => ({ ...s, categoryLabel: tab.label }))
);

// Schema.org ItemList of Service entries — one structured record per service.
const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Young Architects — Services",
  itemListElement: ALL_SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      category: s.categoryLabel,
      description: s.description,
      provider: {
        "@type": "Organization",
        name: "Young Architects",
        url: "https://youngarchitects.in",
      },
    },
  })),
};

export default function ServicesSeo() {
  return (
    <>
      {/* Machine-readable structured data — no visual/aria footprint. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSONLD) }}
      />

      {/* Visually-hidden linear catalogue: indexed by crawlers, read by
          screen readers, invisible to sighted users. */}
      <section className="sr-only" aria-label="Our services in full">
        <h2>Premium Services Built to Scale</h2>
        <p>
          Streamline development, marketing, and design operations with our
          custom-made solutions engineered for enterprise-grade growth.
        </p>

        {SERVICE_TABS.map((tab) => (
          <div key={tab.id}>
            <h3>{`${tab.label} Services`}</h3>
            {(servicesData[tab.id] || []).map((service) => (
              <article key={service.title}>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                {service.learnMore?.intro && <p>{service.learnMore.intro}</p>}
                {Array.isArray(service.learnMore?.points) &&
                  service.learnMore.points.length > 0 && (
                    <ul>
                      {service.learnMore.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                {service.learnMore?.conclusion && (
                  <p>{service.learnMore.conclusion}</p>
                )}
              </article>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

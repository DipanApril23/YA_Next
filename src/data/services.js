// ─── Services section — data loader ───────────────────────────────────
//
// A thin adapter over the services catalogue and its section chrome:
//   ./content/services.json         the catalogue, keyed by tab id (CMS)
//   ./content/servicesSeo.json      the hidden crawlable intro copy (CMS)
//   ./config/serviceTabs.json       tab definitions + card-stack offsets (dev)
//   ./config/serviceSection.json    stat pills + decorative particles (dev)
//
// THE ONE CONTRACT THAT MATTERS
// `SERVICE_TABS[].id` must match a top-level key in content/services.json —
// that is how a tab finds its cards. `getServicesByTab` is the only place that
// join happens, and it returns [] for an unknown id so a mismatch renders an
// empty tab instead of throwing.
//
// Consumed by: Services/Service.jsx, Services/ServiceCards.jsx and
// Services/ServicesSeo.jsx (via the @/data barrel).

import servicesCatalogue from "./content/services.json";
import servicesSectionContent from "./content/servicesSection.json";
import servicesSeoContent from "./content/servicesSeo.json";
import tabConfig from "./config/serviceTabs.json";
import sectionConfig from "./config/serviceSection.json";

export const SERVICE_TABS = tabConfig.tabs;
export const CARD_OFFSETS = tabConfig.cardOffsets;

export const SERVICE_STATS = sectionConfig.stats;
export const SERVICE_PARTICLES = sectionConfig.particles;
export const SERVICE_SECTION = sectionConfig;

/* Copy for the visible deck (headings, tagline, CTA, view-mode labels). */
export const SERVICES_SECTION_CONTENT = servicesSectionContent.content;

export const SERVICES_CATALOGUE = servicesCatalogue;

/* Cards for one tab; [] when the id has no matching catalogue key. */
export const getServicesByTab = (tabId) => servicesCatalogue[tabId] || [];

/* Every service, flattened in tab order and tagged with its category label.
   Used by ServicesSeo to emit the whole catalogue as crawlable markup and as
   Schema.org ItemList entries. */
export const ALL_SERVICES = SERVICE_TABS.flatMap((tab) =>
  getServicesByTab(tab.id).map((service) => ({ ...service, categoryLabel: tab.label }))
);

export const SERVICES_SEO_CONTENT = servicesSeoContent.content;
export const SERVICES_SEO_ORGANIZATION = servicesSeoContent.organization;

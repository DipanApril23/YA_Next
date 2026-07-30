// ─── Main Services section — data loader ──────────────────────────────
//
// A thin adapter over ./content/mainServices.json — the "3 Houses" layout
// (Development House + Creative House side by side, Marketing House spanning
// full width below with a 2×2 grid of sub-groups).
//
// `icon` fields are KEYS, not components: they are resolved to lucide-react
// components by SERVICE_ICONS in MainServices.jsx. Keeping React out of the
// data is what lets this file map 1:1 onto a headless-CMS record.
//
// NOTE: this section is not currently mounted on any page (see the README's
// "Component inventory"). The data and component are kept ready to drop in.
//
// Consumed by: src/components/sections/MainServices/MainServices.jsx.

import mainServicesContent from "./content/mainServices.json";

export const MAIN_SERVICES_CONTENT = mainServicesContent.content;
export const MAIN_SERVICES = mainServicesContent.services;

// ─── ServiceCards: tab config + card-stack fanning offsets ─────────────

export const SERVICE_TABS = [
  { id: "marketing", label: "Marketing", color: "#AD449A", glow: "rgba(255,0,127,0.35)" },
  { id: "development", label: "Development", color: "#59B2E6", glow: "rgba(89,178,230,0.35)" },
  { id: "designing", label: "Designing", color: "#AD449A", glow: "rgba(168,85,247,0.35)" },
];

// Stack positions (0 = front … 3 = back)
export const CARD_OFFSETS = [
  { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 50, opacity: 1 },
  { x: 18, y: 14, rotate: 5, scale: 0.95, zIndex: 40, opacity: 0.85 },
  { x: 32, y: 24, rotate: 9, scale: 0.9, zIndex: 30, opacity: 0.65 },
  { x: 44, y: 32, rotate: 12, scale: 0.85, zIndex: 20, opacity: 0.45 },
];

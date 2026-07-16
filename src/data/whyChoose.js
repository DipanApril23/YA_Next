// ─── Why Choose Us section: rich copy ─────────────────────────────────
//
// The copy is stored as text segments rather than a single string so the
// coloured/bold emphasis stays data-driven. `tone` is semantic — the component
// maps it to a class, so no styling leaks into this file.
//   tone: "blue" | "dark" | "primary"   strong: renders inside <strong>

export const WHYCHOOSE_CONTENT = {
  headingLine1: [{ text: "Why choose Us ?", tone: "blue" }],
  headingLine2: [
    { text: " - ", tone: "dark" },
    { text: "Young Architects", tone: "primary" },
  ],
  body: [
    { text: "Choose " },
    { text: "Young Architects", tone: "primary", strong: true },
    {
      text: " for a client-centric approach where your vision is our priority. We offer tailored solutions through ",
    },
    { text: "deep business analysis", tone: "blue", strong: true },
    { text: ", " },
    { text: "collaborative consultancy", tone: "blue", strong: true },
    { text: ", and a " },
    { text: "commitment to perfection", tone: "blue", strong: true },
    { text: ". With us, you're not just a client — " },
    { text: "you're family", tone: "primary", strong: true },
    { text: "." },
  ],
};

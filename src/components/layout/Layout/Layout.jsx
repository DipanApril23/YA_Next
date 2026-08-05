// ─── Layout ───────────────────────────────────────────────────────────
// App shell shared by every route. Mounted once in src/app/layout.js, so the
// Navbar (via Header), the closing BrandMark statement and the Footer render
// on EVERY page — a visitor who lands on any route still gets the full frame.
// Only the page-specific sections come through `children`.

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MotionProvider from "../MotionProvider/MotionProvider";
import { SplashCursor, SectionDivider } from "@/components/ui";
import BrandMark from "@/components/sections/BrandMark/BrandMark";

const Layout = ({ children }) => {
  return (
    <MotionProvider>
      {/* Fixed-position overlay, not part of the visual stack — mounted here
          so the fluid trail follows the pointer on every route, and exactly
          once. The native cursor still does the pointing; this only paints
          behind it. Self-disables on touch and for reduced motion, and its
          gate keeps the simulation off those devices entirely. */}
      <SplashCursor />

      <Header />
      <main>{children}</main>

      {/* The seam into the closing statement travels with it: whatever a route
          ends on, BrandMark opens near-black, and an unmarked hard cut there
          reads as a dead slab rather than a deliberate edge. */}
      <SectionDivider />
      <BrandMark />
      <Footer />
    </MotionProvider>
  );
};

export default Layout;

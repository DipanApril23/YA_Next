// ─── Header ───────────────────────────────────────────────────────────
// App-shell banner: the black bar that hosts the Navbar on every page.

import Navbar from "../Navbar/Navbar";

const Header = () => {
  return (
    <header className="bg-black">
      <Navbar />
    </header>
  );
};

export default Header;

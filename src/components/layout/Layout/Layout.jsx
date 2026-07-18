// ─── Layout ───────────────────────────────────────────────────────────
// App shell shared by every route: Header + <main>{children}</main> + Footer.

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

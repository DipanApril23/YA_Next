// ─── Layout ───────────────────────────────────────────────────────────
// App shell shared by every route: Header + <main>{children}</main> + Footer.

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MotionProvider from "../MotionProvider/MotionProvider";

const Layout = ({ children }) => {
  return (
    <MotionProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </MotionProvider>
  );
};

export default Layout;

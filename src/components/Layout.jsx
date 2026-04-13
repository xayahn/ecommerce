/**
 * Layout.jsx
 * Wraps every page with Navbar, CartDrawer, and Footer.
 * Add pt-16 to account for fixed navbar height.
 */

import Navbar     from "./Navbar";
import Footer     from "./Footer";
import CartDrawer from "./CartDrawer";

/**
 * @param {{ children: React.ReactNode }} props
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
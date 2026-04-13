/**
 * Footer.jsx
 * Site-wide footer with links, newsletter, and social icons.
 */

import { Link } from "react-router-dom";
import {
  HiMail,
} from "react-icons/hi";
import {
  FaInstagram, FaTwitter, FaFacebookF, FaTiktok,
} from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products",  to: "/shop"                        },
    { label: "Electronics",   to: "/shop?collection=electronics" },
    { label: "Fashion",       to: "/shop?collection=fashion"     },
    { label: "Home & Living", to: "/shop?collection=home-living" },
    { label: "Sports",        to: "/shop?collection=sports"      },
  ],
  Help: [
    { label: "FAQ",            to: "/#" },
    { label: "Shipping Policy",to: "/#" },
    { label: "Returns",        to: "/#" },
    { label: "Track Order",    to: "/#" },
    { label: "Contact Us",     to: "/#" },
  ],
  Company: [
    { label: "About Us",   to: "/#" },
    { label: "Blog",       to: "/#" },
    { label: "Careers",    to: "/#" },
    { label: "Press",      to: "/#" },
  ],
};

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaTwitter,   label: "Twitter",   href: "#" },
  { icon: FaFacebookF, label: "Facebook",  href: "#" },
  { icon: FaTiktok,    label: "TikTok",    href: "#" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're subscribed! 🎉");
    setEmail("");
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-display font-bold text-white">
              ShopStore
            </Link>
            <p className="mt-3 text-sm text-neutral-400 max-w-xs leading-relaxed">
              Your one-stop destination for electronics, fashion, home goods, and more.
              Quality products, fast shipping.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-2">
                Subscribe to our newsletter
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700
                             text-sm text-white placeholder:text-neutral-500
                             focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white
                             text-sm font-semibold rounded-lg transition shrink-0"
                >
                  <HiMail className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-brand-600
                             flex items-center justify-center transition text-neutral-300
                             hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-neutral-400 hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} ShopStore. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/#" className="text-xs text-neutral-500 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/#" className="text-xs text-neutral-500 hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
/**
 * SEO.jsx
 * Dynamic document head manager.
 * Sets title, description, Open Graph, and Twitter meta tags per page.
 * Uses native DOM — no external library needed.
 */

import { useEffect } from "react";

const SITE_NAME    = "ShopStore";
const DEFAULT_DESC = "Your one-stop destination for electronics, fashion, home goods, and more.";
const DEFAULT_IMG  = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200";
const SITE_URL     = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

/**
 * @param {{
 *   title?:       string,
 *   description?: string,
 *   image?:       string,
 *   url?:         string,
 *   type?:        'website' | 'product' | 'article',
 *   noIndex?:     boolean,
 * }} props
 */
const SEO = ({
  title,
  description = DEFAULT_DESC,
  image       = DEFAULT_IMG,
  url,
  type        = "website",
  noIndex     = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl   = url   ? `${SITE_URL}${url}` : SITE_URL;

  useEffect(() => {
    // ── Document title ──────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Helper: set or create a meta tag ───────────────────────────────────
    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("name=")
          ? "name"
          : selector.includes("property=")
          ? "property"
          : "name";
        const val = selector.match(/["']([^"']+)["']/)?.[1] || "";
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // ── Standard meta ───────────────────────────────────────────────────────
    setMeta('meta[name="description"]',        description);
    setMeta('meta[name="robots"]',             noIndex ? "noindex,nofollow" : "index,follow");

    // ── Open Graph ──────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]',       fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]',       image);
    setMeta('meta[property="og:url"]',         fullUrl);
    setMeta('meta[property="og:type"]',        type);
    setMeta('meta[property="og:site_name"]',   SITE_NAME);

    // ── Twitter Card ────────────────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]',        "summary_large_image");
    setMeta('meta[name="twitter:title"]',       fullTitle);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]',       image);

    // ── Canonical link ──────────────────────────────────────────────────────
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

  }, [fullTitle, description, image, fullUrl, type, noIndex]);

  return null;
};

export default SEO;
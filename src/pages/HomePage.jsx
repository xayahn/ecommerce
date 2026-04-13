/**
 * HomePage.jsx
 * Landing page: Hero → Collections → Trending Products → Newsletter CTA
 */

import { useState, useEffect }       from "react";
import { Link, useNavigate }         from "react-router-dom";
import { HiArrowRight, HiSparkles }  from "react-icons/hi";
import ProductCard                   from "../components/ProductCard";
import { productService }            from "../services/productService";
import toast                         from "react-hot-toast";
import SEO from "../components/SEO";

// ─── Hero Slides ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id:       1,
    tag:      "New Arrivals",
    heading:  "Tech That Moves\nWith You",
    sub:      "Discover the latest in electronics, wearables, and smart home devices.",
    cta:      "Shop Electronics",
    link:     "/shop?collection=electronics",
    bg:       "from-neutral-900 to-brand-950",
    image:    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
  },
  {
    id:       2,
    tag:      "Trending Now",
    heading:  "Style That\nSpeaks Volumes",
    sub:      "Curated fashion for every occasion. From casual to refined.",
    cta:      "Shop Fashion",
    link:     "/shop?collection=fashion",
    bg:       "from-brand-900 to-neutral-900",
    image:    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200",
  },
  {
    id:       3,
    tag:      "Home Collection",
    heading:  "Transform Your\nLiving Space",
    sub:      "Furniture, lighting, and decor to make every room feel like home.",
    cta:      "Shop Home",
    link:     "/shop?collection=home-living",
    bg:       "from-neutral-800 to-brand-900",
    image:    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
  },
];

// ─── Features Bar ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🚚", label: "Free Shipping",    sub: "On orders over $50"    },
  { icon: "🔄", label: "Easy Returns",     sub: "30-day return policy"  },
  { icon: "🔒", label: "Secure Checkout",  sub: "SSL encrypted payments"},
  { icon: "💬", label: "24/7 Support",     sub: "We're always here"     },
];

const HomePage = () => {
  const navigate = useNavigate();

  // Hero slider
  const [slide,    setSlide   ] = useState(0);
  const [imgError, setImgError] = useState({});

  // Data
  const [collections, setCollections] = useState([]);
  const [trending,    setTrending   ] = useState([]);
  const [loadingCols, setLoadingCols] = useState(true);
  const [loadingProd, setLoadingProd] = useState(true);

  // Newsletter
  const [email, setEmail] = useState("");

  // Auto-advance hero
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch collections
  useEffect(() => {
    productService.getCollections()
      .then(setCollections)
      .catch(() => {})
      .finally(() => setLoadingCols(false));
  }, []);

  // Fetch trending (latest 8 products)
  useEffect(() => {
    productService.getProducts({ limit: 8, sortBy: "createdAt" })
      .then((r) => setTrending(r.products))
      .catch(() => {})
      .finally(() => setLoadingProd(false));
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks for subscribing! 🎉");
    setEmail("");
  };

  const current = HERO_SLIDES[slide];

  return (
    <div className="animate-fade-in">
      <SEO
        title="Home"
        description="Shop the latest electronics, fashion, home goods, and more at ShopStore."
        url="/"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[560px] max-h-[800px] overflow-hidden">
        {/* Background image */}
        <img
          key={current.id}
          src={current.image}
          alt={current.heading}
          onError={() => setImgError((p) => ({ ...p, [current.id]: true }))}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${current.bg} opacity-80`} />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        flex flex-col justify-center">
          <div className="max-w-xl animate-slide-up">
            <span className="inline-flex items-center gap-1.5 bg-brand-600/20 text-brand-300
                             text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-brand-500/30">
              <HiSparkles className="w-3.5 h-3.5" />
              {current.tag}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold
                           text-white leading-tight whitespace-pre-line mb-4">
              {current.heading}
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg mb-8 leading-relaxed">
              {current.sub}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={current.link}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700
                           text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                {current.cta}
                <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20
                           text-white font-semibold px-6 py-3 rounded-xl transition backdrop-blur-sm
                           border border-white/20"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? "w-8 bg-white" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Features Bar ─────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0
                          divide-neutral-100">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-3 px-6 py-5">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{f.label}</p>
                  <p className="text-xs text-neutral-400">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-1">
              Browse by Category
            </p>
            <h2 className="text-3xl font-display font-bold text-neutral-900">
              Shop Collections
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold
                       text-brand-600 hover:text-brand-700 transition"
          >
            View all <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingCols ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                <div className="aspect-square bg-neutral-200" />
                <div className="h-4 bg-neutral-200 rounded mt-2 mx-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {collections.map((col) => (
              <Link
                key={col.id}
                to={`/shop?collection=${col.handle}`}
                className="group relative rounded-2xl overflow-hidden aspect-square
                           shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <img
                  src={col.imageSrc}
                  alt={col.imageAlt || col.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110
                             transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-bold">{col.title}</p>
                  {col._count?.products !== undefined && (
                    <p className="text-neutral-300 text-xs">
                      {col._count.products} items
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Trending Products ─────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-1">
                Hot Right Now
              </p>
              <h2 className="text-3xl font-display font-bold text-neutral-900">
                Trending Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold
                         text-brand-600 hover:text-brand-700 transition"
            >
              See all <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingProd
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCard key={i} isLoading />
                ))
              : trending.map((product) => (
                  <ProductCard
                    key={product.id || product.handle}
                    product={product}
                  />
                ))
            }
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-2">Get deals & updates</h3>
          <p className="text-neutral-500 mb-6">Sign up for our newsletter.</p>
          <form onSubmit={handleNewsletter} className="flex gap-2 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="px-4 py-2 rounded-lg border border-neutral-200"
            />
            <button className="px-4 py-2 bg-brand-600 text-white rounded-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
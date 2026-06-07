"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { getProducts } from "../../lib/shopify/client";
import { Product } from "../../types/shopify";
import { Search, ShoppingBag, User, Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menus on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  // Track scrolling to toggle styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search autocomplete query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      const results = await getProducts({ query: searchQuery });
      setSearchResults(results.slice(0, 5));
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const trendingProducts = [
    { title: "Royal Banarasi Silk Saree", handle: "royal-banarasi-silk-saree" },
    { title: "Ivory Silk Cotton Kurta", handle: "ivory-silk-cotton-kurta" },
    { title: "Kundan Polki Choker Necklace", handle: "kundan-polki-choker-necklace" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex flex-col shadow-md">
        
        {/* Marquee status bar */}
        <div className="w-full bg-brand-deep border-b border-brand-forest/20 text-brand-ivory/95 py-2 overflow-hidden whitespace-nowrap text-[9px] font-sans font-bold uppercase tracking-widest flex select-none">
          <div className="animate-marquee flex gap-16 flex-shrink-0 pr-16">
            <span>• Complimentary Worldwide Shipping on orders above ₹10,000</span>
            <span>• 100% Handloom Mulberry Silk & Organic Cotton</span>
            <span>• Supporting 500+ Indian Artisan Families</span>
            <span>• Fine Kundan & Polki Jewelry Crafted Slowly</span>
          </div>
          <div className="animate-marquee flex gap-16 flex-shrink-0 pr-16" aria-hidden="true">
            <span>• Complimentary Worldwide Shipping on orders above ₹10,000</span>
            <span>• 100% Handloom Mulberry Silk & Organic Cotton</span>
            <span>• Supporting 500+ Indian Artisan Families</span>
            <span>• Fine Kundan & Polki Jewelry Crafted Slowly</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-brand-forest py-3"
              : "bg-brand-forest py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-brand-ivory hover:text-brand-gold transition-colors p-1"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left Nav (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-sans font-semibold uppercase tracking-widest text-brand-ivory/80">
            <Link
              href="/categories/women"
              className={`hover:text-brand-gold transition-colors ${
                pathname === "/categories/women" ? "text-brand-gold border-b border-brand-gold pb-1" : ""
              }`}
            >
              Women
            </Link>
            <Link
              href="/categories/men"
              className={`hover:text-brand-gold transition-colors ${
                pathname === "/categories/men" ? "text-brand-gold border-b border-brand-gold pb-1" : ""
              }`}
            >
              Men
            </Link>
             <Link
              href="/categories/jewellery"
              className={`hover:text-brand-gold transition-colors ${
                pathname === "/categories/jewellery" ? "text-brand-gold border-b border-brand-gold pb-1" : ""
              }`}
            >
              Jewellery
            </Link>

          </nav>

          {/* Logo */}
          <Link href="/" className="transition-opacity hover:opacity-85 select-none relative w-32 h-9 flex items-center justify-center">
            <Image
              src="/images/fehucode logo.png"
              alt="The Fehu Code Logo"
              width={128}
              height={35}
              className="object-contain filter brightness-110"
              priority
            />
          </Link>



          {/* Right Nav / Icons */}
          <div className="flex items-center space-x-6 text-brand-ivory">
            {/* Desktop About/Journal/Contact Links */}
            <nav className="hidden xl:flex items-center space-x-6 text-[10px] font-sans font-semibold uppercase tracking-widest text-brand-ivory/60 mr-4">
              <Link href="/#brand-story" className="hover:text-brand-gold transition-colors">
                About
              </Link>
              <span className="cursor-not-allowed hover:text-brand-gold transition-colors">Journal</span>
              <Link href="/contact" className="hover:text-brand-gold transition-colors">
                Contact
              </Link>
            </nav>

            {/* Icons */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-brand-gold transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/account"
              className="hidden md:block hover:text-brand-gold transition-colors p-1"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:text-brand-gold transition-colors p-1 relative flex items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-gold text-brand-forest text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-forest">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 z-55 w-80 bg-brand-forest text-brand-ivory p-8 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <div className="relative w-28 h-7 flex items-center">
                    <Image
                      src="/images/fehucode logo.png"
                      alt="The Fehu Code Logo"
                      width={108}
                      height={27}
                      className="object-contain filter brightness-110"
                    />
                  </div>


                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6 text-brand-ivory/80 hover:text-brand-gold" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6 text-sm font-sans font-semibold uppercase tracking-widest">
                  <Link href="/categories/women" className="hover:text-brand-gold py-2 border-b border-brand-deep">
                    Women
                  </Link>
                  <Link href="/categories/men" className="hover:text-brand-gold py-2 border-b border-brand-deep">
                    Men
                  </Link>
                  <Link href="/categories/jewellery" className="hover:text-brand-gold py-2 border-b border-brand-deep">
                    Jewellery
                  </Link>

                  <Link href="/#brand-story" className="hover:text-brand-gold py-2 border-b border-brand-deep text-brand-ivory/60">
                    About Story
                  </Link>
                  <Link href="/account" className="hover:text-brand-gold py-2 border-b border-brand-deep text-brand-ivory/60">
                    Account
                  </Link>
                  <span className="hover:text-brand-gold py-2 border-b border-brand-deep text-brand-ivory/60 cursor-not-allowed">
                    Journal
                  </span>
                  <Link href="/contact" className="hover:text-brand-gold py-2 border-b border-brand-deep text-brand-ivory/60">
                    Contact
                  </Link>
                </nav>
              </div>

              <div className="text-xs text-brand-ivory/40 font-sans tracking-wider">
                <p>© {new Date().getFullYear()} The Fehu Code.</p>
                <p className="mt-1">Indian Heritage, Contemporary Luxury.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-forest/98 flex flex-col"
          >
            {/* Search Header */}
            <div className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-brand-deep">
              <span className="font-serif text-xl tracking-wider text-brand-gold">Instant Search</span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-brand-ivory/70 hover:text-brand-gold transition-colors"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Search Input Body */}
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 flex flex-col space-y-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-brand-beige/30 focus:border-brand-gold text-2xl font-serif text-brand-ivory py-3 outline-none transition-colors pr-12 placeholder-brand-ivory/30"
                  autoFocus
                />
                <Search className="absolute right-2 top-4 w-7 h-7 text-brand-gold" />
              </div>

              {/* Suggestions / Trending */}
              {!searchQuery && (
                <div className="space-y-4">
                  <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-gold/80 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Trending Searches
                  </h4>
                  <div className="flex flex-col space-y-2">
                    {trendingProducts.map((p, idx) => (
                      <Link
                        key={idx}
                        href={`/products/${p.handle}`}
                        className="text-sm text-brand-ivory/70 hover:text-brand-gold flex items-center gap-2 group transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Autocomplete Results */}
              {searchQuery && (
                <div className="space-y-6 flex-1 overflow-y-auto">
                  <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-gold/80">
                    Results ({searchResults.length})
                  </h4>
                  
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-brand-ivory/50">No products found matching "{searchQuery}".</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.handle}`}
                          className="flex gap-4 p-3 bg-brand-deep/30 hover:bg-brand-deep/60 border border-brand-deep rounded transition-all group"
                        >
                          <div className="relative w-12 h-16 flex-shrink-0 bg-brand-deep/20 overflow-hidden">
                            <Image
                              src={product.images[0]?.url}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="text-sm font-sans font-medium text-brand-ivory group-hover:text-brand-gold transition-colors line-clamp-1">
                              {product.title}
                            </span>
                            <span className="text-xs text-brand-ivory/60 mt-0.5">
                              ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-gold font-semibold uppercase tracking-widest hover:underline"
                    >
                      View all results
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

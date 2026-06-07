"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getCollectionProducts, getCollections } from "../../lib/shopify/client";
import { Product, Collection, ProductVariant } from "../../types/shopify";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import CartDrawer from "../cart/CartDrawer";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Heart, SlidersHorizontal, ChevronDown, Check, Sparkles, X, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryClientProps {
  category: string;
  initialSubcategory?: string;
}

export default function CategoryClient({ category, initialSubcategory }: CategoryClientProps) {
  const { addToCart } = useCart();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and Sort states
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || "all");
  const [priceRange, setPriceRange] = useState<number>(35000);
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // Subcategory mapping
  const subcategoryMap: Record<string, string[]> = {
    women: ["Sarees", "Kurtas", "Dresses", "Co-ords", "Dupattas"],
    men: ["Shirts", "Kurtas", "Jackets", "T-Shirts"],
    jewellery: ["Earrings", "Necklaces", "Bracelets", "Rings"],

  };

  const subcategories = subcategoryMap[category] || [];

  // Dynamically calculate the list of colors available in these products
  const colorsList = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => {
      p.variants.forEach((v) => {
        v.selectedOptions.forEach((opt) => {
          if (opt.name === "Color" && opt.value) {
            colors.add(opt.value);
          }
        });
      });
    });
    return Array.from(colors).sort();
  }, [products]);


  // Fetch Category information and products
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const cols = await getCollections();
      const matchedCol = cols.find((c) => c.handle === category) || null;
      setCollection(matchedCol);

      const prods = await getCollectionProducts(category);
      setProducts(prods);
      setLoading(false);
    }
    fetchData();

    // Wishlist load
    const stored = localStorage.getItem("fehucode_wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }

    // Store last visited category in session storage for backtracking
    try {
      sessionStorage.setItem("fehucode_last_category", category);
    } catch (e) {
      console.warn("Failed to set session storage:", e);
    }
  }, [category]);


  // Sync initialSubcategory if searchParam changes
  useEffect(() => {
    if (initialSubcategory) {
      setSelectedSubcategory(initialSubcategory);
    }
  }, [initialSubcategory]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by subcategory
    if (selectedSubcategory !== "all") {
      result = result.filter(
        (p) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }

    // Filter by price
    result = result.filter((p) => {
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      return price <= priceRange;
    });

    // Filter by color
    if (selectedColor !== "all") {
      result = result.filter((p) =>
        p.variants.some((v) =>
          v.selectedOptions.some(
            (opt) => opt.name === "Color" && opt.value.toLowerCase().includes(selectedColor.toLowerCase())
          )
        )
      );
    }

    // Sorting
    if (sortBy === "price-low-to-high") {
      result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (sortBy === "price-high-to-low") {
      result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    } else if (sortBy === "newest") {
      result.sort((a, b) => (a.tags.includes("new-arrivals") ? -1 : 1));
    }

    return result;
  }, [products, selectedSubcategory, priceRange, selectedColor, sortBy]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated = [...wishlist];
    if (wishlist.includes(id)) {
      updated = updated.filter((wId) => wId !== id);
    } else {
      updated.push(id);
    }
    setWishlist(updated);
    localStorage.setItem("fehucode_wishlist", JSON.stringify(updated));
  };

  const handleQuickAdd = (product: Product, variant: ProductVariant, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, variant, 1);
  };

  const resetFilters = () => {
    setSelectedSubcategory("all");
    setPriceRange(35000);
    setSelectedColor("all");
    setSortBy("featured");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-36 pb-24 bg-brand-ivory">
        
        {/* Collection Banner */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 text-center">
          <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-3">
            Handcrafted Luxury
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-wider text-brand-forest uppercase mb-4">
            {collection?.title || category}
          </h1>
          <p className="text-xs text-brand-forest/70 font-sans max-w-xl mx-auto leading-relaxed">
            {collection?.description || "Timeless heritage designs and modern aesthetics blending Indian crafts with luxury styling."}
          </p>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto mt-6" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Subcategory Pills */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <button
                onClick={() => setSelectedSubcategory("all")}
                className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all rounded ${
                  selectedSubcategory === "all"
                    ? "bg-brand-forest text-brand-ivory"
                    : "border border-brand-beige hover:border-brand-forest text-brand-forest"
                }`}
              >
                All {collection?.title}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all rounded ${
                    selectedSubcategory.toLowerCase() === sub.toLowerCase()
                      ? "bg-brand-forest text-brand-ivory"
                      : "border border-brand-beige hover:border-brand-forest text-brand-forest"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Control Bar (Filters / Sorting trigger) */}
          <div className="flex items-center justify-between border-y border-brand-beige py-4 mb-8">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-forest hover:text-brand-gold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter & Refine
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-forest/40">Sort By</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold uppercase tracking-wider text-brand-forest pr-6 pl-1 outline-none border-b border-transparent hover:border-brand-gold cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-to-high">Price: Low to High</option>
                  <option value="price-high-to-low">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden lg:block space-y-8 sticky top-32">
              
              {/* Active filters summary */}
              {(selectedSubcategory !== "all" || priceRange < 35000 || selectedColor !== "all") && (
                <div className="pb-6 border-b border-brand-beige/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/40">Active Filters</span>
                    <button
                      onClick={resetFilters}
                      className="text-[9px] font-sans font-bold uppercase tracking-wider text-brand-gold underline hover:text-brand-forest"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSubcategory !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-beige/50 text-[10px] font-semibold text-brand-forest">
                        {selectedSubcategory}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSubcategory("all")} />
                      </span>
                    )}
                    {priceRange < 35000 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-beige/50 text-[10px] font-semibold text-brand-forest">
                        ≤ ₹{priceRange.toLocaleString()}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange(35000)} />
                      </span>
                    )}
                    {selectedColor !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-beige/50 text-[10px] font-semibold text-brand-forest">
                        {selectedColor}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedColor("all")} />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-forest">Max Price</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1000"
                    max="35000"
                    step="500"
                    value={priceRange > 35000 ? 35000 : priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-brand-gold cursor-pointer bg-brand-beige"
                  />
                  <div className="flex justify-between text-[10px] font-bold font-sans text-brand-forest/65">
                    <span>Min: ₹1,000</span>
                    <span>Slider Max: ₹35,000</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-sans font-bold text-brand-forest/50">Custom ₹</span>
                    <input
                      type="number"
                      min="1000"
                      value={priceRange}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPriceRange(isNaN(val) ? 1000 : val);
                      }}
                      className="w-full bg-white border border-brand-beige rounded px-2.5 py-1 text-xs font-semibold text-brand-forest outline-none focus:border-brand-gold"
                      placeholder="Enter price"
                    />
                  </div>
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-4 pt-6 border-t border-brand-beige/50">
                <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-forest">Artisan Shade</h4>
                <div className="flex flex-col space-y-2 text-xs font-sans text-brand-forest">
                  <button
                    onClick={() => setSelectedColor("all")}
                    className={`flex items-center justify-between text-left py-1 hover:text-brand-gold transition-colors ${
                      selectedColor === "all" ? "text-brand-gold font-bold" : ""
                    }`}
                  >
                    All Shades
                    {selectedColor === "all" && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {colorsList.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`flex items-center justify-between text-left py-1 hover:text-brand-gold transition-colors ${
                        selectedColor === col ? "text-brand-gold font-bold" : ""
                      }`}
                    >
                      {col}
                      {selectedColor === col && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>


            {/* Product Grid (Right side) */}
            <div className="lg:col-span-3 space-y-12">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, idx) => (
                    <div key={idx} className="animate-pulse space-y-4">
                      <div className="bg-brand-beige/50 aspect-[2/3] w-full" />
                      <div className="h-4 bg-brand-beige/50 w-2/3" />
                      <div className="h-4 bg-brand-beige/50 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-brand-beige/15 border border-dashed border-brand-beige p-8">
                  <SlidersHorizontal className="w-10 h-10 text-brand-forest/30 mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-medium text-brand-forest">No products found</h3>
                  <p className="text-xs text-brand-forest/60 mt-2 max-w-sm mx-auto">
                    Try broadening your filters or resetting them to discover more handcrafted pieces.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-2.5 bg-brand-forest text-brand-ivory text-xs font-semibold uppercase tracking-widest hover:bg-brand-deep transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {filteredProducts.slice(0, visibleCount).map((product) => {
                        const hasMultipleImages = product.images.length > 1;
                        const primaryVariant = product.variants[0];

                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            key={product.id}
                            className="bg-white border border-brand-beige/40 p-2.5 group relative luxury-glow flex flex-col justify-between"
                          >
                            <Link href={`/products/${product.handle}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-brand-beige/10">
                              {/* Primary Image */}
                              <Image
                                src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.title}
                                fill
                                className={`object-cover transition-all duration-[0.8s] ease-in-out ${
                                  hasMultipleImages ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                                }`}
                                sizes="(max-width: 768px) 160px, 240px"
                              />
                              {/* Hover Secondary Image */}
                              {hasMultipleImages && (
                                <Image
                                  src={product.images[1]?.url}
                                  alt={product.images[1]?.altText || product.title}
                                  fill
                                  className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-[0.8s] ease-in-out group-hover:scale-105"
                                  sizes="(max-width: 768px) 160px, 240px"
                                />
                              )}

                              {/* Wishlist */}
                              <button
                                onClick={(e) => toggleWishlist(product.id, e)}
                                className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-brand-forest/60 hover:text-brand-gold transition-colors z-20"
                                aria-label="Add to wishlist"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 transition-colors ${
                                    wishlist.includes(product.id) ? "fill-brand-gold text-brand-gold" : ""
                                  }`}
                                />
                              </button>

                              {/* Sale indicator */}
                              {parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || "0") > 0 && (
                                <span className="absolute top-2 left-2 bg-brand-gold text-brand-forest text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 z-20">
                                  Sale
                                </span>
                              )}

                              {/* Quick size hover panel */}
                              <div className="absolute inset-0 bg-brand-forest/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-3">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
                                  <div className="p-2.5 bg-brand-ivory/95 rounded-full shadow-lg text-brand-forest hover:bg-brand-gold transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="space-y-1.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                                  <p className="text-[8px] text-brand-ivory font-bold uppercase tracking-wider text-center">
                                    Quick Add Size
                                  </p>
                                  <div className="flex gap-1 justify-center flex-wrap">
                                    {product.variants.map((v) => {
                                      const sizeVal = v.selectedOptions.find((opt) => opt.name === "Size")?.value || v.title;
                                      return (
                                        <button
                                          key={v.id}
                                          disabled={!v.availableForSale}
                                          onClick={(e) => handleQuickAdd(product, v, e)}
                                          className="px-2 py-0.5 bg-white hover:bg-brand-gold text-brand-forest hover:text-brand-forest text-[8px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                                        >
                                          {sizeVal}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </Link>

                            <div className="pt-3.5 flex flex-col justify-between flex-1">
                              <div>
                                <span className="text-[8px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-1">
                                  {product.productType}
                                </span>
                                <Link href={`/products/${product.handle}`}>
                                  <h3 className="font-sans text-[11px] font-semibold text-brand-forest hover:text-brand-gold transition-colors line-clamp-1 leading-snug">
                                    {product.title}
                                  </h3>
                                </Link>
                              </div>
                              <div className="flex items-center gap-2 mt-2 font-sans text-xs font-semibold">
                                <span className="text-brand-forest">
                                  ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                                </span>
                                {product.compareAtPriceRange?.minVariantPrice?.amount && (
                                  <span className="text-brand-forest/40 line-through text-[10px]">
                                    ₹{parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {/* Load More pagination button */}
                  {filteredProducts.length > visibleCount && (
                    <div className="text-center pt-8">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="px-8 py-3.5 border border-brand-forest text-brand-forest text-xs font-semibold uppercase tracking-widest hover:bg-brand-forest hover:text-brand-ivory transition-all shadow-sm"
                      >
                        Load More Designs
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Collapsible Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-brand-ivory rounded-t-2xl shadow-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto lg:hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-brand-beige">
                <span className="font-serif text-lg font-bold tracking-wider text-brand-forest">Filter & Refine</span>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
                  <X className="w-6 h-6 text-brand-forest/65" />
                </button>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-forest">Max Price</h4>
                <input
                  type="range"
                  min="1000"
                  max="35000"
                  step="500"
                  value={priceRange > 35000 ? 35000 : priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-brand-gold bg-brand-beige cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold font-sans text-brand-forest/65">
                  <span>₹1,000</span>
                  <span className="text-brand-forest">₹{priceRange.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs font-sans font-bold text-brand-forest/50">Custom ₹</span>
                  <input
                    type="number"
                    min="1000"
                    value={priceRange}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setPriceRange(isNaN(val) ? 1000 : val);
                    }}
                    className="w-full bg-white border border-brand-beige rounded px-2.5 py-1.5 text-xs font-semibold text-brand-forest outline-none focus:border-brand-gold"
                    placeholder="Enter price"
                  />
                </div>
              </div>


              {/* Color Filter */}
              <div className="space-y-3 pt-4 border-t border-brand-beige/50">
                <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-forest">Artisan Shade</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedColor("all")}
                    className={`px-3 py-1.5 border text-xs font-semibold uppercase tracking-wider rounded ${
                      selectedColor === "all" ? "border-brand-gold bg-brand-gold text-brand-forest" : "border-brand-beige"
                    }`}
                  >
                    All Shades
                  </button>
                  {colorsList.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 border text-xs font-semibold uppercase tracking-wider rounded ${
                        selectedColor === col ? "border-brand-gold bg-brand-gold text-brand-forest" : "border-brand-beige"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-brand-beige">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 border border-brand-forest text-brand-forest text-xs font-semibold uppercase tracking-widest"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-brand-forest text-brand-ivory text-xs font-semibold uppercase tracking-widest"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
      <CartDrawer />
    </>
  );
}

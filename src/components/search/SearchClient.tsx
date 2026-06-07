"use client";

import React, { useState, useEffect } from "react";
import { getProducts } from "../../lib/shopify/client";
import { Product, ProductVariant } from "../../types/shopify";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Heart, Search, Eye, Sparkles } from "lucide-react";

interface SearchClientProps {
  initialQuery: string;
}

export default function SearchClient({ initialQuery }: SearchClientProps) {
  const { addToCart } = useCart();
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      const results = await getProducts({ query });
      setProducts(results);
      setLoading(false);
    }
    performSearch();

    // Wishlist load
    const stored = localStorage.getItem("fehucode_wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, [query]);

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-36 pb-24 bg-brand-ivory text-brand-forest font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Header & In-page Search Bar */}
          <div className="max-w-xl mx-auto text-center mb-16 space-y-6">
            <h1 className="font-serif text-3xl font-semibold tracking-wider uppercase">Search Results</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search our collection..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white border border-brand-beige focus:border-brand-gold px-4 py-3.5 pr-12 text-sm text-brand-forest outline-none transition-colors placeholder-brand-forest/30 shadow-sm"
              />
              <Search className="absolute right-4 top-3.5 w-5 h-5 text-brand-forest/40" />
            </div>
            {query && !loading && (
              <p className="text-xs text-brand-forest/65">
                We found <span className="font-semibold text-brand-forest">{products.length}</span> results for "{query}"
              </p>
            )}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="animate-pulse space-y-4">
                  <div className="bg-brand-beige/50 aspect-[2/3] w-full" />
                  <div className="h-4 bg-brand-beige/50 w-2/3" />
                  <div className="h-4 bg-brand-beige/50 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-brand-beige/15 border border-dashed border-brand-beige p-8 max-w-lg mx-auto">
              <h3 className="font-serif text-lg font-medium text-brand-forest">No results found</h3>
              <p className="text-xs text-brand-forest/60 mt-2">
                We couldn't find any designs matching your query. Try searching for "Saree", "Kurta", or "Gold".
              </p>
              
              <div className="mt-8 pt-8 border-t border-brand-beige/50 space-y-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold block">Trending Categories</span>
                <div className="flex gap-2 justify-center">
                  <Link href="/categories/women" className="px-3.5 py-1.5 border border-brand-beige hover:border-brand-forest text-xs font-semibold uppercase tracking-wider transition-colors">
                    Women
                  </Link>
                  <Link href="/categories/men" className="px-3.5 py-1.5 border border-brand-beige hover:border-brand-forest text-xs font-semibold uppercase tracking-wider transition-colors">
                    Men
                  </Link>
                  <Link href="/categories/jewellery" className="px-3.5 py-1.5 border border-brand-beige hover:border-brand-forest text-xs font-semibold uppercase tracking-wider transition-colors">
                    Jewellery
                  </Link>

                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => {
                const hasMultipleImages = product.images.length > 1;
                const primaryVariant = product.variants[0];

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-brand-beige/40 p-2.5 group relative luxury-glow flex flex-col justify-between"
                  >
                    <Link href={`/products/${product.handle}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-brand-beige/10">
                      {/* Images */}
                      <Image
                        src={product.images[0]?.url}
                        alt={product.title}
                        fill
                        className={`object-cover transition-all duration-[0.8s] ease-in-out ${
                          hasMultipleImages ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                        }`}
                        sizes="(max-width: 768px) 150px, 220px"
                      />
                      {hasMultipleImages && (
                        <Image
                          src={product.images[1]?.url}
                          alt={product.title}
                          fill
                          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-[0.8s] ease-in-out group-hover:scale-105"
                          sizes="(max-width: 768px) 150px, 220px"
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

                      {/* Quick Add Sizes */}
                      <div className="absolute inset-0 bg-brand-forest/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-3">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
                          <div className="p-2 bg-brand-ivory/95 rounded-full shadow-lg text-brand-forest hover:bg-brand-gold transition-colors">
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
                          <h3 className="font-sans text-[10px] font-semibold text-brand-forest hover:text-brand-gold transition-colors line-clamp-1 leading-snug">
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
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getProducts } from "../../lib/shopify/client";
import { Product, ProductVariant } from "../../types/shopify";
import { useCart } from "../../context/CartContext";
import { Heart, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Image from "next/image";

export default function NewArrivals() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch new arrivals on mount
  useEffect(() => {
    async function fetchProducts() {
      // Fetch products and filter specifically for sarees
      const allProducts = await getProducts();
      const sarees = allProducts.filter((p) =>
        p.productType.toLowerCase().includes("saree") ||
        p.title.toLowerCase().includes("saree") ||
        p.tags.some((t) => t.toLowerCase().includes("saree"))
      );
      setProducts(sarees.length > 0 ? sarees : allProducts.slice(0, 4));
    }
    fetchProducts();

    // Load wishlist
    const storedWishlist = localStorage.getItem("fehucode_wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

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

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-brand-ivory border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-2">
              LATEST CRAFTS
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-brand-forest uppercase">
              New Arrivals
            </h2>
          </div>

          {/* Slider buttons */}
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 border border-brand-beige text-brand-forest hover:bg-brand-forest hover:text-brand-ivory hover:border-brand-forest transition-colors rounded-full"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 border border-brand-beige text-brand-forest hover:bg-brand-forest hover:text-brand-ivory hover:border-brand-forest transition-colors rounded-full"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider */}
        <div
          ref={sliderRef}
          className="flex space-x-6 overflow-x-auto scrollbar-none pb-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => {
            const hasMultipleImages = product.images.length > 1;
            const primaryVariant = product.variants[0];

            return (
              <div
                key={product.id}
                className="w-[280px] md:w-[320px] flex-shrink-0 snap-start bg-white border border-brand-beige/40 p-3 group relative luxury-glow flex flex-col justify-between"
              >
                {/* Product Image Link */}
                <Link href={`/products/${product.handle}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-brand-beige/10">
                  {/* Primary Image */}
                  <Image
                    src={product.images[0]?.url}
                    alt={product.images[0]?.altText || product.title}
                    fill
                    className={`object-cover transition-all duration-[0.8s] ease-in-out ${
                      hasMultipleImages ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                    }`}
                    sizes="(max-width: 768px) 280px, 320px"
                  />
                  {/* Hover Secondary Image */}
                  {hasMultipleImages && (
                    <Image
                      src={product.images[1]?.url}
                      alt={product.images[1]?.altText || product.title}
                      fill
                      className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-[0.8s] ease-in-out group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 320px"
                    />
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-brand-forest/60 hover:text-brand-gold transition-colors z-20"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        wishlist.includes(product.id) ? "fill-brand-gold text-brand-gold" : ""
                      }`}
                    />
                  </button>

                  {/* Gold Highlight for Sale items */}
                  {parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || "0") > 0 && (
                    <span className="absolute top-3 left-3 bg-brand-gold text-brand-forest text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 z-20">
                      Sale
                    </span>
                  )}

                  {/* Luxury Hover Quick-Add Overlay */}
                  <div className="absolute inset-0 bg-brand-forest/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
                    {/* View Details Icon link */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
                      <div className="p-3 bg-brand-ivory/95 rounded-full shadow-lg text-brand-forest hover:bg-brand-gold hover:text-brand-forest transition-colors">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Quick Add Sizes */}
                    <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[9px] text-brand-ivory font-bold uppercase tracking-wider text-center">
                        Quick Add Size
                      </p>
                      <div className="flex gap-1.5 justify-center flex-wrap">
                        {product.variants.map((v) => {
                          const sizeVal = v.selectedOptions.find((opt) => opt.name === "Size")?.value || v.title;
                          return (
                            <button
                              key={v.id}
                              disabled={!v.availableForSale}
                              onClick={(e) => handleQuickAdd(product, v, e)}
                              className="px-2.5 py-1 bg-white hover:bg-brand-gold text-brand-forest hover:text-brand-forest text-[9px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {sizeVal}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="pt-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[8px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-1">
                      {product.productType}
                    </span>
                    <Link href={`/products/${product.handle}`}>
                      <h3 className="font-sans text-xs font-semibold text-brand-forest hover:text-brand-gold transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                  </div>
                  
                  {/* Prices */}
                  <div className="flex items-center gap-2 mt-2 font-sans text-xs font-semibold">
                    <span className="text-brand-forest">
                      ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                    </span>
                    {product.compareAtPriceRange?.minVariantPrice?.amount && (
                      <span className="text-brand-forest/40 line-through text-[11px]">
                        ₹{parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

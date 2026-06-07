"use client";

import React, { useState, useEffect } from "react";
import { getProductByHandle, getProducts } from "../../lib/shopify/client";
import { Product, ProductVariant } from "../../types/shopify";
import { useCart } from "../../context/CartContext";
import Image from "next/image";
import { ShoppingBag, CreditCard, Sparkles, Check } from "lucide-react";

export default function ProductSpotlight() {
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpotlight() {
      // Try live store handle first, then fall back to querying any available saree dynamically
      let p = await getProductByHandle("lotus-tussar-cotton-saree");
      if (!p) {
        p = await getProductByHandle("royal-banarasi-silk-saree");
      }
      if (!p) {
        const all = await getProducts();
        p = all.find(prod => 
          prod.productType.toLowerCase().includes("saree") || 
          prod.title.toLowerCase().includes("saree") ||
          prod.tags.some(t => t.toLowerCase().includes("saree"))
        ) || null;
      }
      
      setProduct(p);
      if (p && p.variants.length > 0) {
        setSelectedVariant(p.variants[0]);
      }
      setLoading(false);
    }
    fetchSpotlight();
  }, []);

  if (loading || !product || !selectedVariant) {
    return (
      <div className="py-24 bg-brand-ivory flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded bg-brand-beige h-96 w-80"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-brand-beige rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-brand-beige rounded"></div>
              <div className="h-4 bg-brand-beige rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, 1);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, 1);
    setIsCartOpen(true);
  };

  return (
    <section className="py-24 bg-brand-beige/10 border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Big Editorial Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-brand-beige p-2.5 bg-white shadow-xl luxury-glow group">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.title}
                fill
                className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-brand-forest/5" />
            </div>
          </div>

          {/* Right: Product details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Artisan Spotlight
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wider text-brand-forest uppercase leading-tight">
                {product.title}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-sans text-brand-forest">
                  ₹{parseFloat(selectedVariant.price).toLocaleString()}
                </span>
                {selectedVariant.compareAtPrice && (
                  <span className="text-sm font-semibold font-sans text-brand-forest/40 line-through">
                    ₹{parseFloat(selectedVariant.compareAtPrice).toLocaleString()}
                  </span>
                )}
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-brand-gold border border-brand-gold/30 px-2 py-0.5">
                  100% Handloom Mulberry Silk
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-forest/80 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Variant selector */}
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-widest text-brand-forest/60 uppercase">
                Select Shade
              </span>
              <div className="flex gap-3">
                {product.variants.map((v) => {
                  const colorOptionVal = v.selectedOptions.find((opt) => opt.name === "Color")?.value || v.title;
                  const isSelected = selectedVariant.id === v.id;

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider font-sans transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "border-brand-forest bg-brand-forest text-brand-ivory shadow-sm"
                          : "border-brand-beige hover:border-brand-forest text-brand-forest bg-transparent"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-brand-gold" />}
                      {colorOptionVal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-brand-forest text-brand-ivory text-xs font-semibold uppercase tracking-widest hover:bg-brand-deep transition-all flex items-center justify-center gap-2 group shadow-md"
              >
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 border border-brand-forest text-brand-forest text-xs font-semibold uppercase tracking-widest hover:bg-brand-forest hover:text-brand-ivory transition-all flex items-center justify-center gap-2 group"
              >
                <CreditCard className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                Buy It Now
              </button>
            </div>

            {/* Quick specifications icons */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-brand-beige/65 text-center text-brand-forest/70">
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold tracking-widest uppercase text-brand-forest/40">Weave Time</p>
                <p className="text-xs font-serif font-medium">18-20 Days</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold tracking-widest uppercase text-brand-forest/40">Origin</p>
                <p className="text-xs font-serif font-medium">Varanasi, India</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold tracking-widest uppercase text-brand-forest/40">Traceability</p>
                <p className="text-xs font-serif font-medium">100% Ethical</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

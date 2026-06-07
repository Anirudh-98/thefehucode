"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, ProductVariant, ProductImage } from "../../types/shopify";
import { getProducts } from "../../lib/shopify/client";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, ShoppingBag, CreditCard, Heart, ArrowLeft, Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductClientProps {
  initialProduct: Product;
}

// Classify product categories dynamically based on type/title/tags
function getProductCategory(p: Product): string {
  const typeLower = (p.productType || "").toLowerCase();
  const titleLower = (p.title || "").toLowerCase();
  const tagsLower = (p.tags || []).map((t) => t.toLowerCase());

  let category = "women";
  if (typeLower.includes("saree") || titleLower.includes("saree") || tagsLower.includes("sarees") || tagsLower.includes("saree") || tagsLower.includes("women")) {
    category = "women";
  } else if (typeLower.includes("shirt") || titleLower.includes("shirt") || typeLower.includes("kurta") || titleLower.includes("kurta") || tagsLower.includes("men")) {
    category = "men";
  } else if (typeLower.includes("jewelry") || typeLower.includes("earring") || typeLower.includes("necklace") || titleLower.includes("jhumka") || tagsLower.includes("jewelry")) {
    category = "jewellery";
  } else {
    category = "women";
  }


  console.log(`[getProductCategory] Product: "${p.title}" | Type: "${p.productType}" | Tags: ${JSON.stringify(p.tags)} => "${category}"`);
  return category;
}

const colorValueMap: Record<string, string> = {
  "forest green": "#0D3B2A",
  "royal crimson": "#8B0000",
  "gold": "#C9A86A",
  "ivory": "#FAF8F2",
  "indigo": "#2F3061",
  "black": "#1A1A1A",
  "white": "#FFFFFF",
  "blue": "#2E5B88",
  "orange": "#E67E22",
  "yellow": "#F1C40F",
  "pink": "#E8A7A1",
  "purple": "#7D3C98",
  "red": "#C0392B",
  "cream": "#FFFDD0",
  "lavender": "#D7BDE2",
  "copper": "#B87333",
  "grey": "#7F8C8D",
  "gray": "#7F8C8D",
  "bottle green": "#0F4C3A",
  "off-white": "#FAF9F6",
  "off- white": "#FAF9F6",
  "off white": "#FAF9F6",
  "royal blue": "#1B4F72",
  "onion": "#D98880",
  "tissue green": "#A2D9CE",
  "tissue gold": "#F5C869",
  "aqua green": "#76D7C4",
  "maroon": "#78281F",
  "sky blue": "#AED6F1",
  "pista green": "#D5F5E3",
  "light pista green": "#E8F8F5",
  "yellow & green": "linear-gradient(135deg, #F1C40F 50%, #2ECC71 50%)",
  "blue & yellow": "linear-gradient(135deg, #2E5B88 50%, #F1C40F 50%)",
  "purple & pista green": "linear-gradient(135deg, #7D3C98 50%, #D5F5E3 50%)",
  "bottle green & off- white": "linear-gradient(135deg, #0F4C3A 50%, #FAF9F6 50%)",
  "royal blue & off- white": "linear-gradient(135deg, #1B4F72 50%, #FAF9F6 50%)",
  "purple & off- white": "linear-gradient(135deg, #7D3C98 50%, #FAF9F6 50%)",
  "yellow & pink": "linear-gradient(135deg, #F1C40F 50%, #E8A7A1 50%)",
  "ochre yellow & pink": "linear-gradient(135deg, #D4AC0D 50%, #E8A7A1 50%)",
  "blue, orange, yellow": "linear-gradient(135deg, #2E5B88 33%, #E67E22 33%, #E67E22 66%, #F1C40F 66%)",
  "orange, green, yellow": "linear-gradient(135deg, #E67E22 33%, #2ECC71 33%, #2ECC71 66%, #F1C40F 66%)"
};

function getColorStyle(colorName: string): React.CSSProperties {
  const norm = colorName.toLowerCase().trim();
  const value = colorValueMap[norm];
  if (value) {
    if (value.startsWith("linear-gradient")) {
      return { background: value };
    }
    return { backgroundColor: value };
  }
  return { backgroundColor: colorName };
}



export default function ProductClient({ initialProduct: product }: ProductClientProps) {
  const { addToCart, setIsCartOpen } = Object.assign(useCart(), {});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "materials" | "shipping" | "care">("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [backCategory, setBackCategory] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastCat = sessionStorage.getItem("fehucode_last_category");
      if (lastCat) {
        setBackCategory(lastCat);
        return;
      }
    }
    setBackCategory(getProductCategory(product));
  }, [product]);


  // Parse option names
  const sizeOption = product.options.find((opt) => opt.name === "Size");
  const colorOption = product.options.find((opt) => opt.name === "Color");

  // Selected option values states
  const [selectedSize, setSelectedSize] = useState<string>(sizeOption?.values[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(colorOption?.values[0] || "");

  // Find active variant matching size and color options
  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) => {
      const sizeMatch = !sizeOption || variant.selectedOptions.some((opt) => opt.name === "Size" && opt.value === selectedSize);
      const colorMatch = !colorOption || variant.selectedOptions.some((opt) => opt.name === "Color" && opt.value === selectedColor);
      return sizeMatch && colorMatch;
    }) || product.variants[0];
  }, [product, selectedSize, selectedColor, sizeOption, colorOption]);

  // Load recommendations and wishlist state
  useEffect(() => {
    async function loadRecommendations() {
      try {
        const all = await getProducts();
        const currentCategory = getProductCategory(product);
        const recs = all
          .filter((p) => p.id !== product.id && getProductCategory(p) === currentCategory)
          .slice(0, 4);
        setRecommended(recs);
      } catch (e) {
        console.warn("Failed to load similar products:", e);
      }
    }
    loadRecommendations();

    const storedWishlist = localStorage.getItem("fehucode_wishlist");
    if (storedWishlist) {
      const arr = JSON.parse(storedWishlist) as string[];
      setWishlisted(arr.includes(product.id));
    }
  }, [product]);

  // Update active image index when selected color changes
  useEffect(() => {
    if (!selectedColor) return;
    
    // 1. Try to match by variant image
    if (selectedVariant?.image?.url) {
      const idx = product.images.findIndex((img) => img.url === selectedVariant.image?.url);
      if (idx !== -1) {
        setActiveImageIndex(idx);
        return;
      }
    }
    
    // 2. Try to match by image altText or filename containing selected color name
    const colorLower = selectedColor.toLowerCase();
    const altMatchIdx = product.images.findIndex((img) => 
      (img.altText || "").toLowerCase().includes(colorLower) ||
      (img.url || "").toLowerCase().includes(colorLower)
    );
    if (altMatchIdx !== -1) {
      setActiveImageIndex(altMatchIdx);
    }
  }, [selectedColor, selectedVariant, product.images]);

  const handleWishlistToggle = () => {
    const storedWishlist = localStorage.getItem("fehucode_wishlist");
    let arr: string[] = storedWishlist ? JSON.parse(storedWishlist) : [];
    
    if (wishlisted) {
      arr = arr.filter((id) => id !== product.id);
      setWishlisted(false);
    } else {
      arr.push(product.id);
      setWishlisted(true);
    }
    localStorage.setItem("fehucode_wishlist", JSON.stringify(arr));
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      setIsCartOpen(true);
    }
  };

  // Default fallback details
  const details = product.details || {
    materials: "Premium handcrafted handloom blend threads.",
    shipping: "Complimentary shipping on orders above ₹10,000. Delivered in 4-6 business days.",
    care: "Dry clean only or delicate cold wash. Low heat press."
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-36 pb-24 bg-brand-ivory text-brand-forest">
        
        {/* Navigation Breadcrumb back */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8 flex items-center">
          <Link
            href={`/categories/${backCategory || getProductCategory(product)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-forest/60 hover:text-brand-forest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Category
          </Link>

        </div>

        {/* Main PDP Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Product Gallery (Sticky on scroll) */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-4 lg:sticky lg:top-32">
            
            {/* Column 1: Thumbnails (Left side on desktop) */}
            <div className="col-span-2 hidden md:flex flex-col space-y-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[2/3] w-full bg-white border overflow-hidden p-1 transition-all ${
                    activeImageIndex === idx ? "border-brand-gold" : "border-brand-beige"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.title} thumb ${idx}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* Column 2: Big Image Display */}
            <div className="col-span-12 md:col-span-10 relative aspect-[2/3] bg-white border border-brand-beige p-2.5 shadow-md overflow-hidden cursor-zoom-in">
              <div
                className="relative w-full h-full"
                onClick={() => setIsZoomed(true)}
              >
                <Image
                  src={product.images[activeImageIndex]?.url || "/images/saree.png"}
                  alt={product.images[activeImageIndex]?.altText || product.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-102"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              </div>

              {/* Mobile Indicator dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === idx ? "bg-brand-gold w-4" : "bg-brand-beige/70"
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Product Buy Details */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Header info */}
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block">
                {product.productType}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-wider uppercase leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center justify-between border-b border-brand-beige pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold font-sans text-brand-forest">
                    ₹{parseFloat(selectedVariant.price).toLocaleString()}
                  </span>
                  {selectedVariant.compareAtPrice && (
                    <span className="text-sm font-semibold font-sans text-brand-forest/40 line-through">
                      ₹{parseFloat(selectedVariant.compareAtPrice).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Indicator */}
                <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border ${
                  selectedVariant.availableForSale 
                    ? "border-green-600/30 text-green-700 bg-green-50/50"
                    : "border-red-600/30 text-red-700 bg-red-50/50"
                }`}>
                  {selectedVariant.availableForSale ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Colors Variant Selector */}
            {colorOption && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-brand-forest/60">Color / Shade</span>
                  <span className="text-xs font-semibold text-brand-forest">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorOption.values.map((col) => {
                    const isActive = selectedColor === col;
                    const style = getColorStyle(col);
                    const isWhiteish = col.toLowerCase().includes("white") || col.toLowerCase().includes("ivory") || col.toLowerCase() === "cream";
                    return (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        style={style}
                        title={col}
                        className={`w-9 h-9 rounded-full border transition-all duration-300 relative ${
                          isActive 
                            ? "border-brand-forest scale-110 shadow-md ring-1 ring-brand-gold ring-offset-2" 
                            : "border-brand-beige hover:border-brand-forest hover:scale-105"
                        }`}
                        aria-label={`Select Color ${col}`}
                      >
                        {isActive && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className={`w-2 h-2 rounded-full ${isWhiteish ? 'bg-brand-forest' : 'bg-brand-ivory'}`} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}


            {/* Sizes Variant Selector */}
            {sizeOption && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-brand-forest/60">Select Size</span>
                  <span className="text-xs font-semibold text-brand-forest">{selectedSize}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizeOption.values.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-10 h-10 border text-xs font-bold font-sans transition-all flex items-center justify-center uppercase ${
                        selectedSize === sz
                          ? "border-brand-forest bg-brand-forest text-brand-ivory"
                          : "border-brand-beige hover:border-brand-forest text-brand-forest"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-brand-forest/60">Quantity</span>
              <div className="flex items-center border border-brand-beige max-w-[120px]">
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="p-2.5 px-3.5 text-brand-forest/60 hover:text-brand-forest hover:bg-brand-beige/30 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center text-xs font-bold font-sans text-brand-forest">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 px-3.5 text-brand-forest/60 hover:text-brand-forest hover:bg-brand-beige/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action buttons CTAs */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-4">
                <button
                  disabled={!selectedVariant.availableForSale}
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-brand-forest text-brand-ivory text-xs font-semibold uppercase tracking-widest hover:bg-brand-deep transition-all flex items-center justify-center gap-2 group shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Add to Cart
                </button>
                
                {/* Wishlist Icon */}
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 border transition-colors ${
                    wishlisted
                      ? "border-brand-gold text-brand-gold bg-brand-gold/5"
                      : "border-brand-beige hover:border-brand-forest text-brand-forest"
                  }`}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-brand-gold" : ""}`} />
                </button>
              </div>

              <button
                disabled={!selectedVariant.availableForSale}
                onClick={handleBuyNow}
                className="w-full py-4 border border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-brand-ivory text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                Buy It Now
              </button>
            </div>

            {/* Description / Tabs */}
            <div className="border-t border-brand-beige pt-8">
              <div className="flex border-b border-brand-beige text-center text-xs font-sans font-semibold uppercase tracking-wider">
                {(["description", "materials", "shipping", "care"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 pb-3 border-b-2 transition-all ${
                      activeTab === tab
                        ? "border-brand-gold text-brand-forest font-bold"
                        : "border-transparent text-brand-forest/50 hover:text-brand-forest"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="py-4 text-xs leading-relaxed text-brand-forest/75 font-sans min-h-[90px]">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "materials" && <p>{details.materials}</p>}
                {activeTab === "shipping" && <p>{details.shipping}</p>}
                {activeTab === "care" && <p>{details.care}</p>}
              </div>
            </div>

          </div>
        </div>

        {/* Recommended Products Spotlight Carousel */}
        {recommended.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-28 border-t border-brand-beige pt-16">
            <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-3 text-center">
              Curated for you
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-brand-forest uppercase text-center mb-12">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map((prod) => (
                <div key={prod.id} className="bg-white border border-brand-beige/40 p-2.5 group relative luxury-glow flex flex-col justify-between">
                  <Link href={`/products/${prod.handle}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-brand-beige/10">
                    <Image
                      src={prod.images[0]?.url}
                      alt={prod.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 150px, 220px"
                    />
                    {prod.images.length > 1 && (
                      <Image
                        src={prod.images[1]?.url}
                        alt={prod.title}
                        fill
                        className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 150px, 220px"
                      />
                    )}
                  </Link>
                  <div className="pt-3">
                    <span className="text-[8px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-0.5">
                      {prod.productType}
                    </span>
                    <Link href={`/products/${prod.handle}`} className="font-sans text-[10px] font-semibold text-brand-forest hover:text-brand-gold transition-colors line-clamp-1 leading-snug">
                      {prod.title}
                    </Link>
                    <span className="text-[10px] font-bold text-brand-forest mt-1.5 block">
                      ₹{parseFloat(prod.priceRange.minVariantPrice.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Fullscreen Zoom Image Overlay */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-zoom-out p-6"
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
              <Image
                src={product.images[activeImageIndex]?.url}
                alt={product.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            {/* Close Button */}
            <span className="absolute top-6 right-6 text-brand-ivory/80 hover:text-brand-gold transition-colors">
              Close (X)
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <CartDrawer />
    </>
  );
}

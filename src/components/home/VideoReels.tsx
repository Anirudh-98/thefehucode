"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { MOCK_PRODUCTS } from "../../lib/shopify/mockData";
import { Product } from "../../types/shopify";
import { getProducts } from "../../lib/shopify/client";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ShoppingBag, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Reel {
  id: string;
  videoUrl: string;
  posterUrl: string;
  title: string;
  subtitle: string;
  description: string;
  productHandle: string;
}

const REELS_DATA: Reel[] = [
  {
    id: "reel_1",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/cf1fa4683a8240709dd89ff8c264b0f1.mp4",
    posterUrl: "/images/saree.png",
    title: "Weaving the Banarasi",
    subtitle: "Loom Heritage",
    description: "Watch the meticulous handloom pit loom weaving process of our pure Banarasi silk sarees, taking over 12 days of intricate zari craftsmanship.",
    productHandle: "lotus-tussar-cotton-saree",
  },
  {
    id: "reel_2",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/cf1fa4683a8240709dd89ff8c264b0f1.mp4",
    posterUrl: "/images/contemporary.png",
    title: "The Jaipur Drafting",
    subtitle: "Atelier Studio",
    description: "From hand-drawn block prints to precise tailoring draping, see how our indigo cotton maxi dress comes to life in Rajasthan.",
    productHandle: "paturu-ikkat-cotton-by-pattu-saree-1",
  },
  {
    id: "reel_3",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/cb720682a2c543e384b489f39561bfa8.mp4",
    posterUrl: "/images/jewelry.png",
    title: "Polishing the Kundan",
    subtitle: "Artisanal Jewelry",
    description: "A close-up look at setting raw polki uncut diamonds into fine gold-foiled bezels, suspended with natural emerald droplets.",
    productHandle: "golden-jute-cotton-saree",
  },
  {
    id: "reel_4",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/6fa21f8bb2f249878920a77fd4c76a20.mp4",
    posterUrl: "/images/men_kurta.png",
    title: "Sizing & Fit Styling",
    subtitle: "Menswear Cut",
    description: "Discover the premium tailoring details, high band collars, and organic handspun cotton texture of our menswear kurtas.",
    productHandle: "dharmo-rakshati-rakshitaha-oversized-t-shirt",
  },
];

export default function VideoReels() {
  const { addToCart, setIsCartOpen } = useCart();
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playingState, setPlayingState] = useState<{ [key: string]: boolean }>({});
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  // Play / Pause utility for cards on hover
  const handleCardMouseEnter = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.play().then(() => {
        setPlayingState(prev => ({ ...prev, [id]: true }));
      }).catch(() => {
        // Fallback for autoplay blocks
      });
    }
  };

  const handleCardMouseLeave = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
      setPlayingState(prev => ({ ...prev, [id]: false }));
    }
  };

  // Scroll Slider
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.75;
      sliderRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle open modal
  const openReelModal = (index: number) => {
    setActiveReelIndex(index);
    setIsMuted(false); // Unmute on active click
  };

  const closeReelModal = () => {
    setActiveReelIndex(null);
  };

  // Handle Modal video playback triggers
  useEffect(() => {
    if (activeReelIndex !== null && modalVideoRef.current) {
      modalVideoRef.current.load();
      modalVideoRef.current.play().catch(() => {});
    }
  }, [activeReelIndex]);

  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const prods = await getProducts();
        setLiveProducts(prods);
      } catch (e) {
        console.warn("Failed to load live products for video reels:", e);
      }
    }
    fetchLiveProducts();
  }, []);

  // Find linked product details
  const getLinkedProduct = (handle: string): Product | undefined => {
    const found = liveProducts.find(p => p.handle === handle);
    if (found) return found;

    return MOCK_PRODUCTS.find(p => p.handle === handle);
  };

  return (
    <section className="py-24 bg-brand-ivory text-brand-forest relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block">
              Loom to Wardrobe
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide uppercase">
              Stories in <span className="italic font-normal font-serif">Motion</span>
            </h2>
            <div className="w-16 h-0.5 bg-brand-gold" />
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 border border-brand-beige hover:border-brand-gold hover:text-brand-gold rounded-full transition-all bg-white/50 backdrop-blur-sm"
              aria-label="Previous Reels"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 border border-brand-beige hover:border-brand-gold hover:text-brand-gold rounded-full transition-all bg-white/50 backdrop-blur-sm"
              aria-label="Next Reels"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Reels Slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 -mx-4 md:-mx-0"
        >
          {REELS_DATA.map((reel, idx) => {
            const product = getLinkedProduct(reel.productHandle);
            return (
              <div
                key={reel.id}
                className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[9/16] snap-start bg-brand-deep rounded-2xl overflow-hidden relative shadow-lg group cursor-pointer border border-brand-beige/20 hover:border-brand-gold/40 transition-all duration-500 hover:shadow-xl"
                onMouseEnter={() => handleCardMouseEnter(reel.id)}
                onMouseLeave={() => handleCardMouseLeave(reel.id)}
                onClick={() => openReelModal(idx)}
              >
                {/* Looping HTML5 Video */}
                <video
                  ref={el => { videoRefs.current[reel.id] = el; }}
                  src={reel.videoUrl}
                  preload="metadata"
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/90 via-transparent to-brand-forest/30 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Play hover badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: playingState[reel.id] ? 1.1 : 1,
                      opacity: playingState[reel.id] ? 0 : 0.8 
                    }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-brand-gold/90 text-brand-forest rounded-full shadow-lg"
                  >
                    <Play className="w-5 h-5 fill-brand-forest ml-0.5" />
                  </motion.div>
                </div>

                {/* Text overlay & Product details */}
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-4">
                  {/* Floating Product Sticker */}
                  {product && (

                    <div
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid opening the reel modal
                      }}
                      className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-brand-beige flex items-center justify-between gap-3 shadow-md hover:bg-white transition-all transform group-hover:translate-y-0 translate-y-1 duration-300"
                    >
                      <Link 
                        href={`/products/${product.handle}`}
                        className="flex items-center gap-2.5 flex-1 min-w-0"
                      >
                        <div className="relative w-10 h-12 bg-brand-ivory rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images[0]?.url || reel.posterUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-forest truncate">
                            {product.title}
                          </h4>
                          <p className="text-[10px] font-sans text-brand-gold font-semibold mt-0.5">
                            ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                          </p>
                        </div>
                      </Link>

                      <button
                        onClick={async () => {
                          // Add to Cart and open sidecart drawer
                          const primaryVariant = product.variants[0];
                          if (primaryVariant) {
                            addToCart(product, primaryVariant, 1);
                            setIsCartOpen(true);
                          }
                        }}
                        className="p-2.5 bg-brand-forest text-brand-ivory hover:bg-brand-gold hover:text-brand-forest rounded-lg transition-all"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* IMMERSIVE FULL-SCREEN MODAL REEL VIEWER */}
      <AnimatePresence>
        {activeReelIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-lg flex items-center justify-center p-0 md:p-6"
          >
            {/* Close Modal */}
            <button
              onClick={closeReelModal}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-brand-ivory rounded-full z-55 transition-all shadow-md"
              aria-label="Close Immersive Reels"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Modal Layout Grid */}
            <div className="w-full max-w-5xl h-full md:h-[90vh] grid grid-cols-1 md:grid-cols-12 gap-0 bg-brand-deep border border-brand-forest/20 rounded-none md:rounded-3xl overflow-hidden relative shadow-2xl">
              
              {/* Left Column: Immersive Video Viewport */}
              <div className="md:col-span-7 bg-black relative flex items-center justify-center h-full">
                
                <video
                  ref={modalVideoRef}
                  src={REELS_DATA[activeReelIndex].videoUrl}
                  preload="metadata"
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-contain md:object-cover"
                />

                {/* Sound Toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-6 right-6 p-3 bg-black/50 hover:bg-black/80 text-brand-ivory rounded-full z-52 transition-all border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* Left/Right Mobile swipe hint / click buttons */}
                <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4 pointer-events-none">
                  <button
                    disabled={activeReelIndex === 0}
                    onClick={() => setActiveReelIndex(activeReelIndex - 1)}
                    className="p-2 bg-black/40 hover:bg-black/70 text-brand-ivory rounded-full pointer-events-auto disabled:opacity-0 transition-opacity border border-white/10"
                    aria-label="Previous Reel"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    disabled={activeReelIndex === REELS_DATA.length - 1}
                    onClick={() => setActiveReelIndex(activeReelIndex + 1)}
                    className="p-2 bg-black/40 hover:bg-black/70 text-brand-ivory rounded-full pointer-events-auto disabled:opacity-0 transition-opacity border border-white/10"
                    aria-label="Next Reel"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Narrative Details & Product Feature Drawer */}
              <div className="hidden md:flex md:col-span-5 bg-brand-forest text-brand-ivory p-8 md:p-12 flex-col justify-between overflow-y-auto border-l border-brand-deep">
                
                {/* Upper Section: Narrative description */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Artisan Chronicles
                    </span>
                    <h2 className="font-serif text-2xl font-light tracking-wide uppercase text-brand-ivory">
                      {REELS_DATA[activeReelIndex].title}
                    </h2>
                    <div className="w-12 h-0.5 bg-brand-gold" />
                  </div>
                  
                  <p className="text-xs text-brand-ivory/70 leading-relaxed font-sans">
                    {REELS_DATA[activeReelIndex].description}
                  </p>
                </div>

                {/* Lower Section: Product shop interface */}
                {(() => {
                  const product = getLinkedProduct(REELS_DATA[activeReelIndex].productHandle);
                  if (!product) return null;

                  return (
                    <div className="space-y-6 pt-8 border-t border-brand-deep">
                      <div className="bg-brand-deep/50 p-4 border border-brand-deep rounded-2xl space-y-4">
                        <div className="flex gap-4">
                          <div className="relative w-16 h-20 bg-brand-forest rounded overflow-hidden flex-shrink-0 border border-brand-deep">
                            <Image
                              src={product.images[0]?.url || REELS_DATA[activeReelIndex].posterUrl}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <span className="text-[9px] font-sans uppercase font-bold tracking-widest text-brand-gold">
                              {product.productType}
                            </span>
                            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-ivory line-clamp-1">
                              {product.title}
                            </h3>
                            <p className="text-sm font-sans text-brand-gold font-bold">
                              ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <p className="text-[10px] text-brand-ivory/60 leading-relaxed font-sans line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* CTAs */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={async () => {
                            const primaryVariant = product.variants[0];
                            if (primaryVariant) {
                              addToCart(product, primaryVariant, 1);
                              closeReelModal();
                              setIsCartOpen(true);
                            }
                          }}
                          className="py-3 bg-brand-gold text-brand-forest text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-forest transition-all duration-300 rounded flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                        
                        <Link
                          href={`/products/${product.handle}`}
                          onClick={closeReelModal}
                          className="py-3 border border-brand-gold/60 text-brand-gold hover:border-white hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

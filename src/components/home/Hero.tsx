"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroPanel {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  ctaText: string;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const panels: HeroPanel[] = [
    {
      title: "Heritage Handlooms",
      subtitle: "Traditional Banarasi Mulberry Silk Sarees",
      image: "/images/saree.png",
      link: "/categories/women?sub=sarees",
      ctaText: "Explore Sarees",
    },
    {
      title: "Contemporary Linen",
      subtitle: "Tailored Organic Cotton Dresses",
      image: "/images/contemporary.png",
      link: "/categories/women?sub=dresses",
      ctaText: "Shop Contemporary",
    },
    {
      title: "The Modern Man",
      subtitle: "Fine Raw Silk and Khadi Kurtas",
      image: "/images/men_kurta.png",
      link: "/categories/men",
      ctaText: "Shop Men",
    },
    {
      title: "Artisanal Kundan",
      subtitle: "Polki and Raw Emerald Jewellery",
      image: "/images/jewelry.png",
      link: "/categories/jewellery",
      ctaText: "Discover Fine Jewellery",
    },

  ];

  // Auto-slide rotation on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % panels.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [panels.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % panels.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + panels.length) % panels.length);
  };

  return (
    <section className="relative h-[92vh] lg:h-[90vh] w-full bg-brand-forest overflow-hidden mt-16 md:mt-20">
      
      {/* Desktop view: 4-Panel Expanding Grid */}
      <div className="hidden lg:flex h-full w-full flex-row">
        {panels.map((panel, idx) => (
          <motion.div
            key={idx}
            className="relative flex-1 hover:flex-[1.5] xl:hover:flex-[1.8] h-full transition-all duration-700 ease-out overflow-hidden group border-r border-brand-forest/30 last:border-0"
          >
            {/* Background Image with Ken Burns zoom */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[2.5s] ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${panel.image})` }}
            />
            {/* Color Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/90 via-brand-forest/30 to-brand-forest/10 group-hover:via-brand-forest/40 transition-colors duration-500" />

            {/* Content Container */}
            <div className="absolute inset-0 p-12 flex flex-col justify-end text-brand-ivory z-10">
              <span className="text-brand-gold text-[10px] font-semibold uppercase tracking-widest mb-1.5 opacity-80 block">
                {panel.subtitle}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide uppercase leading-tight mb-4">
                {panel.title}
              </h2>

              {/* Collapsed CTA reveals on hover */}
              <div className="h-0 group-hover:h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center">
                <Link
                  href={panel.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-ivory border-b border-brand-gold hover:border-brand-ivory pb-1 transition-colors"
                >
                  {panel.ctaText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile view: Auto-rotating Carousel */}
      <div className="relative h-full w-full lg:hidden overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${panels[currentSlide].image})` }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/95 via-brand-forest/45 to-brand-forest/20" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-brand-ivory z-10 pb-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-brand-gold text-[10px] font-semibold uppercase tracking-widest mb-2 block"
              >
                {panels[currentSlide].subtitle}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl font-semibold tracking-wide uppercase leading-tight mb-6"
              >
                {panels[currentSlide].title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href={panels[currentSlide].link}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold border-b border-brand-gold pb-1"
                >
                  {panels[currentSlide].ctaText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel manual navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-forest/40 hover:bg-brand-forest/70 text-brand-ivory rounded-full z-20 backdrop-blur-sm transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-brand-forest/40 hover:bg-brand-forest/70 text-brand-ivory rounded-full z-20 backdrop-blur-sm transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {panels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === idx ? "bg-brand-gold w-6" : "bg-brand-ivory/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}

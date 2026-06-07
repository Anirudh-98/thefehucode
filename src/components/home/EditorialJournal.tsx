"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function EditorialJournal() {
  const articles = [
    {
      category: "Dyeing Craft",
      title: "The Alchemy of Natural Indigo",
      date: "May 15, 2026",
      image: "/images/contemporary.png",
      desc: "An exploration into the slow fermentation process of organic indigo woodblocks in Rajasthan, preserving centuries of natural color extraction.",
    },
    {
      category: "Weaving Heritage",
      title: "Varanasi: Weaving the Gold Zari",
      date: "April 28, 2026",
      image: "/images/saree.png",
      desc: "Step inside the handloom artisan cooperatives preserving the delicate metalcraft of Banarasi silk zari weaving on wooden floor looms.",
    },
    {
      category: "Modern Menswear",
      title: "Redefining the Classic Kurta",
      date: "March 10, 2026",
      image: "/images/men_kurta.png",
      desc: "How structured raw silk-cotton blends and clean band collars are bringing quiet luxury and versatility into modern daily wear.",
    },
  ];

  return (
    <section className="py-24 bg-brand-ivory border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block">
            THE CHRONICLES
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-brand-forest uppercase">
            Artisan Journals
          </h2>
          <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4" />
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <div
              key={idx}
              className="flex flex-col group bg-white border border-brand-beige/40 p-4 luxury-glow transition-all"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-brand-beige/10 mb-6">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
              </div>

              {/* Text details */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[9px] font-sans font-bold uppercase tracking-wider text-brand-gold">
                    <span>{art.category}</span>
                    <span className="text-brand-forest/40">{art.date}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-brand-forest group-hover:text-brand-gold transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-brand-forest/70 leading-relaxed font-sans line-clamp-3">
                    {art.desc}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-forest hover:text-brand-gold transition-colors pt-2 group-hover:underline">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

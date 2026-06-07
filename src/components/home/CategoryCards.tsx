"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CategoryCards() {
  const categories = [
    {
      title: "Women",
      subtitle: "Heritage & Resort Wear",
      image: "/images/saree.png",
      link: "/categories/women",
    },
    {
      title: "Men",
      subtitle: "Timeless Tailored Cuts",
      image: "/images/men_kurta.png",
      link: "/categories/men",
    },
    {
      title: "Jewellery",
      subtitle: "Fine Handcrafted Jewels",
      image: "/images/jewelry.png",
      link: "/categories/jewellery",
    },

  ];

  return (
    <section className="py-24 bg-brand-ivory border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        
        {/* Title */}
        <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-3">
          Timeless Aesthetics
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wider text-brand-forest uppercase mb-16">
          Shop by Category
        </h2>

        {/* Circular Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.link} className="group flex flex-col items-center">
              
              {/* Circular Image Container */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-brand-beige group-hover:border-brand-gold p-1.5 transition-all duration-500 luxury-glow">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                  {/* Subtle dark vignette overlay */}
                  <div className="absolute inset-0 bg-brand-forest/10 group-hover:bg-brand-forest/20 transition-colors duration-500" />
                </div>
              </div>

              {/* Text */}
              <h3 className="font-serif text-xl font-semibold tracking-widest text-brand-forest uppercase mt-6 group-hover:text-brand-gold transition-colors">
                {cat.title}
              </h3>
              <p className="text-[10px] font-sans font-medium text-brand-forest/60 tracking-widest uppercase mt-1">
                {cat.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

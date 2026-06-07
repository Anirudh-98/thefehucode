"use client";

import React from "react";
import { Feather, Droplet, Hourglass, Users } from "lucide-react";

export default function BrandStory() {
  const stories = [
    {
      title: "Heritage Handloom",
      desc: "From the traditional floor looms of Varanasi to lightweight Chanderi weaves, we partner with master weavers to keep centuries-old pit looms active.",
      icon: Feather,
    },
    {
      title: "Natural Vat Dyeing",
      desc: "Our color palette is derived from organic indigo vats, wild madder root, and pomegranate rinds, fermented traditionally without toxic chemicals.",
      icon: Droplet,
    },
    {
      title: "Slow Artistry",
      desc: "A single Banarasi silk saree takes up to twenty days of meticulous hand-weaving. We reject fast-fashion mills, honoring the artisan's patient rhythm.",
      icon: Hourglass,
    },
    {
      title: "Artisan Sovereignty",
      desc: "By working directly with weaver cooperatives and craft clusters, we guarantee fair wages, safe workspaces, and stable futures for artisan lineages.",
      icon: Users,
    },
  ];

  return (
    <section id="brand-story" className="py-24 bg-brand-forest text-brand-ivory scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wider uppercase">
            Crafted Slowly. Woven Eternally.
          </h2>
          <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4" />
          <p className="text-xs text-brand-ivory/80 leading-relaxed font-sans pt-4 max-w-xl mx-auto">
            The Fehu Code is a collaboration with India's master weavers and jewelry artisans. We bypass industrial supply chains to create custom handloom garments and fine jewelry, ensuring every thread holds a lineage of craft.
          </p>
        </div>

        {/* 4 Column Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stories.map((story, idx) => {
            const Icon = story.icon;
            return (
              <div
                key={idx}
                className="bg-brand-deep/30 border border-brand-deep p-8 flex flex-col items-center text-center space-y-4 hover:border-brand-gold/40 transition-all duration-300 rounded group"
              >
                <div className="p-3 bg-brand-deep/60 group-hover:bg-brand-gold group-hover:text-brand-forest rounded-full transition-colors duration-300 text-brand-gold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-brand-gold">
                  {story.title}
                </h3>
                <p className="text-xs text-brand-ivory/70 leading-relaxed font-sans">
                  {story.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

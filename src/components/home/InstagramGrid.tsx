"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { getProducts } from "../../lib/shopify/client";

interface Post {
  image: string;
  likes: string;
}

export default function InstagramGrid() {
  const [posts, setPosts] = useState<Post[]>([
    { image: "/images/saree.png", likes: "1.2k" },
    { image: "/images/jewelry.png", likes: "894" },
    { image: "/images/men_kurta.png", likes: "1.1k" },
    { image: "/images/contemporary.png", likes: "956" },
    { image: "/images/jewelry.png", likes: "1.4k" },
    { image: "/images/saree.png", likes: "1.7k" },
    { image: "/images/contemporary.png", likes: "643" },
    { image: "/images/men_kurta.png", likes: "2.1k" },
  ]);

  useEffect(() => {
    async function loadShopifyImages() {
      try {
        const products = await getProducts();
        if (products && products.length > 0) {
          const fetchedPosts: Post[] = [];
          
          // Loop through products and collect unique images
          let index = 0;
          for (const p of products) {
            if (p.images && p.images.length > 0) {
              // Generate fake likes counts for aesthetic realism
              const likesCount = Math.floor(Math.random() * 1500) + 400;
              const formattedLikes = likesCount >= 1000 
                ? (likesCount / 1000).toFixed(1) + "k" 
                : likesCount.toString();

              fetchedPosts.push({
                image: p.images[0].url,
                likes: formattedLikes
              });
              index++;
            }
            if (fetchedPosts.length >= 8) break;
          }

          if (fetchedPosts.length > 0) {
            // Fill remaining if less than 8
            while (fetchedPosts.length < 8) {
              fetchedPosts.push(fetchedPosts[fetchedPosts.length % fetchedPosts.length]);
            }
            setPosts(fetchedPosts);
          }
        }
      } catch (e) {
        console.warn("Failed to load Instagram grid images from Shopify:", e);
      }
    }
    loadShopifyImages();
  }, []);

  return (
    <section className="py-24 bg-brand-ivory border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        
        {/* Header */}
        <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block mb-3">
          Editorial Journal
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-brand-forest uppercase mb-4">
          #thefehucode on Instagram
        </h2>
        <p className="text-xs text-brand-forest/60 max-w-sm mx-auto font-sans mb-12">
          Join our visual journey and share how you wear modern Indian luxury.
        </p>

        {/* 2x4 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="relative aspect-square w-full overflow-hidden bg-brand-beige/20 border border-brand-beige/50 group cursor-pointer"
            >
              <Image
                src={post.image}
                alt={`Instagram post ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized
              />
              
              {/* Dark Hover overlay */}
              <div className="absolute inset-0 bg-brand-forest/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-brand-ivory space-y-2">
                <svg className="w-6 h-6 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="text-xs font-semibold font-sans tracking-wider flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

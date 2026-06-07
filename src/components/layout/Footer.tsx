"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight } from "lucide-react";


export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-brand-forest text-brand-ivory border-t border-brand-deep pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-brand-deep">
        
        {/* Brand Info & Story */}
        <div className="lg:col-span-2 space-y-6">
          <Link href="/" className="transition-opacity hover:opacity-85 select-none relative w-44 h-11 flex items-center">
            <Image
              src="https://cdn.shopify.com/s/files/1/0918/8258/6410/files/fehucode_logo.png?v=1780845818"
              alt="The Fehu Code Logo"
              width={176}
              height={44}
              className="object-contain filter brightness-110"
            />
          </Link>

          <p className="text-xs text-brand-ivory/70 leading-relaxed font-sans max-w-sm">
            We weave tales of Indian heritage into modern luxury apparel and handcrafted jewelry. 
            Rooted in artisanal excellence, sustainability, and ethical production, 
            each piece is meticulously crafted to endure as a timeless heirloom.
          </p>
          <div className="flex space-x-4">
            <span className="p-2 bg-brand-deep/50 hover:bg-brand-gold hover:text-brand-forest transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </span>
            <span className="p-2 bg-brand-deep/50 hover:bg-brand-gold hover:text-brand-forest transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </span>
            <span className="p-2 bg-brand-deep/50 hover:bg-brand-gold hover:text-brand-forest transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Categories Link Columns */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-gold">Women</h4>
          <ul className="space-y-2 text-xs font-sans text-brand-ivory/60">
            <li><Link href="/categories/women?sub=sarees" className="hover:text-brand-gold transition-colors">Sarees</Link></li>
            <li><Link href="/categories/women?sub=kurtas" className="hover:text-brand-gold transition-colors">Kurtas</Link></li>
            <li><Link href="/categories/women?sub=dresses" className="hover:text-brand-gold transition-colors">Dresses</Link></li>
            <li><Link href="/categories/women?sub=co-ords" className="hover:text-brand-gold transition-colors">Co-ords</Link></li>
            <li><Link href="/categories/women?sub=dupattas" className="hover:text-brand-gold transition-colors">Dupattas</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-gold">Men & Jewellery</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-[10px] font-sans uppercase font-semibold text-brand-ivory/40 tracking-wider mb-2">Men</h5>
              <ul className="space-y-1.5 text-xs font-sans text-brand-ivory/60">
                <li><Link href="/categories/men?sub=kurtas" className="hover:text-brand-gold transition-colors">Kurtas</Link></li>
                <li><Link href="/categories/men?sub=shirts" className="hover:text-brand-gold transition-colors">Shirts</Link></li>
                <li><Link href="/categories/men?sub=jackets" className="hover:text-brand-gold transition-colors">Jackets</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-sans uppercase font-semibold text-brand-ivory/40 tracking-wider mb-2">Jewellery</h5>
              <ul className="space-y-1.5 text-xs font-sans text-brand-ivory/60">
                <li><Link href="/categories/jewellery?sub=necklaces" className="hover:text-brand-gold transition-colors">Necklaces</Link></li>
                <li><Link href="/categories/jewellery?sub=earrings" className="hover:text-brand-gold transition-colors">Earrings</Link></li>
                <li><Link href="/categories/jewellery?sub=rings" className="hover:text-brand-gold transition-colors">Rings</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans uppercase font-bold tracking-widest text-brand-gold">Newsletter</h4>
          <p className="text-xs text-brand-ivory/70 leading-relaxed max-w-xs">
            Subscribe to receive private invitations to new collection previews, editorial journals, and artisan stories.
          </p>
          {subscribed ? (
            <div className="bg-brand-deep/30 border border-brand-gold/40 p-4">
              <p className="text-xs text-brand-gold font-sans font-medium tracking-wide">
                Thank you for subscribing to The Fehu Code journal. Welcome to our heritage circle.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                required
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-deep/20 border-b border-brand-beige/30 focus:border-brand-gold py-2.5 pl-2 pr-10 text-xs font-sans text-brand-ivory uppercase tracking-wider outline-none transition-colors placeholder-brand-ivory/40"
              />
              <button
                type="submit"
                className="absolute right-0 top-1.5 p-1 text-brand-ivory/60 hover:text-brand-gold transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-widest text-brand-ivory/40 space-y-4 md:space-y-0">
        <div>
          © {new Date().getFullYear()} The Fehu Code. All Rights Reserved.
        </div>
        <div className="flex space-x-6">
          <Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link>
          <span className="hover:text-brand-gold transition-colors cursor-not-allowed">Privacy Policy</span>
          <span className="hover:text-brand-gold transition-colors cursor-not-allowed">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CartDrawer from "../../components/cart/CartDrawer";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-36 pb-24 bg-white text-brand-forest font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block">
              Customer Concierge
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-wider uppercase">
              Contact Us
            </h1>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4" />
            <p className="text-xs text-brand-forest/70 leading-relaxed">
              Whether you require sizing advice, details on loom weaving schedules, or custom order inquiries, our concierge is here to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start max-w-5xl mx-auto">
            
            {/* Left Column: Contact Info Details */}
            <div className="lg:col-span-5 space-y-8 bg-brand-ivory/40 p-8 border border-brand-beige/50 rounded">
              <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-brand-forest">
                Atelier Concierge
              </h3>
              
              <div className="space-y-6 text-xs text-brand-forest/80 font-sans">
                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white border border-brand-beige rounded-full text-brand-gold flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold tracking-wider uppercase text-[9px] text-brand-forest/50">Client Services</p>
                    <a href="mailto:concierge@thefehucode.com" className="hover:text-brand-gold underline transition-colors">
                      concierge@thefehucode.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white border border-brand-beige rounded-full text-brand-gold flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold tracking-wider uppercase text-[9px] text-brand-forest/50">WhatsApp Concierge</p>
                    <a href="tel:+911145678900" className="hover:text-brand-gold transition-colors">
                      +91 (11) 4567-8900
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white border border-brand-beige rounded-full text-brand-gold flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold tracking-wider uppercase text-[9px] text-brand-forest/50">Jaipur Atelier</p>
                    <p className="leading-relaxed">
                      Plot 14, Heritage Weavers Lane,<br />
                      Mansarovar Industrial Area,<br />
                      Jaipur, Rajasthan — 302020, India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white border border-brand-beige rounded-full text-brand-gold flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold tracking-wider uppercase text-[9px] text-brand-forest/50">concierge hours</p>
                    <p>Monday to Saturday<br />10:00 AM — 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7 bg-white p-2.5 border border-brand-beige/50 shadow-md luxury-glow">
              <div className="p-6 md:p-8 bg-white">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-brand-forest border-b border-brand-beige pb-3">
                        Send a Message
                      </h3>

                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-forest/60" htmlFor="name">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-brand-beige focus:border-brand-gold px-4 py-3 text-xs outline-none transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-forest/60" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-brand-beige focus:border-brand-gold px-4 py-3 text-xs outline-none transition-colors"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-forest/60" htmlFor="subject">
                          Inquiry Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Sizing, Loom updates, Custom orders"
                          className="w-full bg-transparent border border-brand-beige focus:border-brand-gold px-4 py-3 text-xs outline-none transition-colors placeholder-brand-forest/30"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-forest/60" htmlFor="message">
                          Your Inquiry
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-brand-beige focus:border-brand-gold px-4 py-3 text-xs outline-none transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-brand-forest text-brand-ivory text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-deep transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmitting ? "Sending Inquiry..." : "Submit Message"}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-6"
                    >
                      <CheckCircle2 className="w-14 h-14 text-brand-gold mx-auto" />
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-semibold uppercase tracking-wider text-brand-forest">
                          Inquiry Received
                        </h3>
                        <p className="text-xs text-brand-forest/75 leading-relaxed max-w-sm mx-auto">
                          Thank you for connecting with the Fehu Code concierge. A representative will review your message and reply via email within 24 business hours.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2.5 border border-brand-forest text-brand-forest text-xs font-semibold uppercase tracking-widest hover:bg-brand-forest hover:text-brand-ivory transition-all"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}

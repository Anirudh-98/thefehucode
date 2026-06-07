"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { UploadCloud, CheckCircle2, X, Sparkles, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductByHandle, getProducts } from "../../lib/shopify/client";

export default function CustomDesign() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  
  const [shopifyImage, setShopifyImage] = useState<string>("/images/custom_tshirt.png");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadShopifyTshirt() {
      try {
        let p = await getProductByHandle("royal-oversized-black-t-shirt-horse-elephant-camel-art");
        if (!p) {
          const all = await getProducts();
          p = all.find(prod => 
            prod.productType.toLowerCase().includes("t-shirt") ||
            prod.title.toLowerCase().includes("t-shirt") ||
            prod.title.toLowerCase().includes("shirt")
          ) || null;
        }
        if (p && p.images && p.images.length > 0) {
          setShopifyImage(p.images[0].url);
        }
      } catch (e) {
        console.warn("Failed to load Shopify T-Shirt image:", e);
      }
    }
    loadShopifyTshirt();
  }, []);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process file upload
  const processFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setErrors((prev) => ({ ...prev, file: "Only PNG, JPG, or JPEG files are allowed." }));
      return;
    }

    // Validate size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "File size exceeds the 5MB limit." }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.file;
      return copy;
    });

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Trigger file selection click
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    setFilePreview(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Your name is required.";
    if (!contact.trim()) newErrors.contact = "Email or Mobile Number is required.";
    if (!file) newErrors.file = "Please upload your custom design artwork.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setName("");
      setContact("");
      setMessage("");
      setFile(null);
      setFilePreview(null);
    }, 2000);
  };

  return (
    <section className="py-24 bg-white border-b border-brand-beige relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-beige/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-12 bg-brand-forest/30" />
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-wider text-brand-forest uppercase">
              Customize Your Favorite Design
            </h2>
            <span className="h-[1px] w-12 bg-brand-forest/30" />
          </div>
          <p className="text-xs text-brand-forest/70 font-sans leading-relaxed">
            Bring your vision to life by uploading your custom artwork and personalizing your oversized t-shirt to reflect your unique style.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Side: Mockup Image Panel */}
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-brand-beige/60 p-2 bg-brand-ivory/20 shadow-xl luxury-glow flex flex-col justify-end">
            <div className="absolute inset-0 z-0">
              <Image
                src={shopifyImage}
                alt="Customized Artwork T-Shirt Mockup"
                fill
                className="object-cover transition-transform duration-[4s] hover:scale-102"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-brand-forest/5 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent z-10" />
            </div>

            {/* Top Pill Badge */}
            <div className="absolute top-6 right-6 z-20">
              <span className="bg-brand-forest text-brand-ivory text-[9px] font-sans font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-brand-gold/30 shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                We Value Your Design!
              </span>
            </div>

            {/* Bottom Quote overlay */}
            <div className="relative z-20 p-8 text-brand-ivory max-w-md">
              <blockquote className="font-serif text-sm italic tracking-wide text-brand-ivory/90 leading-relaxed">
                &ldquo;Every great design starts with inspiration. Share yours with us.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Right Side: Form and Dropzone Panel */}
          <div className="flex flex-col justify-between h-full bg-brand-beige/5 border border-brand-beige/35 p-8 lg:p-10 relative">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col items-center justify-center text-center py-20 space-y-6 h-full"
                >
                  <CheckCircle2 className="w-16 h-16 text-brand-forest" />
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-semibold tracking-wider text-brand-forest uppercase">
                      Design Received
                    </h3>
                    <p className="text-xs text-brand-forest/70 font-sans max-w-sm mx-auto leading-relaxed">
                      Thank you for sharing your unique creation! Our couture concierge is reviewing your artwork and will connect with you via email or mobile shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-brand-forest text-brand-ivory text-[10px] font-sans font-semibold uppercase tracking-widest hover:bg-brand-deep transition-all"
                  >
                    Upload Another Design
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    {/* Drag and Drop Zone */}
                    <div className="space-y-2">
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={onButtonClick}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 relative ${
                          dragActive 
                            ? "border-brand-gold bg-brand-gold/5" 
                            : "border-brand-beige/60 hover:border-brand-forest bg-white/50"
                        } ${errors.file ? "border-red-400 bg-red-50/20" : ""}`}
                      >
                        <input
                          ref={inputRef}
                          type="file"
                          className="hidden"
                          accept=".png,.jpg,.jpeg"
                          onChange={handleChange}
                        />

                        {filePreview ? (
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="relative w-20 h-20 border border-brand-beige overflow-hidden bg-brand-ivory shadow-inner">
                              <Image
                                src={filePreview}
                                alt="Design Preview"
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-sans font-semibold text-brand-forest truncate max-w-[200px]">
                                {file?.name}
                              </span>
                              <button
                                onClick={removeFile}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                aria-label="Remove file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="p-3 bg-brand-forest/5 rounded-full text-brand-forest">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-sans font-semibold text-brand-forest">
                                Drag and drop your design or <span className="text-brand-gold underline">click to browse</span>
                              </p>
                              <p className="text-[9px] font-sans text-brand-forest/50">
                                PNG, JPG, JPEG | Max 5MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.file && (
                        <p className="text-[9px] font-sans font-medium text-red-500">{errors.file}</p>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label htmlFor="custom-name" className="text-[10px] font-sans font-bold tracking-widest text-brand-forest/60 uppercase block">
                          Your Name *
                        </label>
                        <input
                          id="custom-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.name;
                              return copy;
                            });
                          }}
                          className={`w-full bg-white border ${
                            errors.name ? "border-red-400 focus:border-red-500" : "border-brand-beige/60 focus:border-brand-forest"
                          } px-4 py-3 text-xs font-sans text-brand-forest outline-none transition-all`}
                        />
                        {errors.name && (
                          <p className="text-[9px] font-sans font-medium text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Contact input */}
                      <div className="space-y-1.5">
                        <label htmlFor="custom-contact" className="text-[10px] font-sans font-bold tracking-widest text-brand-forest/60 uppercase block">
                          Email or Mobile Number *
                        </label>
                        <input
                          id="custom-contact"
                          type="text"
                          value={contact}
                          onChange={(e) => {
                            setContact(e.target.value);
                            if (errors.contact) setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.contact;
                              return copy;
                            });
                          }}
                          className={`w-full bg-white border ${
                            errors.contact ? "border-red-400 focus:border-red-500" : "border-brand-beige/60 focus:border-brand-forest"
                          } px-4 py-3 text-xs font-sans text-brand-forest outline-none transition-all`}
                        />
                        {errors.contact && (
                          <p className="text-[9px] font-sans font-medium text-red-500">{errors.contact}</p>
                        )}
                      </div>

                      {/* Message input */}
                      <div className="space-y-1.5">
                        <label htmlFor="custom-message" className="text-[10px] font-sans font-bold tracking-widest text-brand-forest/60 uppercase block">
                          Message (Optional)
                        </label>
                        <textarea
                          id="custom-message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full bg-white border border-brand-beige/60 focus:border-brand-forest px-4 py-3 text-xs font-sans text-brand-forest outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-brand-forest text-brand-ivory hover:bg-brand-deep text-xs font-sans font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-brand-forest"
                  >
                    {isSubmitting ? (
                      <Loader className="w-4 h-4 animate-spin text-brand-gold" />
                    ) : (
                      "Share Your Design"
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

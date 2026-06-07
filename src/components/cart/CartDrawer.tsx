"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createCheckout } from "../../lib/shopify/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Loader } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = parseFloat(cart.subtotalAmount.amount);
  const freeShippingThreshold = 10000;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FEHUHERITAGE") {
      setPromoApplied(true);
      setDiscountAmount(subtotal * 0.15); // 15% discount
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try 'FEHUHERITAGE'");
      setPromoApplied(false);
      setDiscountAmount(0);
    }
  };

  const finalTotal = subtotal - discountAmount;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const lineItems = cart.lines.map((line) => ({
        variantId: line.selectedVariant.id,
        quantity: line.quantity,
      }));
      
      const checkoutUrl = await createCheckout(lineItems);
      
      // Clear local cart
      clearCart();
      setIsCartOpen(false);
      
      // Redirect to secure Shopify checkout page
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-brand-ivory shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-beige flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-forest" />
                <h2 className="text-xl font-serif font-semibold text-brand-forest tracking-wider uppercase">
                  Your Cart ({cart.totalQuantity})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-brand-forest/60 hover:text-brand-forest transition-colors rounded-full hover:bg-brand-beige/50"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Shipping Bar */}
            <div className="px-6 py-4 bg-brand-beige/30 border-b border-brand-beige">
              {amountToFreeShipping > 0 ? (
                <p className="text-xs text-brand-forest/80 font-sans mb-2">
                  Add <span className="font-semibold text-brand-forest">₹{amountToFreeShipping.toLocaleString()}</span> more for <span className="font-semibold">Complimentary Worldwide Shipping</span>.
                </p>
              ) : (
                <p className="text-xs text-brand-forest font-semibold font-sans mb-2 flex items-center gap-1.5">
                  ✨ Congratulations! You qualify for Free Worldwide Shipping.
                </p>
              )}
              <div className="w-full bg-brand-beige h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-gold h-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-brand-beige/20 rounded-full">
                    <ShoppingBag className="w-10 h-10 text-brand-forest/40" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-brand-forest">Your cart is empty</h3>
                    <p className="text-sm text-brand-forest/60 mt-1 max-w-xs">
                      Explore our collections to discover premium handloom garments and luxury jewelry.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-6 py-2.5 bg-brand-forest text-brand-ivory text-xs font-semibold uppercase tracking-widest hover:bg-brand-deep transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.lines.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-brand-beige/50 last:border-0">
                    <div className="relative w-20 h-28 bg-brand-beige/20 flex-shrink-0 overflow-hidden border border-brand-beige/40">
                      <Image
                        src={item.product.images[0]?.url || "/images/saree.png"}
                        alt={item.product.images[0]?.altText || item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-sans font-medium text-brand-forest line-clamp-2 leading-snug">
                            {item.product.title}
                          </h4>
                          <span className="text-sm font-semibold text-brand-forest whitespace-nowrap">
                            ₹{(parseFloat(item.selectedVariant.price) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        {/* Variant details */}
                        <p className="text-xs text-brand-forest/60 mt-1">
                          {item.selectedVariant.selectedOptions.map((opt) => `${opt.name}: ${opt.value}`).join(" / ")}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-brand-beige">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-brand-forest/60 hover:text-brand-forest hover:bg-brand-beige/30 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-semibold font-sans text-brand-forest">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-brand-forest/60 hover:text-brand-forest hover:bg-brand-beige/30 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-forest/40 hover:text-red-700 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.lines.length > 0 && (
              <div className="p-6 border-t border-brand-beige bg-brand-ivory">
                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. FEHUHERITAGE)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="flex-1 px-3 py-2 border border-brand-beige text-xs uppercase tracking-wider font-sans focus:outline-none focus:border-brand-gold bg-transparent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={promoApplied || !promoCode}
                    className="px-4 py-2 border border-brand-forest text-xs font-semibold uppercase tracking-widest hover:bg-brand-forest hover:text-brand-ivory transition-all disabled:opacity-40"
                  >
                    Apply
                  </button>
                </form>

                {promoApplied && (
                  <p className="text-xs text-brand-gold font-medium mb-3 flex items-center justify-between">
                    <span>✓ 'FEHUHERITAGE' Applied (15% Off)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPromoApplied(false);
                        setDiscountAmount(0);
                        setPromoCode("");
                      }}
                      className="underline ml-1 hover:text-brand-forest"
                    >
                      Remove
                    </button>
                  </p>
                )}

                {promoError && <p className="text-xs text-red-700 font-medium mb-3">{promoError}</p>}

                {/* Subtotals */}
                <div className="space-y-2.5 mb-6 text-sm font-sans">
                  <div className="flex justify-between text-brand-forest/70">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-brand-gold">
                      <span>Discount (15%)</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-forest/70">
                    <span>Shipping</span>
                    <span className="font-medium text-brand-forest">
                      {subtotal >= freeShippingThreshold ? "Complimentary" : "₹500"}
                    </span>
                  </div>
                  <div className="border-t border-brand-beige/50 pt-2.5 flex justify-between font-semibold text-base text-brand-forest">
                    <span>Total</span>
                    <span>
                      ₹{(finalTotal + (subtotal >= freeShippingThreshold ? 0 : 500)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-brand-forest text-brand-ivory font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-deep transition-all shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin text-brand-gold" />
                      Redirecting to Checkout...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

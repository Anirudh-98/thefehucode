"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import CartDrawer from "../cart/CartDrawer";
import { User, LogOut, Package, Mail, Phone, Calendar, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface OrderLineItem {
  node: {
    title: string;
    quantity: number;
    variantTitle?: string;
  };
}

interface OrderNode {
  node: {
    id: string;
    orderNumber: string | number;
    processedAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
    totalPrice: {
      amount: string;
      currencyCode: string;
    };
    lineItems: {
      edges: OrderLineItem[];
    };
  };
}

interface CustomerData {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  emailAddress?: {
    emailAddress: string;
  };
  orders?: {
    edges: OrderNode[];
  };
}

export default function AccountClient() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/api/auth/login";
            return;
          }
          throw new Error("Failed to load customer profile");
        }
        const data = await res.json();
        
        if (data.error) {
          console.warn("Shopify API returned error:", data.error);
          setError(data.error);
        }
        
        setCustomer(data.customer);
      } catch (err: any) {
        console.error("Account fetch error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchCustomer();
  }, []);

  // Format date utility
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Status Badge styling helper
  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "paid" || s === "fulfilled" || s === "success") {
      return "border-green-600/30 text-green-700 bg-green-50/50";
    } else if (s === "unfulfilled" || s === "pending" || s === "authorized") {
      return "border-amber-600/30 text-amber-700 bg-amber-50/50";
    } else {
      return "border-red-600/30 text-red-700 bg-red-50/50";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-36 pb-24 bg-brand-ivory text-brand-forest font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Welcome Banner */}
          <div className="border-b border-brand-beige pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-widest text-brand-gold uppercase block">
                Atelier Client Portal
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-wider text-brand-forest uppercase">
                Welcome Back, {customer?.firstName || "Patron"}
              </h1>
              <div className="w-16 h-0.5 bg-brand-gold" />
            </div>
            
            <a 
              href="/api/auth/logout"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-beige hover:border-brand-forest hover:text-brand-gold text-xs font-semibold uppercase tracking-widest transition-colors bg-white/50 backdrop-blur-sm self-start md:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </a>
          </div>

          {loading ? (
            <div className="space-y-8 animate-pulse py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="h-40 bg-brand-beige/30 border border-brand-beige/50 rounded-2xl" />
                <div className="h-40 bg-brand-beige/30 border border-brand-beige/50 rounded-2xl col-span-2" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Profile Card Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-brand-beige/50 p-8 rounded-2xl shadow-sm space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold" />
                  
                  <div className="flex items-center gap-4 border-b border-brand-beige/40 pb-5">
                    <div className="w-12 h-12 rounded-full bg-brand-forest/5 flex items-center justify-center text-brand-gold">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-forest">
                        {customer ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : "Fehu Patron"}
                      </h3>
                      <span className="text-[9px] font-sans font-bold tracking-widest text-brand-gold uppercase">
                        Verified Account
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center gap-3 text-brand-forest/80">
                      <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                      <span className="truncate">{customer?.emailAddress?.emailAddress || "Loading Email..."}</span>
                    </div>
                    {customer?.phoneNumber && (
                      <div className="flex items-center gap-3 text-brand-forest/80">
                        <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        <span>{customer.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-brand-forest/80">
                      <Calendar className="w-4 h-4 text-brand-gold flex-shrink-0" />
                      <span>Member since {new Date().getFullYear()}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-amber-50/50 border border-amber-200 text-amber-800 text-[10px] rounded-lg leading-relaxed">
                      <strong>Shopify API Note:</strong> {error}. Local preview mode active.
                    </div>
                  )}
                </div>
              </div>

              {/* Order History Section */}
              <div className="lg:col-span-8 space-y-6">
                <h2 className="font-serif text-xl font-medium tracking-wide uppercase text-brand-forest flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-brand-gold" />
                  Order History
                </h2>

                {!customer?.orders?.edges || customer.orders.edges.length === 0 ? (
                  <div className="bg-white border border-brand-beige/50 p-12 rounded-2xl text-center shadow-sm space-y-5">
                    <ShoppingBag className="w-10 h-10 text-brand-forest/30 mx-auto" />
                    <h3 className="font-serif text-lg font-medium text-brand-forest">No orders found</h3>
                    <p className="text-xs text-brand-forest/60 max-w-sm mx-auto leading-relaxed">
                      You haven't placed any orders with us yet. Explore our latest collection of handcrafted luxury wear.
                    </p>
                    <Link
                      href="/categories/women"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-forest text-brand-ivory text-xs font-bold uppercase tracking-widest hover:bg-brand-deep transition-all rounded shadow-sm group"
                    >
                      Start Shopping
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customer.orders.edges.map(({ node: order }) => (
                      <div 
                        key={order.id} 
                        className="bg-white border border-brand-beige/50 rounded-2xl p-6 shadow-sm hover:border-brand-gold/30 transition-all space-y-4"
                      >
                        {/* Order Header Info */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-beige/40 pb-4">
                          <div>
                            <span className="text-[9px] font-sans font-bold uppercase text-brand-forest/40">Order Ref</span>
                            <h4 className="font-serif text-base font-bold text-brand-forest">
                              #{order.orderNumber}
                            </h4>
                          </div>

                          <div>
                            <span className="text-[9px] font-sans font-bold uppercase text-brand-forest/40 block text-left sm:text-right">Placed On</span>
                            <p className="text-xs font-semibold text-brand-forest">
                              {formatDate(order.processedAt)}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border ${getStatusStyle(order.financialStatus)}`}>
                              {order.financialStatus}
                            </span>
                            <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border ${getStatusStyle(order.fulfillmentStatus)}`}>
                              {order.fulfillmentStatus}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] font-sans font-bold uppercase text-brand-forest/40 block">Total Amount</span>
                            <p className="text-sm font-bold text-brand-gold">
                              {parseFloat(order.totalPrice.amount).toLocaleString("en-IN", {
                                style: "currency",
                                currency: order.totalPrice.currencyCode,
                                minimumFractionDigits: 0
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          <span className="text-[9px] font-sans font-bold uppercase text-brand-forest/40 block">Items in this order</span>
                          <div className="divide-y divide-brand-beige/20 text-xs">
                            {order.lineItems.edges.map(({ node: item }, itemIdx) => (
                              <div key={itemIdx} className="py-2 flex justify-between items-center gap-4 text-brand-forest/80">
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{item.title}</p>
                                  {item.variantTitle && (
                                    <p className="text-[10px] text-brand-forest/45 mt-0.5">{item.variantTitle}</p>
                                  )}
                                </div>
                                <span className="font-sans font-bold text-brand-forest/65 bg-brand-forest/5 px-2 py-0.5 rounded text-[10px]">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}

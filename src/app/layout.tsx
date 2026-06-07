import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Fehu Code | Premium Indian Fashion & Lifestyle",
  description: "Experience premium Indian fashion and lifestyle. Explore our handloom sarees, luxury cotton kurtas, dresses, and fine jewelry blending heritage and contemporary design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-ivory text-brand-forest selection:bg-brand-gold selection:text-brand-forest">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

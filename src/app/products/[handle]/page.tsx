import React from "react";
import ProductClient from "../../../components/product/ProductClient";
import { getProductByHandle } from "../../../lib/shopify/client";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  
  // Verify product existence on server before rendering client
  const product = await getProductByHandle(handle);
  if (!product) {
    notFound();
  }

  return <ProductClient initialProduct={product} />;
}

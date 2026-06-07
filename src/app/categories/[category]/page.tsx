import React from "react";
import CategoryClient from "../../../components/category/CategoryClient";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Normalize params
  const category = resolvedParams.category.toLowerCase();
  const sub = typeof resolvedSearchParams.sub === "string" ? resolvedSearchParams.sub : undefined;

  return <CategoryClient category={category} initialSubcategory={sub} />;
}

"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import type { StrapiProduct } from "../types/product";

interface ProductGridProps {
  selectedCategories: string[];
  searchQuery: string;
  products: StrapiProduct[];
}

export function ProductGrid({
  selectedCategories,
  searchQuery,
  products,
}: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<StrapiProduct[]>([]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        product.categories.some((category) =>
          selectedCategories.includes(category.name)
        );

      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [selectedCategories, searchQuery, products]);

  if (filteredProducts.length === 0) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.documentId} product={product} />
      ))}
    </div>
  );
}

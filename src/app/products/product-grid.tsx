"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
// ✅ IMPORT DEFAULT
import type { StrapiProduct } from "../types/product";
import ProductCard from "./product-card";

interface ProductGridProps {
  selectedCategories: string[];
  searchQuery: string;
  products: StrapiProduct[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const safeKey = (p: StrapiProduct, i: number) =>
  String(p.id ?? p.documentId ?? p.SlugURL ?? p.name ?? i) + "-" + i;

export function ProductGrid({
  selectedCategories,
  searchQuery,
  products,
}: ProductGridProps) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by categories
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((selectedCategory) =>
          product.categories?.some(
            (category) => category.name === selectedCategory
          )
        );

      // Filter by search query
      const searchMatch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategories, searchQuery]);

  console.log("🔍 ProductGrid Debug:");
  console.log("- Total products:", products.length);
  console.log("- Filtered products:", filteredProducts.length);
  console.log("- Selected categories:", selectedCategories);
  console.log("- Search query:", searchQuery);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-gray-600 mb-6">
            Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
            <br />
            Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filteredProducts.map((product, index) => (
        <motion.div key={safeKey(product, index)} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

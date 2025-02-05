"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";
import type { StrapiProduct } from "../types/product";

const ITEMS_PER_PAGE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<StrapiProduct[]>([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = products.filter((product) => {
        const categoryMatch =
          selectedCategories.length === 0 ||
          (typeof product.category === "string" &&
            selectedCategories
              .map((c) => c.toLowerCase())
              .includes(product.category.toLowerCase())) ||
          (Array.isArray(product.category) &&
            product.category.some((cat) => {
              {
                return selectedCategories
                  .map((c) => c.toLowerCase())
                  .includes(cat.name.toLowerCase());
              }
              return false;
            }));

        const searchMatch =
          searchQuery === "" ||
          (product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
            false) ||
          (product?.description?.[0]?.children?.[0]?.text
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ??
            false);

        return categoryMatch && searchMatch;
      });

      setFilteredProducts(filtered);
      setCurrentPage(1);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategories, searchQuery, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>No products available.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>No products match the current filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6 min-h-[50vh] font-bold text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery + selectedCategories.join()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-bold"
        >
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>
      {filteredProducts.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </motion.div>
  );
}

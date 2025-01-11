"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";
import { products } from "./product-data";

const ITEMS_PER_PAGE = 12;

interface ProductGridProps {
  selectedCategories: string[];
  priceRange: number[];
  searchQuery: string;
}

export function ProductGrid({
  selectedCategories,
  priceRange,
  searchQuery,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.category)) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (searchQuery === "" ||
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategories, priceRange, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <motion.div
      className="space-y-6 min-h-[50vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }} // Increased duration and added delay
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery + selectedCategories.join() + priceRange.join()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }} // Increased from 0.3 to 0.8
        >
          <ProductCard products={currentProducts} />
        </motion.div>
      </AnimatePresence>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
}

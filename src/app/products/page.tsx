"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Banner } from "./banner";
import { SearchInput } from "./search-input";
import { Sidebar } from "./sidebar";
import { ProductGrid } from "./product-grid";
import { Loader } from "@/components/loader";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ProductPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 3000]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const handlePriceChange = useCallback((newPriceRange: number[]) => {
    setPriceRange(newPriceRange);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 2 seconds loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <Loader /> // Show loader while loading
      ) : (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1 }} // Increased from 0.5 to 1
          className="container mx-auto px-4 py-8"
        >
          <motion.h1
            className="text-3xl font-bold mb-6 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }} // Increased delay and duration
          >
            Thiết Bị Phòng Cháy Chữa Cháy
          </motion.h1>
          <Banner />
          <div className="mb-6">
            <SearchInput onSearch={handleSearch} />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <motion.aside
              className="w-full md:w-64 shrink-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }} // Increased delay and duration
            >
              <Sidebar
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
              />
            </motion.aside>
            <motion.main
              className="flex-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }} // Increased delay and duration
            >
              <ProductGrid
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                searchQuery={searchQuery}
              />
            </motion.main>
          </div>
        </motion.div>
      )}
    </div>
  );
}

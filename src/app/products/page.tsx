"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Banner } from "./banner";
import { SearchInput } from "./search-input";
import { Sidebar } from "./sidebar";
import { ProductGrid } from "./product-grid";
import { Loader } from "@/components/loader";
import api from "../_utils/globalApi";
import type { StrapiProduct } from "../types/product";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ProductPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<StrapiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const getLatestProducts = useCallback(async () => {
    try {
      const response = await api.getLatestProducts();
      console.log("API Response:", response);

      if (response && response.data) {
        // Kiểm tra cấu trúc response
        if (Array.isArray(response.data)) {
          // Nếu response.data là array trực tiếp
          setProducts(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Nếu response.data.data là array
          setProducts(response.data.data);
        } else {
          console.error("Unexpected API response structure:", response);
          setProducts([]);
        }
      } else {
        console.error("No data in response:", response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getLatestProducts();
  }, [getLatestProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Banner />

          {/* Search Section */}
          <div className="mb-8">
            <SearchInput onSearch={handleSearch} />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.aside
              className="w-full lg:w-80 shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Sidebar onCategoryChange={handleCategoryChange} />
            </motion.aside>

            <motion.main
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ProductGrid
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
                products={products}
              />
            </motion.main>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <input
        type="search"
        placeholder="Tìm kiếm thiết bị phòng cháy chữa cháy..."
        className="w-full h-10 pl-4 pr-10 rounded-md border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setQuery("")}
          >
            <Search className="h-5 w-5 text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

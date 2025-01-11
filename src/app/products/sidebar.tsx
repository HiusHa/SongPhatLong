"use client";

import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  "Thiết Bị Bảo Hộ Cá Nhân",
  "Dụng Cụ Chữa Cháy",
  "Thiết Bị Cứu Hộ",
  "Thiết Bị Thông Tin",
  "Vật Tư Y Tế",
  "Thiết Bị Huấn Luyện",
  "Phòng Cháy",
];

interface SidebarProps {
  onCategoryChange: (categories: string[]) => void;
  onPriceChange: (priceRange: number[]) => void;
}

export function Sidebar({ onCategoryChange, onPriceChange }: SidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    onCategoryChange(updatedCategories);
  };

  const handlePriceChange = (newPriceRange: number[]) => {
    setPriceRange(newPriceRange);
    onPriceChange(newPriceRange);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }} // Increased duration and added delay
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }} // Increased delay and duration
      >
        <h3 className="text-lg font-semibold mb-4">Danh Mục</h3>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <motion.label
              key={category}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }} // Increased delay and duration
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="text-sm">{category}</span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }} // Increased delay and duration
      >
        <h3 className="text-lg font-semibold mb-4">Lọc Theo Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 3000]}
            max={3000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <motion.span
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }} // Increased delay and duration
            >
              {priceRange[0].toLocaleString("vi-VN")}₫
            </motion.span>
            <motion.span
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }} // Increased delay and duration
            >
              {priceRange[1].toLocaleString("vi-VN")}₫
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

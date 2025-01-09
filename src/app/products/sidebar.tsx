"use client";

import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const categories = [
  "Thiết Bị Bảo Hộ Cá Nhân",
  "Dụng Cụ Chữa Cháy",
  "Thiết Bị Cứu Hộ",
  "Thiết Bị Thông Tin",
  "Vật Tư Y Tế",
  "Thiết Bị Huấn Luyện",
  "Phòng Cháy",
];

export function Sidebar() {
  const [priceRange, setPriceRange] = useState([0, 3000]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Danh Mục</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Lọc Theo Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 3000]}
            max={3000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {priceRange[0].toLocaleString("vi-VN")}₫
            </span>
            <span className="text-sm text-gray-600">
              {priceRange[1].toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

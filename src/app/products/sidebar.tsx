"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import api from "@/app/_utils/globalApi";

interface SidebarProps {
  onCategoryChange: (categories: string[]) => void;
  onPriceChange?: (priceRange: number[]) => void;
}

interface Category {
  id: number;
  documentId: string;
  name: string;
  Icon: {
    data: {
      attributes: {
        url: string;
      };
    } | null;
  };
}

export function Sidebar({ onCategoryChange, onPriceChange }: SidebarProps) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 100]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    onCategoryChange(newCategories);
  };

  const handlePriceChange = (newPriceRange: number[]) => {
    setPriceRange(newPriceRange);
    if (onPriceChange) {
      onPriceChange(newPriceRange);
    }
  };

  return (
    <div className="w-64 p-4 border-r min-h-screen">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Danh mục</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(
                  category.documentId
                );

                return (
                  <label
                    key={category.documentId}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer",
                      isSelected && "bg-gray-100 font-medium"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryChange(category.documentId)}
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    {category.Icon?.data && (
                      <div className="relative w-5 h-5 flex-shrink-0">
                        <Image
                          src={
                            category.Icon.data.attributes.url ||
                            "/placeholder.svg"
                          }
                          alt={category.name}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    )}
                    <span className="truncate">{category.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Giá</h2>
          <div className="space-y-4">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={priceRange}
              onValueChange={handlePriceChange}
              max={100}
              step={1}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-blue-600 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Min price"
              />
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-blue-600 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Max price"
              />
            </Slider.Root>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{priceRange[0]}đ</span>
              <span>{priceRange[1]}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

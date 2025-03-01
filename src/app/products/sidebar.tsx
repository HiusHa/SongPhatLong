"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/app/_utils/globalApi";

interface SidebarProps {
  onCategoryChange: (categories: string[]) => void;
}

interface Category {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Icon: null | {
    data: {
      attributes: {
        url: string;
      };
    };
  };
}

interface ApiResponse {
  data: Category[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export function Sidebar({ onCategoryChange }: SidebarProps) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        const fetchedCategories = (response.data as ApiResponse).data;
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryName: string) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((name) => name !== categoryName)
      : [...selectedCategories, categoryName];

    setSelectedCategories(newCategories);
    onCategoryChange(newCategories);
  };

  return (
    <div className="w-64 p-4 border-r min-h-screen">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-3">Danh mục</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.name);

                return (
                  <label
                    key={category.documentId}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer",
                      isSelected && "bg-gray-100 font-bold"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryChange(category.name)}
                      className="form-checkbox h-4 w-4 text-red-600 transition duration-150 ease-in-out"
                    />
                    <span className="truncate">{category.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

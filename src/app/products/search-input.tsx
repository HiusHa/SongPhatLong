"use client";

import { Search } from "lucide-react";

export function SearchInput() {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Tìm kiếm thiết bị phòng cháy chữa cháy..."
        className="w-full h-10 pl-4 pr-10 rounded-md border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2">
        <Search className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
}

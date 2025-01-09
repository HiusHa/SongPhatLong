"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";

const ITEMS_PER_PAGE = 12;

const products = [
  {
    id: 1,
    title: "Mũ Bảo Hộ Chữa Cháy",
    description: "Bảo vệ cao cấp",
    price: 299.99,
    image: "/placeholder.svg?height=200&width=280&text=Mũ+Bảo+Hộ",
  },
  {
    id: 2,
    title: "Ủng Chữa Cháy",
    description: "Chống nhiệt",
    price: 189.99,
    image: "/placeholder.svg?height=200&width=280&text=Ủng+Chữa+Cháy",
  },
  {
    id: 3,
    title: "Vòi Chữa Cháy",
    description: "Áp lực cao",
    price: 149.99,
    image: "/placeholder.svg?height=200&width=280&text=Vòi+Chữa+Cháy",
  },
  {
    id: 4,
    title: "Bình Dưỡng Khí",
    description: "Thiết bị thở",
    price: 899.99,
    image: "/placeholder.svg?height=200&width=280&text=Bình+Dưỡng+Khí",
  },
  {
    id: 5,
    title: "Bình Chữa Cháy",
    description: "Đa năng",
    price: 79.99,
    image: "/placeholder.svg?height=200&width=280&text=Bình+Chữa+Cháy",
  },
  {
    id: 6,
    title: "Găng Tay Chữa Cháy",
    description: "Chống nhiệt và cắt",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=280&text=Găng+Tay",
  },
  {
    id: 7,
    title: "Camera Nhiệt",
    description: "Phát hiện nâng cao",
    price: 1299.99,
    image: "/placeholder.svg?height=200&width=280&text=Camera+Nhiệt",
  },
  {
    id: 8,
    title: "Rìu Chữa Cháy",
    description: "Thép bền",
    price: 129.99,
    image: "/placeholder.svg?height=200&width=280&text=Rìu",
  },
  {
    id: 9,
    title: "Dây Cứu Hộ",
    description: "Độ bền cao",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=280&text=Dây+Cứu+Hộ",
  },
  {
    id: 10,
    title: "Chăn Chữa Cháy",
    description: "Triển khai nhanh",
    price: 39.99,
    image: "/placeholder.svg?height=200&width=280&text=Chăn+Chữa+Cháy",
  },
  {
    id: 11,
    title: "Đèn Pin Chữa Cháy",
    description: "Chống nước",
    price: 69.99,
    image: "/placeholder.svg?height=200&width=280&text=Đèn+Pin",
  },
  {
    id: 12,
    title: "Hệ Thống Báo Động",
    description: "Cảnh báo khẩn cấp",
    price: 249.99,
    image: "/placeholder.svg?height=200&width=280&text=Báo+Động",
  },
  {
    id: 13,
    title: "Quần Áo Chống Cháy",
    description: "Bảo vệ toàn thân",
    price: 399.99,
    image: "/placeholder.svg?height=200&width=280&text=Quần+Áo",
  },
  {
    id: 14,
    title: "Thiết Bị Cứu Hộ",
    description: "Kìm cắt thủy lực",
    price: 1499.99,
    image: "/placeholder.svg?height=200&width=280&text=Thiết+Bị+Cứu+Hộ",
  },
  {
    id: 15,
    title: "Bộ Đàm",
    description: "Liên lạc tầm xa",
    price: 299.99,
    image: "/placeholder.svg?height=200&width=280&text=Bộ+Đàm",
  },
  {
    id: 16,
    title: "Cảm Biến Khói",
    description: "Cảnh báo sớm",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=280&text=Cảm+Biến+Khói",
  },
  {
    id: 17,
    title: "Hệ Thống Dập Lửa",
    description: "Tự động kích hoạt",
    price: 799.99,
    image: "/placeholder.svg?height=200&width=280&text=Hệ+Thống+Dập+Lửa",
  },
  {
    id: 18,
    title: "Bộ Sơ Cứu",
    description: "Thiết bị y tế",
    price: 149.99,
    image: "/placeholder.svg?height=200&width=280&text=Bộ+Sơ+Cứu",
  },
  {
    id: 19,
    title: "Đèn Mũ Bảo Hộ",
    description: "Chiếu sáng rảnh tay",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=280&text=Đèn+Mũ",
  },
  {
    id: 20,
    title: "Găng Tay Bảo Hộ",
    description: "Cầm nắm tốt",
    price: 79.99,
    image: "/placeholder.svg?height=200&width=280&text=Găng+Tay+Bảo+Hộ",
  },
  {
    id: 21,
    title: "Máy Bơm Di Động",
    description: "Bơm nước công suất cao",
    price: 599.99,
    image: "/placeholder.svg?height=200&width=280&text=Máy+Bơm",
  },
  {
    id: 22,
    title: "Máy Đo Khí Gas",
    description: "Đo nhiều loại khí",
    price: 349.99,
    image: "/placeholder.svg?height=200&width=280&text=Máy+Đo+Khí",
  },
  {
    id: 23,
    title: "Hệ Thống Báo Cháy",
    description: "Cảnh báo nhanh",
    price: 499.99,
    image: "/placeholder.svg?height=200&width=280&text=Báo+Cháy",
  },
  {
    id: 24,
    title: "Thiết Bị Huấn Luyện",
    description: "Hệ thống thực tế ảo",
    price: 2999.99,
    image: "/placeholder.svg?height=200&width=280&text=Huấn+Luyện",
  },
];

export function ProductGrid() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <ProductCard products={currentProducts} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

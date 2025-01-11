"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RelatedProducts } from "../realted-products";
import { products } from "../product-data";
import { Loader } from "@/components/loader";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Simulate 2 seconds loading
    return () => clearTimeout(timer);
  }, []);

  if (!product) {
    return <div>Product not found</div>;
  }

  const images = [
    product.image,
    "/placeholder.svg?height=400&width=600&text=Image+2",
    "/placeholder.svg?height=400&width=600&text=Image+3",
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.title} to cart`);
    // Here you would typically update a cart state or send to an API
  };

  const handleImageNavigation = (direction: "next" | "prev") => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % images.length;
      } else {
        return (prevIndex - 1 + images.length) % images.length;
      }
    });
  };

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <Loader /> // Show loader while loading
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="relative aspect-square">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  onClick={() => handleImageNavigation("prev")}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => handleImageNavigation("next")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <div className="flex mt-4 gap-4 overflow-x-auto">
                {images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className={`object-cover rounded cursor-pointer ${
                      index === currentImageIndex
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-red-600 mb-4">
                {product.price.toLocaleString("vi-VN")}₫
              </p>
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleAddToCart} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
          <RelatedProducts currentProductId={product.id} />
        </div>
      )}
    </div>
  );
}

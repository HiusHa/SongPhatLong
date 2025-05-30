"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import type { StrapiProduct } from "../types/product";

interface ProductCardProps {
  product: StrapiProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (imageError || !product?.image?.url) {
      return `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(
        product?.name
      )}`;
    }

    return `${product.image.url}`;
  };

  const getImageAlt = () => {
    return product?.image?.alternativeText || product?.name;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="h-full"
    >
      <Link
        href={`/products/${product.documentId}`}
        className="group block h-full"
      >
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative aspect-square w-full">
            <Image
              src={getImageUrl() || "/placeholder.svg"}
              alt={getImageAlt()}
              layout="fill"
              objectFit="fill"
              className="transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-red-600 line-clamp-2">
              {product?.name}
            </h3>

            {product.rating && (
              <div className="flex items-center mb-1">
                {renderStars(product.rating)}
                <span className="ml-1 text-sm text-gray-600">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}

            {product.bought && (
              <p className="text-sm text-gray-600 mb-2">
                Đã bán: {product.bought}
              </p>
            )}

            <div className="mt-auto space-y-1">
              <p className="text-base text-gray-500 line-through">
                {(product.pricing * 1.2).toLocaleString("vi-VN")}₫
              </p>
              <p className="text-xl font-bold text-red-600">
                {product.pricing.toLocaleString("vi-VN")}₫
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

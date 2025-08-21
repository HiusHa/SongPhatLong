import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import type { StrapiProduct } from "@/app/types/product";
import { getProductUrl } from "../../../utils/slugtify";

interface ProductCardProps {
  product: StrapiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // ✅ SỬ DỤNG FUNCTION THÔNG MINH để tạo URL
  const productUrl = getProductUrl(product);
  // const pct =
  //   typeof product.pricing === "number" &&
  //   typeof product.originalPrice === "number" &&
  //   product.originalPrice > product.pricing
  //     ? Math.round(
  //         ((product.originalPrice - product.pricing) / product.originalPrice) *
  //           100
  //       )
  //     : null;
  console.log(`🔗 ProductCard URL for ${product.name}:`, productUrl);
  console.log(`🏷️  SlugURL:`, product.SlugURL);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              rating >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200">
      <Link href={productUrl}>
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.image?.url || "/placeholder.svg?height=300&width=400"}
            alt={product.image?.alternativeText || product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-2">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
                <Eye className="h-5 w-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Badge */}
          {product.originalPrice && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Giảm giá
              </span>
            </div>
          )}

          {/* Slug Status Badge - chỉ hiển thị khi dev mode */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute bottom-4 left-4">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  product.SlugURL
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {product.SlugURL ? "Custom Slug" : "Auto Slug"}
              </span>
              {/* Hiển thị URL sẽ được tạo */}
              <div className="mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                URL: {productUrl}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Category & Brand */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">
              {product.categories?.[0]?.name || "PCCC"}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.brand || "N/A"}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="mb-3">{renderStars(product.rating)}</div>
          )}

          {/* Origin */}
          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Xuất xứ: {product.origin || "N/A"}
          </p>

          {/* Price Section */}
          <div className="space-y-2">
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                {Number(product.originalPrice).toLocaleString("vi-VN")}₫
              </p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-red-600">
                {product.pricing
                  ? Number(product.pricing).toLocaleString("vi-VN") + "₫"
                  : "Liên hệ"}
              </p>
              {product.originalPrice && product.pricing && (
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded font-medium">
                  -
                  {Math.round(
                    ((Number(product.originalPrice) - Number(product.pricing)) /
                      Number(product.originalPrice)) *
                      100
                  )}
                  %
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
                Xem chi tiết →
              </span>
              {product.bought && (
                <span className="text-xs text-gray-500">
                  Đã bán:{" "}
                  {typeof product.bought === "string"
                    ? product.bought
                    : product.bought}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

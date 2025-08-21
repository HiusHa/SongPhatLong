import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import type { StrapiProduct } from "@/app/types/product";
import { getProductUrl } from "../../../utils/slugtify";

/* ====== helpers ====== */
const toCurrency = (n?: number | null) =>
  typeof n === "number" && !Number.isNaN(n)
    ? n.toLocaleString("vi-VN") + "₫"
    : "Liên hệ";

function seededRandom01(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 1000) / 1000; // 0..0.999
}

function getFakeOriginalPrice(price?: number | null, seedKey = "seed") {
  if (!price || price <= 0) return null;
  const r = seededRandom01(seedKey);
  const pct = 0.1 + r * 0.1; // 10–20%
  return Math.round(price * (1 + pct));
}

function computeOriginal(
  pricing?: number | null,
  originalFromCMS?: number | null,
  seedKey = "seed"
) {
  if (
    typeof originalFromCMS === "number" &&
    typeof pricing === "number" &&
    originalFromCMS > pricing
  ) {
    return originalFromCMS;
  }
  return getFakeOriginalPrice(pricing, seedKey);
}

interface ProductCardProps {
  product: StrapiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = getProductUrl(product);

  const rating =
    typeof product.rating === "number" && product.rating > 0
      ? product.rating
      : 0;
  const price =
    typeof product.pricing === "number" ? product.pricing : undefined;
  const seedKey =
    product.documentId ||
    product.SlugURL ||
    product.name ||
    String(product.id || "");
  const original = computeOriginal(
    price,
    product.originalPrice as any,
    seedKey
  );

  const discountPct =
    typeof original === "number" &&
    typeof price === "number" &&
    original > price
      ? Math.round(((original - price) / original) * 100)
      : null;

  const renderStars = (val: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${
            val >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      {val > 0 && <span className="text-sm text-gray-600 ml-1">({val})</span>}
    </div>
  );

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
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
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

          {/* Badge giảm giá */}
          {discountPct && discountPct > 0 && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{discountPct}%
              </span>
            </div>
          )}

          {/* Dev-only: trạng thái slug */}
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
              <div className="mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                URL: {productUrl}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">
              {product.categories?.[0]?.name || "PCCC"}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.brand || "N/A"}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {rating > 0 && <div className="mb-3">{renderStars(rating)}</div>}

          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Xuất xứ: {product.origin || "N/A"}
          </p>

          {/* Price */}
          <div className="space-y-2">
            {typeof original === "number" && original > (price || 0) && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 line-through">
                  {toCurrency(original)}
                </p>
                {discountPct && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">
                    -{discountPct}%
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-red-600">
                {toCurrency(price)}
              </p>
              {typeof product.bought === "number" && product.bought > 0 && (
                <span className="text-xs text-gray-500">
                  Đã bán: {product.bought}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
              Xem chi tiết →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

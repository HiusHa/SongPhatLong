"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Banner } from "./banner";
import { SearchInput } from "./search-input";
import { Sidebar } from "./sidebar";
import { ProductGrid } from "./product-grid";
import { Loader } from "@/components/loader";
import type { StrapiProduct } from "../types/product";

// ======================
// Config
// ======================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ======================
// Strong TS helpers
// ======================
type ID = number | string;
type StrapiItem<T> = { id: ID; attributes: T };
type FlatOrWrapped<T> = StrapiItem<T> | (T & { id?: ID });

/** Nhận item từ Strapi (có thể dạng {id, attributes} hoặc đã phẳng),
 *  trả về object phẳng có kèm id nếu có.
 *  (nới constraint để không cần index signature)
 */
function normalizeMaybeFlat<T extends object>(
  item: FlatOrWrapped<T> | null | undefined
): (T & { id?: ID }) | null {
  if (!item) return null;
  if (
    "attributes" in (item as any) &&
    typeof (item as any).attributes === "object"
  ) {
    const wrapped = item as StrapiItem<T>;
    return { id: wrapped.id, ...(wrapped.attributes as T) };
  }
  return item as T & { id?: ID };
}

/** Bảo đảm URL media tuyệt đối (tránh gọi localhost) */
function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

/** Chuẩn hoá Product: ép số, chuẩn URL ảnh…
 *  ➜ đảm bảo các field số là `number` (default 0 nếu thiếu)
 *  ➜ image luôn là object hoặc null
 */
function normalizeProduct(
  x: (StrapiProduct & { id?: ID }) | null
): (StrapiProduct & { id?: ID }) | null {
  if (!x) return null;

  const asRec = x as unknown as Record<string, unknown>;
  const num = (v: unknown, fallback = 0): number =>
    v === null || v === undefined || v === "" ? fallback : Number(v);

  const imgUrl = resolveMediaUrl((x as any).image?.url);

  return {
    ...x,
    // ép về number để khớp kiểu StrapiProduct (nếu trong type đang là number)
    pricing: num(asRec["pricing"], 0),
    originalPrice: num(asRec["originalPrice"], 0),
    rating: num(asRec["rating"], 0),
    image: x.image && imgUrl ? { ...x.image, url: imgUrl } : null,
  } as StrapiProduct & { id?: ID };
}

// ======================
// Page animation variants
// ======================
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ======================
// Component
// ======================
export default function ProductPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<(StrapiProduct & { id?: ID })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const getLatestProducts = useCallback(async () => {
    setIsLoading(true);

    if (!API_BASE && process.env.NODE_ENV !== "production") {
      console.warn(
        "⚠️ NEXT_PUBLIC_API_URL chưa được set. Hãy thêm vào .env.local (ví dụ: https://songphatlong-admin.onrender.com)"
      );
    }

    try {
      // Thử query gọn với populate + sort + pageSize
      const urlPrimary = `${API_BASE}/api/products?populate=*&sort=createdAt:desc&pagination[pageSize]=48`;
      let res = await fetch(urlPrimary, { cache: "no-store" });

      // Fallback nếu bị 400/403 do policy
      if (!res.ok) {
        const urlFallback1 = `${API_BASE}/api/products?populate=*`;
        res = await fetch(urlFallback1, { cache: "no-store" });
        if (!res.ok) {
          const urlFallback2 = `${API_BASE}/api/products`;
          res = await fetch(urlFallback2, { cache: "no-store" });
        }
      }

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`${res.url} -> ${res.status}${t ? " | " + t : ""}`);
      }

      const json: { data?: Array<FlatOrWrapped<StrapiProduct>> } =
        await res.json();

      const raw: Array<FlatOrWrapped<StrapiProduct>> = Array.isArray(json?.data)
        ? json.data!
        : [];

      const list: (StrapiProduct & { id?: ID })[] = raw
        .map((it) => normalizeMaybeFlat<StrapiProduct>(it))
        .filter((x): x is StrapiProduct & { id?: ID } => Boolean(x))
        .map((p) => normalizeProduct(p))
        .filter((x): x is StrapiProduct & { id?: ID } => Boolean(x))
        // đảm bảo URL ảnh tuyệt đối trong mọi trường hợp
        .map((p) => ({
          ...p,
          image: p.image
            ? { ...p.image, url: resolveMediaUrl(p.image.url)! }
            : null,
        }));

      setProducts(list);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getLatestProducts();
  }, [getLatestProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Banner />

          {/* Search Section */}
          <div className="mb-8">
            <SearchInput onSearch={handleSearch} />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.aside
              className="w-full lg:w-80 shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {/* Truyền thẳng setter để tránh warning unused var */}
              <Sidebar onCategoryChange={setSelectedCategories} />
            </motion.aside>

            <motion.main
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ProductGrid
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
                products={products}
              />
            </motion.main>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// app/services/services-list.client.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "@/components/loader";
import { ServiceCard } from "./service-card";

// ============ Config ============
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";

// ============ Types tối thiểu ============
type ID = number | string;

type ServiceImage = {
  url?: string;
  alternativeText?: string | null;
  name?: string | null;
};

export type StrapiService = {
  id?: ID;
  documentId?: string;
  serviceName?: string;
  SlugURL?: string | null;
  slugURL?: string | null; // phòng khi đặt tên khác
  serviceImage?: ServiceImage[];
  // ... các field step* khác nếu cần hiển thị
};

type StrapiItem<T> = { id: ID; attributes: T };
type StrapiListResponse<T> = {
  data: Array<StrapiItem<T> | (T & { id?: ID })>;
  meta?: {
    pagination?: {
      page?: number;
      pageSize?: number;
      pageCount?: number;
      total?: number;
    };
  };
};

// ============ Helpers ============
function slugify(text?: string) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeMaybeFlat<T extends object>(
  item: StrapiItem<T> | (T & { id?: ID }) | null | undefined
): (T & { id?: ID }) | null {
  if (!item) return null;
  if ("attributes" in (item as any) && (item as any).attributes) {
    const wrapped = item as StrapiItem<T>;
    return { id: wrapped.id, ...(wrapped.attributes as T) };
  }
  return item as T & { id?: ID };
}

function resolveMediaUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

function computeSlug(s: StrapiService): string {
  const raw =
    (s.SlugURL ?? s.slugURL)?.toString().trim() ||
    slugify(s.serviceName) ||
    String(s.documentId ?? s.id ?? "");
  return raw;
}

// ============ Fetch ALL services ============
// Ưu tiên pageSize=-1 (Strapi >= 4.5). Nếu API không hỗ trợ, fallback loop phân trang.
async function fetchAllServices(): Promise<
  (StrapiService & { __slug: string })[]
> {
  const base = `${API_BASE}/api/services`;

  // 1) Thử lấy “ALL” bằng pageSize=-1
  const res = await fetch(`${base}?populate=*`, { cache: "no-store" }).catch(
    () => null
  );

  // 2) Nếu không OK -> fallback phân trang
  let all: Array<StrapiItem<StrapiService> | (StrapiService & { id?: ID })> =
    [];
  if (!res || !res.ok) {
    let page = 1;

    while (true) {
      const url = `${base}?populate=*`;
      const r = await fetch(url, { cache: "no-store" }).catch(() => null);
      if (!r || !r.ok) break;
      const j: StrapiListResponse<StrapiService> = await r
        .json()
        .catch(() => ({} as any));
      const chunk = Array.isArray(j?.data) ? j.data : [];
      all.push(...chunk);
      const { page: cur, pageCount } = j?.meta?.pagination || {};
      if (!cur || !pageCount || cur >= pageCount) break;
      if (page > 200) break; // “cầu chì” an toàn
      page++;
    }
  } else {
    const j: StrapiListResponse<StrapiService> = await res
      .json()
      .catch(() => ({} as any));
    all = Array.isArray(j?.data) ? j.data : [];
  }

  // 3) Normalize + gắn __slug + đảm bảo ảnh tuyệt đối
  const normalized = all
    .map((it) => normalizeMaybeFlat<StrapiService>(it))
    .filter((x): x is StrapiService & { id?: ID } => Boolean(x))
    .map((s) => {
      const __slug = computeSlug(s);
      const imgs = Array.isArray(s.serviceImage)
        ? s.serviceImage.map((img) => ({
            ...img,
            url: resolveMediaUrl(img.url),
          }))
        : s.serviceImage;
      return { ...s, serviceImage: imgs, __slug };
    });

  return normalized;
}

// ============ UI ============
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ServicesListClient() {
  const [services, setServices] = useState<
    (StrapiService & { __slug: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchAllServices();
        setServices(list);
      } catch (e) {
        console.error("Fetch services failed:", e);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-white"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dịch vụ</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <ServiceCard
              key={String(svc.id ?? svc.documentId ?? svc.__slug)}
              service={svc}
              slug={svc.__slug}
            />
          ))}
        </div>

        {services.length === 0 && (
          <p className="text-center text-gray-600 mt-8">Không có dịch vụ.</p>
        )}
      </div>
    </motion.div>
  );
}

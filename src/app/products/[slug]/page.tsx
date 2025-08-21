// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { fetchJSON } from "@/app/lib/api";
import ProductDetailClient from "./ProductDetailClient";

type ID = number | string;

// Strapi helpers
type StrapiItem<T> = { id: ID; attributes: T };
type FlatOrWrapped<T> = StrapiItem<T> | (T & { id?: ID });

type Product = {
  id?: ID;
  documentId?: string;
  name: string;
  SlugURL?: string | null;
  pricing?: number | string | null;
  originalPrice?: number | string | null;
  rating?: number | string | null;
  seo?: { metaTitle?: string; metaDescription?: string } | null;
  image?: { url?: string } | null;
};

type StrapiListResponse<T> = { data: Array<FlatOrWrapped<T>> };

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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";

function resolveMediaUrl(url?: string | null) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

function normalizeProduct(
  x: (Product & { id?: ID }) | null
): (Product & { id?: ID }) | null {
  if (!x) return null;
  const toNum = (v: unknown) =>
    v === null || v === undefined || v === "" ? undefined : Number(v);
  return {
    ...x,
    pricing: toNum(x.pricing as any),
    originalPrice: toNum(x.originalPrice as any),
    rating: toNum(x.rating as any),
    image: x.image
      ? { ...x.image, url: resolveMediaUrl(x.image.url) }
      : x.image,
  };
}

// app/products/[slug]/page.tsx (thêm)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const res = await fetchJSON<StrapiListResponse<Product>>(
    `/api/products?filters[SlugURL][$eq]=${encodeURIComponent(
      decodedSlug
    )}&populate=seo`
  ).catch(() => null);

  const item = res?.data?.[0] ? normalizeMaybeFlat<Product>(res.data[0]) : null;
  const seo = item?.seo;

  return {
    title: seo?.metaTitle ?? item?.name ?? "Sản phẩm",
    description: seo?.metaDescription ?? undefined,
  };
}

// ✅ Next.js 15: params là Promise — phải await
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ⭐ quan trọng
  const decodedSlug = decodeURIComponent(slug);

  // 1) Tìm theo SlugURL
  const q1 = `/api/products?filters[SlugURL][$eq]=${encodeURIComponent(
    decodedSlug
  )}&populate=*`;

  let res = await fetchJSON<StrapiListResponse<Product>>(q1).catch(() => null);

  // 2) Fallback: tìm theo documentId
  if (!res || !Array.isArray(res.data) || res.data.length === 0) {
    const q2 = `/api/products?filters[documentId][$eq]=${encodeURIComponent(
      decodedSlug
    )}&populate=*`;
    res = await fetchJSON<StrapiListResponse<Product>>(q2).catch(() => null);
  }

  if (!res || !Array.isArray(res.data) || res.data.length === 0) {
    notFound();
  }

  const item = normalizeMaybeFlat<Product>(res.data[0]);
  const product = normalizeProduct(item);
  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailClient product={product as any} />
    </div>
  );
}

// app/services/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchJSON } from "@/app/lib/api";
import ServiceDetailsClient from "./ServiceDetailsClient";

export const revalidate = 0; // tránh cache khi test
export const dynamic = "force-dynamic"; // (tuỳ) ép động

type ID = number | string;
type StrapiItem<T> = { id: ID; attributes: T };
type FlatOrWrapped<T> = StrapiItem<T> | (T & { id?: ID });

type ServiceImage = { url?: string | null; alternativeText?: string | null };
type Service = {
  id?: ID;
  documentId?: string;
  serviceName?: string | null;
  SlugURL?: string | null;
  slugURL?: string | null;
  serviceImage?: ServiceImage[] | null;
  step1?: string | null;
  step2?: string | null;
  step3?: string | null;
  step4?: string | null;
  text1Description?: string | null;
  step2Description?: string | null;
  step3Description?: string | null;
  step4Description?: string | null;
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null;
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
    const w = item as StrapiItem<T>;
    return { id: w.id, ...(w.attributes as T) };
  }
  return item as T & { id?: ID };
}

function resolveMediaUrl(base: string, url?: string | null) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${base}${url}`;
}

// ====== SEO ======
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Ưu tiên SlugURL
  let res = await fetchJSON<StrapiListResponse<Service>>(
    `/api/services?filters[SlugURL][$eq]=${encodeURIComponent(
      decodedSlug
    )}&populate=*`
  ).catch(() => null);

  if (!res?.data?.length) {
    res = await fetchJSON<StrapiListResponse<Service>>(
      `/api/services?filters[documentId][$eq]=${encodeURIComponent(
        decodedSlug
      )}&populate=*`
    ).catch(() => null);
  }

  const it = res?.data?.[0] ? normalizeMaybeFlat<Service>(res.data[0]) : null;
  if (!it) {
    return {
      title: "Dịch vụ | Song Phát Long",
      description:
        "Dịch vụ PCCC chuyên nghiệp: tư vấn – thẩm định – giám sát – nghiệm thu.",
    };
  }

  const descFallback =
    [it.step1, it.step2, it.step3, it.step4].filter(Boolean).join(" • ") ||
    "Dịch vụ PCCC chuyên nghiệp: tư vấn – thẩm định – giám sát – nghiệm thu.";

  const title = it.seo?.metaTitle ?? it.serviceName ?? "Dịch vụ";
  const description = it.seo?.metaDescription ?? descFallback;

  // Mượn BASE từ fetchJSON: ta không biết trong file này => lấy từ env giống fetchJSON
  const BASE =
    process.env.STRAPI_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "";

  const ogImg = resolveMediaUrl(BASE, it.serviceImage?.[0]?.url);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImg ? [{ url: ogImg }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
    },
  };
}

// ====== PAGE ======
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  // 1) theo SlugURL
  let res = await fetchJSON<StrapiListResponse<Service>>(
    `/api/services?filters[SlugURL][$eq]=${encodeURIComponent(
      decoded
    )}&populate=*`
  ).catch(() => null);

  // 2) fallback theo documentId
  if (!res?.data?.length) {
    res = await fetchJSON<StrapiListResponse<Service>>(
      `/api/services?filters[documentId][$eq]=${encodeURIComponent(
        decoded
      )}&populate=*`
    ).catch(() => null);
  }

  if (!res?.data?.length) notFound();

  const raw = normalizeMaybeFlat<Service>(res.data[0]);
  if (!raw) notFound();

  const BASE =
    process.env.STRAPI_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "";

  const service = {
    ...raw,
    serviceImage: Array.isArray(raw.serviceImage)
      ? raw.serviceImage.map((im) => ({
          ...im,
          url: resolveMediaUrl(BASE, im?.url),
        }))
      : raw.serviceImage,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ServiceDetailsClient service={service as any} />
    </div>
  );
}

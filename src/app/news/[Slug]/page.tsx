// app/news/[slug]/page.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Loader } from "@/components/loader";
import {
  type NewsDetail,
  type StrapiListResponse,
  type StrapiNewsItem,
} from "@/app/lib/news";
import { toSlug } from "@/app/lib/slug";
import api from "@/app/_utils/globalApi";
import type { AxiosResponse } from "axios";

// Link renderer
function LinkRenderer(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
) {
  const href = props.href || "#";
  const isInternal = href.startsWith("/") || href.startsWith("#");
  return isInternal ? (
    <Link href={href} className="text-red-600 underline">
      {props.children}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-600 underline"
    >
      {props.children}
    </a>
  );
}

// Extended type with updatedAt
type NewsDetailWithUpdated = NewsDetail & {
  updatedAt?: string | null;
  imageUrl: string; // Ensure imageUrl is always a string
};

// Helper function to safely read slug field
function readSlugField(n: StrapiNewsItem): string | null {
  const r =
    (n as unknown as Record<string, unknown>)["SlugURL"] ??
    (n as unknown as Record<string, unknown>)["slugURL"];
  return typeof r === "string" && r.trim() !== "" ? (r as string).trim() : null;
}

// Improved image URL extraction function
function extractImageUrl(imageData: any): string | null {
  if (!imageData) return null;

  // Handle different possible image data structures
  // Direct URL property
  if (imageData.url && typeof imageData.url === "string") {
    return imageData.url;
  }

  // Nested structure with attributes
  if (imageData.data?.attributes?.url) {
    return imageData.data.attributes.url;
  }

  // Nested structure without attributes
  if (imageData.data?.url) {
    return imageData.data.url;
  }

  // Format-specific URLs
  if (imageData.formats) {
    // Try to get the largest available format
    const formats = ["large", "medium", "small", "thumbnail"];
    for (const format of formats) {
      if (imageData.formats[format]?.url) {
        return imageData.formats[format].url;
      }
    }
  }

  return null;
}

// Date formatting helper - now used in the component
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Date formatting error:", e);
    return "-";
  }
};

export default function NewsDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsDetailWithUpdated | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const isDev = process.env.NODE_ENV === "development";
  const dataFetched = useRef(false);

  useEffect(() => {
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    // Prevent duplicate data fetching in development mode
    if (dataFetched.current) return;

    const fetchData = async () => {
      if (!slug || !isMounted) {
        setIsLoading(false);
        return;
      }

      try {
        const resp = await api.getNews();
        const typed = resp as AxiosResponse<StrapiListResponse<StrapiNewsItem>>;
        const list: StrapiNewsItem[] = Array.isArray(typed.data?.data)
          ? typed.data.data
          : [];

        // 1) Try custom SlugURL
        let found = list.find((n) => {
          const customSlug = readSlugField(n);
          return customSlug === slug;
        });

        // 2) Fallback to generated slug from title
        if (!found) {
          found = list.find((n) => toSlug(n.Title) === slug);
        }

        // 3) Fallback to documentId or id
        if (!found) {
          found = list.find((n) => String(n.documentId ?? n.id) === slug);
        }

        if (!found) {
          setError("News article not found");
          if (isMounted) {
            router.replace("/news");
          }
          return;
        }

        // Extract image URL with improved function
        const imageUrl = extractImageUrl(found.Image);

        const detail: NewsDetailWithUpdated = {
          id: found.id,
          title: found.Title,
          slug:
            found.SlugURL?.trim() || toSlug(found.Title) || String(found.id),
          dateISO: found.Date,
          author: found.Author ?? undefined,
          imageUrl: imageUrl || "/placeholder.svg",
          sections:
            found.ContentSection?.map((s) => ({
              id: s.id,
              title: s.SectionTitle ?? undefined,
              content: s.SectionContent ?? undefined,
            })) ?? [],
          updatedAt:
            (found as { updatedAt?: string | null }).updatedAt ?? undefined,
        };

        if (isMounted) {
          setNews(detail);
          dataFetched.current = true;
        }
      } catch (err) {
        console.error("Fetch news error:", err);
        setError("Failed to load news article");
        if (isMounted) {
          router.replace("/news");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [slug, router, isDev, isMounted]);

  // Add debug information in production
  useEffect(() => {
    if (!isDev && !isLoading && !news) {
      console.log(
        "Production debug: isLoading=",
        isLoading,
        "news=",
        news,
        "error=",
        error
      );
    }
  }, [isLoading, news, error, isDev]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Loading news article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested news article could not be found.
          </p>
          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  // Ensure imgSrc is always a string
  const imgSrc: string = imageError
    ? "/placeholder.svg"
    : news.imageUrl || "/placeholder.svg";

  const imgAlt = news.title;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug info for production */}
      {!isDev && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-sm">
          Production Debug: isLoading={isLoading.toString()}, hasNews={!!news},
          error={error || "none"}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link
          href="/news"
          className="text-red-600 hover:underline mb-6 inline-block"
        >
          ← Quay lại tin tức
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <header className="bg-red-600 text-white px-6 md:px-8 py-8 md:py-12">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              {news.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-red-100">
              <time>{formatDate(news.dateISO)}</time>
              <span>{news.author ?? "-"}</span>
            </div>
          </header>

          {/* Image container with fallback */}
          <div className="relative w-full h-64 md:h-96 bg-gray-200">
            <Image
              src={imgSrc}
              alt={imgAlt}
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
              style={{ objectFit: "cover" }}
              onError={() => setImageError(true)}
              unoptimized={true}
              priority
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-gray-500">Image not available</div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-8 space-y-8">
            {news.sections.map((sec) => (
              <section key={sec.id} id={`sec-${sec.id}`} className="mb-8">
                {sec.title && (
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                    {sec.title}
                  </h2>
                )}
                <div className="bg-gray-100 p-4 md:p-6 rounded-lg">
                  <div className="text-gray-700 leading-relaxed prose prose-lg max-w-none">
                    <ReactMarkdown
                      components={{ a: (props) => <LinkRenderer {...props} /> }}
                    >
                      {sec.content ?? ""}
                    </ReactMarkdown>
                  </div>
                </div>
              </section>
            ))}

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-gray-500">
                Cập nhật: {formatDate(news.updatedAt)}
              </span>
              <Link
                href="/news"
                className="text-red-600 hover:underline inline-block"
              >
                ← Xem thêm tin tức
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

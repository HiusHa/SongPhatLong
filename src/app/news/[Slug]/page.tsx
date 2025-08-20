// app/news/[slug]/page.tsx
"use client";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Loader } from "@/components/loader";
import { type NewsDetail, type StrapiNewsItem } from "@/app/lib/news";
import { toSlug } from "@/app/lib/slug";
function FacebookEmbed({ url }: { url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const isReel = url.includes("facebook.com/reel");
  const isVideo = url.includes("facebook.com/videos/");

  return (
    <div className="my-4 rounded-xl overflow-hidden shadow-lg bg-gray-50">
      <div className="p-3 bg-blue-600 text-white flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="font-medium">Facebook</span>
      </div>
      <div className="p-1 bg-white">
        <iframe
          src={`https://www.facebook.com/plugins/${
            isReel || isVideo ? "video" : "post"
          }.php?href=${encodedUrl}&width=500&show_text=true&height=${
            isReel || isVideo ? "280" : "500"
          }&appId`}
          width="100%"
          height={isReel || isVideo ? 280 : 500}
          style={{ border: "none", overflow: "hidden", width: "100%" }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          {...{ allowtransparency: "true" }}
        />
      </div>
    </div>
  );
}
// Link renderer
function LinkRenderer(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
) {
  const href = props.href || "#";
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const isFacebookLink = href.includes("facebook.com");

  // Handle Facebook links specially
  if (isFacebookLink) {
    return (
      <div className="my-4">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline font-medium"
        >
          {props.children}
        </a>
        <FacebookEmbed url={href} />
      </div>
    );
  }

  // Handle regular links
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
  imageUrl: string;
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

  if (imageData.url && typeof imageData.url === "string") {
    return imageData.url;
  }

  if (imageData.data?.attributes?.url) {
    return imageData.data.attributes.url;
  }

  if (imageData.data?.url) {
    return imageData.data.url;
  }

  if (imageData.formats) {
    const formats = ["large", "medium", "small", "thumbnail"];
    for (const format of formats) {
      if (imageData.formats[format]?.url) {
        return imageData.formats[format].url;
      }
    }
  }

  return null;
}

// Date formatting helper
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

// Helper function to extract slug from pathname
function extractSlugFromPathname(pathname: string): string | null {
  const parts = pathname.split("/");
  // Remove empty strings and get the last part
  const nonEmptyParts = parts.filter((part) => part.length > 0);
  if (
    nonEmptyParts.length > 1 &&
    nonEmptyParts[nonEmptyParts.length - 2] === "news"
  ) {
    return nonEmptyParts[nonEmptyParts.length - 1];
  }
  return null;
}

export default function NewsDetailPage() {
  const pathname = usePathname();
  const slug = extractSlugFromPathname(pathname);

  const [news, setNews] = useState<NewsDetailWithUpdated | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === "development";
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const p = total > 0 ? (el.scrollTop / total) * 100 : 0;
      setScrollProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      if (!slug) {
        console.log("No slug found in pathname:", pathname);
        setError("Invalid news URL");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Make a direct API call
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL_PROD ||
            process.env.NEXT_PUBLIC_API_URL_DEV ||
            "https://songphatlong-admin.onrender.com"
          }/api/news?populate=*`
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        const list: StrapiNewsItem[] = Array.isArray(data?.data)
          ? data.data
          : [];

        if (list.length === 0) {
          setError("No articles found");
          return;
        }

        // Try to find the article by slug
        let found = list.find((n) => {
          const customSlug = readSlugField(n);
          return customSlug === slug;
        });

        if (!found) {
          found = list.find((n) => toSlug(n.Title) === slug);
        }

        if (!found) {
          found = list.find((n) => String(n.documentId ?? n.id) === slug);
        }

        if (!found) {
          setError("Article not found");
          return;
        }

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

        setNews(detail);
      } catch (err) {
        console.error("Error loading news:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load news";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [pathname, slug]);

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

          {/* Only show debug info in development */}
          {isDev && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded text-left text-sm">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Pathname: {pathname}</p>
              <p>Extracted slug: {slug}</p>
              <p>Environment: {process.env.NODE_ENV}</p>
            </div>
          )}

          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors mt-4"
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

          {/* Only show debug info in development */}
          {isDev && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded text-left text-sm">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Pathname: {pathname}</p>
              <p>Extracted slug: {slug}</p>
              <p>Environment: {process.env.NODE_ENV}</p>
            </div>
          )}

          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors mt-4"
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
  // NEW: reading progress + copy link state

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-red-600 z-40 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="mb-6 md:mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Trang chủ
          </Link>
          <span className="px-2">/</span>
          <Link href="/news" className="hover:text-gray-700">
            Tin tức
          </Link>
          <span className="px-2">/</span>
          <span className="text-gray-800 line-clamp-1">{news.title}</span>
        </nav>

        {/* Article card */}
        <article className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {/* Cover */}
          <div className="relative">
            <div className="relative w-full h-[42vw] max-h-[420px] bg-gray-100">
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                onError={() => setImageError(true)}
                unoptimized
                priority
              />
              {/* subtle overlay gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              {/* Title over image on larger screens */}
              <div className="hidden md:block absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold drop-shadow">
                  {news.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-red-100/90">
                  <time className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
                    {formatDate(news.dateISO)}
                  </time>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
                    {news.author ?? "Song Phát Long"}
                  </span>
                </div>
              </div>
            </div>

            {/* Title for small screens */}
            <div className="md:hidden px-4 sm:px-6 pt-5">
              <h1 className="text-2xl font-bold text-gray-900">{news.title}</h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                <time>{formatDate(news.dateISO)}</time>
                <span>•</span>
                <span>{news.author ?? "Song Phát Long"}</span>
              </div>
            </div>
          </div>

          {/* Actions bar */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100 bg-white/60 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  className="opacity-70"
                >
                  <path fill="currentColor" d="M10 19l-7-7l7-7v4h8v6h-8v4z" />
                </svg>
                Quay lại
              </Link>

              <div className="ml-auto flex items-center gap-2">
                {/* Share to FB (simple link) */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.href : ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="opacity-70"
                  >
                    <path
                      fill="currentColor"
                      d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3C10.5 7.7 12 6 14.7 6c1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 3h-2.4v7A10 10 0 0 0 22 12"
                    />
                  </svg>
                  Chia sẻ
                </a>

                {/* Copy link */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="opacity-70"
                  >
                    <path
                      fill="currentColor"
                      d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12zM20 5H8a2 2 0 0 0-2 2v14h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 16H8V7h12z"
                    />
                  </svg>
                  {copied ? "Đã copy!" : "Copy link"}
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content */}
            <div className="lg:col-span-8">
              {news.sections.map((sec) => (
                <section key={sec.id} id={`sec-${sec.id}`} className="mb-10">
                  {sec.title && (
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="h-5 w-1.5 rounded-full bg-red-600" />
                      {sec.title}
                    </h2>
                  )}

                  {/* Markdown with preserved line breaks */}
                  <div className="bg-gray-50/70 hover:bg-gray-50 transition-colors border border-gray-100 rounded-xl p-4 sm:p-6">
                    <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                          // Paragraphs become <div>, so block children (like your embed <div>) are valid
                          p: ({ ...props }) => (
                            <div {...props} className="mb-4 leading-relaxed" />
                          ),
                          // Keep your custom link renderer
                          a: (props) => <LinkRenderer {...props} />,
                        }}
                      >
                        {(sec.content ?? "").replace(/\r\n/g, "\n")}
                      </ReactMarkdown>
                    </div>
                  </div>
                </section>
              ))}

              {/* Footer meta */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Cập nhật: {formatDate(news.updatedAt)}
                </span>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 19l-7-7l7-7v4h8v6h-8z" />
                  </svg>
                  Xem thêm tin tức
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Quick contact / CTA */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <span className="h-5 w-1.5 rounded-full bg-red-600" />
                  Liên hệ tư vấn & báo giá
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Dây chống cháy đạt chuẩn IEC 60331, BS 6387, EN 50200.
                </p>

                <div className="space-y-2 text-sm">
                  <a
                    href="tel:0904858385"
                    className="block rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
                  >
                    📲 Hotline/Zalo: 0904.85.83.85
                  </a>
                  <a
                    href="tel:0905799385"
                    className="block rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
                  >
                    📲 Hotline/Zalo: 0905.799.385
                  </a>
                  <a
                    href="mailto:songphatlong@gmail.com"
                    className="block rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
                  >
                    📧 songphatlong@gmail.com
                  </a>
                </div>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-white font-medium hover:bg-red-700"
                >
                  Nhận tư vấn miễn phí
                </Link>
              </div>

              {/* Facebook preview note */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-600">
                🔗 Link Facebook trong nội dung sẽ tự nhúng bên dưới đoạn văn
                bản tương ứng.
              </div>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
}

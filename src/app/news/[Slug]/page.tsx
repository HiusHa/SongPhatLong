// app/news/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {
  firstImageUrl,
  NewsDetail,
  StrapiListResponse,
  StrapiNewsItem,
} from "@/app/lib/news";
import { toSlug } from "@/app/lib/slug";

// Nếu muốn luôn lấy dữ liệu mới:
// export const dynamic = "force-dynamic";

async function fetchNews(): Promise<StrapiListResponse<StrapiNewsItem>> {
  const base = process.env.STRAPI_URL!;
  const token = process.env.STRAPI_API_TOKEN;

  const res = await fetch(`${base}/api/news?populate=*`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // cache: "no-store",
  });

  if (!res.ok) throw new Error(`News API ${res.status}`);
  return res.json();
}

// Link renderer để link ngoài mở tab mới, link nội bộ dùng <Link>
function LinkRenderer(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
) {
  const href = props.href || "#";
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} className="text-red-600 underline">
        {props.children}
      </Link>
    );
  }
  return (
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

// mở rộng kiểu để có updatedAt mà không dùng any
type NewsDetailWithUpdated = NewsDetail & { updatedAt?: string | null };

export default async function NewsDetailPage({
  params,
}: {
  // ⭐ Next 15: params là Promise
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ⭐ phải await

  const payload = await fetchNews();
  const list = payload.data ?? [];

  // Tìm bài theo SlugURL (nếu có) hoặc slugify Title hoặc id/documentId
  const found =
    list.find((n) => (n.SlugURL?.trim() || "") === slug) ||
    list.find((n) => toSlug(n.Title) === slug) ||
    list.find((n) => String(n.id) === slug) ||
    list.find((n) => String(n.documentId ?? "") === slug);

  if (!found) return notFound();

  // Chuẩn hóa về model "detail" để UI dùng
  const detail: NewsDetailWithUpdated = {
    id: found.id,
    title: found.Title,
    slug: found.SlugURL?.trim() || toSlug(found.Title) || String(found.id),
    dateISO: found.Date,
    author: found.Author ?? undefined,
    imageUrl: firstImageUrl(found.Image ?? undefined),
    sections:
      found.ContentSection?.map((s) => ({
        id: s.id,
        title: s.SectionTitle ?? undefined,
        content: s.SectionContent ?? undefined,
      })) ?? [],
    updatedAt: (found as { updatedAt?: string | null }).updatedAt,
  };

  const imgUrl = detail.imageUrl || "";
  const imgAlt = detail.title;

  return (
    <div className="container mx-auto py-12">
      <Link href="/news" className="text-red-600 hover:underline mb-6 block">
        ← Quay lại tin tức
      </Link>

      <article className="bg-white rounded-xl shadow overflow-hidden">
        <header className="bg-red-600 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{detail.title}</h1>
          <div className="flex gap-4 text-red-100">
            <time>
              {detail.dateISO
                ? new Date(detail.dateISO).toLocaleDateString("vi-VN")
                : "-"}
            </time>
            <span>{detail.author ?? "-"}</span>
          </div>
        </header>

        {!!imgUrl && (
          <div
            className="my-8 mx-8 rounded-lg overflow-hidden relative"
            style={{ height: 400 }}
          >
            <Image
              src={imgUrl || "/placeholder.svg"}
              alt={imgAlt}
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
              style={{ objectFit: "cover" }}
              // URL Cloudinary là tuyệt đối → nên để unoptimized
              unoptimized={imgUrl.startsWith("http")}
            />
          </div>
        )}

        <div className="p-8 space-y-16">
          {detail.sections.map((sec) => (
            <section key={sec.id} id={`sec-${sec.id}`}>
              {sec.title && (
                <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>
              )}
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="text-gray-700 leading-relaxed prose max-w-none">
                  <ReactMarkdown
                    components={{
                      a: (props) => <LinkRenderer {...props} />,
                    }}
                  >
                    {sec.content ?? ""}
                  </ReactMarkdown>
                </div>
              </div>
            </section>
          ))}

          <div className="mt-16 pt-8 border-t flex justify-between">
            <span className="text-gray-500">
              Cập nhật:{" "}
              {detail.updatedAt
                ? new Date(detail.updatedAt).toLocaleDateString("vi-VN")
                : "-"}
            </span>
            <Link href="/news" className="text-red-600 hover:underline">
              ← Xem thêm tin tức
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

// app/news/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://songphatlong-admin.onrender.com";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// revalidate (tùy chỉnh)
export const revalidate = 60;

// --- Types ---
type ImageType = {
  alternativeText: string | null;
  url: string;
  width?: number;
  height?: number;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
};

type ContentSection = {
  id: number;
  SectionTitle: string;
  SectionContent: string;
};

type NewsDetail = {
  id: number;
  documentId: string;
  SlugURL?: string | null;
  Title: string;
  Date: string;
  Author: string;
  updatedAt: string;
  Image: ImageType;
  ContentSection: ContentSection[];
};

type ListResponse = { data: NewsDetail[]; meta?: unknown };

// --- helpers ---
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pickImageUrl(img?: ImageType) {
  if (!img) return "";
  return img.formats?.large?.url || img.url;
}

// Markdown-like parsing helpers
const IMAGE_MD = /!\[([^\]]*)\]\(([^)]+)\)/g;
const LINK_MD = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_MD = /\*\*([^*]+)\*\*/g;

function RenderContent({ raw }: { raw: string }) {
  const paras = raw.split(/\n{1,2}/).filter((p) => p.trim());
  return (
    <div className="space-y-6">
      {paras.map((para, idx) => {
        const bolded = para.replace(
          BOLD_MD,
          (_, txt) => `<strong>${txt}</strong>`
        );
        const combined = new RegExp(
          `${IMAGE_MD.source}|${LINK_MD.source}`,
          "g"
        );
        const parts: Array<
          | { type: "html"; content: string }
          | { type: "img"; alt: string; url: string }
          | { type: "link"; text: string; url: string }
        > = [];

        let lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = combined.exec(bolded))) {
          const match = m[0];
          const imgAlt = m[1];
          const imgUrl = m[2];
          const linkText = m[3];
          const linkUrl = m[4];

          if (m.index > lastIndex) {
            parts.push({
              type: "html",
              content: bolded.slice(lastIndex, m.index),
            });
          }

          if (imgUrl && imgAlt !== undefined) {
            parts.push({ type: "img", alt: imgAlt, url: imgUrl });
          } else if (linkText && linkUrl) {
            parts.push({ type: "link", text: linkText, url: linkUrl });
          }

          lastIndex = m.index + match.length;
        }

        if (lastIndex < bolded.length) {
          parts.push({ type: "html", content: bolded.slice(lastIndex) });
        }

        return (
          <div key={idx} className="text-gray-700 leading-relaxed">
            {parts.map((p, i) => {
              if (p.type === "html") {
                return (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{ __html: p.content }}
                  />
                );
              }
              if (p.type === "img") {
                return (
                  <div key={i} className="my-4">
                    <Image
                      src={p.url}
                      alt={p.alt}
                      width={800}
                      height={600}
                      className="w-full rounded-lg object-contain"
                      unoptimized
                    />
                  </div>
                );
              }
              // link
              let href = p.url;
              let text = p.text;
              if (text.toLowerCase().trim() === "link") {
                text = href;
              }
              if (!href.match(/^https?:\/\//) && text.match(/^https?:\/\//)) {
                [href, text] = [text, href];
              }
              return (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline break-all"
                >
                  {text}
                </a>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// --- Pre-render params for build time ---
export async function generateStaticParams() {
  const url = `${API_BASE}/api/news?populate=*`;
  const res = await fetch(url, {
    headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : undefined,
    // server-side fetch at build time
  });

  if (!res.ok) {
    return [];
  }

  const json = (await res.json()) as ListResponse;
  const items = Array.isArray(json?.data) ? json.data : [];
  return items.map((n) => {
    const s =
      (n.SlugURL && n.SlugURL.trim()) ||
      slugify(n.Title || "") ||
      n.documentId ||
      String(n.id);
    return { slug: s };
  });
}

// --- Page (server component) ---
export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // IMPORTANT: await params before reading slug (fixes the runtime error)
  const { slug } = (await params) as { slug: string };

  if (!slug) {
    redirect("/news");
  }

  const url = `${API_BASE}/api/news?populate=*`;
  const res = await fetch(url, {
    headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : undefined,
  });

  if (!res.ok) {
    // API lỗi -> chuyển về list (bạn có thể đổi thành notFound())
    redirect("/news");
  }

  const json = (await res.json()) as ListResponse;
  const list = Array.isArray(json?.data) ? json.data : [];

  const found =
    list.find((n) => n.SlugURL && n.SlugURL.trim() === slug) ||
    list.find((n) => slugify(n.Title || "") === slug) ||
    list.find((n) => n.documentId === slug) ||
    list.find((n) => String(n.id) === slug);

  if (!found) {
    redirect("/news");
  }

  const item = found as NewsDetail;

  return (
    <div className="container mx-auto py-12">
      <Link href="/news" className="text-red-600 hover:underline mb-6 block">
        ← Quay lại tin tức
      </Link>

      <article className="bg-white rounded-xl shadow overflow-hidden">
        <div className="bg-red-600 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{item.Title}</h1>
          <div className="flex gap-4 text-red-100">
            <time>{new Date(item.Date).toLocaleDateString("vi-VN")}</time>
            <span>{item.Author}</span>
          </div>
        </div>

        <div className="my-8 mx-8 rounded-lg overflow-hidden">
          <Image
            src={pickImageUrl(item.Image)}
            alt={item.Image.alternativeText || item.Title}
            width={item.Image.width || 1200}
            height={item.Image.height || 600}
            className="object-cover w-full"
            unoptimized
          />
        </div>

        <div className="p-8 space-y-16">
          {item.ContentSection.map((sec, idx) => (
            <section key={sec.id} id={`sec-${sec.id}`}>
              <h2 className="text-2xl font-bold mb-4">
                {idx + 1}. {sec.SectionTitle}
              </h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                <RenderContent raw={sec.SectionContent} />
              </div>
            </section>
          ))}

          <div className="mt-16 pt-8 border-t flex justify-between">
            <span className="text-gray-500">
              Cập nhật: {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
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

// app/news/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/app/_utils/globalApi";
import { Loader } from "@/components/loader";

// Kiểu dữ liệu
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
  Image: {
    alternativeText: string | null;
    url: string;
    width: number;
    height: number;
    formats: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
  ContentSection: ContentSection[];
};

type ApiResponse<T> = { data: { data: T[] } };

// Regex để parse Markdown
const IMAGE_MD = /!\[([^\]]*)\]\(([^)]+)\)/;
const LINK_MD = /\[([^\]]+)\]\(([^)]+)\)/;
const BOLD_MD = /\*\*([^*]+)\*\*/g;

// Hàm slugify Title
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Component để render nội dung section
function RenderContent({ raw }: { raw: string }) {
  const paras = raw.split(/\n{1,2}/).filter((p) => p.trim());
  return (
    <div className="space-y-6">
      {paras.map((para, idx) => {
        // Tách bold
        const bolded = para.replace(
          BOLD_MD,
          (_, txt) => `<strong>${txt}</strong>`
        );
        // Dùng regex kết hợp để tách link và ảnh
        const combined = new RegExp(
          `${IMAGE_MD.source}|${LINK_MD.source}`,
          "g"
        );
        const parts: Array<
          | { type: "text"; content: string }
          | { type: "img"; alt: string; url: string }
          | { type: "link"; text: string; url: string }
          | { type: "html"; content: string }
        > = [];

        let lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = combined.exec(bolded))) {
          const [match, imgAlt, imgUrl, linkText, linkUrl] = m;
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
          parts.push({
            type: "html",
            content: bolded.slice(lastIndex),
          });
        }

        return (
          <div key={idx} className="text-gray-700 leading-relaxed">
            {parts.map((p, i) => {
              if (p.type === "text" || p.type === "html") {
                // Với phần HTML có chứa <strong> thì dùng dangerouslySetInnerHTML
                return p.type === "html" ? (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{ __html: p.content }}
                  />
                ) : (
                  <span key={i}>{p.content}</span>
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
              // Nếu label chỉ là "link", dùng luôn URL
              if (text.toLowerCase().trim() === "link") {
                text = href;
              }
              // Nếu gõ nhầm [url](link), swap lại
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

export default function NewsDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      const resp = (await api.getNews()) as ApiResponse<NewsDetail>;
      const all = resp.data.data;

      // 1) match custom SlugURL
      let found = all.find((n) => n.SlugURL?.trim() === slug);

      // 2) match auto slugify(Title)
      if (!found) {
        found = all.find((n) => slugify(n.Title) === slug);
      }

      // 3) fallback documentId
      if (!found) {
        found = all.find((n) => n.documentId === slug);
      }

      if (!found) {
        router.replace("/news");
      } else {
        setItem(found);
      }
      setLoading(false);
    })();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (!item) return null;

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
            src={item.Image.formats?.large?.url || item.Image.url}
            alt={item.Image.alternativeText || item.Title}
            width={item.Image.width}
            height={item.Image.height}
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

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader } from "@/components/loader";
import type { NewsDetail } from "@/app/types/news";
import api from "@/app/_utils/globalApi";

export default function NewsDetailPage() {
  const { documentId } = useParams();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.getNews();
        const newsItem = response.data.data.find(
          (item: NewsDetail) => item.documentId === documentId
        );
        setNews(newsItem || null);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [documentId]);

  if (isLoading) {
    return <Loader />;
  }

  if (!news) {
    return <div>News article not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {news.Title}
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mb-8">
            <time>{new Date(news.Date).toLocaleDateString()}</time>
            <span>|</span>
            <span>{news.Author}</span>
          </div>
          <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
            <Image
              src={news.Image.url || "/placeholder.svg"}
              alt={news.Image.alternativeText || news.Title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="prose max-w-none">
            {/* Table of Contents */}
            {news.ContentSection && news.ContentSection.length > 0 && (
              <nav className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Table of Contents
                </h2>
                <ul>
                  {news.ContentSection.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#section-${section.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {section.SectionTitle}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Content Sections */}
            {news.ContentSection.map((section) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.SectionTitle}
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  {section.SectionContent.map((content, index) => (
                    <div key={index}>
                      {content.children.map((child, childIndex) => (
                        <p key={childIndex}>{child.text}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

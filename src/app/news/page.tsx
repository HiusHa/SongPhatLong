import Image from "next/image";
import Link from "next/link";
import api from "../_utils/globalApi";

type NewsItem = {
  id: number;
  documentId: string;
  Title: string;
  Date: string;
  Author: string;
  Image: {
    url: string;
    alternativeText: string | null;
  };
};

export default async function NewsPage() {
  let news: NewsItem[] = [];
  let error = null;

  try {
    const response = await api.getNews();
    news = response.data.data;
  } catch (e) {
    error =
      e instanceof Error ? e.message : "An error occurred while fetching news";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-red-600 mb-8">Tin Tức</h1>
          <p className="text-gray-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-8">Tin Tức</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item.documentId}
              href={`/news/${item.documentId}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gray-900/70 text-white px-3 py-1 text-sm rounded">
                    THÔNG TIN PCCC
                  </span>
                </div>
                <div className="relative aspect-[16/9]">
                  <Image
                    src={item.Image.url || "/placeholder.svg"}
                    alt={item.Image.alternativeText || item.Title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
                  {item.Title}
                </h2>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.Date).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-red-600 group-hover:text-red-700">
                    ĐỌC NGAY »
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

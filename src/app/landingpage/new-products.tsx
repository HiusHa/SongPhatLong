"use client";

import React, { useEffect, useState, useRef } from "react";
import slugify from "slugify";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";

interface StrapiProduct {
  id: number;
  documentId: string;
  SlugURL?: string;
  name: string;
  pricing: number;
  image: {
    formats?: { small?: { url: string } };
    url: string;
  };
}

interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
}

export default function NewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://songphatlong-admin.onrender.com"
        }/api/products?populate=*&sort=createdAt:desc`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { data } = await res.json();

        const mapped: Product[] = data
          .slice(0, 10)
          .map((item: StrapiProduct) => {
            const actual = item.pricing || 0;
            const original = Math.ceil(actual * 1.2);

            // --- phần quan trọng: chọn slug có sẵn hoặc tự tạo ---

            const slug =
              item.SlugURL && item.SlugURL.trim().length > 0
                ? item.SlugURL.trim()
                : slugify(
                    // 1) Thay đ->d trước
                    item.name
                      .normalize("NFD") // tách dấu
                      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
                      .replace(/Đ/g, "D")
                      .replace(/đ/g, "d"),
                    { lower: true, strict: true }
                  );

            return {
              id: item.id,
              slug,
              name: item.name,
              price: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(actual),
              originalPrice: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(original),
              imageUrl:
                item.image?.formats?.small?.url ||
                item.image?.url ||
                "/placeholder.svg",
            };
          });

        setProducts(mapped);
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Các hàm scroll slider… (giữ nguyên như bạn đang dùng)
  const scrollBy = (deltaItems: number) => {
    if (!sliderRef.current) return;
    const count = products.length;
    const itemWidth = sliderRef.current.scrollWidth / count;
    sliderRef.current.scrollBy({
      left: itemWidth * deltaItems,
      behavior: "smooth",
    });
  };

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!products.length) return <p>Không có sản phẩm.</p>;

  return (
    <section className="relative py-8 px-4">
      {/* Nút điều hướng */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronRight />
      </Button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
      >
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="snap-start">
            <Card className="w-60 h-80 flex flex-col">
              <CardContent className="flex-1 flex flex-col">
                <div className="relative flex-1">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                  <button className="absolute top-2 right-2 bg-white p-1 rounded-full">
                    <Heart className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                <h3 className="mt-2 font-semibold truncate">{p.name}</h3>
                <div className="mt-auto">
                  <span className="line-through text-gray-400">
                    {p.originalPrice}
                  </span>
                  <p className="text-red-600 font-bold">{p.price}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Liên hệ
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Xem thêm */}
      <div className="text-center mt-6">
        <Link href="/products">
          <Button className="bg-red-600 text-white px-6 py-2">
            Xem thêm <ArrowRight className="inline ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

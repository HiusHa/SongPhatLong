"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";

// Định nghĩa lại interface để có thêm slug
interface StrapiProduct {
  id: number;
  documentId: string;
  SlugURL?: string;
  name: string;
  pricing: number;
  image: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    url: string;
    formats: {
      small: {
        url: string;
      };
    };
  };
}

interface Product {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
}

function NewProducts() {
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://songphatlong-admin.onrender.com"
        }/api/products?populate=*&sort=createdAt:desc`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          const limited = data.data.slice(0, 10);
          const formatted = limited.map((item: StrapiProduct) => {
            const actualPrice = item.pricing || 0;
            const originalPrice = Math.ceil(actualPrice * 1.2);
            // Chọn slug: SlugURL nếu có, ngược lại dùng documentId
            const slug = item.SlugURL?.trim()
              ? item.SlugURL.trim()
              : item.documentId;
            return {
              id: item.id,
              documentId: item.documentId,
              slug,
              name: item.name || "Sản phẩm",
              price: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(actualPrice),
              originalPrice: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(originalPrice),
              imageUrl:
                item.image?.formats?.small?.url ||
                item.image?.url ||
                "/placeholder.svg?height=300&width=300",
            };
          });

          setProducts(formatted);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [controls, products, isInView, hasAnimated]);

  const getVisibleItems = () => {
    if (isMobile) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  };

  const scrollLeft = () => {
    if (!sliderRef.current || products.length === 0) return;
    const itemWidth = sliderRef.current.scrollWidth / products.length;
    const visible = getVisibleItems();
    if (sliderRef.current.scrollLeft < itemWidth) {
      const maxPos =
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({ left: maxPos, behavior: "smooth" });
    } else {
      sliderRef.current.scrollBy({
        left: -itemWidth * visible,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (!sliderRef.current || products.length === 0) return;
    const itemWidth = sliderRef.current.scrollWidth / products.length;
    const visible = getVisibleItems();
    const maxPos =
      sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
    if (sliderRef.current.scrollLeft >= maxPos - 10) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      sliderRef.current.scrollBy({
        left: itemWidth * visible,
        behavior: "smooth",
      });
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "/contact";
  };

  if (isLoading) {
    return (
      <div className="py-8 px-4 md:py-12 md:px-8 max-w-[1440px] mx-auto">
        <div className="h-10 w-64 bg-gray-200 rounded-md mx-auto mb-8 animate-pulse"></div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 md:py-12 md:px-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-8 px-4 md:py-12 md:px-8 text-center">
        Không có sản phẩm nào.
      </div>
    );
  }

  return (
    <section
      ref={ref}
      className="py-8 px-4 md:py-12 md:px-8 max-w-[1440px] mx-auto"
    >
      <h2 className="mb-6 md:mb-8 text-center text-3xl md:text-4xl font-bold text-red-600">
        SẢN PHẨM MỚI RA MẮT
      </h2>

      <div className="mb-8 relative">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-red-100 hover:text-red-600 shadow-md"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-red-100 hover:text-red-600 shadow-md"
          style={{ transform: "translate(50%, -50%)" }}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="relative overflow-hidden px-4">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((p) => (
              <div
                key={`slider-${p.id}`}
                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start"
              >
                <Link href={`/products/${p.slug}`} className="block h-full">
                  <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                    <CardContent className="p-3 md:p-4 flex flex-col h-full">
                      <div className="relative h-40 md:h-48 w-full">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-contain rounded-lg"
                        />
                        <button
                          className="absolute right-2 top-2 rounded-full bg-white p-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="mt-3 text-lg md:text-xl font-semibold truncate">
                        {p.name}
                      </h3>
                      <div className="mt-auto pt-3 flex flex-col items-start">
                        <span className="text-sm md:text-base text-gray-500 line-through">
                          {p.originalPrice}
                        </span>
                        <span className="text-base md:text-lg font-semibold text-red-600">
                          {p.price}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs md:text-sm hover:bg-red-600 hover:text-white transition-colors duration-300"
                          onClick={handleContactClick}
                        >
                          Liên hệ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/products">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md flex items-center gap-2 text-base"
            size="lg"
          >
            Xem thêm
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default NewProducts;

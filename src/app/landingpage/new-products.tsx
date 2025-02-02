"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "../_utils/globalApi";

interface StrapiProduct {
  id: number;
  documentId: string;
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
  description: Array<{
    type: string;
    children: Array<{ text: string; type: string }>;
  }>;
}

interface StrapiResponse {
  data: StrapiProduct[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
}

export function NewProducts() {
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const getLatestProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.getLatestProducts();
        console.log("Raw API Response:", response);

        if (!response || !response.data) {
          throw new Error("Invalid response from API");
        }

        const strapiResponse = response.data as StrapiResponse;
        console.log("Strapi Response:", strapiResponse);

        if (!Array.isArray(strapiResponse.data)) {
          throw new Error("Data is not an array");
        }

        const formattedProducts = strapiResponse.data.map(
          (item: StrapiProduct) => {
            console.log("Processing item:", item); // Debug log
            const actualPrice = item.pricing || 0;
            const originalPrice = Math.ceil(actualPrice * 1.2); // 20% higher
            return {
              id: item.id,
              name: item.name || "Unnamed Product",
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
                "/placeholder.svg",
            };
          }
        );

        console.log("Formatted Products:", formattedProducts);
        setProducts(formattedProducts);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch products"
        );
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    getLatestProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      controls.start("visible");
    }
  }, [controls, products]);

  const cardVariants: Variants = {
    hidden: (index: number) => ({
      opacity: 0,
      x: index < 2 ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  if (isLoading) {
    return (
      <div className="py-8 px-4 md:py-12 md:px-8 text-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 md:py-12 md:px-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-8 px-4 md:py-12 md:px-8 text-center">
        No products available.
      </div>
    );
  }

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      className="py-8 px-4 md:py-12 md:px-8"
    >
      <motion.h2
        variants={cardVariants}
        className="mb-6 md:mb-8 text-center text-2xl md:text-3xl font-bold text-red-600"
      >
        Sản phẩm mới ra mắt
      </motion.h2>
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={cardVariants}
            whileHover={isMobile ? {} : { scale: 1.05 }}
            whileTap={isMobile ? { scale: 0.95 } : {}}
          >
            <Card className="h-full">
              <CardContent className="p-3 md:p-4 flex flex-col h-full">
                <div className="relative h-40 md:h-48 w-full">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <motion.button
                    className="absolute right-2 top-2 rounded-full bg-white p-1.5"
                    whileTap={{ scale: 0.9 }}
                  >
                    ♡
                  </motion.button>
                </div>
                <h3 className="mt-3 text-lg md:text-xl font-semibold">
                  {product.name}
                </h3>
                <div className="mt-auto pt-3 flex flex-col items-start">
                  <span className="text-sm md:text-base text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                  <span className="text-base md:text-lg font-semibold text-red-600">
                    {product.price}
                  </span>
                </div>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs md:text-sm hover:bg-red-600 hover:text-white transition-colors duration-300"
                  >
                    Liên hệ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

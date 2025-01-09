"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: string;
}

const products: Product[] = [
  { id: 1, name: "All New Rush", price: "$72.00/day" },
  { id: 2, name: "Sporty SUV", price: "$85.00/day" },
  { id: 3, name: "Luxury Sedan", price: "$95.00/day" },
  { id: 4, name: "Electric Hatchback", price: "$68.00/day" },
];

export function NewProducts() {
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }));
  }, [controls]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-8 px-4 md:py-12 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8 text-center text-2xl md:text-3xl font-bold"
      >
        Sản phẩm mới ra mắt
      </motion.h2>
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            custom={index}
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            whileHover={isMobile ? {} : { scale: 1.05 }}
            whileTap={isMobile ? { scale: 0.95 } : {}}
          >
            <Card className="h-full">
              <CardContent className="p-3 md:p-4 flex flex-col h-full">
                <div className="relative h-40 md:h-48 w-full">
                  <Image
                    src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
                      product.name
                    )}`}
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
                <h3 className="mt-3 text-base md:text-lg font-semibold">
                  {product.name}
                </h3>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-sm md:text-base font-semibold">
                    {product.price}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs md:text-sm"
                  >
                    Liên hệ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

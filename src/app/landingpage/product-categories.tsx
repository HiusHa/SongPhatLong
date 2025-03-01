"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { elegantSlideIn } from "../../../utils/animations";

export function ProductCategories() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const products = [
    { name: "Tất cả sản phẩm", image: "/Images/Tatca.jpg" },
    {
      name: "Thiết bị chữa cháy",
      image: "/Images/ChuaChay.jpg",
    },
    {
      name: "Thiết bị báo cháy",
      image: "/Images/baoChay.jpg",
    },
    {
      name: "Hệ thống chữa cháy",
      image: "/Images/HeThongChuaChay.jpg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 md:px-8 max-w-screen-2xl mx-auto"
    >
      <h2 className="mb-12 text-center text-4xl font-bold text-red-600">
        DANH MỤC SẢN PHẨM
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            variants={elegantSlideIn}
            custom={index < 2 ? "left" : "right"}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: index * 0.1 }}
          >
            <Link href="/products" passHref>
              <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl cursor-pointer">
                <CardContent className="p-4">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

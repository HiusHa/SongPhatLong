"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { elegantSlideIn } from "../../../utils/animations";

export function ProductCategories() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const products = [
    { name: "All New Rush", image: "/placeholder.svg?height=200&width=300" },
    { name: "Sporty SUV", image: "/placeholder.svg?height=200&width=300" },
    { name: "Luxury Sedan", image: "/placeholder.svg?height=200&width=300" },
    { name: "Electric Future", image: "/placeholder.svg?height=200&width=300" },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-4 md:px-8">
      <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
        Danh mục sản phẩm
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
            <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardContent className="p-4">
                <div className="relative h-48 mb-4">
                  <Image
                    src={product.image}
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}

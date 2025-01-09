"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  products: Product[];
}

export function ProductCard({ products }: ProductCardProps) {
  return (
    <motion.div
      className="rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="flex flex-col space-y-2 bg-white shadow-md rounded-lg overflow-hidden p-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100">
              <Image
                width={300}
                height={400}
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500">{product.description}</p>
            <p className="text-sm font-medium text-red-600">
              {product.price.toLocaleString("vi-VN")}₫
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

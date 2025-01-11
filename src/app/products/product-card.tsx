import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: index * 0.2 }} // Increased duration and delay
        >
          <Link href={`/products/${product.id}`} className="group">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <motion.div
                className="relative aspect-square"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }} // Increased from 0.2 to 0.5
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-red-600">
                  {product.price.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

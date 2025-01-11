import { products } from "./product-data";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  currentProductId: number;
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
      <ProductCard products={relatedProducts} />
    </div>
  );
}

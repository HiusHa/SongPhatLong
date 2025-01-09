import { ProductGrid } from "./product-grid";
import { Sidebar } from "./sidebar";
import { SearchInput } from "./search-input";
import { Banner } from "./banner";

export default function ProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Thiết Bị Phòng Cháy Chữa Cháy
      </h1>
      <Banner />
      <div className="mb-6">
        <SearchInput />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1">
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}

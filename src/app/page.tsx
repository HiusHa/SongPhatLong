"use client";

import { HeroSection } from "./landingpage/hero-section";
import { CTASection } from "./landingpage/cta-section";
import { ProductCategories } from "./landingpage/product-categories";
import { FeaturedProjects } from "./landingpage/featured-projects";
import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";
import NewProducts from "./landingpage/new-products"; // Sử dụng import default

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Giảm thời gian loading xuống 1 giây để dễ kiểm tra

    return () => clearTimeout(timer);
  }, []);

  // Add another useEffect to ensure scroll position is at top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader /> {/* Show loader while loading */}
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <main className="max-w-10xl pt-4">
            <HeroSection />
            <CTASection />
            <ProductCategories />
            {/* Sử dụng NewProducts trực tiếp */}

            <NewProducts />

            <FeaturedProjects />
          </main>
        </div>
      )}
    </div>
  );
}

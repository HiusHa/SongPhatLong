"use client";

import { HeroSection } from "./landingpage/hero-section";
import { CTASection } from "./landingpage/cta-section";
import { ProductCategories } from "./landingpage/product-categories";
import { NewProducts } from "./landingpage/new-products";
import { FeaturedProjects } from "./landingpage/featured-projects";
import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Simulate 5 seconds loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader /> {/* Show loader while loading */}
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <main className="max-w-10xl pt-4   ">
            <HeroSection />
            <CTASection />
            <ProductCategories />
            <NewProducts />
            <FeaturedProjects />
          </main>
        </div>
      )}
    </div>
  );
}

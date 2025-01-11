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
    }, 5000); // Simulate 2 seconds loading
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen">
      {isLoading ? (
        <Loader /> // Show loader while loading
      ) : (
        <div className="min-h-screen bg-white px-4 md:px-0">
          <main>
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

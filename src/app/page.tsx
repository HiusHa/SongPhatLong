"use client";

import { HeroSection } from "./components/landingpage/hero-section";
import { CTASection } from "./components/landingpage/cta-section";
import { ProductCategories } from "./components/landingpage/product-categories";
import { NewProducts } from "./components/landingpage/new-products";
import { FeaturedProjects } from "./components/landingpage/featured-projects";

export default function Home() {
  return (
    <div className="min-h-screen bg-white px-4 md:px-0">
      <main>
        <HeroSection />
        <CTASection />
        <ProductCategories />
        <NewProducts />
        <FeaturedProjects />
      </main>
    </div>
  );
}

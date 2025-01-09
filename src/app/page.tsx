"use client";

import { HeroSection } from "./landingpage/hero-section";
import { CTASection } from "./landingpage/cta-section";
import { ProductCategories } from "./landingpage/product-categories";
import { NewProducts } from "./landingpage/new-products";
import { FeaturedProjects } from "./landingpage/featured-projects";

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

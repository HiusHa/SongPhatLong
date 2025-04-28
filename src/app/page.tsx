"use client";

import { HeroSection } from "./landingpage/hero-section";
import { CTASection } from "./landingpage/cta-section";
import { ProductCategories } from "./landingpage/product-categories";
import { FeaturedProjects } from "./landingpage/featured-projects";
import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";
import NewProducts from "./landingpage/new-products";
import { ErrorBoundary } from "@/components/error-boundary";
import { SectionError } from "@/components/ui/section-error";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Scroll to top when page loads - use a more gentle approach
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    // Use a shorter loading time to reduce memory pressure
    const loadingTime =
      typeof window !== "undefined" && window.innerWidth < 768 ? 500 : 1000;

    let timer: NodeJS.Timeout;

    try {
      timer = setTimeout(() => {
        setIsLoading(false);
        // Add a small delay before starting the fade-in animation
        setTimeout(() => setFadeIn(true), 50);
      }, loadingTime);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(error);
      setIsLoading(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // If there's an error, show a simple error message instead of crashing
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="mb-4">Please try refreshing the page</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      ) : (
        <div
          className={`min-h-screen bg-white transition-opacity duration-500 ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <main className="w-full max-w-[1400px] mx-auto pt-4">
            <ErrorBoundary
              fallback={<SectionError section="Hero" />}
              onError={(error: Error) =>
                console.error("Hero section error:", error)
              }
            >
              <HeroSection />
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionError section="CTA" />}>
              <CTASection />
            </ErrorBoundary>

            <ErrorBoundary
              fallback={<SectionError section="Product Categories" />}
            >
              <ProductCategories />
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionError section="New Products" />}>
              <NewProducts />
            </ErrorBoundary>

            <ErrorBoundary
              fallback={<SectionError section="Featured Projects" />}
            >
              <FeaturedProjects />
            </ErrorBoundary>
          </main>
        </div>
      )}
    </div>
  );
}

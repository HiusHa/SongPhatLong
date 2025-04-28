"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import api from "../_utils/globalApi";

// Simplified interfaces
interface BannerImage {
  id: number;
  url: string;
  alternativeText: string | null;
}

interface BannerData {
  id: number;
  Banner1: BannerImage[] | null;
  Banner2: BannerImage[] | null;
  Banner3: BannerImage[] | null;
}

// Static fallback banner
const FALLBACK_BANNER = {
  id: 0,
  url: "/placeholder.svg",
  alternativeText: "Fallback banner",
};

export function HeroSection() {
  // State management
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [useMobileMode, setUseMobileMode] = useState(false);

  // Refs for safety
  const isMounted = useRef(true);
  const hasRotated = useRef(false);

  // Detect mobile devices
  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      const mobile =
        typeof window !== "undefined" &&
        (window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ));

      setIsMobile(mobile);

      // On mobile, check if we should use mobile mode based on previous issues
      if (mobile && typeof window !== "undefined") {
        const hadPreviousIssues =
          sessionStorage.getItem("mobileRefreshIssue") === "true";
        setUseMobileMode(hadPreviousIssues);
      }
    };

    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch banner images
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // If we're in mobile mode due to previous issues, use fallback immediately
        if (useMobileMode) {
          setBannerImages([FALLBACK_BANNER]);
          setIsLoading(false);
          return;
        }

        // Set a timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          if (isMounted.current) {
            console.warn("Banner fetch timeout - using fallback");
            setBannerImages([FALLBACK_BANNER]);
            setIsLoading(false);

            // Mark that we had an issue
            if (isMobile && typeof window !== "undefined") {
              sessionStorage.setItem("mobileRefreshIssue", "true");
            }
          }
        }, 5000);

        const response = await api.getBanners();
        clearTimeout(timeoutId);

        if (!isMounted.current) return;

        const bannerData: BannerData = response.data.data[0];

        // Process banners
        const allBanners = [
          ...(bannerData.Banner1 || []),
          ...(bannerData.Banner2 || []),
          ...(bannerData.Banner3 || []),
        ].filter((banner): banner is BannerImage => banner !== null);

        // On mobile, only use the first banner to prevent issues
        if (isMobile) {
          setBannerImages(
            allBanners.length > 0 ? [allBanners[0]] : [FALLBACK_BANNER]
          );
        } else {
          setBannerImages(
            allBanners.length > 0 ? allBanners : [FALLBACK_BANNER]
          );
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBannerImages([FALLBACK_BANNER]);

        // Mark that we had an issue
        if (isMobile && typeof window !== "undefined") {
          sessionStorage.setItem("mobileRefreshIssue", "true");
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      isMounted.current = false;
    };
  }, [isMobile, useMobileMode]);

  // Handle banner rotation - ONLY on desktop
  useEffect(() => {
    // Skip rotation on mobile completely
    if (isMobile || useMobileMode || bannerImages.length <= 1) {
      return;
    }

    let rotationTimer: NodeJS.Timeout | null = null;

    const rotateBanner = () => {
      if (!isMounted.current) return;

      try {
        // Mark that we've rotated at least once
        hasRotated.current = true;

        // Update the active index
        setActiveIndex((prev) => (prev + 1) % bannerImages.length);
      } catch (err) {
        console.error("Error during banner rotation:", err);
      }
    };

    // Set up rotation timer - desktop only
    rotationTimer = setInterval(rotateBanner, 6000);

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [bannerImages.length, isMobile, useMobileMode]);

  // Handle errors during render
  useEffect(() => {
    // Set up error handler
    const originalError = console.error;

    console.error = (...args) => {
      // If we detect an error and we're on mobile, mark it
      if (isMobile && typeof window !== "undefined") {
        sessionStorage.setItem("mobileRefreshIssue", "true");
      }

      // Call original handler
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, [isMobile]);

  // Extremely simplified UI for mobile
  if (isMobile) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-[3/1]">
          {!isLoading && bannerImages.length > 0 ? (
            <div className="relative w-full h-full">
              {/* Static image for mobile - no transitions or animations */}
              <Image
                src={bannerImages[0]?.url || "/placeholder.svg"}
                alt={bannerImages[0]?.alternativeText || "Banner image"}
                fill
                priority={true}
                sizes="100vw"
                className="object-cover"
                quality={50}
                onError={() => {
                  // Mark that we had an issue
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("mobileRefreshIssue", "true");
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="h-24 w-24 bg-gray-300"></div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4 font-bold w-full pb-4">
          <Button
            variant="secondary"
            size="lg"
            className="font-bold bg-green-600 text-white hover:bg-green-700"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }
            }}
          >
            Khám phá thêm tại đây !
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version with more features
  return (
    <div className="w-full flex justify-center items-center">
      <section className="relative w-full overflow-hidden flex flex-col items-center">
        <div className="relative w-full overflow-hidden">
          {!isLoading && bannerImages.length > 0 ? (
            <div className="relative w-full mx-auto aspect-[3/1]">
              {/* Desktop version with transitions */}
              {bannerImages.map((banner, index) => (
                <div
                  key={`${banner.id}-${index}`}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={banner.url || "/placeholder.svg"}
                    alt={banner.alternativeText || "Banner image"}
                    fill
                    priority={index === activeIndex}
                    sizes="100vw"
                    className="object-cover"
                    quality={70}
                  />
                </div>
              ))}

              {/* Navigation dots - desktop only */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-white scale-125 shadow-lg"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[3/1] bg-gray-200 flex items-center justify-center">
              <div className="h-48 w-48 bg-gray-300"></div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4 font-bold w-full pb-8">
          <Button
            variant="secondary"
            size="lg"
            className="font-bold bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }
            }}
          >
            Khám phá thêm tại đây !
          </Button>
        </div>
      </section>
    </div>
  );
}

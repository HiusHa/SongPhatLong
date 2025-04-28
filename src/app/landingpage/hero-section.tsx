"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "../_utils/globalApi";
import { scrollAnimation, wiggle } from "../../../utils/animations";

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

export function HeroSection() {
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);

  const isMounted = useRef(true);

  // Fetch banner images only once on component mount
  useEffect(() => {
    const fetchBanners = async () => {
      if (!isMounted.current) return;

      try {
        setIsLoading(true);
        const response = await api.getBanners();

        if (!isMounted.current) return;

        const bannerData: BannerData = response.data.data[0];

        // Combine all banners and filter out nulls
        const allBanners = [
          ...(bannerData.Banner1 || []),
          ...(bannerData.Banner2 || []),
          ...(bannerData.Banner3 || []),
        ].filter((banner): banner is BannerImage => banner !== null);

        // Don't duplicate images - this can cause memory issues
        setBannerImages(allBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
          setHasAnimated(true);
        }
      }
    };

    fetchBanners();

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle banner rotation with safer interval management
  useEffect(() => {
    // Don't set up interval if no images or component is unmounting
    if (bannerImages.length === 0 || !isMounted.current) return;

    // Clear any existing interval to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set up autoplay with a safer approach
    const rotateImage = () => {
      if (!isTransitioning && isMounted.current) {
        setIsTransitioning(true);

        // Use setTimeout instead of state for tracking transition
        setTimeout(() => {
          if (isMounted.current) {
            setActiveIndex((prev) => (prev + 1) % bannerImages.length);

            // Reset transitioning state after animation completes
            setTimeout(() => {
              if (isMounted.current) {
                setIsTransitioning(false);
              }
            }, 700); // Reduced from 1000ms for better performance
          }
        }, 0);
      }
    };

    // Use longer interval on mobile for better performance
    const intervalTime =
      typeof window !== "undefined" && window.innerWidth < 768 ? 7000 : 5000;
    intervalRef.current = setInterval(rotateImage, intervalTime);

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [bannerImages.length, isTransitioning]);

  // Cleanup all intervals and timers on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleExplore = () => {
    const buttonHeight = buttonRef.current?.offsetHeight || 0;
    window.scrollTo({
      top: window.innerHeight + buttonHeight,
      behavior: "smooth",
    });
  };

  const handleManualChange = (index: number) => {
    if (isTransitioning) return;

    // Clear the autoplay interval when manually changing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTransitioning(true);
    setActiveIndex(index);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      if (isMounted.current) {
        setIsTransitioning(false);

        // Restart the interval after manual change
        const intervalTime =
          typeof window !== "undefined" && window.innerWidth < 768
            ? 7000
            : 5000;
        intervalRef.current = setInterval(() => {
          if (!isTransitioning && isMounted.current) {
            setIsTransitioning(true);
            setActiveIndex((prev) => (prev + 1) % bannerImages.length);

            setTimeout(() => {
              if (isMounted.current) {
                setIsTransitioning(false);
              }
            }, 700);
          }
        }, intervalTime);
      }
    }, 700); // Reduced from 1000ms
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse flex items-center justify-center h-full w-full bg-gray-200 aspect-[3/1]">
      <div className="h-24 w-24 md:h-48 md:w-48 bg-gray-300"></div>
    </div>
  );

  return (
    <div className="w-full flex justify-center items-center">
      <motion.section
        ref={sectionRef}
        initial="offscreen"
        animate={hasAnimated ? "onscreen" : "offscreen"}
        variants={scrollAnimation}
        className="relative w-full overflow-hidden flex flex-col items-center"
      >
        <div className="relative w-full overflow-hidden">
          {!isLoading && bannerImages.length > 0 ? (
            <div className="relative w-full mx-auto aspect-[3/1]">
              {/* Only render the active image and the next one to save memory */}
              {bannerImages.map((banner, index) => {
                // Only render the active image and the next one (for preloading)
                const shouldRender =
                  index === activeIndex ||
                  index === (activeIndex + 1) % bannerImages.length;

                if (!shouldRender) return null;

                return (
                  <div
                    key={`${banner.id}-${index}`}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                      activeIndex === index
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={banner.url || "/placeholder.svg"}
                      alt={banner.alternativeText || "Banner image"}
                      fill
                      priority={index === activeIndex}
                      sizes="100vw"
                      className="object-cover"
                      // Remove unoptimized for better performance
                      quality={70} // Reduced quality for better performance
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        console.error(`Failed to load image: ${banner.url}`);
                        // Provide fallback
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                );
              })}

              {/* Navigation dots */}
              <div className="absolute bottom-2 md:bottom-6 left-0 right-0 flex justify-center gap-2 md:gap-3 z-20">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-white scale-125 shadow-lg"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    onClick={() => handleManualChange(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <SkeletonLoader />
          )}
        </div>
        <div
          className="flex justify-center mt-4 font-bold w-full pb-4 md:pb-8"
          ref={buttonRef}
        >
          <motion.div variants={wiggle} whileHover="hover">
            <Button
              variant="secondary"
              size="lg"
              className="font-bold bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
              onClick={handleExplore}
            >
              Khám phá thêm tại đây !
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

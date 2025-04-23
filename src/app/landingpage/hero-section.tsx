"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
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
  const controls = useAnimation();
  const buttonRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await api.getBanners();
        const bannerData: BannerData = response.data.data[0];
        const allBanners = [
          ...(bannerData.Banner1 || []),
          ...(bannerData.Banner2 || []),
          ...(bannerData.Banner3 || []),
        ].filter((banner): banner is BannerImage => banner !== null);

        // Duplicate images if there are fewer than 3 to ensure smooth looping
        const processedBanners = [...allBanners];
        if (allBanners.length < 3) {
          // Add duplicates with new IDs
          allBanners.forEach((banner, index) => {
            processedBanners.push({
              ...banner,
              id: banner.id + 1000 + index, // Ensure unique IDs
            });
          });
        }

        setBannerImages(processedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsLoading(false);
        // Start animation once loaded
        controls.start("onscreen");
        setHasAnimated(true);
      }
    };

    fetchBanners();
  }, [controls]);

  // Set up autoplay with manual control
  useEffect(() => {
    if (bannerImages.length === 0) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up autoplay interval
    intervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % bannerImages.length);

        // Reset transitioning state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000); // Match this with your transition duration
      }
    }, 5000);

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bannerImages.length, isTransitioning]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      controls.start("hover");
    }, 3000);

    return () => clearInterval(intervalId);
  }, [controls]);

  const handleExplore = () => {
    const buttonHeight = buttonRef.current?.offsetHeight || 0;
    window.scrollTo({
      top: window.innerHeight + buttonHeight,
      behavior: "smooth",
    });
  };

  const handleManualChange = (index: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex(index);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // Match this with your transition duration
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse flex items-center justify-center h-full w-full bg-gray-200 aspect-[3/1]">
      <div className="h-48 w-48 bg-gray-300"></div>
    </div>
  );

  // Custom fade transition instead of carousel
  return (
    <div className="w-full flex justify-center items-center">
      <motion.section
        ref={sectionRef}
        initial="offscreen"
        animate={hasAnimated ? "onscreen" : controls}
        variants={scrollAnimation}
        className="relative w-screen overflow-hidden flex flex-col items-center"
      >
        <div className="relative w-full overflow-hidden">
          {!isLoading && bannerImages.length > 0 ? (
            <div className="relative min-w-[1024px] w-full max-w-[1920px] mx-auto aspect-[3/1]">
              {/* Images with fade transition */}
              {bannerImages.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={banner.url || "/placeholder.svg"}
                    alt={banner.alternativeText || "Banner image"}
                    fill
                    priority={true}
                    sizes="(min-width: 1920px) 1920px, 100vw"
                    className="object-cover"
                    unoptimized={true}
                    quality={90}
                  />
                </div>
              ))}

              {/* Navigation dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                {bannerImages
                  .slice(0, bannerImages.length / 2)
                  .map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeIndex % (bannerImages.length / 2) === index
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
          className="flex justify-center mt-4 font-bold w-full pb-8"
          ref={buttonRef}
        >
          <motion.div
            animate={controls}
            variants={wiggle}
            onHoverStart={() => controls.start("hover")}
            onHoverEnd={() => controls.stop()}
          >
            <Button
              variant="secondary"
              size="xl"
              className="font-bold bg-green-600 text-white hover:bg-green-700 transition-colors duration-500"
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

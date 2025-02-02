"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const controls = useAnimation();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.getBanners();
        const bannerData: BannerData = response.data.data[0];
        const allBanners = [
          ...(bannerData.Banner1 || []),
          ...(bannerData.Banner2 || []),
          ...(bannerData.Banner3 || []),
        ].filter((banner): banner is BannerImage => banner !== null);
        setBannerImages(allBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

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

  return (
    <motion.section
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
      variants={scrollAnimation}
      style={{ opacity }}
      className="relative"
    >
      <div className="h-[600px] md:h-[400px] lg:h-[600px]">
        {bannerImages.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="h-full w-full"
          >
            {bannerImages.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative w-full h-full">
                  <Image
                    src={banner.url || "/placeholder.svg"}
                    alt={banner.alternativeText || "Banner"}
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No banners available</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4" ref={buttonRef}>
        <motion.div
          animate={controls}
          variants={wiggle}
          onHoverStart={() => controls.start("hover")}
          onHoverEnd={() => controls.stop()}
        >
          <Button variant="secondary" size="lg" onClick={handleExplore}>
            Explore
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

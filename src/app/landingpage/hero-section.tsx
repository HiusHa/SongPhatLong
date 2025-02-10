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

  const SkeletonLoader = () => (
    <div className="animate-pulse flex items-center justify-center h-full w-full bg-gray-200">
      <div className="h-48 w-48 bg-gray-300"></div>
    </div>
  );

  return (
    <div className="w-full flex justify-center items-center">
      <motion.section
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        variants={scrollAnimation}
        style={{ opacity }}
        className="relative w-screen overflow-hidden flex flex-col items-center"
      >
        <div className="relative w-full overflow-hidden">
          {bannerImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop
              className=" relative min-w-[1024px] w-full max-w-[1920px] mx-auto"
            >
              {bannerImages.map((banner) => (
                <SwiperSlide
                  key={banner.id}
                  className="relative aspect-[3/1] w-full"
                >
                  <Image
                    src={banner.url || "/placeholder.svg"}
                    alt="Banner description"
                    fill
                    priority
                    sizes="(min-width: 1920px) 1920px, (min-width: 1024px) 100vw"
                    className="object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
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

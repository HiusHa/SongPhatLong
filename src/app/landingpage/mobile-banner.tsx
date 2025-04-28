"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MobileBannerProps {
  imageUrl?: string; // Made optional since we're using a default
  altText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function MobileBanner({
  imageUrl = "/2.png", // Changed to use 2.png as default
  altText = "Banner image",
  buttonText = "Khám phá thêm tại đây !",
  onButtonClick,
}: MobileBannerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Handle scroll on button click
  const handleExplore = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      // Default behavior
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }
    }
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Handle image load error
  const handleImageError = () => {
    console.error(`Failed to load banner image: ${imageUrl}`);

    // Try to reload the image a few times before giving up
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1);
      // Add a cache-busting parameter
      const cacheBuster = `?cb=${Date.now()}`;
      const newUrl = imageUrl.includes("?")
        ? `${imageUrl}&cb=${Date.now()}`
        : `${imageUrl}${cacheBuster}`;

      console.log(`Retrying image load (attempt ${retryCount + 1}): ${newUrl}`);

      // We'll keep the current URL but force a reload with the key change
    } else {
      setImageError(true);
      // Mark that we had an issue
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mobileRefreshIssue", "true");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full aspect-[3/1]">
        {imageError ? (
          // Fallback content when image fails to load
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-gray-500 text-sm">Hình ảnh không khả dụng</p>
            </div>
          </div>
        ) : (
          // Image container with Next.js Image
          <div className="relative w-full h-full">
            <Image
              src={"/Images/2.png"} // Directly using 2.png here
              alt={altText}
              fill
              priority={true}
              sizes="100vw"
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              quality={60}
              onLoad={handleImageLoad}
              onError={handleImageError}
              // Use a key to force remount on retry
              key={`mobile-banner-${retryCount}`}
            />

            {/* Show loading skeleton until image is loaded */}
            {!imageLoaded && (
              <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="h-24 w-24 bg-gray-300 animate-pulse rounded"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4 font-bold w-full pb-4">
        <Button
          variant="secondary"
          size="lg"
          className="font-bold bg-green-600 text-white hover:bg-green-700"
          onClick={handleExplore}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

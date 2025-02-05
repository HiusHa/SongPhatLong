import React from "react";
import Image from "next/image";

interface LoaderProps {
  size?: number;
}

export function Loader({ size = 200 }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-[#87CEEB] via-white to-[#F7E987]">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 border-8 border-red-500 rounded-full animate-spin"
          style={{ borderTopColor: "transparent" }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/Images/logo.png"
            alt="Logo"
            width={size * 0.8}
            height={size * 0.8}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LoaderProps {
  size?: number;
}

export function Loader({ size = 200 }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#FFF5F5] to-white">
      <div style={{ width: size, height: size }}>
        <DotLottieReact
          src="https://lottie.host/fb219ab5-7218-4eaa-820d-2075eaa60b6b/owrzGlutCs.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}

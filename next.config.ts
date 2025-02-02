import type { NextConfig } from "next";

const NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dlsb2q43s/**",
      },
    ],
  },
  reactStrictMode: true,
  transpilePackages: ["swiper", "ssr-window", "dom7"],
};

export default NextConfig;

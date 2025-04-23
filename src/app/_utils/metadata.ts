// Tạo file metadata.ts chung cho toàn bộ ứng dụng
import type { Viewport } from "next";

// Cấu hình viewport chung cho toàn bộ ứng dụng
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Metadata mặc định
export const defaultMetadata = {
  title: {
    default: "Song Phát Long - Thiết bị PCCC chính hãng",
    template: "%s | Song Phát Long",
  },
  description:
    "Cung cấp thiết bị PCCC chính hãng, giải pháp phòng cháy chữa cháy toàn diện cho doanh nghiệp và cá nhân",
  keywords: [
    "PCCC",
    "phòng cháy chữa cháy",
    "thiết bị chữa cháy",
    "bình chữa cháy",
    "Song Phát Long",
  ],
  authors: [{ name: "Song Phát Long" }],
  creator: "Song Phát Long",
  publisher: "Song Phát Long",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

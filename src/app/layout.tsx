import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Song Phát Long",
  description: "Bảo vệ an toàn, Kiến tạo giá trị",
  keywords: ["Song Phát Long", "an toàn", "giá trị", "bảo vệ"],
  authors: [{ name: "Song Phát Long" }],
  creator: "Song Phát Long",
  publisher: "Song Phát Long",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  metadataBase: new URL("https://www.songphatlong.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
    languages: {
      "vi-VN": "/vi",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "Song Phát Long",
    description: "Bảo vệ an toàn, Kiến tạo giá trị",
    url: "https://www.songphatlong.com", // Replace with your actual domain
    siteName: "Song Phát Long",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/Images/og-image.jpg", // Create an OG image for better social sharing
        width: 1200,
        height: 630,
        alt: "Song Phát Long - Bảo vệ an toàn, Kiến tạo giá trị",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Song Phát Long",
    description: "Bảo vệ an toàn, Kiến tạo giá trị",
    images: ["/Images/og-image.jpg"], // Same as OG image
  },
  icons: {
    icon: [
      { url: "/Images/logo.svg", type: "image/svg+xml" },
      { url: "/Images/logo.png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/Images/apple-icon.png", sizes: "180x180" }],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

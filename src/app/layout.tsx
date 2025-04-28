import type React from "react";
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
  // Modified viewport settings to prevent mobile scaling issues
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
      <head>
        {/* Add meta tags to prevent caching issues that can cause refresh loops */}
        <meta httpEquiv="Cache-Control" content="no-store" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />

        {/* Add script to detect and prevent mobile refresh loops */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                // Check if we're on mobile
                const isMobile = window.innerWidth < 768 || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobile) {
                  // Check for refresh loops on mobile
                  const lastLoad = sessionStorage.getItem('mobilePageLastLoad');
                  const now = Date.now();
                  
                  if (lastLoad) {
                    const timeSince = now - parseInt(lastLoad, 10);
                    if (timeSince < 3000) {
                      const count = parseInt(sessionStorage.getItem('mobileQuickRefreshCount') || '0', 10);
                      if (count > 1) {
                        // Mark that we've had mobile refresh issues
                        sessionStorage.setItem('mobileRefreshIssue', 'true');
                        console.warn('Mobile refresh loop detected - enabling safe mode');
                      }
                      sessionStorage.setItem('mobileQuickRefreshCount', (count + 1).toString());
                    } else {
                      sessionStorage.setItem('mobileQuickRefreshCount', '0');
                    }
                  }
                  
                  sessionStorage.setItem('mobilePageLastLoad', now.toString());
                  
                  // Clear refresh detection after 30 seconds if page stays loaded
                  setTimeout(function() {
                    sessionStorage.setItem('mobileQuickRefreshCount', '0');
                  }, 30000);
                }
              } catch (e) {
                console.error('Error in mobile refresh detection:', e);
              }
            })();
          `,
          }}
        />
      </body>
    </html>
  );
}

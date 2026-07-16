import type { Metadata } from "next";
import { Toaster } from "react-hot-toast"; // تم إضافة الإشعار
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trendpilotai.com"),

  title: {
    default: "TrendPilot AI",
    template: "%s | TrendPilot AI",
  },

  description:
    "Discover winning products before they go viral with AI. Analyze trends, estimate profit, generate marketing campaigns and launch your next bestseller.",

  keywords: [
    "AI",
    "Winning Products",
    "Product Research",
    "Shopify",
    "Amazon",
    "TikTok Shop",
    "AliExpress",
    "Dropshipping",
    "Ecommerce",
    "TrendPilot AI",
  ],

  authors: [
    {
      name: "TrendPilot AI",
    },
  ],

  creator: "TrendPilot AI",

  publisher: "TrendPilot AI",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "TrendPilot AI",
    description:
      "AI-powered product research platform for ecommerce sellers.",
    url: "https://trendpilotai.com",
    siteName: "TrendPilot AI",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrendPilot AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TrendPilot AI",
    description:
      "Find winning products before they go viral.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {/* الـ Toaster هنا عشان يظهر الإشعارات في أي مكان في الموقع */}
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
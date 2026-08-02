import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trendpilot-ai.com"),

  title: {
    default: "TrendPilot AI",
    template: "%s | TrendPilot AI",
  },

  description:
    "TrendPilot AI helps ecommerce sellers discover winning products, generate AI-powered reports, analyze competition, and create high-converting marketing content.",

  keywords: [
    "AI",
    "Ecommerce",
    "Shopify",
    "Amazon",
    "TikTok Shop",
    "Product Research",
    "TrendPilot AI",
  ],

  authors: [
    {
      name: "TrendPilot AI",
    },
  ],

  openGraph: {
    title: "TrendPilot AI",
    description:
      "Discover winning ecommerce products with AI-powered insights.",
    type: "website",
    locale: "en_US",
    siteName: "TrendPilot AI",
  },

  twitter: {
    card: "summary_large_image",
    title: "TrendPilot AI",
    description:
      "AI-powered product research for ecommerce sellers.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakarta.variable}>
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}
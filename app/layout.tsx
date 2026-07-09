import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendPilot AI",
  description: "AI Product Research",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
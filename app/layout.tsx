import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ribit - Affordable University Ridesharing",
  description: "Safe, affordable ridesharing for university students. Save up to 85% on medium-distance travel.",
  keywords: "rideshare, university, college, student travel, affordable, safe, spring break",
  openGraph: {
    title: "Ribit - Affordable University Ridesharing",
    description: "Safe, affordable ridesharing for university students. Save up to 85% on medium-distance travel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
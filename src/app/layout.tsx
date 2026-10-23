import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SETU AI — Tell SETU what happened. We’ll turn it into safe action.",
  description: "A Gemini-powered emergency-grade social-impact bridge transforming chaotic human multimodal inputs into verified life-saving next steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col text-[#F8FAFC] selection:bg-[#06B6D4] selection:text-[#020617] relative overflow-x-hidden">
        <AuthProvider>
          {/* Universal Multi-Color Animated Background Across the Entire Website */}
          <AnimatedBackground pageVariant="dashboard" />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

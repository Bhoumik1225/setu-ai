import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CommandPalette } from "@/components/CommandPalette";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { SmartContextPanel } from "@/components/SmartContextPanel";
import { AppShellSidebar } from "@/components/AppShellSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SETU AI — Turn real-world signals into safe action.",
  description: "A fast, Raycast-inspired emergency-grade social-impact operating system transforming chaotic human multimodal inputs into verified life-saving next steps.",
  keywords: ["emergency response", "AI triage", "Gemini AI", "crisis management", "public safety", "multimodal AI"],
  openGraph: {
    title: "SETU AI — Turn real-world signals into safe action.",
    description: "Emergency-grade social-impact OS powered by Gemini AI. Transforms chaotic signals into verified, life-saving action plans.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SETU AI",
    description: "AI-powered emergency response and crisis management platform.",
  },
  robots: { index: true, follow: true },
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
      <body className="min-h-full flex text-[#F8FAFC] selection:bg-[#4F8CFF] selection:text-white relative overflow-x-hidden bg-[#080B12]">
        <AuthProvider>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-bold"
          >
            Skip to main content
          </a>

          {/* Calm, Refined Command Center Ambient Background */}
          <AnimatedBackground pageVariant="dashboard" />

          {/* Desktop Slim Sidebar & Mobile Bottom Navigation */}
          <AppShellSidebar />

          {/* Main App Content Area */}
          <div id="main-content" className="flex-1 flex flex-col min-h-screen pb-16 lg:pb-0 w-full">
            {children}
          </div>

          {/* Global Signature Command Palette (⌘K / Ctrl+K) */}
          <CommandPalette />

          {/* Global Keyboard Shortcuts Helper (?) */}
          <KeyboardShortcutsModal />

          {/* Global Smart Context Panel (Sliding Right Drawer) */}
          <SmartContextPanel />
        </AuthProvider>
      </body>
    </html>
  );
}

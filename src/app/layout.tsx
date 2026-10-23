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
          {/* Calm, Refined Command Center Ambient Background */}
          <AnimatedBackground pageVariant="dashboard" />

          {/* Desktop Slim Sidebar & Mobile Bottom Navigation */}
          <AppShellSidebar />

          {/* Main App Content Area */}
          <div className="flex-1 flex flex-col min-h-screen pb-16 lg:pb-0 w-full">
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

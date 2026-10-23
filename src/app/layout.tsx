import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
      <body className="min-h-full flex flex-col bg-[#061826] text-[#F8FAFC] selection:bg-[#06B6D4] selection:text-[#061826] relative overflow-x-hidden setu-cyber-grid">
        {/* Layered Blurred Gradient Orbs Fixed in Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Royal Purple Glow in Top-Left (#6D28D9) */}
          <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#6D28D9]/25 blur-[180px] animate-orb-purple" />
          
          {/* Electric Blue Glow in Top-Right (#2563EB) */}
          <div className="absolute top-[-10%] right-[-5%] w-[750px] h-[750px] rounded-full bg-[#2563EB]/20 blur-[190px] animate-orb-blue" />
          
          {/* Teal / Cyan Glow near Bottom-Right (#06B6D4) */}
          <div className="absolute bottom-[-15%] right-[10%] w-[680px] h-[680px] rounded-full bg-[#06B6D4]/20 blur-[170px] animate-orb-cyan" />
          
          {/* Subtle Coral Pink Glow behind Important Alerts (#FB7185) */}
          <div className="absolute bottom-[25%] left-[25%] w-[450px] h-[450px] rounded-full bg-[#FB7185]/10 blur-[160px] animate-orb-purple" />
        </div>

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

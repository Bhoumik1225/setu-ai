'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';

// Load 3D NeuralNetworkScene lazily after main interactive content is hydrated
const NeuralNetworkScene = dynamic(
  () => import('./NeuralNetworkScene').then((mod) => mod.NeuralNetworkScene),
  { ssr: false }
);

interface AnimatedBackgroundProps {
  pageVariant?: 'dashboard' | 'logs' | 'login';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ pageVariant = 'dashboard' }) => {
  const { ambientMotion, backgroundQuality, highContrast } = useAuth();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#030712]">
      {/* 1. Base Layer: Deep space navy and midnight linear base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#071A38]/70 to-[#030712]" />

      {/* 2. Slow-Moving Soft Multi-Color Light Glows */}
      {/* Upper-Left: Royal Indigo & Soft Violet (#312E81 & #A78BFA) */}
      <div className="absolute top-[-18%] left-[-8%] w-[720px] h-[720px] rounded-full bg-[#312E81]/30 blur-[180px] animate-glow-1" />
      <div className="absolute top-[5%] left-[8%] w-[480px] h-[480px] rounded-full bg-[#A78BFA]/18 blur-[160px] animate-glow-2" />

      {/* Upper-Right: Electric Blue (#2563EB) */}
      <div className="absolute top-[-12%] right-[-6%] w-[750px] h-[750px] rounded-full bg-[#2563EB]/25 blur-[190px] animate-glow-2" />

      {/* Lower-Right: Teal Cyan (#06B6D4) */}
      <div className="absolute bottom-[-15%] right-[8%] w-[680px] h-[680px] rounded-full bg-[#06B6D4]/22 blur-[170px] animate-glow-3" />

      {/* Lower-Left: Subtle Violet Glow (#A78BFA) */}
      <div className="absolute bottom-[-10%] left-[10%] w-[520px] h-[520px] rounded-full bg-[#A78BFA]/14 blur-[160px] animate-glow-1" />

      {/* Subtle Coral Pink Ambient Glow for alerts (#FB7185) */}
      <div className="absolute top-[45%] left-[30%] w-[420px] h-[420px] rounded-full bg-[#FB7185]/8 blur-[170px]" />

      {/* 3. Fine Low-Opacity Cyber Grid Texture */}
      <div className="absolute inset-0 setu-grid-overlay opacity-60" />

      {/* 4. 3D Neural Safety Network Canvas */}
      {!highContrast && (
        <NeuralNetworkScene
          pageVariant={pageVariant}
          ambientMotion={ambientMotion}
          quality={backgroundQuality}
        />
      )}

      {/* 5. Soft Dark Readability Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-transparent to-[#030712]/50" />
    </div>
  );
};

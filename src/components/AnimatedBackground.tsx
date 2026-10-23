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
      {/* 1. Base Layer: Dual-Color Moving Liquid Gradient Mesh (Electric Cyan & Royal Violet) */}
      <div className={`absolute inset-0 ${ambientMotion ? 'animate-two-color-flow opacity-70' : 'bg-gradient-to-br from-[#071A38] via-[#1E1B4B] to-[#030712] opacity-60'}`} />

      {/* 2. Primary Flowing Color 1: Electric Teal Cyan (#06B6D4) Liquid Orb */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[850px] h-[850px] rounded-full bg-gradient-to-br from-[#06B6D4]/50 via-[#0EA5E9]/35 to-transparent blur-[140px] ${
          ambientMotion ? 'animate-liquid-cyan' : ''
        }`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 3. Primary Flowing Color 2: Royal Electric Violet (#8B5CF6 / #A78BFA) Liquid Orb */}
      <div
        className={`absolute bottom-[-15%] right-[-5%] w-[900px] h-[900px] rounded-full bg-gradient-to-tl from-[#8B5CF6]/55 via-[#6D28D9]/40 to-transparent blur-[150px] ${
          ambientMotion ? 'animate-liquid-violet' : ''
        }`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 4. Secondary Counter-Drifting Light Waves */}
      <div
        className={`absolute top-[25%] right-[15%] w-[600px] h-[600px] rounded-full bg-[#06B6D4]/30 blur-[160px] ${
          ambientMotion ? 'animate-glow-2' : ''
        }`}
      />
      <div
        className={`absolute bottom-[20%] left-[10%] w-[650px] h-[650px] rounded-full bg-[#A78BFA]/30 blur-[160px] ${
          ambientMotion ? 'animate-glow-1' : ''
        }`}
      />

      {/* 5. Fine Low-Opacity Cyber Grid Texture */}
      <div className="absolute inset-0 setu-grid-overlay opacity-50" />

      {/* 6. 3D Neural Safety Network Canvas */}
      {!highContrast && (
        <NeuralNetworkScene
          pageVariant={pageVariant}
          ambientMotion={ambientMotion}
          quality={backgroundQuality}
        />
      )}

      {/* 7. Soft Vignette Overlay for Crisp Readability */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/40 to-[#030712]/85" />
    </div>
  );
};

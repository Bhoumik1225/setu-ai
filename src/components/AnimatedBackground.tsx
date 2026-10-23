'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface AnimatedBackgroundProps {
  pageVariant?: 'dashboard' | 'logs' | 'login';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = () => {
  const { ambientMotion, highContrast } = useAuth();

  if (highContrast) {
    return <div className="fixed inset-0 pointer-events-none -z-10 bg-black" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#080B12]">
      {/* 1. Base Dark Slate Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080B12] via-[#0B101D] to-[#080B12]" />

      {/* 2. Refined, Minimal Ambient Glows (Electric Blue & Soft Violet) */}
      <div
        className={`absolute top-[-10%] left-[15%] w-[650px] h-[450px] rounded-full bg-[#4F8CFF]/12 blur-[140px] pointer-events-none ${
          ambientMotion ? 'animate-subtle-glow' : ''
        }`}
      />
      <div
        className={`absolute bottom-[-10%] right-[15%] w-[650px] h-[450px] rounded-full bg-[#A78BFA]/10 blur-[150px] pointer-events-none ${
          ambientMotion ? 'animate-subtle-glow' : ''
        }`}
        style={{ animationDelay: '-8s' }}
      />

      {/* 3. Subtle Technical Grid Overlay */}
      <div className="absolute inset-0 setu-grid-overlay opacity-40" />

      {/* 4. Fine Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#080B12]/80" />
    </div>
  );
};

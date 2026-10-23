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
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* 1. Base Layer: Flowing Multi-Color Liquid Aurora Gradient Mesh */}
      <div
        className={`absolute inset-0 ${
          ambientMotion ? 'animate-multi-aurora opacity-80' : 'bg-gradient-to-br from-[#1e1b4b] via-[#06b6d4]/40 to-[#020617] opacity-75'
        }`}
      />

      {/* 2. Color 1: Luminous Electric Cyan (#06B6D4) Moving Orb */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#06B6D4]/60 via-[#0EA5E9]/45 to-transparent blur-[130px] ${
          ambientMotion ? 'animate-orb-cyan' : ''
        }`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 3. Color 2: Luminous Hot Magenta / Coral Pink (#EC4899 / #FB7185) Moving Orb */}
      <div
        className={`absolute top-[20%] right-[-8%] w-[850px] h-[850px] rounded-full bg-gradient-to-bl from-[#EC4899]/55 via-[#F43F5E]/40 to-transparent blur-[140px] ${
          ambientMotion ? 'animate-orb-magenta' : ''
        }`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 4. Color 3: Royal Electric Violet & Indigo (#8B5CF6 / #6366F1) Moving Orb */}
      <div
        className={`absolute bottom-[-15%] right-[10%] w-[900px] h-[900px] rounded-full bg-gradient-to-tl from-[#8B5CF6]/65 via-[#6366F1]/45 to-transparent blur-[140px] ${
          ambientMotion ? 'animate-orb-violet' : ''
        }`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 5. Color 4: Deep Ocean Electric Blue (#2563EB) Moving Orb */}
      <div
        className={`absolute bottom-[10%] left-[-8%] w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-[#2563EB]/55 via-[#3B82F6]/35 to-transparent blur-[140px] ${
          ambientMotion ? 'animate-orb-blue' : ''
        }`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 6. Crisp High-Tech Cyber Grid Overlay */}
      <div className="absolute inset-0 setu-grid-overlay opacity-60" />

      {/* 7. Interactive 3D Neural Safety Network Scene */}
      {!highContrast && (
        <NeuralNetworkScene
          pageVariant={pageVariant}
          ambientMotion={ambientMotion}
          quality={backgroundQuality}
        />
      )}

      {/* 8. Subtle Radial Vignette for Content Readability */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#020617]/35 to-[#020617]/80" />
    </div>
  );
};

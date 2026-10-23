'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ThreeBackground } from './ThreeBackground';

interface AnimatedBackgroundProps {
  pageVariant?: 'dashboard' | 'logs' | 'login';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = () => {
  const { ambientMotion, highContrast } = useAuth();

  if (highContrast) {
    return <div className="fixed inset-0 pointer-events-none -z-10 bg-black" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#040916]">
      {/* 1. Cinematic Aesthetic Wallpaper Texture (Soft Blend) */}
      <div className="absolute inset-0 opacity-25 filter contrast-125 saturate-120">
        <img
          src="/assets/aesthetic-hero-bridge.jpg"
          alt="Cyber Bridge Nexus Backdrop"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Luminous Deep Space Azure Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020612]/92 via-[#06132A]/85 to-[#030917]/95" />

      {/* 3. Interactive Real 3D Geometric Mesh & Constellation Scene (Three.js) */}
      <ThreeBackground />

      {/* 3. Glowing Multi-Layered Atmosphere Lights */}
      <div
        className={`absolute -top-36 left-[12%] w-[750px] h-[580px] rounded-full bg-blue-600/22 blur-[140px] pointer-events-none ${
          ambientMotion ? 'animate-subtle-glow' : ''
        }`}
      />
      <div
        className={`absolute top-1/3 -right-28 w-[680px] h-[680px] rounded-full bg-sky-500/20 blur-[150px] pointer-events-none ${
          ambientMotion ? 'animate-pulse-soft' : ''
        }`}
        style={{ animationDelay: '-3.5s' }}
      />
      <div
        className={`absolute -bottom-32 left-1/4 w-[720px] h-[540px] rounded-full bg-indigo-500/18 blur-[160px] pointer-events-none ${
          ambientMotion ? 'animate-float' : ''
        }`}
        style={{ animationDelay: '-6.5s' }}
      />
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-cyan-400/12 blur-[130px] pointer-events-none ${
          ambientMotion ? 'animate-subtle-glow' : ''
        }`}
        style={{ animationDelay: '-9s' }}
      />

      {/* 4. Fine Digital Precision Grid Matrix */}
      <div className="absolute inset-0 setu-grid-overlay opacity-35" />

      {/* 5. Smooth Cinema Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#020612]/85" />
    </div>
  );
};

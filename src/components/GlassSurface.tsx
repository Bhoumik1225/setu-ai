'use client';

import React from 'react';

interface GlassSurfaceProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  className = '',
  hoverEffect = true,
}) => {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#08142a]/60 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-[#030712]/60 transition-all duration-300 ${
        hoverEffect ? 'hover:border-[#06B6D4]/35 hover:shadow-[#06B6D4]/10 hover:translate-y-[-2px]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

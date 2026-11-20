'use client';

import React from 'react';

interface Waffer3DLogoProps {
  className?: string;
  size?: number; // size in pixels (default 120)
}

export const Waffer3DLogo: React.FC<Waffer3DLogoProps> = ({
  className = '',
  size = 120,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Official Brand Emblem: Crisp, physical-feel card with subtle depth and clean borders */}
      <div className="w-full h-full relative rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 p-3 flex items-center justify-center transition-transform duration-200 hover:scale-[1.02]">
        <img
          src="/logo.png"
          alt="وفّـر | Waffer"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
    </div>
  );
};

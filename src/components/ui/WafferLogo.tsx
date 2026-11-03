'use client';

import React from 'react';

interface WafferLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
  logoUrl?: string;
}

export const WafferLogo: React.FC<WafferLogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = '',
  logoUrl = '/logo.png',
}) => {
  const sizeMap = {
    sm: { box: 'w-10 h-10', text: 'text-lg', subtext: 'text-[10px]' },
    md: { box: 'w-12 h-12', text: 'text-2xl', subtext: 'text-xs' },
    lg: { box: 'w-16 h-16', text: 'text-3xl', subtext: 'text-sm' },
    xl: { box: 'w-24 h-24', text: 'text-4xl', subtext: 'text-base' },
    '2xl': { box: 'w-32 h-32', text: 'text-5xl', subtext: 'text-lg' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Waffer Logo Container */}
      <div
        className={`relative ${currentSize.box} shrink-0 rounded-2xl overflow-hidden bg-white border border-emerald-100 shadow-xs flex items-center justify-center p-0.5 ${
          animated ? 'animate-[float3d_4s_ease-in-out_infinite]' : ''
        }`}
      >
        <img
          src={logoUrl}
          alt="وفّـر | Waffer"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-slate-900 tracking-tight leading-none ${currentSize.text}`}>
              وفّـر
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              WAFFER
            </span>
          </div>
          <span className={`text-slate-500 font-medium ${currentSize.subtext} mt-0.5`}>
            منصة توفير فائض الطعام 🇯🇴
          </span>
        </div>
      )}
    </div>
  );
};

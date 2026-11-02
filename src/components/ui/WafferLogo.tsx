'use client';

import React from 'react';

interface WafferLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const WafferLogo: React.FC<WafferLogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-9 h-9', icon: 36, text: 'text-lg', subtext: 'text-[10px]' },
    md: { box: 'w-12 h-12', icon: 48, text: 'text-2xl', subtext: 'text-xs' },
    lg: { box: 'w-16 h-16', icon: 64, text: 'text-3xl', subtext: 'text-sm' },
    xl: { box: 'w-24 h-24', icon: 96, text: 'text-4xl', subtext: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Iconic Single-Letter 'و' Luxury Squircle Mark */}
      <div
        className={`relative ${currentSize.box} shrink-0 rounded-2xl overflow-hidden shadow-md shadow-emerald-900/20 ${
          animated ? 'animate-[float3d_4s_ease-in-out_infinite]' : ''
        }`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Royal Emerald Luxury Gradient */}
            <linearGradient id="luxuryBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Letter 'و' Crisp White Shading */}
            <linearGradient id="letterGrad" x1="40" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>

            <filter id="letterShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#022c22" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Luxury Squircle Base */}
          <rect width="120" height="120" rx="30" fill="url(#luxuryBg)" />
          {/* Inner Precision Rim */}
          <rect x="2" y="2" width="116" height="116" rx="28" stroke="white" strokeOpacity="0.2" strokeWidth="2" />

          {/* The Iconic Single Letter 'و' (Waw) - Bold, Minimalist, Crystal Clear from Afar */}
          <path
            d="M 64 25
               C 47 25, 34 38, 34 54
               C 34 69, 46 80, 61 80
               C 68 80, 75 77, 80 71
               C 76 84, 64 94, 46 96
               C 41 96.5, 38 100, 40 104
               C 42 107, 46 108, 51 107
               C 76 103, 93 85, 93 57
               C 93 39, 80 25, 64 25 Z
               M 63 39
               C 71 39, 78 45, 78 53
               C 78 61, 71 67, 63 67
               C 55 67, 48 61, 48 53
               C 48 45, 55 39, 63 39 Z"
            fill="url(#letterGrad)"
            filter="url(#letterShadow)"
          />

          {/* Minimal Sprout Cusp (A subtle symbol of fresh food & barakah) */}
          <path
            d="M 76 21 C 79 12, 90 10, 96 11 C 96 18, 90 26, 81 26 C 79 26, 76 24, 76 21 Z"
            fill="#34D399"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-slate-900 tracking-tight ${currentSize.text}`}>
              وفّـر
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              WAFFER
            </span>
          </div>
          <span className={`text-slate-500 font-medium ${currentSize.subtext}`}>
            توفير نفقات الطعام 🇯🇴
          </span>
        </div>
      )}
    </div>
  );
};

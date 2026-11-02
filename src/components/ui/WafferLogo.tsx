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
    sm: { box: 'w-9 h-9', text: 'text-lg', subtext: 'text-[10px]' },
    md: { box: 'w-12 h-12', text: 'text-2xl', subtext: 'text-xs' },
    lg: { box: 'w-16 h-16', text: 'text-3xl', subtext: 'text-sm' },
    xl: { box: 'w-24 h-24', text: 'text-4xl', subtext: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Clean Vector Brand Icon */}
      <div
        className={`relative ${currentSize.box} shrink-0 ${
          animated ? 'animate-[float3d_4s_ease-in-out_infinite]' : ''
        }`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(22,163,74,0.2)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wafferBagGrad" x1="20" y1="20" x2="100" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="60%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            <linearGradient id="wafferHandleGrad" x1="40" y1="10" x2="80" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="wafferCoinGrad" x1="45" y1="52" x2="75" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Handle */}
          <path
            d="M44 34 V22 C44 13 51 8 60 8 C69 8 76 13 76 22 V34"
            stroke="url(#wafferHandleGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Bag Body */}
          <path
            d="M28 38 C28 32 32 29 38 29 H82 C88 29 92 32 92 38 L86 102 C86 107 81 111 76 111 H44 C39 111 34 107 34 102 L28 38 Z"
            fill="url(#wafferBagGrad)"
          />

          {/* Top Edge Reflection */}
          <path
            d="M38 29 H82 C86 29 89 31 90 35 L89 39 H31 L30 35 C31 31 34 29 38 29 Z"
            fill="white"
            fillOpacity="0.25"
          />

          {/* Golden Savings Coin in Center */}
          <g transform="translate(60, 70)">
            <circle r="16" fill="url(#wafferCoinGrad)" stroke="#FEF3C7" strokeWidth="2" />
            {/* Arabic 'و' Calligraphic Seal for Waffer */}
            <path
              d="M3 -6 C5 -3 4 2 0 4 C-4 5 -7 1 -5 -3 C-3 -6 0 -7 3 -6 Z M0 4 L-3 9"
              stroke="#78350F"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Sprout Freshness Leaf */}
          <g transform="translate(74, 10)">
            <path
              d="M0 22 C2 10 12 2 24 2 C24 12 16 22 4 24 Z"
              fill="#4ADE80"
            />
            <path
              d="M5 21 C12 14 17 7 22 4"
              stroke="#DCFCE7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
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

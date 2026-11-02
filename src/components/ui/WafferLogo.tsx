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
    sm: { box: 'w-10 h-10', icon: 40, text: 'text-lg', subtext: 'text-[10px]' },
    md: { box: 'w-14 h-14', icon: 56, text: 'text-2xl', subtext: 'text-xs' },
    lg: { box: 'w-20 h-20', icon: 80, text: 'text-3xl', subtext: 'text-sm' },
    xl: { box: 'w-28 h-28', icon: 112, text: 'text-4xl', subtext: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 3D-Sculpted Vector Emblem */}
      <div
        className={`relative ${currentSize.box} shrink-0 ${
          animated ? 'animate-[float3d_4s_ease-in-out_infinite]' : ''
        }`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_10px_16px_rgba(16,185,129,0.28)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Bag Front Gradient */}
            <linearGradient id="bagFrontGrad" x1="20" y1="30" x2="100" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="35%" stopColor="#10B981" />
              <stop offset="85%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Handle 3D Gradient */}
            <linearGradient id="handleGrad" x1="40" y1="8" x2="80" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Sprout Leaf Gradient */}
            <linearGradient id="leafGrad" x1="70" y1="10" x2="110" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="40%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Coin/Badge Gradient */}
            <linearGradient id="badgeGrad" x1="45" y1="50" x2="75" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="80%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Specular Highlight Gloss */}
            <linearGradient id="glossGrad" x1="30" y1="32" x2="90" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <filter id="shadow3d" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#064E3B" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* 3D Handle */}
          <path
            d="M42 36 V24 C42 14 50 8 60 8 C70 8 78 14 78 24 V36"
            stroke="url(#handleGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bag Body - 3D Rounded Taper */}
          <path
            d="M26 40 C26 34 30 30 36 30 H84 C90 30 94 34 94 40 L88 100 C88 106 82 110 76 110 H44 C38 110 32 106 32 100 L26 40 Z"
            fill="url(#bagFrontGrad)"
            filter="url(#shadow3d)"
          />

          {/* 3D Bevel Edge Light (Top Rim) */}
          <path
            d="M36 31 H84 C88 31 92 34 92 38 L91 42 H29 L28 38 C28 34 32 31 36 31 Z"
            fill="white"
            fillOpacity="0.25"
          />

          {/* Glossy Curved Highlight on Left Face */}
          <path
            d="M32 36 L36 96 C36 98 38 100 40 100 C42 100 43 97 43 95 L40 36 C40 33 36 32 32 36 Z"
            fill="url(#glossGrad)"
          />

          {/* 3D Embedded Savings Seal (Golden Percent Badge) */}
          <g transform="translate(60, 72)">
            <circle r="18" fill="url(#badgeGrad)" stroke="#FEF3C7" strokeWidth="2" filter="url(#shadow3d)" />
            {/* Arabic / Symbol 'وفر' or '%' in crisp relief */}
            <path
              d="M-7 -6 L7 6 M-5 -3 A 2.5 2.5 0 1 1 -5 -3.1 M5 3 A 2.5 2.5 0 1 1 5 2.9"
              stroke="#78350F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Fresh Sprout Leaf on Top Right (Symbolizing Saving Food & Ecology) */}
          <g transform="translate(76, 12)">
            <path
              d="M0 24 C2 12 14 2 28 2 C28 14 18 26 6 26 Z"
              fill="url(#leafGrad)"
              filter="url(#shadow3d)"
            />
            <path
              d="M6 24 C14 16 20 8 26 4"
              stroke="#D1FAE5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg -z-10 pointer-events-none" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-slate-900 tracking-tight ${currentSize.text}`}>
              وفّـر
            </span>
            <span className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              WAFFER
            </span>
          </div>
          <span className={`text-slate-500 font-medium ${currentSize.subtext}`}>
            حفظ النعمة.. وأوفر لجيبتك 🇯🇴
          </span>
        </div>
      )}
    </div>
  );
};

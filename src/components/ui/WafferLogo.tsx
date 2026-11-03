'use client';

import React, { useId, useState } from 'react';

interface WafferLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
  logoUrl?: string; // يدعم رابط صورة الشعار الخاصة التي سيرسلها المستخدم
}

export const WafferLogo: React.FC<WafferLogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = '',
  logoUrl,
}) => {
  const [imageError, setImageError] = useState(false);
  const reactId = useId();
  const safeId = reactId.replace(/:/g, '_');

  const sizeMap = {
    sm: { box: 'w-10 h-10', icon: 40, text: 'text-lg', subtext: 'text-[10px]' },
    md: { box: 'w-12 h-12', icon: 48, text: 'text-2xl', subtext: 'text-xs' },
    lg: { box: 'w-16 h-16', icon: 64, text: 'text-3xl', subtext: 'text-sm' },
    xl: { box: 'w-24 h-24', icon: 96, text: 'text-4xl', subtext: 'text-base' },
  };

  const currentSize = sizeMap[size];

  // لو وضع المستخدم صورة شعار باسم /logo.png أو تم تمرير logoUrl
  const effectiveLogoUrl = !imageError ? (logoUrl || '/logo.png') : null;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Container Box - Guaranteed solid emerald gradient in CSS so it NEVER renders white */}
      <div
        className={`relative ${currentSize.box} shrink-0 rounded-2xl overflow-hidden shadow-md shadow-emerald-900/30 border border-emerald-400/40 flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 ${
          animated ? 'animate-[float3d_4s_ease-in-out_infinite]' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 45%, #047857 100%)',
        }}
      >
        {effectiveLogoUrl ? (
          <img
            src={effectiveLogoUrl}
            alt="وفّـر | Waffer"
            className="w-full h-full object-cover p-0.5 rounded-2xl"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Unique gradient IDs to prevent browser defs clashes */}
              <linearGradient id={`luxuryBg_${safeId}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              <linearGradient id={`letterGrad_${safeId}`} x1="30" y1="20" x2="90" y2="105" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#ECFDF5" />
              </linearGradient>

              <filter id={`shadow_${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#064e3b" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Base Fill & Inner Rim */}
            <rect width="120" height="120" rx="28" fill={`url(#luxuryBg_${safeId})`} />
            <rect x="2" y="2" width="116" height="116" rx="26" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" />

            {/* The Iconic Single Letter 'و' (Waw) - Bold, High-Contrast & Visible from Afar */}
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
              fill={`url(#letterGrad_${safeId})`}
              filter={`url(#shadow_${safeId})`}
            />

            {/* Golden Fresh Food Sprout */}
            <path
              d="M 76 21 C 79 11, 91 9, 98 10 C 98 18, 91 27, 81 27 C 78 27, 76 24, 76 21 Z"
              fill="#FDE047"
            />
          </svg>
        )}
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
            منصة توفير فائض الطعام 🇯🇴
          </span>
        </div>
      )}
    </div>
  );
};

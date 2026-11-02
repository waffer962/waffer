'use client';

import React, { useState, useEffect } from 'react';

interface Waffer3DLogoProps {
  className?: string;
  size?: number; // size in pixels (default 140)
  enableTilt?: boolean;
}

export const Waffer3DLogo: React.FC<Waffer3DLogoProps> = ({
  className = '',
  size = 140,
  enableTilt = true,
}) => {
  const [rotation, setRotation] = useState({ x: 8, y: -6 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth floating animation
  useEffect(() => {
    if (isHovered) return;
    let frame: number;
    const start = Date.now();

    const loop = () => {
      const elapsed = (Date.now() - start) / 1000;
      const x = Math.sin(elapsed * 1.5) * 5 + 6;
      const y = Math.cos(elapsed * 1.2) * 6 - 4;
      setRotation({ x, y });
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({
      x: -(y / (rect.height / 2)) * 14,
      y: (x / (rect.width / 2)) * 16,
    });
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '800px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Container */}
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Soft Ambient Shadow */}
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-6 rounded-3xl bg-emerald-950/20 blur-md pointer-events-none transition-all duration-300"
          style={{ transform: 'translateZ(-30px)' }}
        />

        {/* Layer 1: Luxury Squircle Base */}
        <div
          className="w-full h-full relative rounded-[32px] overflow-hidden shadow-xl shadow-emerald-950/25"
          style={{ transform: 'translateZ(0px)' }}
        >
          <svg
            viewBox="0 0 140 140"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="luxurySquircleBg" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="45%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              <linearGradient id="wawLetterGrad" x1="45" y1="25" x2="95" y2="115" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="85%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>

              <filter id="wawShadow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#022c22" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Squircle Background Tile */}
            <rect width="140" height="140" rx="34" fill="url(#luxurySquircleBg)" />
            {/* Subtle Luxury Inset Border */}
            <rect x="2.5" y="2.5" width="135" height="135" rx="31.5" stroke="white" strokeOpacity="0.22" strokeWidth="2.5" />

            {/* The Iconic Single Letter 'و' (Waw) */}
            <path
              d="M 74 29
                 C 54 29, 39 44, 39 63
                 C 39 80, 53 93, 71 93
                 C 79 93, 87 89, 93 82
                 C 88 97, 74 109, 53 111
                 C 47 111.5, 44 116, 46 120
                 C 48 124, 53 125, 59 124
                 C 88 119, 108 98, 108 66
                 C 108 45, 93 29, 74 29 Z
                 M 73 45
                 C 82 45, 90 52, 90 61
                 C 90 70, 82 77, 73 77
                 C 64 77, 56 70, 56 61
                 C 56 52, 64 45, 73 45 Z"
              fill="url(#wawLetterGrad)"
              filter="url(#wawShadow)"
            />

            {/* Subtle Fresh Food Sprout Cusp */}
            <path
              d="M 88 24 C 91 14, 104 12, 111 13 C 111 21, 104 30, 94 30 C 91 30, 88 28, 88 24 Z"
              fill="#34D399"
            />

            {/* Diagonal Specular Sheen across Squircle */}
            <path
              d="M 0 0 L 70 0 L 0 70 Z"
              fill="white"
              fillOpacity="0.1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

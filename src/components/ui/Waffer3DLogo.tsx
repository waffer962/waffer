'use client';

import React, { useState, useEffect } from 'react';

interface Waffer3DLogoProps {
  className?: string;
  size?: number; // size in pixels (default 150)
  enableTilt?: boolean;
}

export const Waffer3DLogo: React.FC<Waffer3DLogoProps> = ({
  className = '',
  size = 150,
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
      const x = Math.sin(elapsed * 1.6) * 6 + 6;
      const y = Math.cos(elapsed * 1.3) * 8 - 4;
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
        perspective: '900px',
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
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-5 rounded-full bg-emerald-950/15 blur-md pointer-events-none transition-all duration-300"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Layer 1: Clean Vector Bag Body */}
        <div
          className="w-full h-full relative"
          style={{ transform: 'translateZ(0px)' }}
        >
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full drop-shadow-[0_12px_20px_rgba(22,163,74,0.25)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bagGrad3D" x1="20" y1="20" x2="140" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="45%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>

              <linearGradient id="handleGrad3D" x1="50" y1="10" x2="110" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="leafGrad3D" x1="90" y1="15" x2="150" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="50%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>

              <linearGradient id="coinGrad3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Handle */}
            <path
              d="M56 46 V30 C56 16 66 8 80 8 C94 8 104 16 104 30 V46"
              stroke="url(#handleGrad3D)"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Bag Body */}
            <path
              d="M34 50 C34 42 40 38 48 38 H112 C120 38 126 42 126 50 L118 134 C118 142 110 148 102 148 H58 C50 148 42 142 42 134 L34 50 Z"
              fill="url(#bagGrad3D)"
            />

            {/* Top Rim Trim */}
            <path
              d="M48 38 H112 C118 38 123 42 123 47 L122 53 H38 L37 47 C37 42 42 38 48 38 Z"
              fill="white"
              fillOpacity="0.25"
            />

            {/* Curved Highlight */}
            <path
              d="M42 48 L48 132 C48 135 50 137 53 137 L49 48 Z"
              fill="white"
              fillOpacity="0.18"
            />
          </svg>
        </div>

        {/* Layer 2: Popping 3D Golden Savings Coin (NO 70%!) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(28px) translateY(12px)' }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[2.5px] shadow-[0_6px_14px_rgba(217,119,6,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 flex flex-col items-center justify-center text-amber-950 font-black shadow-inner">
              {/* Elegant Arabic 'و' seal with coin ring */}
              <span className="text-xl leading-none font-black text-amber-950 tracking-tighter drop-shadow-xs">
                وفّـر
              </span>
            </div>
          </div>
        </div>

        {/* Layer 3: Popping Fresh Food Sprout Leaf */}
        <div
          className="absolute top-2 -right-1 pointer-events-none"
          style={{ transform: 'translateZ(36px)' }}
        >
          <div className="w-11 h-11 drop-shadow-[0_4px_8px_rgba(22,163,74,0.3)]">
            <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
              <path
                d="M4 44 C8 24 24 6 44 4 C44 24 30 42 12 44 Z"
                fill="url(#leafGrad3D)"
              />
              <path
                d="M10 42 C20 30 28 18 38 10"
                stroke="#DCFCE7"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

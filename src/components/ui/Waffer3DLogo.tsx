'use client';

import React, { useState, useEffect } from 'react';

interface Waffer3DLogoProps {
  className?: string;
  size?: number; // size in pixels (default 160)
  enableTilt?: boolean;
}

export const Waffer3DLogo: React.FC<Waffer3DLogoProps> = ({
  className = '',
  size = 160,
  enableTilt = true,
}) => {
  const [rotation, setRotation] = useState({ x: 10, y: -10 });
  const [isHovered, setIsHovered] = useState(false);

  // Auto idle subtle floating animation
  useEffect(() => {
    if (isHovered) return;
    let frame: number;
    let start = Date.now();

    const loop = () => {
      const elapsed = (Date.now() - start) / 1000;
      const x = Math.sin(elapsed * 1.5) * 8 + 6;
      const y = Math.cos(elapsed * 1.2) * 10 - 4;
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
    // Map to degrees
    setRotation({
      x: -(y / (rect.height / 2)) * 18,
      y: (x / (rect.width / 2)) * 22,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Container with preserved depth */}
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Layer 0: Ambient Backlight & Pulsing Aura */}
        <div
          className="absolute -inset-4 rounded-full bg-gradient-to-tr from-emerald-500/30 to-amber-400/25 blur-2xl pointer-events-none animate-pulse"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Layer 1: Ground Shadow that reflects 3D tilt */}
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-6 rounded-full bg-emerald-950/20 blur-md pointer-events-none transition-all duration-300"
          style={{
            transform: `translateZ(-50px) scale(${1 - Math.abs(rotation.x) * 0.015})`,
          }}
        />

        {/* Layer 2: Main 3D Bag Body (SVG with rich gradient shaders) */}
        <div
          className="w-full h-full relative"
          style={{ transform: 'translateZ(0px)' }}
        >
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full drop-shadow-[0_20px_25px_rgba(5,150,105,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Bag Base Shader */}
              <linearGradient id="bag3DGrad" x1="20" y1="20" x2="140" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="25%" stopColor="#10B981" />
                <stop offset="65%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              {/* Beveled Handle Gradient */}
              <linearGradient id="handle3DGrad" x1="50" y1="10" x2="110" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* Shimmer Light Bar */}
              <linearGradient id="lightShimmer" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="40%" stopColor="white" stopOpacity="0.45" />
                <stop offset="60%" stopColor="white" stopOpacity="0.8" />
                <stop offset="80%" stopColor="white" stopOpacity="0.45" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>

              {/* Sprout Leaf Gradient */}
              <linearGradient id="leaf3DGrad" x1="90" y1="15" x2="150" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#BBF7D0" />
                <stop offset="30%" stopColor="#4ADE80" />
                <stop offset="80%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>

              <filter id="shadow3DLayer" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#064E3B" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* 3D Handle */}
            <path
              d="M56 46 V30 C56 16 66 8 80 8 C94 8 104 16 104 30 V46"
              stroke="url(#handle3DGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#shadow3DLayer)"
            />
            {/* Handle Inner Ring Specular */}
            <path
              d="M60 44 V31 C60 20 68 13 80 13 C92 13 100 20 100 31 V44"
              stroke="#FEF3C7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />

            {/* Bag Body */}
            <path
              d="M34 50 C34 42 40 38 48 38 H112 C120 38 126 42 126 50 L118 134 C118 142 110 148 102 148 H58 C50 148 42 142 42 134 L34 50 Z"
              fill="url(#bag3DGrad)"
              filter="url(#shadow3DLayer)"
            />

            {/* 3D Top Rim Trim */}
            <path
              d="M48 38 H112 C118 38 123 42 123 47 L122 53 H38 L37 47 C37 42 42 38 48 38 Z"
              fill="white"
              fillOpacity="0.3"
            />

            {/* Left Beveled Shadow for 3D Volume */}
            <path
              d="M34 50 L42 134 C43 140 47 145 53 147 L46 142 C40 137 35 130 35 122 L34 50 Z"
              fill="#064E3B"
              fillOpacity="0.35"
            />

            {/* Glossy Curved Highlight on Left Face */}
            <path
              d="M44 48 L50 132 C50 135 53 138 56 138 C58 138 60 135 60 132 L54 48 C54 44 44 44 44 48 Z"
              fill="white"
              fillOpacity="0.22"
            />
          </svg>
        </div>

        {/* Layer 3: Popping 3D Golden Medallion (Translate Z +32px) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(32px) translateY(12px)' }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[3px] shadow-[0_8px_16px_rgba(217,119,6,0.45)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex flex-col items-center justify-center text-amber-950 font-black shadow-inner">
              <span className="text-[17px] leading-none font-black tracking-tighter">وفّر</span>
              <span className="text-[9px] font-black text-amber-900 tracking-wider">70%</span>
            </div>
          </div>
        </div>

        {/* Layer 4: Popping Fresh Ecology Leaf (Translate Z +48px) */}
        <div
          className="absolute top-2 -right-1 pointer-events-none"
          style={{ transform: 'translateZ(48px)' }}
        >
          <div className="w-12 h-12 relative drop-shadow-[0_8px_12px_rgba(5,150,105,0.45)]">
            <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
              <path
                d="M4 44 C8 24 24 6 44 4 C44 24 30 42 12 44 Z"
                fill="url(#leaf3DGrad)"
              />
              <path
                d="M10 42 C20 30 28 18 38 10"
                stroke="#ECFDF5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="36" cy="12" r="3" fill="#FEF08A" />
            </svg>
          </div>
        </div>

        {/* Layer 5: Glassmorphism Diagonal Reflection Sheen */}
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-40"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -rotate-45 translate-x-[-120%] animate-[shimmerSweep_3.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

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
  const [rotation, setRotation] = useState({ x: 6, y: -4 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth floating animation
  useEffect(() => {
    if (isHovered) return;
    let frame: number;
    const start = Date.now();

    const loop = () => {
      const elapsed = (Date.now() - start) / 1000;
      const x = Math.sin(elapsed * 1.5) * 4 + 4;
      const y = Math.cos(elapsed * 1.2) * 5 - 3;
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
      x: -(y / (rect.height / 2)) * 12,
      y: (x / (rect.width / 2)) * 14,
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
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full bg-emerald-950/15 blur-lg pointer-events-none transition-all duration-300"
          style={{ transform: 'translateZ(-30px)' }}
        />

        {/* Official Logo Card with 3D Depth */}
        <div
          className="w-full h-full relative rounded-3xl overflow-hidden bg-white border border-emerald-200/80 shadow-xl shadow-emerald-900/10 p-3 flex items-center justify-center"
          style={{ transform: 'translateZ(10px)' }}
        >
          <img
            src="/logo.png"
            alt="وفّـر | Waffer"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

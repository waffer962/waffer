'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Waffer3DLogo } from '@/components/ui/Waffer3DLogo';
import { ArrowLeft, Coins } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [progress, setProgress] = useState(0);
  const [coinDropped, setCoinDropped] = useState(false);

  // Smooth, longer ~3.2s intro duration as requested
  useEffect(() => {
    // Drop coin animation trigger at 0.6s
    const coinTimer = setTimeout(() => {
      setCoinDropped(true);
    }, 600);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setCurrentScreen('login'), 250);
          return 100;
        }
        return prev + 2; // Increments by 2 every 64ms => ~3.2 seconds
      });
    }, 64);

    return () => {
      clearInterval(timer);
      clearTimeout(coinTimer);
    };
  }, [setCurrentScreen]);

  const handleSkip = () => {
    setCurrentScreen('login');
  };

  return (
    <div
      onClick={handleSkip}
      className="flex-1 w-full flex flex-col items-center justify-between min-h-screen p-6 sm:p-10 bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 text-slate-900 relative overflow-hidden select-none cursor-pointer"
    >
      {/* Subtle top bar with clean skip button */}
      <div className="w-full max-w-sm flex justify-end items-center z-10 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs font-bold text-slate-400 hover:text-emerald-700 bg-white/80 hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1 transition"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Hero: Logo + Money Saving Coin Animation */}
      <div className="flex flex-col items-center text-center z-10 my-auto space-y-6">
        {/* Animated 3D Bag with Dropping Savings Coin */}
        <div className="relative flex flex-col items-center">
          {/* Animated Gold Coin that drops into the bag to show you save real money */}
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 border-2 border-amber-200 shadow-md flex items-center justify-center text-amber-950 font-black text-xs transition-all duration-700 ease-out z-20 ${
              coinDropped
                ? 'translate-y-14 scale-75 opacity-0'
                : '-translate-y-6 opacity-100 animate-bounce'
            }`}
          >
            <Coins className="w-5 h-5 text-amber-900" />
          </div>

          {/* 3D Waffer Emblem */}
          <Waffer3DLogo size={160} enableTilt={true} />
        </div>

        {/* Clean, Authentic Brand Title (Zero Text Clutter) */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              وفّـر
            </h1>
            <span className="text-xs font-extrabold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              WAFFER
            </span>
          </div>

          {/* Concise visual savings indicator without fake percentages */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-bold shadow-xs">
            <span className="text-amber-500">💰</span>
            <span>وفّر مبالغ حقيقية على طعامك اليومي</span>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Progress Bar */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center gap-2.5 pb-6">
        <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{progress}%</span>
      </div>
    </div>
  );
};

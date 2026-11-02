'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Waffer3DLogo } from '@/components/ui/Waffer3DLogo';
import { ArrowLeft } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, currentUser, currentUserRole } = useApp();
  const [progress, setProgress] = useState(0);

  // Transition smoothly to user's saved screen or login
  const proceedToNextScreen = () => {
    let targetScreen: 'customer' | 'store' | 'staff' | 'login' = 'login';

    // 1. Check in-memory store
    if (currentUser && currentUserRole && currentUserRole !== 'guest') {
      if (currentUserRole === 'store_owner') targetScreen = 'store';
      else if (currentUserRole === 'staff') targetScreen = 'staff';
      else targetScreen = 'customer';
    } else {
      // 2. Check localStorage session directly
      try {
        const saved = localStorage.getItem('waffer_user_session_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.role && parsed.role !== 'guest') {
            if (parsed.role === 'store_owner') targetScreen = 'store';
            else if (parsed.role === 'staff') targetScreen = 'staff';
            else targetScreen = 'customer';
          }
        }
      } catch {
        // fallback
      }
    }

    setCurrentScreen(targetScreen);
  };

  // Smooth, relaxed ~2.5s intro duration
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(proceedToNextScreen, 200);
          return 100;
        }
        return prev + 2; // Increments by 2 every 50ms => ~2.5s
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentUser, currentUserRole]);

  const handleSkip = () => {
    proceedToNextScreen();
  };

  return (
    <div
      onClick={handleSkip}
      className="flex-1 w-full flex flex-col items-center justify-between min-h-screen p-6 sm:p-10 bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 text-slate-900 relative overflow-hidden select-none cursor-pointer"
    >
      {/* Top minimal skip button */}
      <div className="w-full max-w-sm flex justify-end items-center z-10 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs font-bold text-slate-400 hover:text-emerald-700 bg-white hover:bg-emerald-50 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-1 transition"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Iconic Luxury Single-Mark 'و' & Minimal Branding */}
      <div className="flex flex-col items-center text-center z-10 my-auto space-y-6">
        {/* 3D Iconic Single-Mark 'و' (Instant Recognition from Afar) */}
        <div className="relative">
          <Waffer3DLogo size={140} enableTilt={true} />
        </div>

        {/* Minimal Luxury Typography */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              وفّـر
            </h1>
            <span className="text-xs font-black text-emerald-700 tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              WAFFER
            </span>
          </div>

          <p className="text-xs text-slate-500 font-bold">
            توفير مبالغ حقيقية على طعامك اليومي 🇯🇴
          </p>
        </div>
      </div>

      {/* Bottom Minimal Progress Bar */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center gap-2 pb-6">
        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
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

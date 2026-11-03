'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Waffer3DLogo } from '@/components/ui/Waffer3DLogo';
import { ArrowLeft } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, currentUser, currentUserRole } = useApp();

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

  // Gentle, calm intro transition (approx 2.2 seconds) with no upload progress bar or numbers
  useEffect(() => {
    const timer = setTimeout(() => {
      proceedToNextScreen();
    }, 2200);

    return () => clearTimeout(timer);
  }, [currentUser, currentUserRole]);

  const handleSkip = () => {
    proceedToNextScreen();
  };

  return (
    <div
      onClick={handleSkip}
      className="flex-1 w-full flex flex-col items-center justify-between min-h-screen p-6 sm:p-10 bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 text-slate-900 relative overflow-hidden select-none cursor-pointer"
    >
      {/* Top minimal skip button */}
      <div className="w-full max-w-sm flex justify-end items-center z-10 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs font-bold text-slate-400 hover:text-emerald-700 bg-white hover:bg-emerald-50 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-1 transition cursor-pointer"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Official Logo with 3D gentle motion & Branding */}
      <div className="flex flex-col items-center text-center z-10 my-auto space-y-6">
        {/* Subtle glowing ambient pulse */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-400/15 blur-2xl animate-pulse -z-10 scale-125" />
          <Waffer3DLogo size={145} enableTilt={true} />
        </div>

        {/* Brand Typography */}
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

      {/* Bottom Gentle Calm Motion (No progress bar line, no numeric percentages) */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center justify-center gap-3 pb-8">
        {/* Three gentle pulsing / dancing dots */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
        </div>

        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
          جاري فتح المنصة...
        </p>
      </div>
    </div>
  );
};


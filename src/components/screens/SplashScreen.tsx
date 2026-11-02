'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Sparkles, Utensils, HeartHandshake, ArrowLeft } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setCurrentScreen('login'), 300);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [setCurrentScreen]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-between min-h-[85vh] p-6 sm:p-12 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden select-none">
      {/* Decorative background glow circles */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tagline */}
      <div className="w-full max-w-5xl flex justify-between items-center z-10 pt-2">
        <span className="text-xs sm:text-sm font-bold tracking-wider text-emerald-300 bg-emerald-500/15 px-4 py-1.5 rounded-full border border-emerald-500/30">
          المملكة الأردنية الهاشمية 🇯🇴
        </span>
        <button
          onClick={() => setCurrentScreen('login')}
          className="text-xs sm:text-sm text-slate-300 hover:text-white flex items-center gap-1 transition"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Center Animated Logo & Branding */}
      <div className="flex flex-col items-center text-center z-10 my-auto py-10">
        <div className="relative mb-8">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-8 ring-emerald-400/20 animate-pulse">
            <Utensils className="w-14 h-14 sm:w-18 sm:h-18 text-slate-950" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold text-sm">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
          وفّر <span className="text-emerald-400 font-bold text-4xl sm:text-5xl">Waffer</span>
        </h1>
        <p className="text-emerald-100/90 text-sm sm:text-lg max-w-md font-semibold leading-relaxed">
          طعام طازج بأسعار مخفضة.. لتقليل الهدر وحماية البيئة في الأردن
        </p>
      </div>

      {/* Bottom Progress & Pillars */}
      <div className="w-full max-w-md z-10 flex flex-col items-center gap-4 pb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200/90 font-medium">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>مطاعم ومخابز • وجبات بخصم حتى 70% • استلام مباشر</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-700/60 shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">جاري تجهيز المنصة... {progress}%</span>
      </div>
    </div>
  );
};

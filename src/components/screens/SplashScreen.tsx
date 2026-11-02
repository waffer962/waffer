'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Sparkles, Utensils, HeartHandshake } from 'lucide-react';

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
    }, 80);

    return () => clearInterval(timer);
  }, [setCurrentScreen]);

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[680px] h-full p-8 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white overflow-hidden select-none">
      {/* Decorative background glow circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tagline */}
      <div className="w-full flex justify-between items-center z-10 pt-4">
        <span className="text-xs font-medium tracking-wider text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          المملكة الأردنية الهاشمية 🇯🇴
        </span>
        <button
          onClick={() => setCurrentScreen('login')}
          className="text-xs text-slate-300 hover:text-white underline underline-offset-4 transition"
        >
          تخطي
        </button>
      </div>

      {/* Center Animated Logo & Branding */}
      <div className="flex flex-col items-center text-center z-10 my-auto">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-400/20 animate-pulse">
            <Utensils className="w-12 h-12 text-slate-950" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-5xl font-black tracking-tight text-white mb-2 drop-shadow-md">
          وفّر <span className="text-emerald-400 text-3xl font-bold">Waffer</span>
        </h1>
        <p className="text-emerald-100/90 text-sm max-w-xs font-medium leading-relaxed">
          طعام طازج بأسعار مخفضة.. لتقليل الهدر وحماية البيئة في الأردن
        </p>
      </div>

      {/* Bottom Progress & Pillars */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-emerald-200/80">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>مطاعم ومخابز • وجبات بخصم حتى 70% • استلام مباشر</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-slate-400 font-mono">جاري التحميل... {progress}%</span>
      </div>
    </div>
  );
};

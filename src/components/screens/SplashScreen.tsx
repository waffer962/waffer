'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Waffer3DLogo } from '@/components/ui/Waffer3DLogo';
import { Sparkles, ArrowLeft, ShieldCheck, HeartHandshake } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [progress, setProgress] = useState(0);

  // Quick and smooth ~1.8s intro animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setCurrentScreen('login'), 200);
          return 100;
        }
        return prev + 6;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [setCurrentScreen]);

  const handleSkip = () => {
    setCurrentScreen('login');
  };

  return (
    <div
      onClick={handleSkip}
      className="flex-1 w-full flex flex-col items-center justify-between min-h-screen p-6 sm:p-10 bg-gradient-to-b from-white via-slate-50 to-emerald-50/50 text-slate-900 relative overflow-hidden select-none cursor-pointer"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[420px] h-[420px] bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[380px] h-[380px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Country Badge & Instant Skip Button */}
      <div className="w-full max-w-md flex justify-between items-center z-10 pt-2">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3.5 py-1.5 rounded-full border border-emerald-300/60 shadow-xs flex items-center gap-1.5">
          <span>المملكة الأردنية الهاشمية</span>
          <span>🇯🇴</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs font-bold text-slate-500 hover:text-emerald-700 bg-white/90 hover:bg-emerald-50 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1 transition"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center 3D Logo & Brand Intro */}
      <div className="flex flex-col items-center text-center z-10 my-auto py-6 space-y-6 max-w-sm">
        {/* Animated 3D Waffer Emblem */}
        <div className="relative">
          <Waffer3DLogo size={160} enableTilt={true} />
        </div>

        {/* Brand Name & Typography */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              تطبيق <span className="text-emerald-600">وفّـر</span>
            </h1>
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
              WAFFER
            </span>
          </div>

          <p className="text-slate-600 text-sm sm:text-base font-bold">
            حفظ النعمة.. وأوفر لجيبتك
          </p>

          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            منصة حجز فائض وجبات المطاعم والمخابز بأسعار مخفضة حتى 70% والدفع عند الاستلام
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar & Trust Indicator */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center gap-3 pb-4">
        {/* Features Pills */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/70">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
          <span>مطاعم معتمدة • استلام مباشر • كاش</span>
        </div>

        {/* Elegant Animated Progress Bar */}
        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden shadow-inner p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-100 ease-out shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-medium">
          <span>انقر في أي مكان للدخول السريع</span>
          <span className="font-mono text-emerald-600 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

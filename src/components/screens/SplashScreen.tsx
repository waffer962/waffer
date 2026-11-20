'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Waffer3DLogo } from '@/components/ui/Waffer3DLogo';
import { ArrowLeft } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, currentUser, currentUserRole, isAuthInitialized, googleAuthUser } = useApp();

  const proceedToNextScreen = () => {
    let targetScreen: 'customer' | 'store' | 'staff' | 'admin' | 'role_select' | 'login' = 'login';

    if (currentUser && currentUserRole && currentUserRole !== 'guest') {
      if (currentUserRole === 'admin') targetScreen = 'admin';
      else if (currentUserRole === 'store_owner') targetScreen = 'store';
      else if (currentUserRole === 'staff') targetScreen = 'staff';
      else targetScreen = 'customer';
    } else if (googleAuthUser) {
      targetScreen = 'role_select';
    } else {
      try {
        const saved = localStorage.getItem('waffer_user_session_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.role && parsed.role !== 'guest') {
            if (parsed.role === 'admin') targetScreen = 'admin';
            else if (parsed.role === 'store_owner') targetScreen = 'store';
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

  useEffect(() => {
    if (!isAuthInitialized) return;

    const timer = setTimeout(() => {
      proceedToNextScreen();
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthInitialized, currentUser, currentUserRole, googleAuthUser]);

  return (
    <div
      onClick={proceedToNextScreen}
      className="flex-1 w-full flex flex-col items-center justify-between min-h-screen p-6 sm:p-10 bg-white text-slate-900 select-none cursor-pointer"
    >
      {/* Top minimal skip button */}
      <div className="w-full max-w-sm flex justify-end items-center pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            proceedToNextScreen();
          }}
          className="text-xs font-bold text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 transition cursor-pointer"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5 inline-block mr-1" />
        </button>
      </div>

      {/* Center: Official Logo & Clean Brand Hierarchy */}
      <div className="flex flex-col items-center text-center my-auto space-y-5">
        <Waffer3DLogo size={130} />

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              وفّـر
            </h1>
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              WAFFER
            </span>
          </div>

          <p className="text-sm text-slate-600 font-medium">
            المنصة الأردنية للحد من هدر الطعام وتوفير الوجبات اليومية
          </p>
        </div>
      </div>

      {/* Bottom Minimal Indicator (Clean, understated loader) */}
      <div className="w-full max-w-xs flex flex-col items-center justify-center gap-2.5 pb-8">
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="w-full h-full bg-emerald-600 origin-left animate-pulse" />
        </div>
        <p className="text-xs text-slate-400 font-medium">
          جاري فتح المنصة...
        </p>
      </div>
    </div>
  );
};

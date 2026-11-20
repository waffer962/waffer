'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { Shield, ArrowRight } from 'lucide-react';
import { WafferLogo } from '@/components/ui/WafferLogo';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, loginAsGuest, setCurrentScreen } = useApp();

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-8 min-h-screen relative">
      {/* Container Card */}
      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
        
        {/* Top Bar with English "Admin" button only */}
        <div className="flex items-center justify-end pb-2">
          <button
            type="button"
            onClick={() => setCurrentScreen('admin_login')}
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200/80 transition cursor-pointer"
            title="Admin & Operations Portal"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition" />
            <span className="font-semibold tracking-wide">Admin</span>
          </button>
        </div>

        {/* Brand Header with Sculpted Logo */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <WafferLogo size="lg" showText={false} animated={true} />
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              منصة <span className="text-emerald-600">وفّـر</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
              شراء فائض الوجبات الطازجة بأسعار مخفضة والحد من الهدر الغذائي في الأردن 🇯🇴
            </p>
          </div>
        </div>

        {/* 1. Primary Action: Official Real Google Sign-In */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="group flex items-center justify-center gap-3 w-full py-4 px-5 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm shadow-sm border border-slate-300 hover:border-slate-400 active:scale-[0.98] transition cursor-pointer"
          >
            {/* Official Google G Icon */}
            <svg className="w-5 h-5 shrink-0 group-hover:scale-105 transition" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-slate-800 font-bold">المتابعة بواسطة Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] text-slate-400 font-medium">أو</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* 2. Secondary Action: Guest Browsing */}
          <div className="text-center">
            <button
              type="button"
              onClick={loginAsGuest}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition py-2.5 px-4 rounded-xl hover:bg-emerald-50 cursor-pointer"
            >
              <span>تصفح العروض كزائر بدون حساب</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

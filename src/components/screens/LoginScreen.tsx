'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ShoppingBag,
  Store,
  LifeBuoy
} from 'lucide-react';
import { WafferLogo } from '@/components/ui/WafferLogo';

export const LoginScreen: React.FC = () => {
  const { loginAsGoogle, loginWithEmail, loginAsGuest } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }
    setErrorMessage('');
    loginWithEmail(email, password);
  };

  const handleQuickFill = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('123456');
    setErrorMessage('');
    loginWithEmail(presetEmail, '123456');
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-8 min-h-screen">
      {/* Container card with clean commercial shopping look */}
      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
        
        {/* Brand Header with Sculpted Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <WafferLogo size="lg" showText={false} animated={true} />
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              تطبيق <span className="text-emerald-600">وفّـر</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
              منصة شراء فائض الوجبات بأسعار مخفضة وتقليل الهدر في الأردن 🇯🇴
            </p>
          </div>
        </div>

        {/* 1. Google Sign-In Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => loginAsGoogle()}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm shadow-sm border border-slate-200 active:scale-[0.98] transition cursor-pointer"
          >
            {/* Official Google G Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>المتابعة بواسطة Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] text-slate-600 font-medium">أو بالبريد الإلكتروني</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 2. Email & Password Form (Intelligent Role Detection) */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 pl-10 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  required
                />
                <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 pl-10 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-600 hover:text-slate-600 absolute left-3 top-3.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-[0.98] cursor-pointer"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>

        {/* 3. Quick-Access Account Chips (For direct testing of each role) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
          <p className="text-[11px] font-bold text-slate-600 text-center">
            ⚡ حسابات معتمدة جاهزة للدخول المباشر:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@waffer.jo')}
              className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl font-bold text-slate-700 hover:text-emerald-700 transition flex flex-col items-center gap-1 cursor-pointer text-center"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>الأدمن العام</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('staff@waffer.jo')}
              className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl font-bold text-slate-700 hover:text-blue-700 transition flex flex-col items-center gap-1 cursor-pointer text-center"
            >
              <LifeBuoy className="w-4 h-4 text-blue-600" />
              <span>إدارة الطلبات</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('store@waffer.jo')}
              className="p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl font-bold text-slate-700 hover:text-amber-700 transition flex flex-col items-center gap-1 cursor-pointer text-center"
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span>صاحب متجر</span>
            </button>
          </div>
        </div>

        {/* 4. Guest Mode */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={loginAsGuest}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition py-2 px-4 rounded-xl hover:bg-emerald-50 cursor-pointer"
          >
            <span>تصفح العروض كزائر بدون حساب</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

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
  ShoppingBag,
  Store,
  X,
  Check
} from 'lucide-react';
import { WafferLogo } from '@/components/ui/WafferLogo';

export const LoginScreen: React.FC = () => {
  const { loginAsGoogle, loginWithEmail, loginAsGuest } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Google Sign-In Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googlePhone, setGooglePhone] = useState('');
  const [googleRole, setGoogleRole] = useState<'customer' | 'store_owner'>('customer');
  const [googleError, setGoogleError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!password) {
      setErrorMessage('يرجى إدخال كلمة المرور');
      return;
    }
    setErrorMessage('');
    const res = loginWithEmail(email, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) {
      setGoogleError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (!googlePassword.trim() || googlePassword.trim().length < 4) {
      setGoogleError('كلمة المرور مطلوبة لحفظ وتأمين حسابك في الداتابيس (4 أحرف أو أرقام على الأقل)');
      return;
    }
    if (!googleName.trim() || googleName.trim().length < 2) {
      setGoogleError('الاسم الكامل إجباري لحفظ الحساب وتأكيد الطلبات');
      return;
    }
    if (!googlePhone.trim() || googlePhone.trim().length < 8) {
      setGoogleError('رقم الهاتف إجباري للتواصل وتأكيد الحجز (مثال: 0791234567)');
      return;
    }
    setGoogleError('');
    setIsGoogleModalOpen(false);
    loginAsGoogle(googleEmail, googleName, googlePhone, googleRole, googlePassword);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-8 min-h-screen relative">
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
            onClick={() => setIsGoogleModalOpen(true)}
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
            <span className="text-[11px] text-slate-500 font-medium">أو بالبريد الإلكتروني</span>
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
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
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
                  className="text-slate-400 hover:text-slate-600 absolute left-3 top-3.5 cursor-pointer"
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

          {/* Official Credentials Info Box (Non-bypass, requires typing email and password in the form above) */}
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                <span>🔐</span>
                <span>بيانات الدخول الرسمية للإدارة والتشغيل:</span>
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                إدخال يدوي إجباري 🔒
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-right">
              {/* Admin Credential Info */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 text-[11px] flex items-center gap-1">
                    <span>🛡️</span> المشرف (أدمن)
                  </span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold">تعديل ✏️</span>
                </div>
                <p className="text-[10px] text-slate-600 font-mono select-all">admin@waffer.jo</p>
                <p className="text-[9px] text-slate-500 mt-0.5">الرمز: <span className="font-mono font-bold text-amber-700 select-all">admin123</span></p>
              </div>

              {/* Staff Credential Info */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 text-[11px] flex items-center gap-1">
                    <span>🎧</span> موظف الشكاوى
                  </span>
                  <span className="text-[9px] bg-sky-100 text-sky-800 px-1 py-0.5 rounded font-bold">طلبات 📋</span>
                </div>
                <p className="text-[10px] text-slate-600 font-mono select-all">staff@waffer.jo</p>
                <p className="text-[9px] text-slate-500 mt-0.5">الرمز: <span className="font-mono font-bold text-sky-700 select-all">staff123</span></p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center font-medium leading-relaxed">
              * للحفاظ على أمان الموقع، يرجى كتابة البريد وكلمة المرور الخاصة بك في خانات تسجيل الدخول أعلاه.
            </p>
          </div>
        </div>

        {/* 3. Guest Mode */}
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

      {/* ===================== GOOGLE SIGN IN MODAL ===================== */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
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
                <h3 className="text-base font-black text-slate-900">تسجيل الدخول وحفظ الحساب</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {googleError && (
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
                {googleError}
              </div>
            )}

            {/* Google Form */}
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  بريدك الإلكتروني:
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور للحساب <span className="text-red-600 font-bold">* (إجباري لحفظ وتأمين الدخول)</span>:
                </label>
                <input
                  type="password"
                  value={googlePassword}
                  onChange={(e) => setGooglePassword(e.target.value)}
                  placeholder="أدخل كلمة مرور لتأمين حسابك..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم الكامل <span className="text-red-600 font-bold">* (إجباري)</span>:
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف للتواصل <span className="text-red-600 font-bold">* (إجباري)</span>:
                </label>
                <input
                  type="tel"
                  value={googlePhone}
                  onChange={(e) => setGooglePhone(e.target.value)}
                  placeholder="0791234567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  required
                />
              </div>

              {/* Role Choice for Google Account */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  نوع الحساب الذي ترغب في الدخول به:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGoogleRole('customer')}
                    className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between cursor-pointer ${
                      googleRole === 'customer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      {googleRole === 'customer' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-xs font-bold block">حساب زبون</span>
                    <span className="text-[10px] text-slate-500">لشراء وتوفير الوجبات</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGoogleRole('store_owner')}
                    className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between cursor-pointer ${
                      googleRole === 'store_owner'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Store className="w-4 h-4 text-teal-600" />
                      {googleRole === 'store_owner' && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                    <span className="text-xs font-bold block">حساب تاجر</span>
                    <span className="text-[10px] text-slate-500">لإدارة المتجر والطلبات</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-[0.98] cursor-pointer"
              >
                متابعة وحفظ الحساب وكلمة المرور في الداتابيس 🔒
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

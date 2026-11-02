'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginAsGoogle, loginAsStaffOrAdmin, loginAsGuest } = useApp();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminRole, setAdminRole] = useState<'admin' | 'staff'>('admin');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    // Validation for demo/management login
    if (password.length < 4) {
      setErrorMessage('كلمة المرور يجب أن لا تقل عن 4 خانات');
      return;
    }

    loginAsStaffOrAdmin(email, adminRole);
  };

  return (
    <div className="flex flex-col min-h-[680px] h-full bg-slate-900 text-slate-100 p-6 relative justify-between overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="pt-6 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>منصة تقليل هدر الطعام في الأردن</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          تسجيل الدخول إلى <span className="text-emerald-400">وفّر</span>
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          انضم إلينا كزبون للاستفادة من العروض المخفضة، أو كمتجر لعرض فائض طعامك والحد من الهدر
        </p>
      </div>

      {/* Central Action Buttons */}
      <div className="flex flex-col gap-4 my-auto py-6 z-10 max-w-sm w-full mx-auto">
        {/* 1. Google Sign-in */}
        <button
          onClick={() => loginAsGoogle()}
          className="group relative flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm shadow-xl shadow-white/5 active:scale-[0.98] transition border border-slate-200"
        >
          {/* Google G Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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

        <div className="flex items-center gap-3 my-1">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[11px] text-slate-500 font-medium">أو خيارات الإدارة</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* 2. Email Login (Super Admin & Support Staff Only) */}
        <button
          onClick={() => {
            setShowAdminModal(true);
            setErrorMessage('');
          }}
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-2xl font-medium text-xs border border-slate-700/60 active:scale-[0.98] transition shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>المتابعة بواسطة البريد الإلكتروني (الإدارة والموظفين)</span>
        </button>
      </div>

      {/* 3. Guest Browsing at the bottom */}
      <div className="pt-4 border-t border-slate-800/80 text-center z-10 pb-2">
        <button
          onClick={loginAsGuest}
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition py-2 px-4 rounded-xl bg-emerald-950/40 border border-emerald-900/50"
        >
          <span>التصفح بدون حساب (كزائر)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <p className="text-[11px] text-slate-500 mt-2">
          يمكنك استعراض العروض والأسعار كزائر، ويتطلب إتمام الحجز تسجيل الدخول.
        </p>
      </div>

      {/* Admin / Staff Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-right">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                حساب مصرح للإدارة فقط
              </span>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">تسجيل دخول الإدارة والدعم</h3>
            <p className="text-xs text-slate-400 mb-4">
              تُنشأ هذه الحسابات وتُمنح صلاحياتها من خلال إدارة الموقع فقط ولا يوجد خيار لإنشاء حساب جديد.
            </p>

            {/* Role switch toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800">
              <button
                type="button"
                onClick={() => setAdminRole('admin')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                  adminRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                الأدمن الرئيسي
              </button>
              <button
                type="button"
                onClick={() => setAdminRole('staff')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                  adminRole === 'staff'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                موظف الشكاوى والتتبع
              </button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 mb-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  البريد الإلكتروني المعتمد
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={adminRole === 'admin' ? 'admin@waffer.jo' : 'support@waffer.jo'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 pl-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 pl-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 absolute left-3 top-3"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/40 transition active:scale-[0.98]"
                >
                  دخول لوحة التحكم
                </button>
              </div>

              {/* Demo quick fill button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(adminRole === 'admin' ? 'admin@waffer.jo' : 'staff@waffer.jo');
                    setPassword('123456');
                  }}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  ⚡ تعبئة بيانات تجريبية سريعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

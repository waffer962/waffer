'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { WafferLogo } from '@/components/ui/WafferLogo';

export const AdminLoginScreen: React.FC = () => {
  const { loginWithEmail, setCurrentScreen } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!password) {
      setErrorMessage('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await loginWithEmail(email, password);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء تسجيل الدخول، يرجى إعادة المحاولة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-8 min-h-screen relative">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
        
        {/* Top Bar with Back Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>العودة للرئيسية | Back</span>
          </button>

          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            منطقة الإدارة والعمليات
          </span>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Admin & Operations Login
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              تسجيل دخول المشرف العام وفريق العمليات والشكاوى
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              البريد الإلكتروني المعتمد (Email Address):
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@waffer.jo or staff@waffer.jo"
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white transition"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              كلمة المرور (Password):
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white transition"
                required
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
            disabled={isLoading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-2xl font-bold text-sm shadow-md transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'جاري التحقق من الصلاحيات...' : 'تسجيل الدخول | Login'}
          </button>
        </form>

        {/* Security Note */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            يتم التعرف تلقائياً على الصلاحيات وتوجيهك إلى لوحتك المخصصة.
          </p>
        </div>
      </div>
    </div>
  );
};

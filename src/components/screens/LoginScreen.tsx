'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Shield, ArrowRight, X, User, Check, Plus } from 'lucide-react';
import { WafferLogo } from '@/components/ui/WafferLogo';

export const LoginScreen: React.FC = () => {
  const { loginAsGuest, setCurrentScreen, setGoogleAuthUser, usersList, setCurrentUser, setCurrentUserRole } = useApp();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);

  // Quick Google Accounts for instant 1-click selection
  const handleSelectGoogleAccount = (email: string, name: string) => {
    setIsGoogleModalOpen(false);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user already exists in database with saved role
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing && (existing.role === 'customer' || existing.role === 'store_owner')) {
      const profile = {
        id: existing.id,
        email: existing.email,
        full_name: existing.full_name,
        phone: existing.phone,
        role: existing.role as 'customer' | 'store_owner'
      };
      setCurrentUser(profile);
      setCurrentUserRole(profile.role);
      try {
        localStorage.setItem('waffer_user_session_v1', JSON.stringify({ user: profile, role: profile.role }));
      } catch {}
      setCurrentScreen(profile.role === 'store_owner' ? 'store' : 'customer');
      return;
    }

    // 2. New Google user -> direct to Role Selection (Customer vs Store Owner)
    setGoogleAuthUser({
      id: `google-${Date.now()}`,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`
    });
    setCurrentScreen('role_select');
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    handleSelectGoogleAccount(customEmail, customName || customEmail.split('@')[0]);
  };

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

        {/* 1. Primary Action: Google Sign-In */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
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

      {/* ===================== GOOGLE ACCOUNT SELECTION MODAL ===================== */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Google Header */}
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
                <div className="text-right">
                  <h3 className="text-sm font-bold text-slate-900 leading-none">تسجيل الدخول باستخدام Google</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">للمتابعة إلى تطبيق وفّـر</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account List */}
            <div className="space-y-2">
              <p className="text-xs text-slate-600 text-right font-medium">اختر حساباً للمتابعة:</p>

              {/* Account 1: Mohammed */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('mohammed@gmail.com', 'محمد جميل')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition text-right cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    م
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">محمد جميل</span>
                    <span className="text-[11px] text-slate-400 font-mono">mohammed@gmail.com</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
              </button>

              {/* Account 2: Ahmad */}
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('ahmad@gmail.com', 'أحمد أمين')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition text-right cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    أ
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-700">أحمد أمين</span>
                    <span className="text-[11px] text-slate-400 font-mono">ahmad@gmail.com</span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
              </button>

              {/* Use Another Account Toggle */}
              {!isCustomInputOpen ? (
                <button
                  type="button"
                  onClick={() => setIsCustomInputOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition text-right cursor-pointer text-xs font-bold text-slate-600"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>استخدام حساب Google آخر...</span>
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 pt-2 border-t border-slate-100">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                    required
                    autoFocus
                  />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    متابعة بهذا الحساب
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

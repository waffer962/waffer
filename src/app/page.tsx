'use client';

import React from 'react';
import { AppProvider, useApp } from '@/lib/store/app-context';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { RoleSelectScreen } from '@/components/screens/RoleSelectScreen';
import { CustomerScreen } from '@/components/screens/CustomerScreen';
import { StoreScreen } from '@/components/screens/StoreScreen';
import { AdminScreen } from '@/components/screens/AdminScreen';
import { StaffScreen } from '@/components/screens/StaffScreen';
import {
  Sparkles,
  ShoppingBag,
  Store,
  ShieldAlert,
  LifeBuoy,
  Key,
  Layers
} from 'lucide-react';

function AppContent() {
  const { currentScreen, setCurrentScreen, setCurrentUserRole, currentUserRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Demo & Role Switcher Bar (Discreet and full-width on desktop) */}
      <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 z-50 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
            وفّر
          </div>
          <span className="font-bold text-white text-sm hidden sm:inline">
            مشروع وفّر (Waffer) 🇯🇴
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px] border-r border-slate-700 pr-2 mr-1">
            منصة تقليل هدر الطعام في الأردن
          </span>
        </div>

        {/* Quick Screen / Role Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-slate-400 text-[11px] font-medium hidden lg:inline ml-1">
            المعاينة السريعة للشاشات:
          </span>

          <button
            onClick={() => setCurrentScreen('splash')}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] ${
              currentScreen === 'splash'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            الافتتاح
          </button>

          <button
            onClick={() => setCurrentScreen('login')}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] ${
              currentScreen === 'login'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            تسجيل الدخول
          </button>

          <button
            onClick={() => setCurrentScreen('role_select')}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] ${
              currentScreen === 'role_select'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            نوع الحساب
          </button>

          <button
            onClick={() => {
              setCurrentUserRole('customer');
              setCurrentScreen('customer');
            }}
            className={`px-3 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1.5 ${
              currentScreen === 'customer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>واجهة الزبون</span>
          </button>

          <button
            onClick={() => {
              setCurrentUserRole('store_owner');
              setCurrentScreen('store');
            }}
            className={`px-3 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1.5 ${
              currentScreen === 'store'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>لوحة المتجر</span>
          </button>

          <button
            onClick={() => {
              setCurrentUserRole('admin');
              setCurrentScreen('admin');
            }}
            className={`px-3 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1.5 ${
              currentScreen === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>الأدمن</span>
          </button>

          <button
            onClick={() => {
              setCurrentUserRole('staff');
              setCurrentScreen('staff');
            }}
            className={`px-3 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1.5 ${
              currentScreen === 'staff'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>موظف الشكاوى</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Viewport: Full Width on Laptop/PC, Mobile Optimized on Phone */}
      <main className="flex-1 w-full flex flex-col">
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'role_select' && <RoleSelectScreen />}
        {currentScreen === 'customer' && <CustomerScreen />}
        {currentScreen === 'store' && <StoreScreen />}
        {currentScreen === 'admin' && <AdminScreen />}
        {currentScreen === 'staff' && <StaffScreen />}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

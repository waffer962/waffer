'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/store/app-context';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { RoleSelectScreen } from '@/components/screens/RoleSelectScreen';
import { CustomerScreen } from '@/components/screens/CustomerScreen';
import { StoreScreen } from '@/components/screens/StoreScreen';
import { AdminScreen } from '@/components/screens/AdminScreen';
import { StaffScreen } from '@/components/screens/StaffScreen';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Users,
  Store,
  ShoppingBag,
  ShieldAlert,
  LifeBuoy,
  Wifi,
  Battery,
  Sparkles
} from 'lucide-react';

function AppContent() {
  const { currentScreen, setCurrentScreen, setCurrentUserRole, currentUserRole } = useApp();
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative font-sans text-slate-100">
      
      {/* Top Testing & Presentation Switcher (Ideal for Graduation Defense & Demo) */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-40 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مشروع وفّر (Waffer) 🇯🇴</span>
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            منصة تقليل هدر الطعام في الأردن
          </span>
        </div>

        {/* Quick Role & Screen Switcher for Testing */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-slate-400 text-[11px] hidden md:inline ml-1 font-medium">
            شريط المعاينة السريعة:
          </span>

          <button
            onClick={() => setCurrentScreen('splash')}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] ${
              currentScreen === 'splash'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            الافتتاح
          </button>

          <button
            onClick={() => setCurrentScreen('login')}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] ${
              currentScreen === 'login'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            تسجيل الدخول
          </button>

          <button
            onClick={() => setCurrentScreen('role_select')}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] ${
              currentScreen === 'role_select'
                ? 'bg-emerald-600 text-white'
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
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1 ${
              currentScreen === 'customer'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>الزبون</span>
          </button>

          <button
            onClick={() => {
              setCurrentUserRole('store_owner');
              setCurrentScreen('store');
            }}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1 ${
              currentScreen === 'store'
                ? 'bg-teal-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Store className="w-3 h-3" />
            <span>المتجر</span>
          </button>

          <button
            onClick={() => {
              setCurrentUserRole('admin');
              setCurrentScreen('admin');
            }}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1 ${
              currentScreen === 'admin'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>الأدمن</span>
          </button>

          <button
            onClick={() => {
              setCurrentUserRole('staff');
              setCurrentScreen('staff');
            }}
            className={`px-2.5 py-1 rounded-lg transition font-bold text-[11px] flex items-center gap-1 ${
              currentScreen === 'staff'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LifeBuoy className="w-3 h-3" />
            <span>الموظف</span>
          </button>
        </div>

        {/* Viewport Mode Toggle (Mobile Mockup vs Full Screen) */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-[11px] transition"
            title="تبديل بين إطار الهاتف والعرض الكامل"
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>شاشة كاملة</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                <span>إطار هاتف</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 md:p-6">
        <div
          className={`w-full transition-all duration-300 bg-slate-950 ${
            isMobileFrame
              ? 'max-w-[430px] h-[100dvh] md:h-[880px] md:max-h-[92vh] md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-2xl md:ring-1 md:ring-slate-700/50 flex flex-col overflow-hidden relative'
              : 'max-w-4xl min-h-[85vh] rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative'
          }`}
        >
          {/* Mobile Status Bar Simulation (Visible on Mobile Frame) */}
          {isMobileFrame && (
            <div className="hidden md:flex justify-between items-center px-7 pt-3 pb-1 text-slate-400 text-[11px] font-mono z-30 select-none bg-slate-900/40">
              <span>9:41</span>
              {/* Dynamic Island / Speaker notch */}
              <div className="w-24 h-4 bg-slate-850 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-950 mr-2" />
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-slate-400" />
                <Battery className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          )}

          {/* Dynamic Active Screen */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
            {currentScreen === 'splash' && <SplashScreen />}
            {currentScreen === 'login' && <LoginScreen />}
            {currentScreen === 'role_select' && <RoleSelectScreen />}
            {currentScreen === 'customer' && <CustomerScreen />}
            {currentScreen === 'store' && <StoreScreen />}
            {currentScreen === 'admin' && <AdminScreen />}
            {currentScreen === 'staff' && <StaffScreen />}
          </div>
        </div>
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

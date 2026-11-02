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

function AppContent() {
  const { currentScreen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* Main Responsive Viewport: Clean, uncluttered real app without any top demo switcher */}
      <main className="flex-1 w-full flex flex-col">
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'customer' && <CustomerScreen />}
        {currentScreen === 'store' && <StoreScreen />}
        {currentScreen === 'admin' && <AdminScreen />}
        {currentScreen === 'staff' && <StaffScreen />}
        {currentScreen === 'role_select' && <RoleSelectScreen />}
        {currentScreen === 'splash' && <SplashScreen />}
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

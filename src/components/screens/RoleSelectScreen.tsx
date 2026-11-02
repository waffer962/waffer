'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { ShoppingBag, Store as StoreIcon, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const RoleSelectScreen: React.FC = () => {
  const { setCurrentScreen, setCurrentUserRole } = useApp();

  const handleSelectRole = (role: 'customer' | 'store_owner') => {
    setCurrentUserRole(role);
    if (role === 'customer') {
      setCurrentScreen('customer');
    } else {
      setCurrentScreen('store');
    }
  };

  return (
    <div className="flex flex-col min-h-[680px] h-full bg-slate-950 text-white p-6 justify-between relative overflow-y-auto select-none">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="text-center pt-4 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>خطوة أخيرة للبدء</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          كيف ترغب في استخدام <span className="text-emerald-400">وفّر</span>؟
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          اختر نوع حسابك لتخصيص التجربة بالكامل وفق احتياجاتك
        </p>
      </div>

      {/* Two Animated Cards */}
      <div className="flex flex-col gap-5 my-auto py-6 z-10 max-w-sm w-full mx-auto">
        {/* Card 1: Customer */}
        <button
          onClick={() => handleSelectRole('customer')}
          className="group relative flex flex-col items-start p-5 bg-gradient-to-br from-slate-900 to-slate-850 hover:from-emerald-950/60 hover:to-slate-900 border-2 border-slate-800 hover:border-emerald-500/80 rounded-3xl text-right transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold group-hover:translate-x-[-4px] transition">
              <span>دخول الزبون</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition">
            أنا زبون (أرغب بالتوفير)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            تصفح أشهى عروض المطاعم والمخابز بخصومات تصل إلى 70%، احجز واستلم نقدًا من المتجر مباشرة.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> توفير نفقات الطعام
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> فاتورة حجز رقمية
            </span>
          </div>
        </button>

        {/* Card 2: Store Owner */}
        <button
          onClick={() => handleSelectRole('store_owner')}
          className="group relative flex flex-col items-start p-5 bg-gradient-to-br from-slate-900 to-slate-850 hover:from-teal-950/60 hover:to-slate-900 border-2 border-slate-800 hover:border-teal-500/80 rounded-3xl text-right transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <StoreIcon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs text-teal-400 font-bold group-hover:translate-x-[-4px] transition">
              <span>واجهة المتجر</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal-300 transition">
            أنا صاحب متجر (مطعم / مخبز)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            سجّل متجرك لعرض الفائض الغذائي الصالح للاستهلاك، زِد مبيعاتك وتجنب خسائر الهدر بتنبيهات ذكية.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80">
              <CheckCircle2 className="w-3 h-3 text-teal-400" /> موافقة يدوية على كل حجز
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80">
              <CheckCircle2 className="w-3 h-3 text-teal-400" /> تنبيه عاجل للكميات الكبيرة
            </span>
          </div>
        </button>
      </div>

      {/* Footer Back Button */}
      <div className="text-center z-10 pt-2 pb-2">
        <button
          onClick={() => setCurrentScreen('login')}
          className="text-xs text-slate-400 hover:text-white transition"
        >
          ← العودة لشاشة تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

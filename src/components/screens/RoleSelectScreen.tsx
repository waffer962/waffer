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
    <div className="flex-1 w-full bg-slate-950 text-white p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="text-center pt-4 z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>خطوة أخيرة للبدء في المنصة</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          كيف ترغب في استخدام <span className="text-emerald-400">وفّر</span>؟
        </h2>
        <p className="text-xs sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          اختر نوع حسابك لتخصيص التجربة بالكامل وفق رغبتك (يمكنك التبديل لاحقاً بكل سهولة)
        </p>
      </div>

      {/* Two Animated Cards (Side-by-side on PC & Laptop, Stacked on Mobile) */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-8 z-10">
        {/* Card 1: Customer */}
        <button
          onClick={() => handleSelectRole('customer')}
          className="group relative flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-850 hover:from-emerald-950/60 hover:to-slate-900 border-2 border-slate-800 hover:border-emerald-500 rounded-3xl text-right transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 active:scale-[0.98] min-h-[260px]"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold group-hover:translate-x-[-6px] transition">
                <span>دخول واجهة الزبون</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-emerald-300 transition">
              أنا زبون (أرغب بالتوفير)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              تصفح أشهى عروض المطاعم والمخابز بخصومات تصل إلى 70%، احجز وجباتك واستلمها نقدًا من المتجر مباشرة.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> توفير نفقات الطعام
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> فاتورة حجز رقمية
            </span>
          </div>
        </button>

        {/* Card 2: Store Owner */}
        <button
          onClick={() => handleSelectRole('store_owner')}
          className="group relative flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-850 hover:from-teal-950/60 hover:to-slate-900 border-2 border-slate-800 hover:border-teal-500 rounded-3xl text-right transition-all duration-300 hover:shadow-2xl hover:shadow-teal-950/40 active:scale-[0.98] min-h-[260px]"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <StoreIcon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-teal-400 font-bold group-hover:translate-x-[-6px] transition">
                <span>دخول واجهة المتجر</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-teal-300 transition">
              أنا صاحب متجر (مطعم / مخبز)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              سجّل متجرك لعرض الفائض الغذائي الصالح للاستهلاك، زِد مبيعاتك وتجنب خسائر الهدر بتنبيهات ذكية وموافقة يدوية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> موافقة يدوية على كل حجز
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> تنبيه عاجل للكميات الكبيرة
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

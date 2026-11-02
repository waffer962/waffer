'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { WafferLogo } from '@/components/ui/WafferLogo';
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
    <div className="flex-1 w-full bg-slate-50 text-slate-900 p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden select-none min-h-screen">
      {/* Decorative ambient background */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Waffer Logo */}
      <div className="text-center pt-4 z-10 max-w-2xl mx-auto flex flex-col items-center">
        <WafferLogo size="md" showText={false} animated={true} className="mb-3" />
        
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100/80 border border-emerald-300 text-emerald-800 rounded-full text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>خطوة أخيرة للبدء في المنصة</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          كيف ترغب في استخدام <span className="text-emerald-600">وفّـر</span>؟
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          اختر نوع حسابك لتخصيص التجربة بالكامل وفق رغبتك (يمكنك التبديل لاحقاً بكل سهولة)
        </p>
      </div>

      {/* Two Animated Cards (Side-by-side on PC & Laptop, Stacked on Mobile) */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-8 z-10">
        {/* Card 1: Customer */}
        <button
          onClick={() => handleSelectRole('customer')}
          className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white hover:bg-emerald-50/40 border-2 border-slate-200 hover:border-emerald-500 rounded-3xl text-right transition-all duration-300 shadow-sm hover:shadow-xl active:scale-[0.98] min-h-[260px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-xs">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold group-hover:translate-x-[-6px] transition">
                <span>دخول واجهة الزبون</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition">
              أنا زبون (أرغب بالتوفير)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              تصفح أشهى عروض المطاعم والمخابز بأسعار مخفضة، احجز وجباتك واستلمها نقدًا من المتجر مباشرة ووفر مبالغ حقيقية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> توفير نفقات الطعام
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> فاتورة حجز رقمية
            </span>
          </div>
        </button>

        {/* Card 2: Store Owner */}
        <button
          onClick={() => handleSelectRole('store_owner')}
          className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white hover:bg-teal-50/40 border-2 border-slate-200 hover:border-teal-500 rounded-3xl text-right transition-all duration-300 shadow-sm hover:shadow-xl active:scale-[0.98] min-h-[260px] cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-xs">
                <StoreIcon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold group-hover:translate-x-[-6px] transition">
                <span>دخول واجهة المتجر</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 group-hover:text-teal-700 transition">
              أنا صاحب متجر (مطعم / مخبز)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              سجّل متجرك لعرض الفائض الغذائي الصالح للاستهلاك، زِد مبيعاتك وتجنب خسائر الهدر بتنبيهات ذكية وموافقة يدوية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> موافقة يدوية على كل حجز
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> تنبيه عاجل للكميات الكبيرة
            </span>
          </div>
        </button>
      </div>

      {/* Footer Back Button */}
      <div className="text-center z-10 pt-2 pb-2">
        <button
          onClick={() => setCurrentScreen('login')}
          className="text-xs text-slate-500 hover:text-emerald-700 font-bold transition cursor-pointer"
        >
          ← العودة لشاشة تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

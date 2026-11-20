'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { WafferLogo } from '@/components/ui/WafferLogo';
import { ShoppingBag, Store as StoreIcon, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
    <div className="flex-1 w-full bg-slate-50 text-slate-900 p-6 sm:p-12 flex flex-col justify-between select-none min-h-screen">
      {/* Top Header with Waffer Logo */}
      <div className="text-center pt-4 max-w-2xl mx-auto flex flex-col items-center">
        <WafferLogo size="md" showText={false} animated={false} className="mb-4" />
        
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          كيف ترغب في استخدام <span className="text-emerald-700">وفّـر</span>؟
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          اختر نوع حسابك لتخصيص التجربة بالكامل وفق احتياجاتك، مع إمكانية التبديل لاحقاً.
        </p>
      </div>

      {/* Two Role Selection Cards */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-8">
        {/* Card 1: Customer */}
        <button
          type="button"
          onClick={() => handleSelectRole('customer')}
          className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white border border-slate-200 hover:border-emerald-600 rounded-2xl text-right transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.99] min-h-[260px] cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center transition">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold group-hover:translate-x-[-4px] transition">
                <span>واجهة الزبون</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition">
              حساب زبون (توفير وجبات)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              تصفح عروض المطاعم والمخابز بأسعار مخفضة، احجز وجبتك واستلمها نقدًا من المتجر مباشرة.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> توفير نفقات الطعام
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> فاتورة حجز رقمية معتمدة
            </span>
          </div>
        </button>

        {/* Card 2: Store Owner */}
        <button
          type="button"
          onClick={() => handleSelectRole('store_owner')}
          className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white border border-slate-200 hover:border-emerald-600 rounded-2xl text-right transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.99] min-h-[260px] cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-5">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition">
                <StoreIcon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold group-hover:translate-x-[-4px] transition">
                <span>واجهة المتجر</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition">
              حساب شريك (مطعم / مخبز)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              سجّل متجرك لعرض الفائض الغذائي الصالح للاستهلاك، زِد مبيعاتك وتجنب خسائر الهدر بتنبيهات فورية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> موافقة على الحجوزات
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> تنبيه فوري للكميات الكبيرة
            </span>
          </div>
        </button>
      </div>

      {/* Footer Back Button */}
      <div className="text-center pt-2 pb-2">
        <button
          type="button"
          onClick={() => setCurrentScreen('login')}
          className="text-xs text-slate-500 hover:text-slate-900 font-bold transition cursor-pointer"
        >
          ← العودة لشاشة تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

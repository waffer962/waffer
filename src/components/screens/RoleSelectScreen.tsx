'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { WafferLogo } from '@/components/ui/WafferLogo';
import {
  ShoppingBag,
  Store as StoreIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const RoleSelectScreen: React.FC = () => {
  const { googleAuthUser, completeGoogleRegistration, setCurrentScreen } = useApp();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'store_owner' | null>(null);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!selectedRole) {
      setError('يرجى تحديد نوع الحساب للمتابعة');
      return;
    }

    if (selectedRole === 'customer' && phone.trim() && phone.trim().length < 9) {
      setError('يرجى إدخال رقم هاتف صحيح (مثال: 0791234567)');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await completeGoogleRegistration(selectedRole, phone);
    } catch {
      setError('حدث خطأ أثناء حفظ نوع الحساب، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-900 p-4 sm:p-8 flex flex-col justify-between min-h-screen select-none">
      
      {/* Top Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between pt-2 pb-4">
        <button
          type="button"
          onClick={() => setCurrentScreen('login')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع | Back</span>
        </button>

        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
          الخطوة 2: تحديد نوع الحساب
        </span>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl w-full mx-auto my-auto space-y-6 py-4">
        
        {/* Title & Google User Badge */}
        <div className="text-center space-y-3">
          <WafferLogo size="sm" showText={false} animated={false} className="mx-auto" />

          {/* Authenticated Google Account Pill */}
          {googleAuthUser && (
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full shadow-xs text-xs">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span className="text-slate-600 font-medium">مرحباً بك:</span>
              <span className="font-bold text-slate-900">{googleAuthUser.name}</span>
              <span className="text-slate-400 font-mono text-[11px]">({googleAuthUser.email})</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                موثق
              </span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            اختر نوع حسابك في <span className="text-emerald-600">وفّـر</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            يجب تحديد نوع الحساب لتهيئة لوحة التحكم والبدء فوراً. يمكنك تعديل الخيار في أي وقت.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="max-w-md mx-auto p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Two Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Option 1: Customer */}
          <div
            onClick={() => setSelectedRole('customer')}
            className={`relative flex flex-col justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${
              selectedRole === 'customer'
                ? 'bg-emerald-50/40 border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between w-full mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                    selectedRole === 'customer'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <ShoppingBag className="w-6 h-6" />
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    selectedRole === 'customer'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedRole === 'customer' && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1.5">
                حساب زبون (Customer)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                تصفح العروض اليومية، احجز وجباتك بأسعار مخفضة أو مجانية، واستلمها نقدًا من المتجر مباشرة.
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                توفير حتى 70% على وجبات المخابز والمطاعم
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                كود حجز فوري معتمد بدون دفع إلكتروني مسبق
              </span>
            </div>
          </div>

          {/* Option 2: Store Owner */}
          <div
            onClick={() => setSelectedRole('store_owner')}
            className={`relative flex flex-col justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${
              selectedRole === 'store_owner'
                ? 'bg-emerald-50/40 border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between w-full mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                    selectedRole === 'store_owner'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <StoreIcon className="w-6 h-6" />
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    selectedRole === 'store_owner'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedRole === 'store_owner' && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1.5">
                حساب صاحب متجر (Store Owner)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                سجّل متجرك لعرض الفائض الغذائي الصالح للاستهلاك، زِد مبيعاتك وتجنب خسائر الهدر بتنبيهات فورية.
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                إدارة الوجبات والأسعار المخفضة والمجانية
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                تنبيهات صوتية وفورية للطلبات الكبيرة (&gt;50%)
              </span>
            </div>
          </div>
        </div>

        {/* Customer Contact Phone (Optional/Convenience) */}
        {selectedRole === 'customer' && (
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-4 space-y-2 animate-in fade-in duration-200">
            <label className="block text-xs font-bold text-slate-700">
              رقم الهاتف للتواصل وتأكيد الحجز عند الاستلام:
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0791234567"
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 pl-10 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition font-mono"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400">
              * تم ربط بريدك واسمك تلقائياً بواسطة Google دون الحاجة لكلمة مرور.
            </p>
          </div>
        )}

        {/* Continue & Back Buttons */}
        <div className="max-w-md mx-auto space-y-3 pt-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'جاري حفظ الحساب وتوجيهك...' : 'المتابعة والدخول إلى المنصة'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('login')}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition cursor-pointer text-center"
          >
            ← العودة لشاشة تسجيل الدخول
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className="text-center pt-2 pb-2">
        <p className="text-[11px] text-slate-400">
          يتم حفظ نوع حسابك في قاعدة البيانات وتوجيهك إليه تلقائياً في الزيارات القادمة.
        </p>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { WafferLogo } from '@/components/ui/WafferLogo';
import {
  ShoppingBag,
  Store as StoreIcon,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Phone,
  Loader2,
  Sparkles
} from 'lucide-react';

export const RoleSelectScreen: React.FC = () => {
  const { googleAuthUser, completeGoogleRegistration, setCurrentScreen } = useApp();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'store_owner'>('customer');
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
    <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto">
      
      {/* Sized perfectly for mobile screens (iPhone, Galaxy) & desktop */}
      <div className="w-full max-w-md mx-auto flex flex-col my-auto space-y-4 py-2">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={() => setCurrentScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/90 active:bg-slate-100 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>رجوع</span>
          </button>

          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-lg">
            الخطوة 2 من 2
          </span>
        </div>

        {/* Brand & Google Account Verified Pill */}
        <div className="text-center space-y-2 pt-1">
          <WafferLogo size="sm" showText={false} animated={false} className="mx-auto" />

          {/* User Verified Pill */}
          {googleAuthUser && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200/90 rounded-full shadow-2xs text-xs max-w-full">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span className="font-bold text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">
                {googleAuthUser.name}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                موثق
              </span>
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              كيف ترغب في استخدام <span className="text-emerald-600">وفّـر</span>؟
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              اختر نوع الحساب ليتم توجيهك فوراً للواجهة المخصصة لاحتياجاتك
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Role Cards: Mobile App Native Architecture */}
        <div className="space-y-3 pt-1">
          
          {/* Option 1: Customer Card */}
          <div
            onClick={() => setSelectedRole('customer')}
            className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-right active:scale-[0.99] ${
              selectedRole === 'customer'
                ? 'bg-emerald-50/60 border-emerald-600 shadow-sm ring-1 ring-emerald-600/20'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition ${
                  selectedRole === 'customer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black text-slate-900">حساب زبون</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded shrink-0">
                    خصم حتى 70%
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug mt-1">
                  حجز وجبات الفائض الطازجة وتوفير ميزانية الطعام
                </p>
              </div>
            </div>

            {/* Checkmark Circle */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ms-3 ${
                selectedRole === 'customer'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedRole === 'customer' && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Option 2: Store Owner Card */}
          <div
            onClick={() => setSelectedRole('store_owner')}
            className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-right active:scale-[0.99] ${
              selectedRole === 'store_owner'
                ? 'bg-emerald-50/60 border-emerald-600 shadow-sm ring-1 ring-emerald-600/20'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition ${
                  selectedRole === 'store_owner'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <StoreIcon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black text-slate-900">صاحب متجر (شريك)</h3>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    مطعم / مخبز
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug mt-1">
                  عرض الفائض اليومي، إدارة الطلبات، والحد من الهدر
                </p>
              </div>
            </div>

            {/* Checkmark Circle */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ms-3 ${
                selectedRole === 'store_owner'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedRole === 'store_owner' && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Customer Phone Input Field */}
        {selectedRole === 'customer' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                رقم الهاتف للتواصل وتأكيد الحجز:
              </label>
              <span className="text-[10px] text-slate-400">اختياري</span>
            </div>
            
            <div className="relative flex items-center">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0791234567"
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 pl-10 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition font-mono"
              />
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none text-[11px] font-bold text-slate-500">
                <span>🇯🇴</span>
                <span>962+</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed pt-0.5">
              يُستخدم رقم هاتفك فقط لإرسال تفاصيل كود الحجز وتسهيل استلام الوجبة.
            </p>
          </div>
        )}

        {/* Store Owner Quick Note */}
        {selectedRole === 'store_owner' && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-800 space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>مرحباً بك كشريك في منصة وفّـر</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              ستتمكن فور الدخول من تسجيل بيانات متجرك أو فرعك والبدء في نشر عروض الفائض اليومية واستقبال الحجوزات فوراً.
            </p>
          </div>
        )}

        {/* Continue Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full h-12 sm:h-13 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تهيئة الحساب...</span>
              </>
            ) : (
              <>
                <span>المتابعة والدخول إلى وفّـر</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Session Note */}
      <div className="text-center pb-2 pt-2">
        <p className="text-[11px] text-slate-400">
          يتم حفظ نوع حسابك تلقائياً لتدخل مباشرة في المرات القادمة بدون إعادة الاختيار.
        </p>
      </div>
    </div>
  );
};

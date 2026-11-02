'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Store, Offer, Reservation } from '@/types';
import { JORDAN_GOVERNORATES } from '@/lib/mock-data';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Tag,
  Bell,
  BarChart3,
  Settings,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  RotateCcw,
  Store as StoreIcon,
  LogOut,
  Sparkles,
  TrendingUp,
  Coins
} from 'lucide-react';

export const StoreScreen: React.FC = () => {
  const {
    stores,
    currentStore,
    addStore,
    offers,
    addOffer,
    toggleOfferActive,
    deleteOffer,
    republishOffer,
    reservations,
    updateReservationStatus,
    hasPendingUrgentOrders,
    urgentOrdersCount,
    isUrgentSoundMuted,
    setIsUrgentSoundMuted,
    notifications,
    updateStoreDetails,
    setCurrentScreen,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'add_offer' | 'orders' | 'my_offers' | 'notifications' | 'stats' | 'settings'
  >('dashboard');

  // New Store Registration Form State
  const [isRegisteringStore, setIsRegisteringStore] = useState(!currentStore);
  const [storeName, setStoreName] = useState('');
  const [storeLogo, setStoreLogo] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80');
  const [governorate, setGovernorate] = useState('عمان');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('0791234567');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [storeType, setStoreType] = useState<Store['store_type']>('مخبز');
  const [description, setDescription] = useState('');
  const [workingDays, setWorkingDays] = useState('يومياً');
  const [workingHours, setWorkingHours] = useState('08:00 ص - 11:00 م');
  const [ownerName, setOwnerName] = useState('أحمد الخالد');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // New Offer Form State
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCategory, setOfferCategory] = useState('مخابز ومعجنات');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerImage, setOfferImage] = useState('https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80');
  const [originalPrice, setOriginalPrice] = useState(5.0);
  const [discountedPrice, setDiscountedPrice] = useState(2.25);
  const [quantity, setQuantity] = useState(10);
  const [pickupStart, setPickupStart] = useState('19:00');
  const [pickupEnd, setPickupEnd] = useState('22:30');
  const [offerSuccessMsg, setOfferSuccessMsg] = useState('');

  // Handle Store Registration
  const handleRegisterStore = (e: React.FormEvent) => {
    e.preventDefault();
    addStore({
      name: storeName,
      logo_url: storeLogo,
      governorate,
      area,
      phone,
      phone_secondary: phoneSecondary || undefined,
      store_type: storeType,
      description,
      working_days: workingDays,
      working_hours: workingHours,
      owner_name: ownerName,
      is_accepting_orders: true
    });
    setRegisteredSuccess(true);
  };

  // Handle Add Offer
  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStore) return;

    addOffer({
      store_id: currentStore.id,
      store_name: currentStore.name,
      store_logo: currentStore.logo_url,
      store_location: `${currentStore.governorate} - ${currentStore.area}`,
      store_phone: currentStore.phone,
      title: offerTitle,
      description: offerDescription,
      image_url: offerImage,
      original_price: Number(originalPrice),
      discounted_price: Number(discountedPrice),
      quantity_available: Number(quantity),
      initial_quantity: Number(quantity),
      pickup_start: pickupStart,
      pickup_end: pickupEnd,
      category: offerCategory,
      is_active: true
    });

    setOfferSuccessMsg('تمت إضافة العرض بنجاح وهو الآن متاح للزبائن!');
    setOfferTitle('');
    setOfferDescription('');
    setTimeout(() => {
      setOfferSuccessMsg('');
      setActiveTab('my_offers');
    }, 1500);
  };

  // Stats calculation
  const completedOrders = reservations.filter((r) => r.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, r) => sum + r.total_price, 0);
  const pendingReservations = reservations.filter((r) => r.status === 'pending');
  const storeOffers = offers.filter((o) => currentStore ? o.store_id === currentStore.id : true);

  // If in registration mode or store is pending approval
  if (isRegisteringStore) {
    return (
      <div className="flex flex-col min-h-[680px] h-full bg-slate-950 text-white p-5 overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <StoreIcon className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm text-white">تسجيل متجر جديد في وفّر</h3>
          </div>
          <button
            onClick={() => setCurrentScreen('role_select')}
            className="text-xs text-slate-400 hover:text-white"
          >
            إلغاء
          </button>
        </div>

        {registeredSuccess ? (
          <div className="text-center py-12 space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto text-2xl animate-bounce">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">تم إرسال طلب المتجر للإدارة بنجاح</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              يقوم الأدمن الرئيسي بمراجعة وثائق المتجر واعتماده لتتمكن من البدء بنشر عروض الطعام الفائض فوراً.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setIsRegisteringStore(false)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition"
              >
                الدخول للوحة التحكم التجريبية
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterStore} className="space-y-3 py-4 text-xs">
            <p className="text-xs text-slate-400 mb-2">
              أدخل بيانات متجرك كاملة لربطه بالمنصة وتمكينك من بيع الفائض الغذائي الصالح للاستهلاك.
            </p>

            <div>
              <label className="block text-slate-300 font-medium mb-1">اسم المتجر (المخبز أو المطعم):</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="مثال: مخابز الريان الحديثة"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">نوع المتجر:</label>
                <select
                  value={storeType}
                  onChange={(e) => setStoreType(e.target.value as Store['store_type'])}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="مخبز">مخبز ومعجنات</option>
                  <option value="مطعم">مطعم شرقي / غربي</option>
                  <option value="وجبات سريعة">وجبات سريعة</option>
                  <option value="حلويات">حلويات</option>
                  <option value="سوبرماركت">سوبرماركت / بقالة</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">اسم مالك المتجر:</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="الاسم الكامل للمالك"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">المحافظة:</label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  {JORDAN_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">المنطقة والحي:</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="مثال: الجبيهة، شارع البلدية"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">رقم الهاتف الأساسي:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="079xxxxxxx"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white dir-ltr text-right focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">رقم هاتف ثانٍ (اختياري):</label>
                <input
                  type="tel"
                  value={phoneSecondary}
                  onChange={(e) => setPhoneSecondary(e.target.value)}
                  placeholder="06xxxxxxx"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white dir-ltr text-right focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">وصف المتجر وطبيعة منتجاته:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="نبذة عن المخبز أو المطعم والأطعمة التي يقدمها"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-teal-900/30 transition active:scale-[0.98]"
              >
                إرسال الطلب إلى الإدارة للاعتماد
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[680px] h-full bg-slate-950 text-slate-100 relative pb-16 overflow-y-auto select-none">
      
      {/* Top Urgent Alert Banner (>50% Large Order Requirement) */}
      {hasPendingUrgentOrders && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-red-650 via-red-600 to-rose-700 text-white px-4 py-2.5 flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />
            <span>
              ⚠️ تنبيه عاجل: لديك {urgentOrdersCount} طلب كمية كبيرة (&gt; 50%) بانتظار ردك الفوري!
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsUrgentSoundMuted(!isUrgentSoundMuted)}
              className="p-1 rounded-lg bg-red-800/80 hover:bg-red-850 text-white text-xs"
              title={isUrgentSoundMuted ? 'تشغيل صوت التنبيه' : 'كتم صوت التنبيه'}
            >
              {isUrgentSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="px-2.5 py-1 bg-white text-red-700 rounded-lg text-xs font-black shadow transition active:scale-95"
            >
              الرد الآن
            </button>
          </div>
        </div>
      )}

      {/* Store Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img
            src={currentStore?.logo_url}
            alt={currentStore?.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <h4 className="font-bold text-xs text-white">{currentStore?.name || 'متجري'}</h4>
            <span className="text-[10px] text-teal-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              لوحة تحكم المتجر المعتمد
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('add_offer')}
            className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة عرض</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-900/60 border-b border-slate-800 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium relative ${
            activeTab === 'orders' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          الطلبات
          {pendingReservations.length > 0 && (
            <span className="mr-1.5 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {pendingReservations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('my_offers')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'my_offers' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          عروضي ({storeOffers.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'stats' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          الإحصائيات
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'settings' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          الإعدادات
        </button>
      </div>

      {/* Main Container */}
      <div className="p-4 space-y-4">
        
        {/* ===================== TAB 1: DASHBOARD ===================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[11px] text-slate-400 block mb-1">طلبات بانتظار الرد</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-amber-400">{pendingReservations.length}</span>
                  <span className="text-[10px] text-amber-500/80 font-bold">تحتاج موافقتك</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[11px] text-slate-400 block mb-1">العروض النشطة</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-teal-400">
                    {storeOffers.filter((o) => o.is_active).length}
                  </span>
                  <span className="text-[10px] text-teal-500/80 font-bold">معروضة للزبائن</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[11px] text-slate-400 block mb-1">إجمالي الحجوزات</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-white">{reservations.length}</span>
                  <span className="text-[10px] text-slate-400 font-bold">طلب حجز</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <span className="text-[11px] text-slate-400 block mb-1">المبيعات المستلمة نقدًا</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-emerald-400">{totalRevenue.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">د.أ</span>
                </div>
              </div>
            </div>

            {/* Pending Requests Highlight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>الطلبات الجديدة الواردة (تحتاج موافقة المتجر)</span>
                </h4>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[11px] text-teal-400 hover:underline"
                >
                  عرض الكل
                </button>
              </div>

              {pendingReservations.length === 0 ? (
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                  لا توجد طلبات جديدة بانتظار الموافقة حالياً 👍
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingReservations.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-white block">{r.customer_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{r.booking_code}</span>
                        </div>
                        {r.is_large_order && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
                            طلب كبير &gt; 50% 🔥
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between text-slate-300 text-[11px] bg-slate-950 p-2 rounded-xl">
                        <span>{r.offer_title} ({r.quantity} قطع)</span>
                        <span className="font-bold text-emerald-400">{r.total_price.toFixed(2)} د.أ</span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => updateReservationStatus(r.id, 'confirmed')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                        >
                          قبول الطلب
                        </button>
                        <button
                          onClick={() => updateReservationStatus(r.id, 'rejected')}
                          className="py-1.5 px-3 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-900/60 rounded-xl text-xs font-bold transition"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ADD OFFER ===================== */}
        {activeTab === 'add_offer' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>إضافة إعلان بيع طعام فائض جديد</span>
            </h3>

            {offerSuccessMsg && (
              <div className="p-3 bg-teal-950/60 border border-teal-800 rounded-2xl text-teal-300 text-xs text-center font-bold">
                {offerSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAddOffer} className="space-y-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">اسم الوجبة أو السلة:</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="مثال: سلة معجنات مشكلة ومخبوزات المساء"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">تصنيف الطعام:</label>
                <select
                  value={offerCategory}
                  onChange={(e) => setOfferCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="مخابز ومعجنات">مخابز ومعجنات</option>
                  <option value="وجبات ومطاعم">وجبات ومطاعم شرقية</option>
                  <option value="وجبات سريعة">وجبات سريعة (برجر، شاورما)</option>
                  <option value="حلويات">حلويات شرقية وغربية</option>
                  <option value="سوبرماركت">سوبرماركت ومواد غذائية</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">وصف المنتج والمكونات:</label>
                <textarea
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  rows={2}
                  placeholder="محتويات السلة وصلاحيتها للاستهلاك الفوري"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">السعر الأصلي (د.أ):</label>
                  <input
                    type="number"
                    step="0.25"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-bold mb-1">السعر المخفض (د.أ):</label>
                  <input
                    type="number"
                    step="0.25"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">الكمية المتوفرة للبيع:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  إذا حجز الزبون أكثر من 50% من هذه الكمية، سيتفعل التنبيه العاجل والمتكرر تلقائياً.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">بداية وقت الاستلام:</label>
                  <input
                    type="time"
                    value={pickupStart}
                    onChange={(e) => setPickupStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">نهاية وقت الاستلام:</label>
                  <input
                    type="time"
                    value={pickupEnd}
                    onChange={(e) => setPickupEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-md transition"
                >
                  نشر العرض في الموقع
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================== TAB 3: ORDERS ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-teal-400" />
                <span>إدارة طلبات الحجز الواردة</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">({reservations.length} طلب)</span>
            </h3>

            <div className="space-y-3">
              {reservations.map((res) => {
                const isPending = res.status === 'pending';
                const isConfirmed = res.status === 'confirmed';
                const isCompleted = res.status === 'completed';

                return (
                  <div
                    key={res.id}
                    className={`p-3.5 bg-slate-900 border rounded-2xl space-y-2.5 text-xs transition ${
                      res.is_large_order && isPending
                        ? 'border-red-500 shadow-md shadow-red-500/10'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{res.customer_name}</span>
                          <span className="text-slate-400 font-mono text-[11px]">({res.booking_code})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 dir-ltr text-right mt-0.5">{res.customer_phone}</p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isConfirmed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isPending
                            ? 'bg-amber-500/20 text-amber-400'
                            : isCompleted
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {isConfirmed
                          ? 'موافق عليه'
                          : isPending
                          ? 'بانتظار الموافقة'
                          : isCompleted
                          ? 'تم التسليم'
                          : 'مرفوض'}
                      </span>
                    </div>

                    {res.is_large_order && (
                      <div className="p-2 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-[11px] font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                        <span>طلب كمية كبيرة تتجاوز 50% من الوجبات المعروضة!</span>
                      </div>
                    )}

                    <div className="p-2.5 bg-slate-950 rounded-xl text-slate-300 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>{res.offer_title}</span>
                        <span className="font-bold text-white">الكمية: {res.quantity}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>المبلغ الإجمالي (نقدًا):</span>
                        <span className="font-bold text-emerald-400">{res.total_price.toFixed(2)} د.أ</span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-0.5">
                        موعد الحضور: <span className="text-white">{res.expected_arrival}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {isPending && (
                        <>
                          <button
                            onClick={() => updateReservationStatus(res.id, 'confirmed')}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition"
                          >
                            موافقة على الحجز
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res.id, 'rejected')}
                            className="py-2 px-3 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900 rounded-xl font-bold text-xs transition"
                          >
                            رفض
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'completed')}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم التسليم واستلام المبلغ نقدًا 💵</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: MY OFFERS ===================== */}
        {activeTab === 'my_offers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-teal-400" />
                <span>إدارة العروض المنشورة</span>
              </h3>
              <button
                onClick={() => setActiveTab('add_offer')}
                className="text-xs text-teal-400 font-bold hover:underline"
              >
                + إضافة عرض جديد
              </button>
            </div>

            <div className="space-y-3">
              {storeOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-2.5 text-xs"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${offer.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <h5 className="font-bold text-white truncate">{offer.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        متبقي {offer.quantity_available} من {offer.initial_quantity} • السعر {offer.discounted_price.toFixed(2)} د.أ
                      </p>
                      <span className="text-[10px] text-teal-400 font-medium">استلام: {offer.pickup_start} - {offer.pickup_end}</span>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <button
                      onClick={() => toggleOfferActive(offer.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition ${
                        offer.is_active
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {offer.is_active ? 'إيقاف مؤقت' : 'تفعيل العرض'}
                    </button>

                    <button
                      onClick={() => republishOffer(offer.id)}
                      className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-bold px-2 py-1 rounded-lg bg-teal-950/40"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>إعادة نشر العرض</span>
                    </button>

                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="text-red-400 hover:text-red-300 px-2 py-1"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: STATS ===================== */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>السجل والإحصائيات</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-slate-400 block mb-1">الطلبات المكتملة</span>
                <span className="text-2xl font-black text-emerald-400">{completedOrders.length}</span>
                <span className="text-[10px] text-slate-500 block mt-1">تم تسليمها واستلام قيمتها</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-slate-400 block mb-1">إجمالي المبيعات المستلمة</span>
                <span className="text-2xl font-black text-teal-400">{totalRevenue.toFixed(2)} د.أ</span>
                <span className="text-[10px] text-slate-500 block mt-1">نقدًا عند الاستلام</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-slate-400 block mb-1">وجبات تم إنقاذها</span>
                <span className="text-2xl font-black text-amber-400">
                  {completedOrders.reduce((sum, r) => sum + r.quantity, 0)} وجبة 🌱
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">تقليل مباشر للهدر</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-slate-400 block mb-1">زبائن لم يحضروا</span>
                <span className="text-2xl font-black text-slate-400">0</span>
                <span className="text-[10px] text-slate-500 block mt-1">نسبة التزام 100%</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-teal-400" />
              <span>إعدادات المتجر</span>
            </h3>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <span className="font-bold text-white block">استقبال الحجوزات</span>
                  <span className="text-[11px] text-slate-400">تشغيل أو إيقاف استقبال الطلبات مؤقتاً</span>
                </div>
                <button
                  onClick={() =>
                    currentStore &&
                    updateStoreDetails(currentStore.id, {
                      is_accepting_orders: !currentStore.is_accepting_orders
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl font-bold ${
                    currentStore?.is_accepting_orders
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentStore?.is_accepting_orders ? 'مفعل' : 'موقف'}
                </button>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">اسم المتجر:</span>
                <p className="font-bold text-white">{currentStore?.name}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">الموقع:</span>
                <p className="font-bold text-white">{currentStore?.governorate} - {currentStore?.area}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">رقم الهاتف:</span>
                <p className="font-bold text-white dir-ltr text-right">{currentStore?.phone}</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => setCurrentScreen('role_select')}
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 transition"
              >
                تبديل الدور (واجهة الزبون أو الإدارة)
              </button>

              <button
                onClick={logout}
                className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 rounded-xl text-xs font-bold text-red-400 transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

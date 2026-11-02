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
  Coins,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
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
    'dashboard' | 'add_offer' | 'orders' | 'my_offers' | 'stats' | 'settings'
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

    setOfferSuccessMsg('تمت إضافة العرض بنجاح وهو الآن معروض للزبائن!');
    setOfferTitle('');
    setOfferDescription('');
    setTimeout(() => {
      setOfferSuccessMsg('');
      setActiveTab('my_offers');
    }, 1200);
  };

  // Stats calculation
  const completedOrders = reservations.filter((r) => r.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, r) => sum + r.total_price, 0);
  const pendingReservations = reservations.filter((r) => r.status === 'pending');
  const storeOffers = offers.filter((o) => currentStore ? o.store_id === currentStore.id : true);

  if (isRegisteringStore) {
    return (
      <div className="flex-1 w-full bg-slate-950 text-white flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <StoreIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">تسجيل متجر جديد في وفّر</h3>
                <p className="text-xs text-slate-400">انضم لأصحاب المتاجر والمخابز وساهم في تقليل الهدر وزيادة المبيعات</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentScreen('role_select')}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          {registeredSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto text-3xl animate-bounce">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">تم إرسال طلب المتجر للإدارة بنجاح!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                يقوم الأدمن الرئيسي بمراجعة وثائق المتجر واعتماده لتتمكن من البدء بنشر عروض الطعام الفائض فوراً.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setIsRegisteringStore(false)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-teal-950/50"
                >
                  الدخول للوحة التحكم التجريبية للمتجر
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterStore} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم المتجر (المخبز أو المطعم):</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="مثال: مخابز الريان الحديثة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">نوع المتجر:</label>
                  <select
                    value={storeType}
                    onChange={(e) => setStoreType(e.target.value as Store['store_type'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="مخبز">مخبز ومعجنات</option>
                    <option value="مطعم">مطعم شرقي / غربي</option>
                    <option value="وجبات سريعة">وجبات سريعة</option>
                    <option value="حلويات">حلويات</option>
                    <option value="سوبرماركت">سوبرماركت / بقالة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم مالك المتجر:</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="الاسم الكامل للمالك"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">المحافظة:</label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    {JORDAN_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المنطقة والحي:</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="مثال: الجبيهة، شارع البلدية"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم الهاتف الأساسي:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="079xxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white dir-ltr text-right focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم هاتف ثانٍ (اختياري):</label>
                  <input
                    type="tel"
                    value={phoneSecondary}
                    onChange={(e) => setPhoneSecondary(e.target.value)}
                    placeholder="06xxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white dir-ltr text-right focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">وصف المتجر وطبيعة منتجاته:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="نبذة عن المخبز أو المطعم والأطعمة التي يقدمها"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-teal-950/60 transition active:scale-[0.98]"
                >
                  إرسال الطلب إلى الإدارة للاعتماد
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-950 text-slate-100 flex flex-col pb-16">
      
      {/* Top Urgent Alert Banner (>50% Large Order Requirement) */}
      {hasPendingUrgentOrders && (
        <div className="w-full bg-gradient-to-r from-red-650 via-red-600 to-rose-700 text-white px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-300 animate-bounce" />
            <span>
              ⚠️ تنبيه عاجل: لديك {urgentOrdersCount} طلب كمية كبيرة تتجاوز 50% من المعروض بانتظار ردك الفوري!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUrgentSoundMuted(!isUrgentSoundMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-800/80 hover:bg-red-850 text-white text-xs font-bold transition"
            >
              {isUrgentSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isUrgentSoundMuted ? 'تشغيل الصوت' : 'كتم الصوت'}</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="px-4 py-1.5 bg-white text-red-700 rounded-xl text-xs font-black shadow-md transition active:scale-95"
            >
              مراجعة الطلبات العاجلة
            </button>
          </div>
        </div>
      )}

      {/* Store Header Full Width */}
      <div className="w-full bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentStore?.logo_url}
              alt={currentStore?.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">{currentStore?.name || 'متجري'}</h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                  متجر معتمد ✅
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentStore?.governorate} - {currentStore?.area} • {currentStore?.store_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('add_offer')}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-950/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة عرض جديد</span>
            </button>
          </div>
        </div>

        {/* Store Navigation Bar Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-bold border-t border-slate-850 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition relative ${
              activeTab === 'orders' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            الطلبات الواردة
            {pendingReservations.length > 0 && (
              <span className="mr-2 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {pendingReservations.length} جديد
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('my_offers')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'my_offers' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            عروضي ({storeOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'stats' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            السجل والإحصائيات
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'settings' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            إعدادات المتجر
          </button>
        </div>
      </div>

      {/* Main Container Full Width on Laptop / Desktop */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* ===================== TAB 1: DASHBOARD ===================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 4 Wide KPI Cards in a Row on Laptop/PC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm">
                <span className="text-slate-400 block mb-1">طلبات بانتظار الرد</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-amber-400">{pendingReservations.length}</span>
                  <span className="text-xs text-amber-500/90 font-bold">تحتاج موافقتك</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm">
                <span className="text-slate-400 block mb-1">العروض النشطة الحالية</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-teal-400">
                    {storeOffers.filter((o) => o.is_active).length}
                  </span>
                  <span className="text-xs text-teal-400/90 font-bold">معروضة للزبائن</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm">
                <span className="text-slate-400 block mb-1">إجمالي الحجوزات</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-white">{reservations.length}</span>
                  <span className="text-xs text-slate-400 font-bold">طلب حجز</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm">
                <span className="text-slate-400 block mb-1">المبيعات المستلمة نقدًا</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-emerald-400">{totalRevenue.toFixed(2)}</span>
                  <span className="text-xs text-emerald-400 font-bold">دينار أردني</span>
                </div>
              </div>
            </div>

            {/* Pending Requests Table / Cards on Desktop */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>الطلبات الواردة الجديدة (تحتاج موافقة المتجر)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    راجع الكميات المطلوبة ووافق عليها لتصل الفاتورة للزبون
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-teal-400 font-bold hover:underline"
                >
                  عرض جميع الطلبات
                </button>
              </div>

              {pendingReservations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <div className="text-3xl">👍</div>
                  <p className="font-bold text-white">لا توجد طلبات جديدة بانتظار الرد حالياً</p>
                  <p className="text-slate-500">تم الرد على كافة الحجوزات الواردة لمتجرك.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingReservations.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-white text-sm block">{r.customer_name}</span>
                          <span className="text-xs text-slate-400 font-mono">{r.booking_code}</span>
                        </div>
                        {r.is_large_order && (
                          <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white text-[10px] font-bold">
                            طلب كبير &gt; 50% 🔥
                          </span>
                        )}
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{r.offer_title}</span>
                          <span>{r.quantity} قطع</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold text-xs">
                          <span>المجموع نقدًا:</span>
                          <span>{r.total_price.toFixed(2)} د.أ</span>
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1">
                          وقت الحضور: <span className="text-white">{r.expected_arrival}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => updateReservationStatus(r.id, 'confirmed')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                        >
                          قبول الطلب
                        </button>
                        <button
                          onClick={() => updateReservationStatus(r.id, 'rejected')}
                          className="py-2 px-3 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900 rounded-xl text-xs font-bold transition"
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
          <div className="max-w-3xl mx-auto space-y-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-teal-400" />
                <span>إضافة إعلان بيع طعام فائض جديد</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                أدخل تفاصيل الطعام الفائض الصالح للاستهلاك اليوم وحدد السعر المخفض
              </p>
            </div>

            {offerSuccessMsg && (
              <div className="p-4 bg-teal-950/80 border border-teal-700 rounded-2xl text-teal-300 text-xs text-center font-bold">
                {offerSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAddOffer} className="space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl text-xs shadow-xl">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">اسم الوجبة أو السلة:</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="مثال: سلة معجنات مشكلة ومخبوزات المساء الطازجة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">تصنيف الطعام:</label>
                  <select
                    value={offerCategory}
                    onChange={(e) => setOfferCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="مخابز ومعجنات">مخابز ومعجنات</option>
                    <option value="وجبات ومطاعم">وجبات ومطاعم شرقية</option>
                    <option value="وجبات سريعة">وجبات سريعة (برجر، شاورما)</option>
                    <option value="حلويات">حلويات شرقية وغربية</option>
                    <option value="سوبرماركت">سوبرماركت ومواد غذائية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">الكمية المتوفرة للبيع:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">وصف المنتج ومحتويات السلة:</label>
                <textarea
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  rows={3}
                  placeholder="محتويات السلة وصلاحيتها للاستهلاك الفوري الليلة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">السعر الأصلي المعتاد (دينار أردني):</label>
                  <input
                    type="number"
                    step="0.25"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-bold mb-1.5">سعر البيع المخفض (دينار أردني):</label>
                  <input
                    type="number"
                    step="0.25"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl p-3 text-white font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">بداية وقت الاستلام:</label>
                  <input
                    type="time"
                    value={pickupStart}
                    onChange={(e) => setPickupStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">نهاية وقت الاستلام:</label>
                  <input
                    type="time"
                    value={pickupEnd}
                    onChange={(e) => setPickupEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-teal-950/60 transition active:scale-[0.98]"
                >
                  نشر العرض في المنصة فوراً
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================== TAB 3: ORDERS ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-teal-400" />
                  <span>إدارة طلبات الحجز الواردة</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  جميع الحجوزات تتطلب موافقتك اليدوية لضمان توفر الكميات قبل وصول الزبون
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-teal-400 font-mono">
                {reservations.length} طلب إجمالي
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations.map((res) => {
                const isPending = res.status === 'pending';
                const isConfirmed = res.status === 'confirmed';
                const isCompleted = res.status === 'completed';

                return (
                  <div
                    key={res.id}
                    className={`p-5 bg-slate-900 border rounded-3xl space-y-3.5 text-xs shadow-md transition ${
                      res.is_large_order && isPending
                        ? 'border-red-500 shadow-xl shadow-red-500/10'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{res.customer_name}</span>
                          <span className="text-slate-400 font-mono text-xs">({res.booking_code})</span>
                        </div>
                        <p className="text-xs text-slate-400 dir-ltr text-right mt-1">{res.customer_phone}</p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                          ? 'موافق عليه ✅'
                          : isPending
                          ? 'بانتظار الموافقة ⏳'
                          : isCompleted
                          ? 'تم التسليم 💰'
                          : 'مرفوض ❌'}
                      </span>
                    </div>

                    {res.is_large_order && (
                      <div className="p-3 bg-red-950/80 border border-red-800 rounded-2xl text-red-300 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>طلب كمية كبيرة تتجاوز 50% من الوجبات المعروضة!</span>
                      </div>
                    )}

                    <div className="p-3 bg-slate-950 rounded-2xl text-slate-300 space-y-1.5 border border-slate-850">
                      <div className="flex justify-between font-bold text-white">
                        <span>{res.offer_title}</span>
                        <span>الكمية: {res.quantity} قطع</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-xs">
                        <span>المبلغ الإجمالي (نقدًا):</span>
                        <span className="font-black text-emerald-400 text-sm">{res.total_price.toFixed(2)} د.أ</span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                        موعد الحضور: <span className="text-white font-medium">{res.expected_arrival}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-1">
                      {isPending && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateReservationStatus(res.id, 'confirmed')}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition shadow-md"
                          >
                            موافقة على الحجز
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res.id, 'rejected')}
                            className="py-2.5 px-4 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900 rounded-xl font-bold text-xs transition"
                          >
                            رفض
                          </button>
                        </div>
                      )}

                      {isConfirmed && (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'completed')}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-teal-400" />
                  <span>إدارة العروض المنشورة لمتجرك</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحكم بحالة العرض أو أعد نشره بضغطة زر واحدة لتوفير الوقت
                </p>
              </div>
              <button
                onClick={() => setActiveTab('add_offer')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة عرض جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between gap-4 text-xs shadow-md"
                >
                  <div className="flex gap-3.5 items-start">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-2 h-2 rounded-full ${offer.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <h5 className="font-bold text-sm text-white truncate">{offer.title}</h5>
                      </div>
                      <p className="text-xs text-slate-400">
                        متبقي {offer.quantity_available} من {offer.initial_quantity} قطع
                      </p>
                      <p className="font-black text-emerald-400 text-sm mt-1">{offer.discounted_price.toFixed(2)} د.أ</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <button
                      onClick={() => toggleOfferActive(offer.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        offer.is_active
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {offer.is_active ? 'إيقاف مؤقت' : 'تفعيل العرض'}
                    </button>

                    <button
                      onClick={() => republishOffer(offer.id)}
                      className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold px-3 py-1.5 rounded-xl bg-teal-950/60 border border-teal-800/40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة نشر العرض</span>
                    </button>

                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="text-red-400 hover:text-red-300 px-2 py-1.5"
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
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              <span>السجل والإحصائيات المالية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <span className="text-slate-400 block mb-1">الطلبات المكتملة</span>
                <span className="text-3xl font-black text-emerald-400">{completedOrders.length}</span>
                <span className="text-xs text-slate-500 block mt-2">تم تسليمها واستلام قيمتها</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <span className="text-slate-400 block mb-1">إجمالي المبيعات المستلمة</span>
                <span className="text-3xl font-black text-teal-400">{totalRevenue.toFixed(2)} د.أ</span>
                <span className="text-xs text-slate-500 block mt-2">نقدًا عند الاستلام بالمتجر</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <span className="text-slate-400 block mb-1">وجبات تم إنقاذها</span>
                <span className="text-3xl font-black text-amber-400">
                  {completedOrders.reduce((sum, r) => sum + r.quantity, 0)} وجبة 🌱
                </span>
                <span className="text-xs text-slate-500 block mt-2">تقليل مباشر لهدر الطعام</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <span className="text-slate-400 block mb-1">زبائن لم يحضروا</span>
                <span className="text-3xl font-black text-slate-400">0</span>
                <span className="text-xs text-slate-500 block mt-2">نسبة التزام الحضور 100%</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6 text-xs">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-400" />
              <span>إعدادات المتجر</span>
            </h3>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-md">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <span className="font-bold text-white text-sm block">استقبال الحجوزات</span>
                  <span className="text-xs text-slate-400">تشغيل أو إيقاف استقبال الطلبات مؤقتاً</span>
                </div>
                <button
                  onClick={() =>
                    currentStore &&
                    updateStoreDetails(currentStore.id, {
                      is_accepting_orders: !currentStore.is_accepting_orders
                    })
                  }
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    currentStore?.is_accepting_orders
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentStore?.is_accepting_orders ? 'مفعل (نستقبل حجوزات)' : 'موقف مؤقتاً'}
                </button>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">اسم المتجر:</span>
                <p className="font-bold text-white text-sm">{currentStore?.name}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">الموقع:</span>
                <p className="font-bold text-white">{currentStore?.governorate} - {currentStore?.area}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">رقم الهاتف للتواصل:</span>
                <p className="font-bold text-white dir-ltr text-right">{currentStore?.phone}</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => setCurrentScreen('role_select')}
                className="w-full py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-2xl text-xs font-bold text-slate-200 transition"
              >
                تبديل الدور (واجهة الزبون أو الإدارة)
              </button>

              <button
                onClick={logout}
                className="w-full py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 rounded-2xl text-xs font-bold text-red-400 transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

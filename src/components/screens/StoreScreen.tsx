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
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'add_offer' | 'orders' | 'my_offers' | 'stats' | 'settings'
  >('dashboard');

  // New Store Registration Form State
  const [isRegisteringStore, setIsRegisteringStore] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState<Store['store_type']>('مخبز');
  const [ownerName, setOwnerName] = useState('');
  const [governorate, setGovernorate] = useState('عمان');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [description, setDescription] = useState('');
  const [workingHours, setWorkingHours] = useState('08:00 ص - 11:00 م');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // New Offer Form State
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerImage, setOfferImage] = useState(
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
  );
  const [originalPrice, setOriginalPrice] = useState<number | ''>(5.0);
  const [discountedPrice, setDiscountedPrice] = useState<number | ''>(2.25);
  const [quantity, setQuantity] = useState<number | ''>(10);
  const [pickupStart, setPickupStart] = useState('19:00');
  const [pickupEnd, setPickupEnd] = useState('22:30');
  const [offerCategory, setOfferCategory] = useState('مخابز ومعجنات');
  const [isCharityFree, setIsCharityFree] = useState(false);
  const [offerSuccessMsg, setOfferSuccessMsg] = useState('');

  // Handle Register Store
  const handleRegisterStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !phone) return;

    addStore({
      name: storeName,
      logo_url:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
      governorate,
      area,
      phone,
      phone_secondary: phoneSecondary,
      store_type: storeType,
      description,
      working_days: 'طيلة أيام الأسبوع',
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

    const finalPrice = isCharityFree ? 0 : Number(discountedPrice);
    const isFree = isCharityFree || finalPrice === 0;

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
      discounted_price: finalPrice,
      quantity_available: Number(quantity),
      initial_quantity: Number(quantity),
      pickup_start: pickupStart,
      pickup_end: pickupEnd,
      category: isFree ? 'وجبات مجانية لوجه الله 💚' : offerCategory,
      is_free: isFree,
      charity_badge: isFree ? 'مجاناً لوجه الله تعالى 💚' : undefined,
      is_active: true
    });

    setOfferSuccessMsg('تمت إضافة العرض بنجاح وهو الآن معروض للزبائن!');
    setOfferTitle('');
    setOfferDescription('');
    setIsCharityFree(false);
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

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex flex-col pb-16 min-h-screen">
      
      {/* Top Urgent Alert Banner (>50% Large Order Requirement) */}
      {hasPendingUrgentOrders && (
        <div className="w-full bg-red-600 text-white px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-300 animate-bounce" />
            <span>
              ⚠️ تنبيه عاجل: لديك {urgentOrdersCount} طلب كمية كبيرة تتجاوز 50% من المعروض بانتظار ردك الفوري!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUrgentSoundMuted(!isUrgentSoundMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-750 hover:bg-red-800 text-white text-xs font-bold transition cursor-pointer"
            >
              {isUrgentSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isUrgentSoundMuted ? 'تشغيل الصوت' : 'كتم الصوت'}</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="px-4 py-1.5 bg-white text-red-700 rounded-xl text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
            >
              مراجعة الطلبات العاجلة
            </button>
          </div>
        </div>
      )}

      {/* Store Header Full Width */}
      <div className="w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentStore?.logo_url}
              alt={currentStore?.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-900">{currentStore?.name || 'متجري'}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  متجر معتمد ✅
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {currentStore?.governorate} - {currentStore?.area} • {currentStore?.store_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('add_offer')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة عرض جديد</span>
            </button>

            <button
              onClick={logout}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Store Navigation Bar Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-bold border-t border-slate-100 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            لوحة المتجر
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition relative cursor-pointer ${
              activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الطلبات الواردة
            {pendingReservations.length > 0 && (
              <span className="mr-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {pendingReservations.length} جديد
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('my_offers')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'my_offers' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            عروضي ({storeOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'stats' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            السجل المالي
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بيانات المتجر
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
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">طلبات بانتظار الرد</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-amber-600">{pendingReservations.length}</span>
                  <span className="text-xs text-amber-700 font-bold">تحتاج موافقتك</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">العروض النشطة الحالية</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-emerald-700">
                    {storeOffers.filter((o) => o.is_active).length}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">معروضة للزبائن</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">إجمالي الحجوزات</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-slate-900">{reservations.length}</span>
                  <span className="text-xs text-slate-600 font-bold">طلب حجز</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">المبيعات المستلمة نقدًا</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-black text-emerald-700">{totalRevenue.toFixed(2)}</span>
                  <span className="text-xs text-emerald-700 font-bold">دينار أردني</span>
                </div>
              </div>
            </div>

            {/* Pending Requests Table / Cards on Desktop */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>الطلبات الواردة الجديدة (تحتاج موافقة المتجر)</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    راجع الكميات المطلوبة ووافق عليها لتصل الفاتورة للزبون
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  عرض جميع الطلبات
                </button>
              </div>

              {pendingReservations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-600 space-y-2">
                  <div className="text-3xl">👍</div>
                  <p className="font-bold text-slate-900 text-sm">لا توجد طلبات جديدة بانتظار الرد حالياً</p>
                  <p className="text-slate-500">تم الرد على كافة الحجوزات الواردة لمتجرك.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingReservations.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{r.customer_name}</span>
                          <span className="text-xs text-slate-600 font-mono">{r.booking_code}</span>
                        </div>
                        {r.is_large_order && (
                          <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white text-[10px] font-bold">
                            طلب كبير &gt; 50% 🔥
                          </span>
                        )}
                      </div>

                      <div className="p-3 bg-white rounded-xl space-y-1 border border-slate-200">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{r.offer_title}</span>
                          <span>{r.quantity} قطع</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold text-xs">
                          <span>المجموع نقدًا:</span>
                          <span>{r.total_price.toFixed(2)} د.أ</span>
                        </div>
                        <div className="text-[11px] text-slate-600 pt-1">
                          وقت الحضور: <span className="text-slate-900 font-medium">{r.expected_arrival}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => updateReservationStatus(r.id, 'confirmed')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          قبول الطلب
                        </button>
                        <button
                          onClick={() => updateReservationStatus(r.id, 'rejected')}
                          className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
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
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>إضافة إعلان بيع طعام فائض جديد</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                أدخل تفاصيل الطعام الفائض الصالح للاستهلاك اليوم وحدد السعر المخفض
              </p>
            </div>

            {offerSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs text-center font-bold">
                {offerSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAddOffer} className="space-y-4 bg-white border border-slate-200 p-6 rounded-3xl text-xs shadow-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">اسم الوجبة أو السلة:</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="مثال: سلة معجنات مشكلة ومخبوزات المساء الطازجة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">تصنيف الطعام:</label>
                  <select
                    value={offerCategory}
                    onChange={(e) => setOfferCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none font-medium"
                  >
                    <option value="مخابز ومعجنات">مخابز ومعجنات</option>
                    <option value="وجبات ومطاعم">وجبات ومطاعم شرقية</option>
                    <option value="وجبات سريعة">وجبات سريعة (برجر، شاورما)</option>
                    <option value="حلويات">حلويات شرقية وغربية</option>
                    <option value="سوبرماركت">سوبرماركت ومواد غذائية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">الكمية المتوفرة للبيع:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">وصف المنتج ومحتويات السلة:</label>
                <textarea
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  rows={3}
                  placeholder="محتويات السلة وصلاحيتها للاستهلاك الفوري الليلة..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              {/* Charity Option: Free for God's sake or symbolic tiny price */}
              <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 shadow-xs">
                <input
                  type="checkbox"
                  id="charityFreeCheck"
                  checked={isCharityFree}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsCharityFree(checked);
                    if (checked) {
                      setDiscountedPrice(0);
                      setOfferCategory('وجبات مجانية لوجه الله 💚');
                    } else {
                      setDiscountedPrice(2.25);
                      setOfferCategory('مخابز ومعجنات');
                    }
                  }}
                  className="mt-1 w-5 h-5 text-emerald-600 rounded-lg border-emerald-400 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="charityFreeCheck" className="text-xs cursor-pointer select-none">
                  <span className="font-black text-emerald-900 block text-sm flex items-center gap-1.5">
                    <span>تقديم الوجبة مجاناً لوجه الله تعالى (0.00 د.أ) 💚</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">صدقة وبركة</span>
                  </span>
                  <span className="text-slate-600 font-medium block mt-1 leading-relaxed">
                    مبادرة إطعام طعام وصدقة جارية للفقراء والمحتاجين وعابري السبيل. إذا كنت ترغب في وضع سعر قليل رمزي (مثل 0.25 أو 0.50 د.أ)، اترك الخيار غير محدد وضع السعر القليل في خانة السعر أدناه.
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">السعر الأصلي المعتاد (دينار أردني):</label>
                  <input
                    type="number"
                    step="0.25"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 font-bold mb-1.5">
                    سعر البيع المخفض (دينار أردني): {isCharityFree && <span className="text-emerald-600 font-bold">(مجاناً 0.00)</span>}
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    disabled={isCharityFree}
                    value={isCharityFree ? 0 : discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className={`w-full border rounded-xl p-3 font-bold focus:outline-none ${
                      isCharityFree 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-black cursor-not-allowed' 
                        : 'bg-slate-50 border-emerald-400 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">بداية وقت الاستلام:</label>
                  <input
                    type="time"
                    value={pickupStart}
                    onChange={(e) => setPickupStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">نهاية وقت الاستلام:</label>
                  <input
                    type="time"
                    value={pickupEnd}
                    onChange={(e) => setPickupEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-xs transition active:scale-[0.98] cursor-pointer"
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
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  <span>إدارة طلبات الحجز الواردة</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  جميع الحجوزات تتطلب موافقتك اليدوية لضمان توفر الكميات قبل وصول الزبون
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-xl text-emerald-700 font-mono">
                {reservations.length} طلب إجمالي
              </span>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <p className="text-xs text-slate-500">لا توجد طلبات مسجلة بعد. عند حجز الزبائن ستظهر هنا فوراً مع التنبيه الصوتي.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((res) => {
                  const isPending = res.status === 'pending';
                  const isConfirmed = res.status === 'confirmed';
                  const isCompleted = res.status === 'completed';

                  return (
                    <div
                      key={res.id}
                      className={`p-5 bg-white border rounded-3xl space-y-3.5 text-xs shadow-xs transition ${
                        res.is_large_order && isPending
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-base">{res.customer_name}</span>
                            <span className="text-slate-600 font-mono text-xs">({res.booking_code})</span>
                          </div>
                          <p className="text-xs text-slate-600 dir-ltr text-right mt-1 font-medium">{res.customer_phone}</p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : isCompleted
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
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
                        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                          <span>طلب كمية كبيرة تتجاوز 50% من الوجبات المعروضة!</span>
                        </div>
                      )}

                      <div className="p-3 bg-slate-50 rounded-2xl text-slate-700 space-y-1.5 border border-slate-200">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{res.offer_title}</span>
                          <span>الكمية: {res.quantity} قطع</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-xs">
                          <span>المبلغ الإجمالي (نقدًا):</span>
                          <span className="font-black text-emerald-700 text-sm">{res.total_price.toFixed(2)} د.أ</span>
                        </div>
                        <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                          موعد الحضور: <span className="text-slate-900 font-medium">{res.expected_arrival}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-1">
                        {isPending && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateReservationStatus(res.id, 'confirmed')}
                              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-xs cursor-pointer"
                            >
                              موافقة على الحجز
                            </button>
                            <button
                              onClick={() => updateReservationStatus(res.id, 'rejected')}
                              className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs transition cursor-pointer"
                            >
                              رفض
                            </button>
                          </div>
                        )}

                        {isConfirmed && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'completed')}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
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
            )}
          </div>
        )}

        {/* ===================== TAB 4: MY OFFERS ===================== */}
        {activeTab === 'my_offers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  <span>إدارة العروض المنشورة لمتجرك</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  تحكم بحالة العرض أو أعد نشره بضغطة زر واحدة لتوفير الوقت
                </p>
              </div>
              <button
                onClick={() => setActiveTab('add_offer')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة عرض جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between gap-4 text-xs shadow-xs"
                >
                  <div className="flex gap-3.5 items-start">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-2 h-2 rounded-full ${offer.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <h5 className="font-bold text-sm text-slate-900 truncate">{offer.title}</h5>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        متبقي {offer.quantity_available} من {offer.initial_quantity} قطع
                      </p>
                      {offer.is_free || offer.discounted_price === 0 ? (
                        <p className="font-black text-emerald-700 text-xs mt-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 inline-block">
                          مجاناً لوجه الله تعالى 💚 (0.00 د.أ)
                        </p>
                      ) : (
                        <p className="font-black text-emerald-700 text-sm mt-1">{offer.discounted_price.toFixed(2)} د.أ</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => toggleOfferActive(offer.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        offer.is_active
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {offer.is_active ? 'إيقاف مؤقت' : 'تفعيل العرض'}
                    </button>

                    <button
                      onClick={() => republishOffer(offer.id)}
                      className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة نشر العرض</span>
                    </button>

                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="text-red-600 hover:text-red-700 px-2 py-1.5 cursor-pointer font-bold"
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
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>السجل والإحصائيات المالية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">الطلبات المكتملة</span>
                <span className="text-3xl font-black text-emerald-700">{completedOrders.length}</span>
                <span className="text-xs text-slate-500 block mt-2">تم تسليمها واستلام قيمتها</span>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">إجمالي المبيعات المستلمة</span>
                <span className="text-3xl font-black text-emerald-700">{totalRevenue.toFixed(2)} د.أ</span>
                <span className="text-xs text-slate-500 block mt-2">نقدًا عند الاستلام بالمتجر</span>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">وجبات تم إنقاذها</span>
                <span className="text-3xl font-black text-amber-600">
                  {completedOrders.reduce((sum, r) => sum + r.quantity, 0)} وجبة 🌱
                </span>
                <span className="text-xs text-slate-500 block mt-2">تقليل مباشر لهدر الطعام</span>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
                <span className="text-slate-600 block mb-1 font-medium">زبائن لم يحضروا</span>
                <span className="text-3xl font-black text-slate-500">0</span>
                <span className="text-xs text-slate-500 block mt-2">نسبة التزام الحضور 100%</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6 text-xs">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              <span>إعدادات المتجر</span>
            </h3>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">استقبال الحجوزات</span>
                  <span className="text-xs text-slate-600">تشغيل أو إيقاف استقبال الطلبات مؤقتاً</span>
                </div>
                <button
                  onClick={() =>
                    currentStore &&
                    updateStoreDetails(currentStore.id, {
                      is_accepting_orders: !currentStore.is_accepting_orders
                    })
                  }
                  className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                    currentStore?.is_accepting_orders
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStore?.is_accepting_orders ? 'مفعل (نستقبل حجوزات)' : 'موقف مؤقتاً'}
                </button>
              </div>

              <div>
                <span className="text-slate-600 block mb-1 font-medium">اسم المتجر:</span>
                <p className="font-bold text-slate-900 text-sm">{currentStore?.name}</p>
              </div>

              <div>
                <span className="text-slate-600 block mb-1 font-medium">الموقع:</span>
                <p className="font-bold text-slate-900">{currentStore?.governorate} - {currentStore?.area}</p>
              </div>

              <div>
                <span className="text-slate-600 block mb-1 font-medium">رقم الهاتف للتواصل:</span>
                <p className="font-bold text-slate-900 dir-ltr text-right">{currentStore?.phone}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={logout}
                className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl text-xs font-bold text-red-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من لوحة المتجر</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

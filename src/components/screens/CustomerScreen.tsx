'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Offer, Reservation } from '@/types';
import { JORDAN_GOVERNORATES, FOOD_CATEGORIES } from '@/lib/mock-data';
import { InvoiceModal } from '@/components/InvoiceModal';
import {
  Home,
  Search,
  Receipt,
  User,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  ShoppingBag,
  Heart,
  ChevronLeft,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Info,
  LogOut,
  Navigation
} from 'lucide-react';

export const CustomerScreen: React.FC = () => {
  const {
    offers,
    reservations,
    createReservation,
    currentUser,
    currentUserRole,
    setCurrentScreen,
    logout,
    favorites,
    toggleFavorite
  } = useApp();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'reservations' | 'profile'>('home');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState('الكل');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [maxPrice, setMaxPrice] = useState(15);

  // Selected Offer Modal for Details & Reservation
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [reservationQty, setReservationQty] = useState(1);
  const [customerName, setCustomerName] = useState(currentUser?.full_name || 'عبدالله المجالي');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '0795551234');
  const [expectedArrival, setExpectedArrival] = useState('اليوم بين 8:30 و 9:00 مساءً');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<Reservation | null>(null);
  const [bookingError, setBookingError] = useState('');

  // Selected Invoice to view/print
  const [viewInvoice, setViewInvoice] = useState<Reservation | null>(null);

  // Filtered offers
  const filteredOffers = offers.filter((o) => {
    if (!o.is_active) return false;
    const matchQuery =
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.store_name && o.store_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = selectedCategory === 'الكل' || o.category === selectedCategory;
    const matchGov = selectedGov === 'الكل' || (o.store_location && o.store_location.includes(selectedGov));
    const matchPrice = o.discounted_price <= maxPrice;
    return matchQuery && matchCategory && matchGov && matchPrice;
  });

  const handleOpenOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setReservationQty(1);
    setBookingSuccess(null);
    setBookingError('');
  };

  const handleBookOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    if (currentUserRole === 'guest') {
      alert('عذراً، يجب تسجيل الدخول بحساب Google لتتمكن من إرسال طلب الحجز.');
      setCurrentScreen('login');
      return;
    }

    if (!customerName || !customerPhone) {
      setBookingError('يرجى كتابة الاسم الثلاثي ورقم الهاتف للتواصل');
      return;
    }

    const result = createReservation({
      offerId: selectedOffer.id,
      quantity: reservationQty,
      customerName,
      customerPhone,
      expectedArrival,
      notes
    });

    if (result.success && result.reservation) {
      setBookingSuccess(result.reservation);
    } else {
      setBookingError(result.error || 'حدث خطأ أثناء إرسال الحجز');
    }
  };

  return (
    <div className="flex flex-col min-h-[680px] h-full bg-slate-950 text-slate-100 relative pb-20 overflow-y-auto select-none">
      
      {/* Top Banner / Location selector */}
      <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
            وفّر
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>المحافظة:</span>
              <select
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="الكل" className="bg-slate-900 text-white">كل الأردن 🇯🇴</option>
                {JORDAN_GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* User indicator */}
        <div className="flex items-center gap-2">
          {currentUserRole === 'guest' ? (
            <button
              onClick={() => setCurrentScreen('login')}
              className="text-xs font-bold px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
            >
              تسجيل دخول
            </button>
          ) : (
            <span className="text-xs font-medium text-slate-300">
              مرحباً، {currentUser?.full_name?.split(' ')[0] || 'الزبون'}
            </span>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-4">
        {/* ====================== TAB 1: HOME ====================== */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Impact Hero Card */}
            <div className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-r from-emerald-900/80 via-teal-900/60 to-slate-900 border border-emerald-500/30 shadow-lg">
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold mb-1">
                    🌱 معاً ضد هدر الطعام
                  </span>
                  <h3 className="text-sm font-extrabold text-white leading-snug">
                    احجز وجبات طازجة بنصف السعر واستلمها نقدًا
                  </h3>
                  <p className="text-[11px] text-emerald-200/80 mt-1">
                    أكثر من 1,420 وجبة تم إنقاذها في الأردن هذا الشهر!
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
                  🍞
                </div>
              </div>
            </div>

            {/* Category Quick Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Offers Grid */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>عروض الطعام الفائض المتاحة اليوم</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">({filteredOffers.length} عرض)</span>
              </div>

              {filteredOffers.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
                  <p className="text-sm text-slate-400 mb-2">لا توجد عروض مطابقة للبحث أو المحافظة حالياً</p>
                  <button
                    onClick={() => {
                      setSelectedGov('الكل');
                      setSelectedCategory('الكل');
                      setSearchQuery('');
                    }}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredOffers.map((offer) => {
                    const discountPercent = Math.round(
                      ((offer.original_price - offer.discounted_price) / offer.original_price) * 100
                    );
                    const isFav = favorites.includes(offer.id);

                    return (
                      <div
                        key={offer.id}
                        onClick={() => handleOpenOffer(offer)}
                        className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-200 shadow-md cursor-pointer active:scale-[0.99] flex flex-col"
                      >
                        {/* Image & Badges */}
                        <div className="relative h-40 w-full overflow-hidden bg-slate-800">
                          <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          {/* Discount badge */}
                          <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-xl bg-red-600/90 text-white font-black text-xs shadow-md">
                            خصم {discountPercent}%
                          </div>

                          {/* Favorite icon */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(offer.id);
                            }}
                            className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transition"
                          >
                            <Heart
                              className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`}
                            />
                          </button>

                          {/* Pickup time banner */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-2 flex justify-between items-end text-[11px] text-emerald-300">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span>استلام: {offer.pickup_start} - {offer.pickup_end}</span>
                            </span>
                            <span className="bg-emerald-500/20 px-2 py-0.5 rounded-md font-bold text-[10px] text-emerald-300">
                              متبقي: {offer.quantity_available} قطع
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3.5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                              <span className="font-semibold text-slate-300">{offer.store_name}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-slate-400">
                                <MapPin className="w-3 h-3 text-emerald-400" />
                                {offer.store_location}
                              </span>
                            </div>
                            <h5 className="font-bold text-sm text-white group-hover:text-emerald-300 transition line-clamp-1 mb-1">
                              {offer.title}
                            </h5>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {offer.description}
                            </p>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-extrabold text-emerald-400">
                                {offer.discounted_price.toFixed(2)} د.أ
                              </span>
                              <span className="text-xs line-through text-slate-500 font-medium">
                                {offer.original_price.toFixed(2)} د.أ
                              </span>
                            </div>
                            <button
                              type="button"
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                            >
                              حجز الآن
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================== TAB 2: SEARCH ====================== */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              <span>البحث وتصفية العروض</span>
            </h3>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الوجبة، المتجر، أو المنطقة..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 pr-11 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
            </div>

            {/* Filter controls */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">المحافظة:</label>
                <select
                  value={selectedGov}
                  onChange={(e) => setSelectedGov(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-xs focus:outline-none"
                >
                  <option value="الكل">كل المحافظات</option>
                  {JORDAN_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">نوع الطعام:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-xs focus:outline-none"
                >
                  {FOOD_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>الحد الأقصى للسعر:</span>
                  <span className="font-bold text-emerald-400">{maxPrice} دينار أردني</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-slate-400">
              تم العثور على <span className="font-bold text-white">{filteredOffers.length}</span> عرض مطابق
            </p>

            {/* Search Results List */}
            <div className="space-y-3">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleOpenOffer(offer)}
                  className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl flex gap-3 cursor-pointer items-center transition"
                >
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{offer.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{offer.store_name} • {offer.store_location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-emerald-400 text-xs">{offer.discounted_price.toFixed(2)} د.أ</span>
                      <span className="line-through text-slate-500 text-[10px]">{offer.original_price.toFixed(2)} د.أ</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================== TAB 3: RESERVATIONS ====================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <span>حجوزاتي ومتابعة الطلبات</span>
            </h3>

            {reservations.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
                <p className="text-sm text-slate-400 mb-3">ليس لديك أي حجوزات حالياً</p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  تصفح العروض الآن
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => {
                  const isPending = res.status === 'pending';
                  const isConfirmed = res.status === 'confirmed';
                  const isCompleted = res.status === 'completed';
                  const isRejected = res.status === 'rejected';

                  return (
                    <div
                      key={res.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs"
                    >
                      {/* Top Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-emerald-400">
                              {res.booking_code}
                            </span>
                            {res.is_large_order && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                                طلب كمية كبيرة ⚠️
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">{res.store_name}</p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isConfirmed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : isCompleted
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {isConfirmed
                            ? 'مؤكد من المتجر ✅'
                            : isPending
                            ? 'بانتظار موافقة المتجر ⏳'
                            : isCompleted
                            ? 'مكتمل ومستلم 🎉'
                            : 'مرفوض ❌'}
                        </span>
                      </div>

                      {/* Items Info */}
                      <div className="p-2.5 bg-slate-950 rounded-xl space-y-1">
                        <div className="flex justify-between font-medium text-white">
                          <span>{res.offer_title}</span>
                          <span>{res.quantity} × {res.unit_price.toFixed(2)} د.أ</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>المجموع نقدًا:</span>
                          <span className="font-bold text-emerald-400">{res.total_price.toFixed(2)} د.أ</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>موعد الاستلام: {res.expected_arrival}</span>
                        </div>
                      </div>

                      {/* Mandatory Notice if pending */}
                      {isPending && (
                        <div className="flex items-start gap-2 p-2.5 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-300 text-[11px]">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <span>يرجى انتظار تأكيد المتجر قبل التوجه لاستلام الطلب.</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">
                          {new Date(res.created_at).toLocaleDateString('ar-JO')}
                        </span>

                        {isConfirmed && (
                          <button
                            onClick={() => setViewInvoice(res)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>عرض وتحميل الفاتورة PDF</span>
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

        {/* ====================== TAB 4: PROFILE ====================== */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* User Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 font-bold text-xl mb-2">
                {currentUser?.full_name?.charAt(0) || 'ز'}
              </div>
              <h4 className="font-bold text-white text-base">
                {currentUser?.full_name || 'زائر غير مسجل'}
              </h4>
              <p className="text-xs text-slate-400 dir-ltr text-center">
                {currentUser?.phone || 'لا يوجد هاتف مسجل'}
              </p>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-950 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">وجبات أنقذتها</span>
                  <span className="text-base font-extrabold text-emerald-400">14 وجبة 🌱</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">إجمالي التوفير</span>
                  <span className="text-base font-extrabold text-teal-400">32.50 د.أ 💰</span>
                </div>
              </div>
            </div>

            {/* Quick Settings & Help */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 text-xs">
              <div className="p-3.5 flex justify-between items-center text-slate-300">
                <span>المفضلة</span>
                <span className="text-slate-500 font-mono">({favorites.length})</span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-slate-300">
                <span>طريقة الدفع المعتمدة</span>
                <span className="text-emerald-400 font-bold">نقدًا عند الاستلام بالمتجر 💵</span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-slate-300">
                <span>اللغة</span>
                <span className="text-slate-400">العربية (الأردن)</span>
              </div>
            </div>

            {/* Logout / Switch Role */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setCurrentScreen('role_select')}
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 transition"
              >
                تبديل الدور (الانتقال لواجهة المتجر أو الإدارة)
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

      {/* ====================== OFFER DETAILS & BOOKING MODAL ====================== */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-right text-slate-100 p-5 relative shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedOffer(null)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSuccess ? (
              /* Success confirmation state */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl animate-bounce">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-white">تم إرسال طلب الحجز بنجاح!</h4>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p>رقم الحجز: <span className="font-mono font-bold text-emerald-400">{bookingSuccess.booking_code}</span></p>
                  <p>المبلغ الإجمالي للدفع نقدًا: <span className="font-bold text-emerald-400">{bookingSuccess.total_price.toFixed(2)} د.أ</span></p>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-xs">
                  <p className="font-bold">يرجى انتظار تأكيد المتجر قبل التوجه للاستلام.</p>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">ستصلك رسالة وفاتورة الحجز فور موافقة صاحب المتجر.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedOffer(null);
                      setActiveTab('reservations');
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    الانتقال إلى حجوزاتي
                  </button>
                  <button
                    onClick={() => setSelectedOffer(null)}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ) : (
              /* Offer form and details */
              <div className="space-y-4">
                {/* Offer Image */}
                <div className="h-44 w-full rounded-2xl overflow-hidden relative bg-slate-800">
                  <img
                    src={selectedOffer.image_url}
                    alt={selectedOffer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-red-600 text-white font-bold text-xs rounded-xl shadow">
                    خصم {Math.round(((selectedOffer.original_price - selectedOffer.discounted_price) / selectedOffer.original_price) * 100)}%
                  </div>
                </div>

                {/* Title & Store info */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-bold text-emerald-400">{selectedOffer.store_name}</span>
                    <span>•</span>
                    <span>{selectedOffer.store_location}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedOffer.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedOffer.description}</p>
                </div>

                {/* Price & savings */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">السعر للقطعة:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-emerald-400">{selectedOffer.discounted_price.toFixed(2)} د.أ</span>
                      <span className="line-through text-slate-500 font-medium">{selectedOffer.original_price.toFixed(2)} د.أ</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      توفير {(selectedOffer.original_price - selectedOffer.discounted_price).toFixed(2)} د.أ بالوجبة
                    </span>
                    <span className="text-[10px] text-slate-500">متوفر الآن: {selectedOffer.quantity_available} قطع</span>
                  </div>
                </div>

                {/* Pickup and contact */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">فترة الاستلام:</span>
                      <span className="font-bold text-white">{selectedOffer.pickup_start} - {selectedOffer.pickup_end}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">هاتف المتجر:</span>
                      <span className="font-bold text-white dir-ltr">{selectedOffer.store_phone || '0790000000'}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleBookOffer} className="space-y-3 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تأكيد بيانات الحجز</span>
                  </h4>

                  {bookingError && (
                    <div className="p-2.5 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs">
                      {bookingError}
                    </div>
                  )}

                  {/* Quantity selector */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">الكمية المطلوبة:</label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setReservationQty((q) => Math.max(1, q - 1))}
                          className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-1.5 font-bold text-white text-xs">{reservationQty}</span>
                        <button
                          type="button"
                          onClick={() => setReservationQty((q) => Math.min(selectedOffer.quantity_available, q + 1))}
                          className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        المجموع: <strong className="text-emerald-400">{(reservationQty * selectedOffer.discounted_price).toFixed(2)} د.أ</strong> (نقدًا)
                      </span>
                    </div>
                  </div>

                  {/* Full Name & Phone */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">الاسم الثلاثي:</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="الاسم الكامل"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">رقم الهاتف:</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="07xxxxxxxx"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white dir-ltr text-right focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Expected arrival */}
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">الوقت المتوقع للوصول:</label>
                    <input
                      type="text"
                      value={expectedArrival}
                      onChange={(e) => setExpectedArrival(e.target.value)}
                      placeholder="مثال: اليوم الساعة 8:30 مساءً"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-900/40 transition active:scale-[0.98]"
                    >
                      إرسال طلب الحجز إلى المتجر
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                      لا يعتبر الحجز مؤكدًا إلا بعد موافقة صاحب المتجر
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================== INVOICE PRINT MODAL ====================== */}
      {viewInvoice && (
        <InvoiceModal reservation={viewInvoice} onClose={() => setViewInvoice(null)} />
      )}

      {/* ====================== BOTTOM NAVIGATION BAR ====================== */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-6 flex justify-between items-center shadow-2xl">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">الرئيسية</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'search' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">البحث</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex flex-col items-center gap-1 relative transition ${
            activeTab === 'reservations' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">حجوزاتي</span>
          {reservations.filter((r) => r.status === 'confirmed').length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">حسابي</span>
        </button>
      </div>
    </div>
  );
};

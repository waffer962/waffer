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
  Navigation,
  UtensilsCrossed,
  ShieldCheck,
  TrendingDown,
  ExternalLink
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
      (o.store_name && o.store_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.description && o.description.toLowerCase().includes(searchQuery.toLowerCase()));
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
    <div className="flex-1 w-full bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-12">
      
      {/* ===================== DESKTOP NAVIGATION BAR (Hidden on Mobile) ===================== */}
      <header className="hidden md:block w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20">
                وفّر
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight">وفّر <span className="text-emerald-400 text-sm font-bold">Waffer</span></span>
                <span className="text-[10px] text-slate-400 block -mt-1">للحد من هدر الطعام في الأردن</span>
              </div>
            </div>

            {/* Jordan Governorate Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">المحافظة:</span>
              <select
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="الكل" className="bg-slate-900 text-white">كل محافظات الأردن 🇯🇴</option>
                {JORDAN_GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الوجبة، المطعم، المخبز، أو الحي..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>البحث المتقدم</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 relative ${
                activeTab === 'reservations'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>حجوزاتي</span>
              {reservations.filter((r) => r.status === 'confirmed').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>حسابي</span>
            </button>
          </nav>

          {/* User Auth Info */}
          <div className="flex items-center gap-3 border-r border-slate-800 pr-4">
            {currentUserRole === 'guest' ? (
              <button
                onClick={() => setCurrentScreen('login')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                تسجيل الدخول
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  {currentUser?.full_name?.charAt(0) || 'ز'}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">{currentUser?.full_name}</span>
                  <span className="text-[10px] text-slate-400">زبون وفّر</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================== MOBILE TOP BAR (Hidden on Desktop) ===================== */}
      <div className="md:hidden sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
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

      {/* ===================== MAIN CONTENT CONTAINER ===================== */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        
        {/* ====================== TAB 1: HOME ====================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Desktop & Mobile Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 shadow-2xl">
              <div className="max-w-2xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مبادرة أردنية وطنية للحد من هدر الطعام 🇯🇴</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  طعام طازج بنصف السعر.. <br />
                  <span className="text-emerald-400">وفر مصاريفك</span> وساهم في حماية البيئة
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
                  تصفح الفائض اليومي الصالح للاستهلاك 100% من أشهر المخابز والمطاعم في منطقتك، احجز كميتك بضغطة زر وادفع نقدًا عند الاستلام من المتجر مباشرة.
                </p>

                {/* Live rescue counter */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
                  <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold">1,420+</span>
                    <span>وجبة تم إنقاذها هذا الشهر</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold">45+</span>
                    <span>مخبز ومطعم شريك في الأردن</span>
                  </div>
                </div>
              </div>

              {/* Decorative graphic overlay */}
              <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 items-center justify-center w-52 h-52 rounded-3xl bg-emerald-900/30 border border-emerald-500/20 text-6xl shadow-2xl">
                🥐 🥗 🍕
              </div>
            </div>

            {/* Food Categories Pills */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">تصفح حسب تصنيف الطعام:</span>
                <span className="text-xs text-slate-500">اختر نوع الوجبة</span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl shrink-0 font-bold transition shadow-sm ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-emerald-900/30 shadow-md'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Offers Grid Section */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
                    <span>عروض الطعام الفائض المتاحة اليوم</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    الاستلام اليوم في المواعيد المحددة والدفع نقداً عند المتجر
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-mono">
                  {filteredOffers.length} عرض متوفر
                </span>
              </div>

              {filteredOffers.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <h4 className="text-sm font-bold text-white">لا توجد عروض مطابقة للفلاتر المحددة</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    جرب اختيار محافظة أخرى أو نوع طعام مختلف للاطلاع على العروض المتاحة.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedGov('الكل');
                      setSelectedCategory('الكل');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                /* Multi-column Grid on PC & Tablet, Single/Double on Mobile */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredOffers.map((offer) => {
                    const discountPercent = Math.round(
                      ((offer.original_price - offer.discounted_price) / offer.original_price) * 100
                    );
                    const isFav = favorites.includes(offer.id);

                    return (
                      <div
                        key={offer.id}
                        onClick={() => handleOpenOffer(offer)}
                        className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-emerald-950/30 cursor-pointer flex flex-col justify-between"
                      >
                        {/* Image Banner */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                          <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          {/* Discount Ribbon */}
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-red-600 text-white font-black text-xs shadow-lg">
                            وفر {discountPercent}%
                          </div>

                          {/* Favorite button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(offer.id);
                            }}
                            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-950/70 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transition"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                          </button>

                          {/* Pickup Timing Banner */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 flex justify-between items-end text-xs text-emerald-300">
                            <span className="flex items-center gap-1 font-semibold text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span>استلام: {offer.pickup_start} - {offer.pickup_end}</span>
                            </span>
                            <span className="bg-emerald-500/20 px-2 py-0.5 rounded-md font-bold text-[10px] text-emerald-300">
                              متبقي: {offer.quantity_available}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                              <span className="font-bold text-slate-200">{offer.store_name}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-slate-400 truncate">
                                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="truncate">{offer.store_location}</span>
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition line-clamp-1">
                              {offer.title}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                              {offer.description}
                            </p>
                          </div>

                          {/* Pricing and Action */}
                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black text-emerald-400">
                                  {offer.discounted_price.toFixed(2)} د.أ
                                </span>
                                <span className="text-xs line-through text-slate-500 font-medium">
                                  {offer.original_price.toFixed(2)} د.أ
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">الدفع نقداً بالمتجر 💵</span>
                            </div>

                            <button
                              type="button"
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-900/30 active:scale-95"
                            >
                              حجز الوجبة
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
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <span>البحث والتصفية المتقدمة</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ابحث في جميع مخابز ومطاعم الأردن بحسب المنطقة والأسعار
              </p>
            </div>

            {/* Filter Controls Box */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-400 font-medium mb-1.5">كلمة البحث:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="اسم الوجبة، المطعم، المخبز، أو الشارع..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 pr-10 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1.5">المحافظة:</label>
                <select
                  value={selectedGov}
                  onChange={(e) => setSelectedGov(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="الكل">كل محافظات الأردن 🇯🇴</option>
                  {JORDAN_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-slate-400 mb-1.5">
                  <span>الحد الأقصى للسعر:</span>
                  <span className="font-bold text-emerald-400">{maxPrice} دينار</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleOpenOffer(offer)}
                  className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-3xl flex gap-3.5 items-center cursor-pointer transition shadow-md"
                >
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{offer.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{offer.store_name}</p>
                    <p className="text-[10px] text-emerald-400 truncate">{offer.store_location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-emerald-400 text-sm">{offer.discounted_price.toFixed(2)} د.أ</span>
                      <span className="line-through text-slate-500 text-xs">{offer.original_price.toFixed(2)} د.أ</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================== TAB 3: RESERVATIONS ====================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  <span>حجوزاتي ومتابعة الطلبات</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تتبع موافقة المتاجر واعرض فاتورة الحجز الرسمية للاستلام نقدًا
                </p>
              </div>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-2xl">
                  🛒
                </div>
                <h4 className="text-sm font-bold text-white">ليس لديك أي حجوزات بعد</h4>
                <p className="text-xs text-slate-400">
                  استكشف أشهى عروض الطعام الفائض في الأردن ووفّر ما يصل إلى 70% من النفقات.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                >
                  تصفح العروض الآن
                </button>
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
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3.5 text-xs shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-black text-base text-emerald-400">
                            {res.booking_code}
                          </span>
                          <h5 className="font-bold text-white text-sm mt-0.5">{res.store_name}</h5>
                          <span className="text-[11px] text-slate-400">{res.store_location}</span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
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

                      <div className="p-3 bg-slate-950 rounded-2xl space-y-1.5 border border-slate-800/60">
                        <div className="flex justify-between font-bold text-white">
                          <span>{res.offer_title}</span>
                          <span>{res.quantity} × {res.unit_price.toFixed(2)} د.أ</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-xs">
                          <span>طريقة الدفع:</span>
                          <span className="font-bold text-emerald-400">
                            {res.total_price.toFixed(2)} د.أ (نقدًا عند الاستلام 💵)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>موعد الوصول: {res.expected_arrival}</span>
                        </div>
                      </div>

                      {/* Required Notice if pending */}
                      {isPending && (
                        <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-2xl text-amber-300 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-bold block">يرجى انتظار تأكيد المتجر</span>
                            <span className="text-[11px] text-amber-200/80">
                              لا تتوجه للاستلام قبل ظهور حالة «مؤكد من المتجر» وصدور الفاتورة.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* View Invoice Button if confirmed */}
                      {isConfirmed && (
                        <button
                          onClick={() => setViewInvoice(res)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>عرض وتحميل فاتورة الحجز PDF</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ====================== TAB 4: PROFILE ====================== */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 font-black text-2xl">
                {currentUser?.full_name?.charAt(0) || 'ز'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentUser?.full_name || 'زائر غير مسجل'}</h3>
                <p className="text-xs text-slate-400 dir-ltr mt-0.5">{currentUser?.phone || 'لا يوجد هاتف مسجل'}</p>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">وجبات أنقذتها</span>
                  <span className="text-2xl font-black text-emerald-400">14 وجبة 🌱</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">إجمالي التوفير</span>
                  <span className="text-2xl font-black text-teal-400">32.50 د.أ 💰</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl divide-y divide-slate-800 text-xs shadow-md">
              <div className="p-4 flex justify-between items-center text-slate-300">
                <span>المفضلة</span>
                <span className="text-emerald-400 font-bold">{favorites.length} عروض</span>
              </div>
              <div className="p-4 flex justify-between items-center text-slate-300">
                <span>طريقة الدفع المعتمدة</span>
                <span className="text-amber-400 font-bold">الدفع نقدًا عند الاستلام من المتجر 💵</span>
              </div>
              <div className="p-4 flex justify-between items-center text-slate-300">
                <span>البلد والعملة</span>
                <span className="text-white font-bold">الأردن (الدينار الأردني JOD) 🇯🇴</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => setCurrentScreen('role_select')}
                className="w-full py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-2xl text-xs font-bold text-slate-200 transition"
              >
                تبديل الدور (الانتقال لواجهة المتجر أو لوحة الإدارة)
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

      {/* ====================== OFFER DETAILS & BOOKING MODAL (Desktop Wide Dialog + Mobile Sheet) ====================== */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto text-right text-slate-100 p-6 sm:p-8 relative shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedOffer(null)}
              className="absolute top-5 left-5 w-9 h-9 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center z-20 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              /* Success screen */
              <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white">تم إرسال طلب الحجز إلى المتجر بنجاح!</h3>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <p>رقم الحجز الخاص: <span className="font-mono font-black text-emerald-400 text-base">{bookingSuccess.booking_code}</span></p>
                  <p>المبلغ الإجمالي للدفع نقدًا: <span className="font-black text-emerald-400 text-base">{bookingSuccess.total_price.toFixed(2)} د.أ</span></p>
                </div>

                <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-amber-300 text-xs">
                  <p className="font-black text-sm">«يرجى انتظار تأكيد المتجر قبل التوجه للاستلام»</p>
                  <p className="text-[11px] text-amber-200/80 mt-1">ستصلك رسالة فور موافقة المتجر وتصبح فاتورة الحجز جاهزة للتحميل.</p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => {
                      setSelectedOffer(null);
                      setActiveTab('reservations');
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/50"
                  >
                    الانتقال إلى حجوزاتي
                  </button>
                  <button
                    onClick={() => setSelectedOffer(null)}
                    className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ) : (
              /* 2-Column Responsive Layout on PC */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Right Column: Visuals & Store info */}
                <div className="space-y-4">
                  <div className="h-60 sm:h-72 w-full rounded-2xl overflow-hidden relative bg-slate-800">
                    <img
                      src={selectedOffer.image_url}
                      alt={selectedOffer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white font-black text-xs rounded-xl shadow-lg">
                      وفر {Math.round(((selectedOffer.original_price - selectedOffer.discounted_price) / selectedOffer.original_price) * 100)}%
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-bold text-emerald-400">{selectedOffer.store_name}</span>
                      <span>•</span>
                      <span>{selectedOffer.store_location}</span>
                    </div>
                    <h3 className="text-lg font-black text-white">{selectedOffer.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedOffer.description}</p>
                  </div>

                  {/* Pickup and store phone */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">وقت الاستلام:</span>
                        <span className="font-bold text-white">{selectedOffer.pickup_start} - {selectedOffer.pickup_end}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">هاتف المتجر:</span>
                        <span className="font-bold text-white dir-ltr">{selectedOffer.store_phone || '0790000000'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Column: Price calculation & Booking Form */}
                <div className="space-y-4 bg-slate-950 p-5 rounded-3xl border border-slate-800">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-850">
                    <div>
                      <span className="text-[11px] text-slate-400 block">السعر للقطعة:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-400">{selectedOffer.discounted_price.toFixed(2)} د.أ</span>
                        <span className="line-through text-slate-500 text-xs">{selectedOffer.original_price.toFixed(2)} د.أ</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-emerald-400 block">
                        توفير {(selectedOffer.original_price - selectedOffer.discounted_price).toFixed(2)} د.أ
                      </span>
                      <span className="text-[11px] text-slate-400">متوفر: {selectedOffer.quantity_available} قطع</span>
                    </div>
                  </div>

                  <form onSubmit={handleBookOffer} className="space-y-3.5 text-xs">
                    {bookingError && (
                      <div className="p-2.5 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs">
                        {bookingError}
                      </div>
                    )}

                    {/* Quantity */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">الكمية المطلوبة:</label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-slate-700 bg-slate-900 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setReservationQty((q) => Math.max(1, q - 1))}
                            className="px-3.5 py-2 text-slate-300 hover:bg-slate-800 font-bold"
                          >
                            -
                          </button>
                          <span className="px-5 py-2 font-black text-white text-sm">{reservationQty}</span>
                          <button
                            type="button"
                            onClick={() => setReservationQty((q) => Math.min(selectedOffer.quantity_available, q + 1))}
                            className="px-3.5 py-2 text-slate-300 hover:bg-slate-800 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-xs block">المجموع المطلوب:</span>
                          <span className="text-base font-black text-emerald-400">
                            {(reservationQty * selectedOffer.discounted_price).toFixed(2)} دينار أردني
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Name & Phone */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-400 mb-1">الاسم الثلاثي:</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="الاسم الكامل"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">رقم الهاتف:</label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="07xxxxxxxx"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white dir-ltr text-right focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Expected Arrival */}
                    <div>
                      <label className="block text-slate-400 mb-1">الوقت المتوقع للوصول للمتجر:</label>
                      <input
                        type="text"
                        value={expectedArrival}
                        onChange={(e) => setExpectedArrival(e.target.value)}
                        placeholder="مثال: اليوم الساعة 8:30 مساءً"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-950/60 transition active:scale-[0.98]"
                      >
                        إرسال طلب الحجز إلى المتجر 🛒
                      </button>
                      <p className="text-[11px] text-center text-slate-400 mt-2">
                        الدفع نقدًا عند الاستلام • الحجز يخضع لموافقة صاحب المتجر
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {viewInvoice && (
        <InvoiceModal reservation={viewInvoice} onClose={() => setViewInvoice(null)} />
      )}

      {/* ===================== BOTTOM NAVIGATION (MOBILE ONLY - Hidden on Desktop) ===================== */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-6 flex justify-between items-center shadow-2xl">
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

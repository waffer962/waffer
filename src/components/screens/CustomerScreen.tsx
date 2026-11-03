'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Offer, Reservation, UserLog } from '@/types';
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
  ExternalLink,
  Edit3,
  Trash2,
  Users,
  Database,
  Settings,
  Save,
  Plus,
  Check,
  Key
} from 'lucide-react';
import { WafferLogo } from '@/components/ui/WafferLogo';

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
    toggleFavorite,
    // Admin In-Place Editing Tools
    isAdmin,
    adminEditOffer,
    adminDeleteOffer,
    adminDeleteStore,
    adminDeleteReservation,
    usersList,
    adminDeleteUser,
    adminUpdateUserPermissions
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
  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [expectedArrival, setExpectedArrival] = useState('اليوم بين 8:30 و 9:00 مساءً');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<Reservation | null>(null);
  const [bookingError, setBookingError] = useState('');

  // Admin In-Place Editing State (قلم التعديل المباشر)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editOfferForm, setEditOfferForm] = useState<Partial<Offer>>({});
  const [isAdminUsersDrawerOpen, setIsAdminUsersDrawerOpen] = useState(false);

  // Admin Employee & User Permissions Management State
  const [editingUser, setEditingUser] = useState<UserLog | null>(null);
  const [editRole, setEditRole] = useState<string>('staff');
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  // Sync with current user profile
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.full_name) setCustomerName(currentUser.full_name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Selected Invoice to view/print
  const [viewInvoice, setViewInvoice] = useState<Reservation | null>(null);

  // Admin Handler functions
  const handleStartEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setEditOfferForm({
      title: offer.title,
      description: offer.description,
      image_url: offer.image_url,
      original_price: offer.original_price,
      discounted_price: offer.discounted_price,
      quantity_available: offer.quantity_available,
      pickup_start: offer.pickup_start,
      pickup_end: offer.pickup_end,
      category: offer.category
    });
  };

  const handleSaveOfferEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    adminEditOffer(editingOffer.id, editOfferForm);
    setEditingOffer(null);
  };

  const handleDeleteOffer = () => {
    if (!editingOffer) return;
    if (confirm(`تأكيد المشرف: هل أنت متأكد من حذف العرض "${editingOffer.title}" نهائياً من الموقع؟`)) {
      adminDeleteOffer(editingOffer.id);
      setEditingOffer(null);
      setSelectedOffer(null);
    }
  };

  const handleDeleteStore = (storeId: string, storeName: string) => {
    if (confirm(`تحذير المشرف: هل أنت متأكد من حذف متجر "${storeName}" وجميع الوجبات والعروض التابعة له نهائياً؟`)) {
      adminDeleteStore(storeId);
    }
  };

  const handleDeleteReservation = (resId: string, code: string) => {
    if (confirm(`تأكيد المشرف: هل تريد حذف الطلب ${code} (أو إزالة الطلب المكرر) نهائياً من النظام؟`)) {
      adminDeleteReservation(resId);
    }
  };

  const handleDeleteUserAccount = (userId: string, email: string, name: string) => {
    if (confirm(`تأكيد المشرف: هل أنت متأكد من حذف حساب المستخدم "${name}" (${email}) نهائياً من قاعدة البيانات؟`)) {
      adminDeleteUser(userId, email);
    }
  };

  // Filtered offers
  const filteredOffers = offers.filter((o) => {
    if (!o.is_active && !isAdmin) return false;
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
      alert('يرجى تسجيل الدخول بحساب Google أو بريدك الإلكتروني لتأكيد طلب الحجز.');
      setCurrentScreen('login');
      return;
    }

    if (!customerName || customerName.trim().length < 2) {
      setBookingError('الاسم الكامل إجباري لإتمام الطلب');
      return;
    }
    if (!customerPhone || customerPhone.trim().length < 8) {
      setBookingError('رقم الهاتف إجباري للتواصل وتأكيد الحجز عند الاستلام (مثال: 0791234567)');
      return;
    }

    const result = createReservation({
      offerId: selectedOffer.id,
      quantity: reservationQty,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
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
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex flex-col pb-20 md:pb-12 min-h-screen">
      
      {/* ===================== ADMIN IN-PLACE EDIT MODE BANNER ===================== */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex flex-wrap items-center justify-between gap-3 shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="text-base">✏️</span>
            <div>
              <span className="font-black block text-sm">وضع المشرف العام (التعديل المباشر بالقلم ✏️ مفعّل)</span>
              <span className="text-[11px] text-amber-100 font-medium">
                تصفح الموقع بحرية، واستخدم أيقونة القلم ✏️ لتعديل أي نص أو صورة أو سعر، وحذف المتاجر والطلبات مباشرة.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAdminUsersDrawerOpen(true)}
              className="bg-slate-900/40 hover:bg-slate-900/60 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition border border-white/20 cursor-pointer shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>سجل المستخدمين بالداتابيس ({usersList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('admin')}
              className="bg-purple-900/40 hover:bg-purple-900/60 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition border border-white/20 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة الأدمن 🛡️</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                setCurrentScreen('login');
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              خروج المشرف
            </button>
          </div>
        </div>
      )}

      {/* ===================== DESKTOP NAVIGATION BAR (Hidden on Mobile) ===================== */}
      <header className="hidden md:block w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <WafferLogo size="sm" showText={false} animated={false} />
              <div>
                <span className="font-black text-xl text-slate-900 tracking-tight">
                  وفّـر <span className="text-emerald-600 text-sm font-bold">Waffer</span>
                </span>
                <span className="text-[11px] text-slate-600 block -mt-1 font-medium">
                  منصة توفير فائض الطعام في الأردن 🇯🇴
                </span>
              </div>
            </div>

            {/* Jordan Governorate Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-600">المحافظة:</span>
              <select
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
                className="bg-transparent text-emerald-700 font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="الكل" className="bg-white text-slate-900">كل محافظات الأردن 🇯🇴</option>
                {JORDAN_GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-white text-slate-900">{g}</option>
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
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 px-4 pr-10 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white focus:border-emerald-600 transition"
            />
            <Search className="w-4 h-4 text-slate-600 absolute right-3.5 top-2.5" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>البحث</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 relative ${
                activeTab === 'reservations'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>طلباتي</span>
              {reservations.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>حسابي</span>
            </button>
          </nav>

          {/* User Auth Info */}
          <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
            {currentUserRole === 'guest' ? (
              <button
                onClick={() => setCurrentScreen('login')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                تسجيل الدخول
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
                  {currentUser?.full_name?.charAt(0) || 'ع'}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">{currentUser?.full_name}</span>
                  <span className="text-[10px] text-slate-600 font-medium">حساب زبون</span>
                </div>
                <button
                  onClick={logout}
                  title="تسجيل الخروج"
                  className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================== MOBILE TOP BAR (Hidden on Desktop) ===================== */}
      <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <WafferLogo size="sm" showText={false} />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-base text-slate-900 tracking-tight leading-none">
                وفّـر
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                WAFFER
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <select
                value={selectedGov}
                onChange={(e) => {
                  e.stopPropagation();
                  setSelectedGov(e.target.value);
                }}
                className="bg-transparent text-emerald-700 font-bold focus:outline-none cursor-pointer"
              >
                <option value="الكل" className="bg-white text-slate-900">كل الأردن 🇯🇴</option>
                {JORDAN_GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-white text-slate-900">{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {currentUserRole === 'guest' ? (
          <button
            onClick={() => setCurrentScreen('login')}
            className="text-xs font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm shrink-0"
          >
            تسجيل دخول
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl shrink-0"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span className="max-w-[75px] truncate">{currentUser?.full_name?.split(' ')[0] || 'حسابي'}</span>
          </button>
        )}
      </div>

      {/* ===================== MAIN CONTENT CONTAINER ===================== */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        
        {/* ====================== TAB 1: HOME ====================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Commercial Hero Banner (Wafrah style) */}
            <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-sm">
              <div className="max-w-2xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>عروض حقيقية بأسعار مخفضة يومياً 🇯🇴</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  طعام طازج بنصف السعر.. <br />
                  <span className="text-amber-300">وفّر نفقاتك اليومية</span> وساهم في تقليل الهدر
                </h2>
                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-xl">
                  تصفح الفائض اليومي الطازج من مخابز ومطاعم منطقتك، احجز وجبتك بضغطة زر وادفع نقدًا عند الاستلام من المتجر مباشرة.
                </p>

                {/* Counter */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-amber-300">1,420+</span>
                    <span>وجبة تم توفيرها هذا الشهر</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-amber-300">45+</span>
                    <span>مخبز ومطعم شريك في الأردن</span>
                  </div>
                </div>
              </div>

              {/* Decorative icons */}
              <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 items-center justify-center w-48 h-48 rounded-3xl bg-white/10 border border-white/20 text-5xl shadow-lg">
                🥐 🥗 🍕
              </div>
            </div>

            {/* Food Categories Pills */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">تصفح حسب تصنيف الطعام:</span>
                <span className="text-xs text-slate-600 font-medium">اختر النوع</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl shrink-0 font-bold transition shadow-xs cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Offers Grid Section */}
            <div className="space-y-4 pt-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                    <span>عروض المتاجر المتاحة اليوم</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    الاستلام اليوم في المواعيد المحددة والدفع نقداً عند المتجر
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-xl text-emerald-700 font-mono shadow-2xs">
                  {filteredOffers.length} عرض متوفر
                </span>
              </div>

              {filteredOffers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">لا توجد عروض مطابقة للفلاتر المحددة</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    جرب اختيار محافظة أخرى أو نوع طعام مختلف للاطلاع على العروض المتاحة.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedGov('الكل');
                      setSelectedCategory('الكل');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                /* Multi-column Grid on PC & Tablet, Single on Mobile */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredOffers.map((offer) => {
                    const isFreeOffer = offer.is_free || offer.discounted_price === 0;
                    const discountPercent = isFreeOffer
                      ? 100
                      : Math.round(
                          ((offer.original_price - offer.discounted_price) / offer.original_price) * 100
                        );
                    const isFav = favorites.includes(offer.id);

                    return (
                      <div
                        key={offer.id}
                        onClick={() => handleOpenOffer(offer)}
                        className={`group bg-white hover:bg-slate-50/50 border rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between ${
                          isFreeOffer ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-slate-200/90'
                        }`}
                      >
                        {/* Image Banner */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                          <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          {/* Discount Ribbon or Admin Pencil Edit Button */}
                          {isAdmin ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditOffer(offer);
                              }}
                              className="absolute top-3 right-3 z-30 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
                              title="تعديل هذا العرض بالقلم ✏️"
                            >
                              <span>✏️ تعديل العرض</span>
                            </button>
                          ) : isFreeOffer ? (
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md border border-white/20 flex items-center gap-1">
                              <span>وجبة مجانية 💚</span>
                            </div>
                          ) : (
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-md">
                              وفر {discountPercent}%
                            </div>
                          )}

                          {/* Favorite button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(offer.id);
                            }}
                            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 flex items-center justify-center hover:scale-110 transition cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                          </button>

                          {/* Pickup Timing Banner */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 flex justify-between items-end text-xs text-white">
                            <span className="flex items-center gap-1 font-bold text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-amber-300" />
                              <span>استلام: {offer.pickup_start} - {offer.pickup_end}</span>
                            </span>
                            <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-[10px] text-white">
                              متبقي: {offer.quantity_available}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between gap-1 text-xs text-slate-600 mb-1 font-medium">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-bold text-slate-800 truncate">{offer.store_name}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-slate-600 truncate">
                                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate">{offer.store_location}</span>
                                </span>
                              </div>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStore(offer.store_id, offer.store_name || 'المتجر');
                                  }}
                                  className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                                  title="حذف هذا المتجر وكل عروضه نهائياً"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>حذف المتجر</span>
                                </button>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                              {offer.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                              {offer.description}
                            </p>
                          </div>

                          {/* Pricing and Action */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              {isFreeOffer ? (
                                <div>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-base sm:text-lg font-black text-emerald-700">
                                      مجاناً (0.00 د.أ)
                                    </span>
                                    <span className="text-xs line-through text-slate-400 font-medium">
                                      {offer.original_price.toFixed(2)} د.أ
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md font-bold block mt-0.5">
                                    وجبة مجانية 💚
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-black text-emerald-700">
                                      {offer.discounted_price.toFixed(2)} د.أ
                                    </span>
                                    <span className="text-xs line-through text-slate-600 font-medium">
                                      {offer.original_price.toFixed(2)} د.أ
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-600 font-medium">الدفع نقداً بالمتجر 💵</span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer ${
                                isFreeOffer
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                                  : 'bg-emerald-600 hover:bg-emerald-700'
                              }`}
                            >
                              {isFreeOffer ? 'حجز مجاني 💚' : 'حجز الوجبة'}
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
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <span>البحث والتصفية</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                ابحث في جميع مخابز ومطاعم الأردن بحسب المنطقة والتصنيف والسعر
              </p>
            </div>

            {/* Filter Controls Box */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white border border-slate-200 rounded-3xl text-xs shadow-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">كلمة البحث:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="اسم الوجبة، المطعم، المخبز، أو الشارع..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 pr-10 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                  <Search className="w-4 h-4 text-slate-600 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">المحافظة:</label>
                <select
                  value={selectedGov}
                  onChange={(e) => setSelectedGov(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
                >
                  <option value="الكل">كل محافظات الأردن 🇯🇴</option>
                  {JORDAN_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-slate-700 font-bold mb-1.5">
                  <span>الحد الأقصى للسعر:</span>
                  <span className="text-emerald-700 font-black">{maxPrice} د.أ</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleOpenOffer(offer)}
                  className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl flex gap-3.5 items-center cursor-pointer transition shadow-xs relative"
                >
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-900 truncate">{offer.title}</h5>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditOffer(offer);
                          }}
                          className="text-[10px] bg-amber-100 text-amber-800 hover:bg-amber-200 px-2 py-0.5 rounded-md font-black transition shrink-0"
                        >
                          ✏️ تعديل
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{offer.store_name}</p>
                    <p className="text-[10px] text-emerald-700 font-bold truncate">{offer.store_location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-emerald-700 text-sm">{offer.discounted_price.toFixed(2)} د.أ</span>
                      <span className="line-through text-slate-600 text-xs">{offer.original_price.toFixed(2)} د.أ</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-600 shrink-0" />
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
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <span>طلباتي وحجوزاتي</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  تتبع موافقة المتاجر واعرض الفاتورة الرسمية للاستلام نقدًا
                </p>
              </div>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  🛒
                </div>
                <h4 className="text-sm font-bold text-slate-900">ليس لديك أي حجوزات بعد</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  تصفح وجبات اليوم المتوفرة من أشهر المخابز والمطاعم في الأردن ووفّر مبالغ مالية حقيقية على طعامك.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  تصفح عروض اليوم
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
                      className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 text-xs shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-black text-base text-emerald-700">
                            {res.booking_code}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm mt-0.5">{res.store_name}</h5>
                          <span className="text-[11px] text-slate-600">{res.store_location}</span>
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
                            ? 'مؤكد من المتجر ✅'
                            : isPending
                            ? 'بانتظار موافقة المتجر ⏳'
                            : isCompleted
                            ? 'مكتمل ومستلم 🎉'
                            : 'مرفوض ❌'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-200">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{res.offer_title}</span>
                          <span>{res.quantity} × {res.unit_price.toFixed(2)} د.أ</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-xs">
                          <span>طريقة الدفع:</span>
                          <span className="font-bold text-emerald-700">
                            {res.total_price === 0
                              ? 'وجبة مجانية 💚'
                              : `${res.total_price.toFixed(2)} د.أ (نقدًا عند الاستلام 💵)`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>موعد الوصول: {res.expected_arrival}</span>
                        </div>
                      </div>

                      {/* Notice if pending */}
                      {isPending && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                          <div>
                            <span className="font-bold block">يرجى انتظار تأكيد المتجر</span>
                            <span className="text-[11px] text-amber-800">
                              لا تتوجه للاستلام قبل ظهور حالة «مؤكد من المتجر» وصدور الفاتورة.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* View Invoice Button if confirmed */}
                      {isConfirmed && (
                        <button
                          onClick={() => setViewInvoice(res)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>عرض وتحميل فاتورة الحجز PDF</span>
                        </button>
                      )}

                      {/* Admin In-Place Order Management: Delete duplicate/fake orders */}
                      {isAdmin && (
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-500 font-bold truncate">
                            👤 {res.customer_name} ({res.customer_phone})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteReservation(res.id, res.booking_code)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                            title="حذف هذا الطلب المكرر أو الوهمي"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف الطلب (المكرر)</span>
                          </button>
                        </div>
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 mx-auto flex items-center justify-center text-emerald-800 font-black text-2xl">
                {currentUser?.full_name?.charAt(0) || 'ع'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{currentUser?.full_name || 'زائر غير مسجل'}</h3>
                <p className="text-xs text-slate-600 dir-ltr mt-0.5 font-medium">{currentUser?.phone || '07xxxxxxxx'}</p>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-600 block mb-1 font-medium">وجبات أنقذتها</span>
                  <span className="text-2xl font-black text-emerald-700">14 وجبة 🌱</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-600 block mb-1 font-medium">إجمالي التوفير</span>
                  <span className="text-2xl font-black text-emerald-700">32.50 د.أ 💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 text-xs shadow-xs font-medium">
              <div className="p-4 flex justify-between items-center text-slate-700">
                <span>عروضي المفضلة</span>
                <span className="text-emerald-700 font-bold">{favorites.length} عروض</span>
              </div>
              <div className="p-4 flex justify-between items-center text-slate-700">
                <span>طريقة الدفع المعتمدة</span>
                <span className="text-amber-700 font-bold">الدفع نقدًا عند الاستلام من المتجر 💵</span>
              </div>
              <div className="p-4 flex justify-between items-center text-slate-700">
                <span>البلد والعملة</span>
                <span className="text-slate-900 font-bold">الأردن (الدينار الأردني JOD) 🇯🇴</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={logout}
                className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl text-xs font-bold text-red-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من الحساب</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ====================== OFFER DETAILS & BOOKING MODAL ====================== */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto text-right text-slate-900 p-6 sm:p-8 relative shadow-2xl">
            {/* Close button & Admin Edit Pencil */}
            <div className="absolute top-5 left-5 flex items-center gap-2 z-20">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    const offer = selectedOffer;
                    setSelectedOffer(null);
                    handleStartEditOffer(offer);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
                  title="تعديل هذا العرض بالقلم ✏️"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل بالقلم ✏️</span>
                </button>
              )}
              <button
                onClick={() => setSelectedOffer(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              /* Success screen */
              <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl font-bold animate-bounce">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900">تم إرسال طلب الحجز إلى المتجر بنجاح!</h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                  <p>كود الحجز: <span className="font-mono font-black text-emerald-700 text-base">{bookingSuccess.booking_code}</span></p>
                  <p>
                    المبلغ الإجمالي:{' '}
                    <span className="font-black text-emerald-700 text-base">
                      {bookingSuccess.total_price === 0
                        ? '0.00 د.أ (وجبة مجانية 💚)'
                        : `${bookingSuccess.total_price.toFixed(2)} د.أ (نقدًا عند الاستلام)`}
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                  <p className="font-black text-sm">«يرجى انتظار تأكيد المتجر قبل التوجه للاستلام»</p>
                  <p className="text-[11px] text-amber-800 mt-1">ستصلك رسالة فور موافقة المتجر وتصبح فاتورة الحجز جاهزة للتحميل.</p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => {
                      setSelectedOffer(null);
                      setActiveTab('reservations');
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    الانتقال إلى حجوزاتي
                  </button>
                  <button
                    onClick={() => setSelectedOffer(null)}
                    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
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
                  <div className="h-60 sm:h-72 w-full rounded-2xl overflow-hidden relative bg-slate-100">
                    <img
                      src={selectedOffer.image_url}
                      alt={selectedOffer.title}
                      className="w-full h-full object-cover"
                    />
                    {selectedOffer.is_free || selectedOffer.discounted_price === 0 ? (
                      <div className="absolute top-3 right-3 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs rounded-xl shadow-md border border-white/20 flex items-center gap-1.5">
                        <span>وجبة مجانية 💚</span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-amber-500 text-white font-black text-xs rounded-xl shadow-md">
                        وفر {Math.round(((selectedOffer.original_price - selectedOffer.discounted_price) / selectedOffer.original_price) * 100)}%
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1 font-medium">
                      <span className="font-bold text-emerald-700">{selectedOffer.store_name}</span>
                      <span>•</span>
                      <span>{selectedOffer.store_location}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{selectedOffer.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedOffer.description}</p>
                  </div>

                  {/* Pickup and store phone */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-600 block font-medium">وقت الاستلام:</span>
                        <span className="font-bold text-slate-900">{selectedOffer.pickup_start} - {selectedOffer.pickup_end}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-600 block font-medium">هاتف المتجر:</span>
                        <span className="font-bold text-slate-900 dir-ltr">{selectedOffer.store_phone || '0790000000'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Column: Price calculation & Booking Form */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-600 block font-medium">السعر:</span>
                      {selectedOffer.is_free || selectedOffer.discounted_price === 0 ? (
                        <div>
                          <span className="text-2xl font-black text-emerald-700">مجاناً (0.00 د.أ)</span>
                          <span className="text-[11px] text-emerald-700 block font-bold mt-0.5">وجبة مجانية 💚</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-emerald-700">{selectedOffer.discounted_price.toFixed(2)} د.أ</span>
                          <span className="line-through text-slate-600 text-xs font-medium">{selectedOffer.original_price.toFixed(2)} د.أ</span>
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      {selectedOffer.is_free || selectedOffer.discounted_price === 0 ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl block">
                          بدون أي مقابل نقدي
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 block">
                          توفير {(selectedOffer.original_price - selectedOffer.discounted_price).toFixed(2)} د.أ
                        </span>
                      )}
                      <span className="text-[11px] text-slate-600 font-medium">متوفر: {selectedOffer.quantity_available} قطع</span>
                    </div>
                  </div>

                  <form onSubmit={handleBookOffer} className="space-y-3.5 text-xs">
                    {bookingError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                        {bookingError}
                      </div>
                    )}

                    {/* Quantity */}
                    <div>
                      <label className="block text-slate-800 font-bold mb-1.5">الكمية المطلوبة:</label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-slate-300 bg-white rounded-xl overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setReservationQty((q) => Math.max(1, q - 1))}
                            className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-5 py-2 font-black text-slate-900 text-sm">{reservationQty}</span>
                          <button
                            type="button"
                            onClick={() => setReservationQty((q) => Math.min(selectedOffer.quantity_available, q + 1))}
                            className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-600 text-xs block font-medium">المجموع الإجمالي:</span>
                          <span className="text-base font-black text-emerald-700">
                            {selectedOffer.is_free || selectedOffer.discounted_price === 0 ? (
                              <span>0.00 دينار (وجبة مجانية 💚)</span>
                            ) : (
                              <span>{(reservationQty * selectedOffer.discounted_price).toFixed(2)} دينار أردني</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Name & Phone (Strictly Mandatory) */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          الاسم الكامل <span className="text-red-600 font-black">* (إجباري)</span>:
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="الاسم الكامل"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          رقم الهاتف للتواصل <span className="text-red-600 font-black">* (إجباري)</span>:
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0791234567"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 dir-ltr text-right focus:outline-none focus:border-emerald-600"
                          required
                        />
                      </div>
                    </div>

                    {/* Expected Arrival */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">الوقت المتوقع للوصول للمتجر:</label>
                      <input
                        type="text"
                        value={expectedArrival}
                        onChange={(e) => setExpectedArrival(e.target.value)}
                        placeholder="مثال: اليوم الساعة 8:30 مساءً"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className={`w-full py-3.5 text-white rounded-2xl font-black text-sm shadow-md transition active:scale-[0.98] cursor-pointer ${
                          selectedOffer.is_free || selectedOffer.discounted_price === 0
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30'
                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                        }`}
                      >
                        {selectedOffer.is_free || selectedOffer.discounted_price === 0
                          ? 'تأكيد حجز الوجبة المجانية 💚'
                          : 'إرسال طلب الحجز إلى المتجر 🛒'}
                      </button>
                      <p className="text-[11px] text-center text-slate-600 mt-2 font-medium">
                        {selectedOffer.is_free || selectedOffer.discounted_price === 0
                          ? 'لا يتطلب أي دفع نقدي عند الاستلام • نسألكم الدعاء بالبركة والقبول'
                          : 'الدفع نقدًا عند الاستلام من المتجر • الحجز يخضع لموافقة صاحب المتجر'}
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== ADMIN IN-PLACE EDIT OFFER MODAL ===================== */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto text-right text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                  ✏️
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">تعديل بيانات العرض بالقلم</h3>
                  <span className="text-[10px] text-slate-500">تعديل مباشر على واجهة الموقع للجميع</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOffer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOfferEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الوجبة / العرض:</label>
                <input
                  type="text"
                  value={editOfferForm.title || ''}
                  onChange={(e) => setEditOfferForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">وصف العرض والمحتوى:</label>
                <textarea
                  value={editOfferForm.description || ''}
                  onChange={(e) => setEditOfferForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رابط صورة الوجبة (URL):</label>
                <input
                  type="url"
                  value={editOfferForm.image_url || ''}
                  onChange={(e) => setEditOfferForm((prev) => ({ ...prev, image_url: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 dir-ltr text-right focus:outline-none focus:border-amber-500 focus:bg-white"
                  required
                />
              </div>

              {/* Charity free meal option */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">عرض وجبة مجانية (0.00 د.أ) 💚:</span>
                  <span className="text-[10px] text-emerald-700">تقديم الوجبة مجاناً بالكامل</span>
                </div>
                <input
                  type="checkbox"
                  checked={editOfferForm.discounted_price === 0 || editOfferForm.is_free}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEditOfferForm((prev) => ({
                      ...prev,
                      discounted_price: checked ? 0 : 2.0,
                      is_free: checked,
                      category: checked ? 'وجبات مجانية' : (prev.category || 'وجبات ومطاعم'),
                      charity_badge: checked ? 'وجبة مجانية 💚' : undefined
                    }));
                  }}
                  className="w-4 h-4 text-emerald-600 rounded-md cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">السعر الأصلي (د.أ):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editOfferForm.original_price ?? 0}
                    onChange={(e) => setEditOfferForm((prev) => ({ ...prev, original_price: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">السعر المخفض (د.أ):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editOfferForm.discounted_price ?? 0}
                    onChange={(e) => setEditOfferForm((prev) => ({ ...prev, discounted_price: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الكمية المتوفرة:</label>
                  <input
                    type="number"
                    min="0"
                    value={editOfferForm.quantity_available ?? 1}
                    onChange={(e) => setEditOfferForm((prev) => ({ ...prev, quantity_available: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">التصنيف:</label>
                  <select
                    value={editOfferForm.category || 'وجبات جاهزة'}
                    onChange={(e) => setEditOfferForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  >
                    {FOOD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">بدء الاستلام:</label>
                  <input
                    type="text"
                    value={editOfferForm.pickup_start || '18:00'}
                    onChange={(e) => setEditOfferForm((prev) => ({ ...prev, pickup_start: e.target.value }))}
                    placeholder="18:00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">انتهاء الاستلام:</label>
                  <input
                    type="text"
                    value={editOfferForm.pickup_end || '22:00'}
                    onChange={(e) => setEditOfferForm((prev) => ({ ...prev, pickup_end: e.target.value }))}
                    placeholder="22:00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات في الموقع</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteOffer}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  title="حذف هذا العرض نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف العرض</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== INVOICE POPUP MODAL ===================== */}
      {viewInvoice && (
        <InvoiceModal
          reservation={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}

      {/* ===================== ADMIN USERS & DATABASE DRAWER ===================== */}
      {isAdminUsersDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto text-right text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                  🗄️
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">سجل المستخدمين وقاعدة البيانات</h3>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    قاعدة بيانات Supabase 🌐 (جدول profiles)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminUsersDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Storage Location Info Banner */}
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-black text-emerald-900">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>أين تُحفظ بيانات المستخدمين وتواريخ الدخول؟</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                كل حساب يقوم بالدخول أو التسجيل يُحفظ مباشرة في قاعدة بيانات Supabase في جدول <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">public.profiles</code> على الخادم، متضمناً: الاسم الكامل، رقم الهاتف، البريد، الدور، ووقت آخر ظهور.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] text-slate-500 block font-medium">الحسابات المحفوظة</span>
                <span className="text-xl font-black text-slate-900">{usersList.length} مستخدم</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] text-slate-500 block font-medium">العروض النشطة</span>
                <span className="text-xl font-black text-emerald-700">{offers.length} وجبة</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] text-slate-500 block font-medium">إجمالي الحجوزات</span>
                <span className="text-xl font-black text-amber-600">{reservations.length} حجز</span>
              </div>
            </div>

            {/* Users & Staff List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>قائمة الحسابات والموظفين المسجلين ({usersList.length}):</span>
                <span className="text-[10px] text-slate-500 font-medium">تعديل الصلاحيات • حذف الحساب • إظهار كلمات المرور</span>
              </h4>

              {usersList.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                  لا توجد حسابات مسجلة بعد في السجل الحالي.
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {usersList.map((usr) => (
                    <div
                      key={usr.id}
                      className="p-3.5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                          {usr.full_name?.charAt(0) || 'م'}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-xs text-slate-900 truncate">{usr.full_name}</span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-200">
                              {usr.role === 'admin' ? 'مشرف عام 👑' : usr.role === 'store_owner' ? 'صاحب متجر 🏪' : usr.role === 'staff' ? 'موظف تشغيل 🛡️' : 'زبون 🛒'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-600">
                            <span className="dir-ltr font-mono font-medium truncate">{usr.email}</span>
                            {usr.phone && (
                              <>
                                <span>•</span>
                                <span className="dir-ltr font-bold text-slate-800">{usr.phone}</span>
                              </>
                            )}
                          </div>

                          {/* Stored Password Badge for Admin visibility */}
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="text-[10px] text-slate-500 font-medium">كلمة المرور:</span>
                            <span className="font-mono font-bold text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 select-all">
                              {usr.password || '••••••••'}
                            </span>
                          </div>

                          {/* Active Permissions Badges */}
                          {Array.isArray(usr.permissions) && usr.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {usr.permissions.includes('manage_orders') && (
                                <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                  إدارة الطلبات 📦
                                </span>
                              )}
                              {usr.permissions.includes('manage_complaints') && (
                                <span className="text-[9px] bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded font-bold">
                                  حل الشكاوى 🎧
                                </span>
                              )}
                              {usr.permissions.includes('edit_offers_stores') && (
                                <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                                  تعديل العروض ✏️
                                </span>
                              )}
                              {usr.permissions.includes('contact_customers') && (
                                <span className="text-[9px] bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded font-bold">
                                  التواصل بالهاتف 📞
                                </span>
                              )}
                            </div>
                          )}

                          <span className="text-[9px] text-slate-400 block">
                            آخر نشاط: {new Date(usr.login_time).toLocaleString('ar-JO')}
                          </span>
                        </div>
                      </div>

                      {/* Admin Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(usr);
                            setEditRole(usr.role || 'staff');
                            setEditPermissions(usr.permissions || ['manage_orders', 'manage_complaints']);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                          title="تعديل الصلاحيات والدور لهذا الحساب"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-500" />
                          <span>الصلاحيات والدور</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUserAccount(usr.id, usr.email, usr.full_name)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer border border-transparent hover:border-red-200"
                          title="حذف هذا الموظف أو المستخدم نهائياً من قاعدة البيانات"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                بصفتك المشرف العام، لديك كامل الصلاحية لإضافة أو إلغاء أي دور أو موظف.
              </span>
              <button
                type="button"
                onClick={() => setIsAdminUsersDrawerOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADMIN EDIT USER PERMISSIONS MODAL ===================== */}
      {editingUser && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-right text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    تعديل صلاحيات ودور: {editingUser.full_name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">{editingUser.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                تحديد دور الحساب في الموقع:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'admin', label: 'مشرف عام 👑', desc: 'كامل الصلاحيات والتعديل بالقلم' },
                  { id: 'staff', label: 'موظف تشغيل 🛡️', desc: 'متابعة الطلبات وحل الشكاوى' },
                  { id: 'store_owner', label: 'صاحب متجر 🏪', desc: 'إدارة متجر وعروض خاصة' },
                  { id: 'customer', label: 'زبون / عميل 🛒', desc: 'تصفح وحجز الوجبات' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setEditRole(r.id)}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                      editRole === r.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{r.label}</span>
                      {editRole === r.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal mt-0.5">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Granular Permissions Checklist */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                الصلاحيات الممنوحة (تحديد دقيق للمهام):
              </label>

              {[
                {
                  key: 'manage_orders',
                  label: 'إدارة ومتابعة وحل الطلبات 📦',
                  desc: 'يمكنه الموافقة على الحجوزات أو رفضها ومتابعة تسليمها للعملاء.'
                },
                {
                  key: 'manage_complaints',
                  label: 'حل وإغلاق الشكاوى 🎧',
                  desc: 'يمكنه مراجعة الشكاوى المفتوحة والرد عليها وتغيير حالتها إلى محلولة.'
                },
                {
                  key: 'edit_offers_stores',
                  label: 'مراجعة وتعديل الوجبات والمتاجر ✏️',
                  desc: 'إمكانية مراجعة تفاصيل عروض المتاجر وتعديلها بالقلم المباشر.'
                },
                {
                  key: 'contact_customers',
                  label: 'التواصل المباشر مع العملاء 📞',
                  desc: 'إظهار أرقام هواتف العملاء للاتصال والتنسيق للاستلام.'
                }
              ].map((perm) => {
                const isChecked = editPermissions.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                      isChecked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditPermissions((prev) => [...prev, perm.key]);
                        } else {
                          setEditPermissions((prev) => prev.filter((k) => k !== perm.key));
                        }
                      }}
                      className="w-4 h-4 text-emerald-600 rounded-md mt-0.5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-900 block">{perm.label}</span>
                      <span className="text-[10px] text-slate-500 leading-relaxed block">{perm.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  handleDeleteUserAccount(editingUser.id, editingUser.email, editingUser.full_name);
                  setEditingUser(null);
                }}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إلغاء وحذف الحساب نهائياً</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    adminUpdateUserPermissions(editingUser.id, editRole, editPermissions);
                    setEditingUser(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  حفظ الصلاحيات والدور ✅
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== BOTTOM NAVIGATION (MOBILE ONLY - Hidden on Desktop) ===================== */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-6 flex justify-between items-center shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">الرئيسية</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'search' ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">البحث</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex flex-col items-center gap-1 relative transition cursor-pointer ${
            activeTab === 'reservations' ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">طلباتي</span>
          {reservations.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">حسابي</span>
        </button>
      </div>
    </div>
  );
};

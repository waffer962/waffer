'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  CharityRefrigerator,
  FreeFoodRestaurant,
  CharityNetworkStats,
} from '@/types/charity';
import {
  INITIAL_CHARITY_REFRIGERATORS,
  INITIAL_FREE_RESTAURANTS,
  ALL_JORDAN_GOVERNORATES,
  calculateDistanceKm,
  getGoogleMapsDirectionsUrl,
} from '@/lib/data/charity-data';
import { CharityMap } from './CharityMap';
import { IoTSimulatorModal } from './IoTSimulatorModal';
import {
  HeartHandshake,
  MapPin,
  Navigation,
  Search,
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Thermometer,
  Battery,
  Clock,
  ExternalLink,
  ChevronRight,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Phone,
  Info,
  SlidersHorizontal,
  RefreshCw,
  X,
  Share2,
} from 'lucide-react';

interface CharityFoodNetworkProps {
  onBackToHome?: () => void;
  isAdmin?: boolean;
}

export const CharityFoodNetwork: React.FC<CharityFoodNetworkProps> = ({
  onBackToHome,
  isAdmin = false,
}) => {
  const [refrigerators, setRefrigerators] = useState<CharityRefrigerator[]>(
    INITIAL_CHARITY_REFRIGERATORS
  );
  const [restaurants, setRestaurants] = useState<FreeFoodRestaurant[]>(
    INITIAL_FREE_RESTAURANTS
  );

  // Filter States
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'refrigerators' | 'restaurants'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedFridgeDetail, setSelectedFridgeDetail] = useState<CharityRefrigerator | null>(null);
  const [selectedRestaurantDetail, setSelectedRestaurantDetail] = useState<FreeFoodRestaurant | null>(null);

  // Fetch initial telemetry from server if available
  useEffect(() => {
    fetch('/api/iot/refrigerator-telemetry')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.refrigerators) && data.refrigerators.length > 0) {
          setRefrigerators(data.refrigerators);
        }
      })
      .catch(() => {});
  }, []);

  // Request GPS Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('خاصية تحديد الموقع غير مدعومة في متصفحك');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError('تعذر تحديد الموقع تلقائياً، يمكنك اختيار المحافظة يدوياً');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Update Refrigerator from Simulator
  const handleUpdateRefrigerator = (updated: CharityRefrigerator) => {
    setRefrigerators((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
    if (selectedFridgeDetail && selectedFridgeDetail.id === updated.id) {
      setSelectedFridgeDetail(updated);
    }
  };

  // Calculate Network Overview Statistics
  const stats: CharityNetworkStats = useMemo(() => {
    const totalRefrigerators = refrigerators.length;
    const availableRefrigerators = refrigerators.filter((r) => r.status === 'food_available').length;
    const emptyRefrigerators = refrigerators.filter((r) => r.status === 'empty').length;
    const offlineRefrigerators = refrigerators.filter((r) => r.status === 'offline').length;
    const totalRestaurants = restaurants.length;

    const mealsFromFridges = refrigerators
      .filter((r) => r.status === 'food_available')
      .reduce((sum, r) => sum + (r.estimated_meals_count || 0), 0);

    const mealsFromRestaurants = restaurants.reduce(
      (sum, r) => sum + (r.available_meals_today || 0),
      0
    );

    return {
      totalRefrigerators,
      availableRefrigerators,
      emptyRefrigerators,
      offlineRefrigerators,
      totalRestaurants,
      totalMealsAvailable: mealsFromFridges + mealsFromRestaurants,
      totalBeneficiariesToday: 320 + mealsFromFridges,
    };
  }, [refrigerators, restaurants]);

  // Compute Items with Distance & Filter
  const processedItems = useMemo(() => {
    // 1. Process Refrigerators
    const fridgeItems = refrigerators.map((fridge) => {
      const distance = userLocation
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, fridge.lat, fridge.lng)
        : null;
      return {
        itemType: 'refrigerator' as const,
        data: fridge,
        distance,
      };
    });

    // 2. Process Restaurants
    const restaurantItems = restaurants.map((rest) => {
      const distance = userLocation
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, rest.lat, rest.lng)
        : null;
      return {
        itemType: 'restaurant' as const,
        data: rest,
        distance,
      };
    });

    // 3. Combine by Category Filter
    let combined = [];
    if (selectedCategory === 'all') {
      combined = [...fridgeItems, ...restaurantItems];
    } else if (selectedCategory === 'refrigerators') {
      combined = fridgeItems;
    } else {
      combined = restaurantItems;
    }

    // 4. Filter by Governorate
    if (selectedGovernorate !== 'الكل') {
      combined = combined.filter((item) => item.data.governorate === selectedGovernorate);
    }

    // 5. Filter by Availability Only
    if (availabilityOnly) {
      combined = combined.filter((item) => {
        if (item.itemType === 'refrigerator') {
          return (item.data as CharityRefrigerator).status === 'food_available';
        }
        return (item.data as FreeFoodRestaurant).available_meals_today > 0;
      });
    }

    // 6. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      combined = combined.filter((item) => {
        if (item.itemType === 'refrigerator') {
          const f = item.data as CharityRefrigerator;
          return (
            f.mosque_name.toLowerCase().includes(q) ||
            f.area.toLowerCase().includes(q) ||
            f.address.toLowerCase().includes(q) ||
            f.food_description.toLowerCase().includes(q) ||
            f.id.toLowerCase().includes(q)
          );
        } else {
          const r = item.data as FreeFoodRestaurant;
          return (
            r.name.toLowerCase().includes(q) ||
            r.area.toLowerCase().includes(q) ||
            r.address.toLowerCase().includes(q) ||
            r.meal_type.toLowerCase().includes(q)
          );
        }
      });
    }

    // 7. Sort by Distance if Location Active, otherwise by Status & Availability
    if (userLocation) {
      combined.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    } else {
      combined.sort((a, b) => {
        // Prioritize available refrigerators & restaurants
        const aAvail =
          a.itemType === 'refrigerator'
            ? (a.data as CharityRefrigerator).status === 'food_available'
            : (a.data as FreeFoodRestaurant).available_meals_today > 0;
        const bAvail =
          b.itemType === 'refrigerator'
            ? (b.data as CharityRefrigerator).status === 'food_available'
            : (b.data as FreeFoodRestaurant).available_meals_today > 0;

        if (aAvail && !bAvail) return -1;
        if (!aAvail && bAvail) return 1;
        return 0;
      });
    }

    return combined;
  }, [
    refrigerators,
    restaurants,
    selectedCategory,
    selectedGovernorate,
    availabilityOnly,
    searchQuery,
    userLocation,
  ]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-16">
      
      {/* ===================== HERO BANNER ===================== */}
      <section className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white border-b border-emerald-900/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
          
          {/* Top Bar with Back Button & Simulator Pill */}
          <div className="flex items-center justify-between gap-3">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>
            )}

            {/* IoT Simulator Trigger Pill (Admin Only) */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(true)}
                  className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 rounded-2xl text-xs font-black text-emerald-300 transition shadow-lg cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>محاكي الحساسات (إدارة)</span>
                </button>
              </div>
            )}
          </div>

          {/* Hero Titles */}
          <div className="space-y-2 text-center sm:text-right max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>مبادرة وطنية لحفظ النعمة وإطعام الطعام في الأردن</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              شبكة <span className="text-emerald-400">وفّـر</span> للصدقات والوجبات المجانية
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              دليل موحد لمطاعم الوجبات المجانية وثلاجات الخير في مساجد الأردن لمساعدتك في العثور على أماكن توفر الطعام مباشرة دون عناء الذهاب لمكان فارغ.
            </p>
          </div>

          {/* Nationwide Statistics Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
            
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-3 text-center sm:text-right">
              <span className="text-[10px] text-slate-400 block font-medium">ثلاجات المساجد</span>
              <span className="text-xl font-black text-white font-mono mt-0.5 block">
                {stats.totalRefrigerators} ثلاجة
              </span>
            </div>

            <div className="bg-emerald-950/60 backdrop-blur-sm border border-emerald-700/60 rounded-2xl p-3 text-center sm:text-right">
              <span className="text-[10px] text-emerald-300 block font-medium">يتوفر بها طعام الآن</span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                {stats.availableRefrigerators} متوفرة
              </span>
            </div>

            <div className="bg-amber-950/60 backdrop-blur-sm border border-amber-700/60 rounded-2xl p-3 text-center sm:text-right">
              <span className="text-[10px] text-amber-300 block font-medium">فارغة بانتظار التعبئة</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
                {stats.emptyRefrigerators} ثلاجة
              </span>
            </div>

            <div className="bg-orange-950/60 backdrop-blur-sm border border-orange-700/60 rounded-2xl p-3 text-center sm:text-right">
              <span className="text-[10px] text-orange-300 block font-medium">مطاعم وجبات مجانية</span>
              <span className="text-xl font-black text-orange-400 font-mono mt-0.5 block">
                {stats.totalRestaurants} مطعم
              </span>
            </div>

            <div className="bg-cyan-950/60 backdrop-blur-sm border border-cyan-700/60 rounded-2xl p-3 text-center sm:text-right">
              <span className="text-[10px] text-cyan-300 block font-medium">وجبات متوفرة اليوم</span>
              <span className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">
                {stats.totalMealsAvailable}+ وجبة
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONTROLS & FILTER TOOLBAR ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 relative z-20 w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
          
          {/* Row 1: GPS Auto-Location & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* GPS Location Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className={`py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                  userLocation
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>
                  {isLocating
                    ? 'جاري تحديد موقعك...'
                    : userLocation
                    ? '✓ تم تفعيل موقعك (الترتيب بالأقرب)'
                    : 'تفعيل موقعي الحالي (GPS)'}
                </span>
              </button>

              {userLocation && (
                <button
                  type="button"
                  onClick={() => setUserLocation(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                  title="إلغاء الموقع التلقائي"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 max-w-lg relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المسجد، المطعم، الحي، أو نوع الوجبة..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            {/* View Mode Switcher (List vs Map) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 self-end md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`py-1.5 px-3.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                قائمة البطاقات
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`py-1.5 px-3.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الخريطة التفاعلية
              </button>
            </div>
          </div>

          {/* Location Error Notice if any */}
          {locationError && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Row 2: Category Tabs & Governorate Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الكل ({refrigerators.length + restaurants.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('refrigerators')}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'refrigerators'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>ثلاجات الخير بالمساجد ({refrigerators.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('restaurants')}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'restaurants'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>مطاعم الوجبات المجانية ({restaurants.length})</span>
              </button>

              {/* Only Available Toggle */}
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-bold mr-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>عرض المتوفر به طعام فقط</span>
              </label>
            </div>

            {/* 12 Jordanian Governorates Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>المحافظة:</span>
              </span>
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="الكل">كل محافظات الأردن (12)</option>
                {ALL_JORDAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    محافظة {gov}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 w-full flex-1">
        
        {/* VIEW 1: INTERACTIVE JORDAN MAP */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <CharityMap
              refrigerators={refrigerators}
              restaurants={restaurants}
              userLocation={userLocation}
              selectedCategory={selectedCategory}
              selectedGovernorate={selectedGovernorate}
              onSelectRefrigerator={(fridge) => setSelectedFridgeDetail(fridge)}
              onSelectRestaurant={(rest) => setSelectedRestaurantDetail(rest)}
            />
          </div>
        ) : (
          /* VIEW 2: CARDS LIST VIEW */
          <div className="space-y-6">
            
            {/* Header info showing count and sorting */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span>
                عرض <strong>{processedItems.length}</strong> موقع خيري في{' '}
                <strong className="text-emerald-700">
                  {selectedGovernorate === 'الكل' ? 'كافة محافظات المملكة' : `محافظة ${selectedGovernorate}`}
                </strong>
              </span>

              {userLocation && (
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>النتائج مرتبة حسب الأقرب إلى موقعك الجغرافي</span>
                </span>
              )}
            </div>

            {/* Empty State */}
            {processedItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  لا توجد مواقع تطابق خيارات البحث الحالية
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  جرب تغيير المحافظة أو إلغاء فلتر «عرض المتوفر به طعام فقط» لاستعراض كافة المواقع في الشبكة.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGovernorate('الكل');
                    setSearchQuery('');
                    setAvailabilityOnly(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              /* Items Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {processedItems.map((item) => {
                  if (item.itemType === 'refrigerator') {
                    const fridge = item.data as CharityRefrigerator;
                    const isAvail = fridge.status === 'food_available';
                    const isEmpty = fridge.status === 'empty';
                    const isOffline = fridge.status === 'offline';

                    return (
                      <div
                        key={fridge.id}
                        className={`bg-white rounded-3xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 ${
                          isAvail
                            ? 'border-emerald-200/90 ring-1 ring-emerald-500/10'
                            : isEmpty
                            ? 'border-amber-200/80'
                            : 'border-slate-200/90 opacity-90'
                        }`}
                      >
                        {/* Top Card Info */}
                        <div className="space-y-3">
                          
                          {/* Badge Bar */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                              {/* Mosque Crescent Icon */}
                              <svg className="w-3.5 h-3.5 fill-current text-emerald-700" viewBox="0 0 24 24">
                                <path d="M12 2c.5 1.5 2 2.5 3.5 2.5s3-1 3.5-2.5c.3 1.2 1.5 2 2.8 2 0 3-2 6-5.8 7.5V22h-8V11.5C4.2 10 2.2 7 2.2 4c1.3 0 2.5-.8 2.8-2 .5 1.5 2 2.5 3.5 2.5S11.5 3.5 12 2z" />
                              </svg>
                              <span>ثلاجة مسجد ذكية</span>
                            </span>

                            {/* Distance Badge if available */}
                            {item.distance !== null && (
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                                <Compass className="w-3 h-3 text-blue-600" />
                                <span>يبعد {item.distance} كم</span>
                              </span>
                            )}
                          </div>

                          {/* Mosque Name & Location */}
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                              <span>{fridge.governorate}</span>
                              <span>•</span>
                              <span>{fridge.area}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
                              {fridge.mosque_name}
                            </h3>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{fridge.address}</span>
                            </p>
                          </div>

                          {/* Status Pill & Food Availability Details */}
                          <div
                            className={`p-3 rounded-2xl border space-y-2 ${
                              isAvail
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : isEmpty
                                ? 'bg-amber-50/70 border-amber-200'
                                : 'bg-slate-100 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                                  isAvail
                                    ? 'text-emerald-800'
                                    : isEmpty
                                    ? 'text-amber-800'
                                    : 'text-slate-600'
                                }`}
                              >
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    isAvail
                                      ? 'bg-emerald-500'
                                      : isEmpty
                                      ? 'bg-amber-500'
                                      : 'bg-slate-400'
                                  }`}
                                />
                                <span>
                                  {isAvail
                                    ? `متوفر طعام (${fridge.estimated_meals_count} وجبة)`
                                    : isEmpty
                                    ? 'الثلاجة فارغة حالياً'
                                    : 'غير متاح للتوزيع حالياً'}
                                </span>
                              </span>

                              <span className="text-[10px] text-slate-500 font-mono">
                                {fridge.id}
                              </span>
                            </div>

                            {/* Progress bar of fullness (only if available) */}
                            {isAvail && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium">
                                  <span>نسبة الامتلاء:</span>
                                  <span className="font-mono font-bold text-emerald-800">
                                    {fridge.fill_percentage}%
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                    style={{ width: `${fridge.fill_percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Food Summary */}
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {fridge.food_description}
                            </p>
                          </div>

                          {/* Cooling & update info */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1">
                              <Thermometer className="w-3 h-3 text-cyan-600" />
                              <span>{isOffline ? 'الحرارة: --' : `تبريد محفوظ: ${fridge.temperature_celsius}°C`}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>آخر تحديث: قبل قليل</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                          <a
                            href={getGoogleMapsDirectionsUrl(fridge.lat, fridge.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>الاتجاهات بالخريطة</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedFridgeDetail(fridge)}
                            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            التفاصيل
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    const rest = item.data as FreeFoodRestaurant;

                    return (
                      <div
                        key={rest.id}
                        className="bg-white rounded-3xl p-5 border border-orange-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          
                          {/* Badge Bar */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50 text-orange-800 text-[11px] font-bold border border-orange-200">
                              <Utensils className="w-3.5 h-3.5 text-orange-600" />
                              <span>مطعم وجبات مجانية</span>
                            </span>

                            {item.distance !== null && (
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                                <Compass className="w-3 h-3 text-blue-600" />
                                <span>يبعد {item.distance} كم</span>
                              </span>
                            )}
                          </div>

                          {/* Restaurant Info */}
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-orange-700 font-bold">
                              <span>{rest.governorate}</span>
                              <span>•</span>
                              <span>{rest.area}</span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
                              {rest.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{rest.address}</span>
                            </p>
                          </div>

                          {/* Meal Info Card */}
                          <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200/70 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-orange-900">
                                الوجبات المجانية المتاحة اليوم:
                              </span>
                              <span className="px-2 py-0.5 bg-orange-600 text-white font-mono font-bold text-xs rounded-lg shadow-xs">
                                {rest.available_meals_today} وجبة
                              </span>
                            </div>

                            <p className="text-xs text-slate-800 font-bold">
                              {rest.meal_type}
                            </p>

                            <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-orange-200/50">
                              <div className="flex items-center gap-1 text-slate-500">
                                <Clock className="w-3 h-3 text-orange-600" />
                                <span>{rest.working_hours}</span>
                              </div>
                              <p className="text-orange-950 font-medium text-[10px] leading-relaxed">
                                {rest.instructions}
                              </p>
                            </div>
                          </div>

                          {rest.sponsor_name && (
                            <p className="text-[10px] text-slate-400">
                              برعاية: {rest.sponsor_name}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                          <a
                            href={getGoogleMapsDirectionsUrl(rest.lat, rest.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>الاتجاهات بالخريطة</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedRestaurantDetail(rest)}
                            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            التفاصيل
                          </button>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===================== MODAL: REFRIGERATOR DETAILS ===================== */}
      {selectedFridgeDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-emerald-800 text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-100">
                    {selectedFridgeDetail.governorate} • {selectedFridgeDetail.area}
                  </span>
                  <span className="font-mono text-xs text-emerald-200">
                    {selectedFridgeDetail.id}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white leading-tight">
                  {selectedFridgeDetail.mosque_name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFridgeDetail(null)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-xl bg-emerald-700/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              
              {/* Status Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">حالة توفر الطعام:</span>
                  <span
                    className={`font-black px-3 py-1 rounded-full text-xs ${
                      selectedFridgeDetail.status === 'food_available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedFridgeDetail.status === 'empty'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedFridgeDetail.status === 'food_available'
                      ? `يوجد طعام (${selectedFridgeDetail.estimated_meals_count} وجبة)`
                      : selectedFridgeDetail.status === 'empty'
                      ? 'الثلاجة فارغة حالياً'
                      : 'غير متاح للتوزيع حالياً'}
                  </span>
                </div>

                {selectedFridgeDetail.status === 'food_available' && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>نسبة الامتلاء:</span>
                      <span className="font-bold font-mono text-emerald-700">
                        {selectedFridgeDetail.fill_percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${selectedFridgeDetail.fill_percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Food Content Description */}
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">محتوى الأطعمة المتاحة:</span>
                <p className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedFridgeDetail.food_description}
                </p>
              </div>

              {/* Preservation & Status Box */}
              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span>حالة التبريد وجودة الحفظ:</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">درجة التبريد:</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      {selectedFridgeDetail.status === 'offline' ? '--' : `${selectedFridgeDetail.temperature_celsius}°C`}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">حالة التوزيع:</span>
                    <span className="font-bold text-emerald-400">
                      {selectedFridgeDetail.status === 'food_available'
                        ? 'متاح للاستلام'
                        : selectedFridgeDetail.status === 'empty'
                        ? 'بانتظار تعبئة طعام جديد'
                        : 'غير متاح للتوزيع حالياً'}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 flex items-center justify-between">
                  <span>آخر تحديث:</span>
                  <span className="text-emerald-400">قبل قليل</span>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">العنوان الدقيق:</span>
                <p className="text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{selectedFridgeDetail.address}</span>
                </p>
                {selectedFridgeDetail.notes && (
                  <p className="text-[11px] text-slate-500 pt-1">
                    {selectedFridgeDetail.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <a
                href={getGoogleMapsDirectionsUrl(
                  selectedFridgeDetail.lat,
                  selectedFridgeDetail.lng
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Navigation className="w-4 h-4" />
                <span>فتح الاتجاهات عبر Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedFridgeDetail(null)}
                className="py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: RESTAURANT DETAILS ===================== */}
      {selectedRestaurantDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-orange-700 text-white flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-600 text-orange-100">
                  {selectedRestaurantDetail.governorate} • {selectedRestaurantDetail.area}
                </span>
                <h3 className="text-lg font-black text-white leading-tight">
                  {selectedRestaurantDetail.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRestaurantDetail(null)}
                className="p-1.5 text-orange-200 hover:text-white rounded-xl bg-orange-600/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-950 block">الوجبات المتوفرة اليوم مجاناً:</span>
                  <span className="text-lg font-black text-orange-700 font-mono">
                    {selectedRestaurantDetail.available_meals_today} وجبة
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">نوع الوجبات:</span>
                <p className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed font-semibold">
                  {selectedRestaurantDetail.meal_type}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">أوقات التوزيع والاستلام:</span>
                <p className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>{selectedRestaurantDetail.working_hours}</span>
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="font-bold text-emerald-900 block text-xs">تعليمات الاستلام وحفظ الكرامة:</span>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  {selectedRestaurantDetail.instructions}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">العنوان ورقم التواصل:</span>
                <p className="text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedRestaurantDetail.address}</span>
                </p>
                <p className="text-slate-600 flex items-center gap-1.5 pt-1">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono font-bold" dir="ltr">{selectedRestaurantDetail.phone}</span>
                </p>
              </div>

              {selectedRestaurantDetail.sponsor_name && (
                <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                  الجهة الراعية / المتبرع: <strong>{selectedRestaurantDetail.sponsor_name}</strong>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <a
                href={getGoogleMapsDirectionsUrl(
                  selectedRestaurantDetail.lat,
                  selectedRestaurantDetail.lng
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Navigation className="w-4 h-4" />
                <span>فتح الاتجاهات عبر Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedRestaurantDetail(null)}
                className="py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SIMULATOR MODAL ===================== */}
      <IoTSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        refrigerators={refrigerators}
        onUpdateRefrigerator={handleUpdateRefrigerator}
      />
    </div>
  );
};

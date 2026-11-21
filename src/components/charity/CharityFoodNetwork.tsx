'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CharityRefrigerator } from '@/types/charity';
import {
  INITIAL_CHARITY_REFRIGERATORS,
  ALL_JORDAN_GOVERNORATES,
  calculateDistanceKm,
  getGoogleMapsDirectionsUrl,
  GOVERNORATE_COORDINATES,
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
  Thermometer,
  Clock,
  ChevronRight,
  ExternalLink,
  X,
  AlertCircle,
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

  // Filter States
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState('');

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedFridgeDetail, setSelectedFridgeDetail] = useState<CharityRefrigerator | null>(null);

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

  // Robust Progressive Geolocation
  const handleGetLocation = () => {
    if (userLocation) {
      // Toggle off
      setUserLocation(null);
      setLocationNotice('تم إلغاء تفعيل الموقع وعرض الترتيب الافتراضي');
      setTimeout(() => setLocationNotice(''), 3000);
      return;
    }

    if (!navigator.geolocation) {
      fallbackToGovernorate('خاصية تحديد الموقع الجغرافي غير مدعومة في متصفحك');
      return;
    }

    setIsLocating(true);
    setLocationNotice('');

    // Attempt 1: Fast Wi-Fi / IP / Cell location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setLocationNotice('✓ تم تحديد موقعك بنجاح وعرض المساجد الأقرب إليك أولاً');
        setTimeout(() => setLocationNotice(''), 4000);
      },
      () => {
        // Attempt 2: High accuracy GPS attempt
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setIsLocating(false);
            setLocationNotice('✓ تم تحديد موقعك الدقيق بالـ GPS');
            setTimeout(() => setLocationNotice(''), 4000);
          },
          (err) => {
            setIsLocating(false);
            if (err.code === 1) {
              fallbackToGovernorate('تم رفض إذن الوصول للموقع في المتصفح. يمكنك اختيار محافظتك لتحديد الأقرب.');
            } else {
              fallbackToGovernorate('تعذر التقاط إشارة GPS بدقة. تم استخدام موقع مركز المحافظة كمرجع للمسافات.');
            }
          },
          { timeout: 7000, enableHighAccuracy: true }
        );
      },
      { timeout: 5000, enableHighAccuracy: false, maximumAge: 120000 }
    );
  };

  // Helper when GPS fails: use governorate center coordinates
  const fallbackToGovernorate = (msg: string) => {
    const gov = selectedGovernorate !== 'الكل' ? selectedGovernorate : 'عمان';
    const coords = GOVERNORATE_COORDINATES[gov] || { lat: 31.9539, lng: 35.9106 };
    setUserLocation(coords);
    setLocationNotice(`${msg} (المرجع الحالي: مركز ${gov})`);
    setTimeout(() => setLocationNotice(''), 6000);
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

  // Calculate Overview Statistics for Mosque Fridges
  const stats = useMemo(() => {
    const totalRefrigerators = refrigerators.length;
    const availableRefrigerators = refrigerators.filter((r) => r.status === 'food_available').length;
    const emptyRefrigerators = refrigerators.filter((r) => r.status === 'empty').length;
    const totalMealsAvailable = refrigerators
      .filter((r) => r.status === 'food_available')
      .reduce((sum, r) => sum + (r.estimated_meals_count || 0), 0);

    return {
      totalRefrigerators,
      availableRefrigerators,
      emptyRefrigerators,
      totalMealsAvailable,
    };
  }, [refrigerators]);

  // Compute Fridges with Distance & Filter
  const filteredFridges = useMemo(() => {
    let list = refrigerators.map((fridge) => {
      const distance = userLocation
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, fridge.lat, fridge.lng)
        : null;
      return {
        ...fridge,
        distance,
      };
    });

    // Filter by Governorate
    if (selectedGovernorate !== 'الكل') {
      list = list.filter((f) => f.governorate === selectedGovernorate);
    }

    // Filter by Availability Only
    if (availabilityOnly) {
      list = list.filter((f) => f.status === 'food_available');
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.mosque_name.toLowerCase().includes(q) ||
          f.area.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.food_description.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q)
      );
    }

    // Sort by Distance if Location Active, otherwise Prioritize Available Fridges
    if (userLocation) {
      list.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    } else {
      list.sort((a, b) => {
        const aAvail = a.status === 'food_available';
        const bAvail = b.status === 'food_available';
        if (aAvail && !bAvail) return -1;
        if (!aAvail && bAvail) return 1;
        return 0;
      });
    }

    return list;
  }, [refrigerators, selectedGovernorate, availabilityOnly, searchQuery, userLocation]);

  return (
    <div className="min-h-screen bg-slate-950/5 flex flex-col font-sans pb-16">
      {/* ===================== HERO BANNER ===================== */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white pt-8 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Top Bar Controls */}
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
                  <span>محاكي الحساسات (خاص بالإدارة)</span>
                </button>
              </div>
            )}
          </div>

          {/* Hero Titles */}
          <div className="space-y-2 text-center sm:text-right max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>مبادرة وطنية لحفظ النعمة وإطعام الطعام في مساجد الأردن</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              شبكة <span className="text-emerald-400">ثلاجات الخير</span> في مساجد المملكة
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              دليل مباشر لمعرفة أماكن توفر الطعام في ثلاجات المساجد والتوجه إليها مباشرة عبر خرائط Google دون عناء الذهاب لمكان فارغ.
            </p>
          </div>

          {/* Statistics Metrics Bar (4 Clean Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
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

            <div className="bg-cyan-950/60 backdrop-blur-sm border border-cyan-700/60 rounded-2xl p-3 text-center sm:text-right">
              <span className="text-[10px] text-cyan-300 block font-medium">وجبات متوفرة اليوم</span>
              <span className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">
                {stats.totalMealsAvailable}+ وجبة
              </span>
            </div>

            <div className="bg-amber-950/60 backdrop-blur-sm border border-amber-700/60 rounded-2xl p-3 text-center sm:text-right">
              <span className="text-[10px] text-amber-300 block font-medium">فارغة بانتظار التعبئة</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
                {stats.emptyRefrigerators} ثلاجة
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONTROLS & FILTER TOOLBAR ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 relative z-20 w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
          {/* Row 1: Location & Search & Mode Switch */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* GPS Location Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className={`py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer ${
                  userLocation
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>
                  {isLocating
                    ? 'جاري تحديد موقعك...'
                    : userLocation
                    ? '✓ الموقع مفعل (الترتيب بالأقرب) - انقر للإلغاء'
                    : 'تحديد موقعي الأقرب (GPS)'}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المسجد، الحي، أو نوع الطعام..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pr-10 pl-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            {/* View Mode Toggle: Cards List vs Google Map */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>قائمة المساجد</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>خريطة Google</span>
              </button>
            </div>
          </div>

          {/* Location Feedback Notice */}
          {locationNotice && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{locationNotice}</span>
            </div>
          )}

          {/* Row 2: Governorate Dropdown & Availability Checkbox */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            {/* Governorate Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
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

            {/* Checkbox: Available Only */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>عرض الثلاجات المتوفر بها طعام فقط</span>
            </label>
          </div>
        </div>
      </section>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 w-full flex-1">
        {/* VIEW 1: INTERACTIVE GOOGLE MAP */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <CharityMap
              refrigerators={refrigerators}
              userLocation={userLocation}
              selectedGovernorate={selectedGovernorate}
              onSelectRefrigerator={(fridge) => setSelectedFridgeDetail(fridge)}
            />
          </div>
        ) : (
          /* VIEW 2: CARDS LIST VIEW */
          <div className="space-y-6">
            {/* Header info showing count and sorting */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 pb-1">
              <span>
                عرض <strong>{filteredFridges.length}</strong> ثلاجة مسجد في{' '}
                <strong className="text-emerald-700">
                  {selectedGovernorate === 'الكل' ? 'كافة محافظات المملكة' : `محافظة ${selectedGovernorate}`}
                </strong>
              </span>

              {userLocation && (
                <span className="text-blue-700 font-bold flex items-center gap-1 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                  <Compass className="w-3.5 h-3.5" />
                  <span>النتائج مرتبة حسب الأقرب لموقعك</span>
                </span>
              )}
            </div>

            {/* Empty State */}
            {filteredFridges.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  لا توجد مساجد تطابق خيارات البحث الحالية
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  جرب تغيير المحافظة أو إلغاء فلتر «عرض المتوفر به طعام فقط» لاستعراض كافة ثلاجات المساجد.
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
              /* Fridges Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredFridges.map((fridge) => {
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
                      <div className="space-y-3">
                        {/* Header: Mosque name & Distance */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                              مسجد • {fridge.governorate}
                            </span>
                            <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                              {fridge.mosque_name}
                            </h3>
                          </div>

                          {fridge.distance !== null && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0 font-mono">
                              <Compass className="w-3 h-3 text-blue-600" />
                              <span>{fridge.distance} كم</span>
                            </span>
                          )}
                        </div>

                        {/* Location Address */}
                        <p className="text-xs text-slate-600 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{fridge.address}</span>
                        </p>

                        {/* Status Card Box */}
                        <div
                          className={`p-3.5 rounded-2xl border space-y-2 ${
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
                              {fridge.area}
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

                        {/* Preservation & Update Info */}
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

                      {/* Card Actions: Direct Google Maps Navigation */}
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                        <a
                          href={getGoogleMapsDirectionsUrl(fridge.lat, fridge.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>فتح المسار في خرائط Google</span>
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
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===================== FRIDGE DETAILS MODAL ===================== */}
      {selectedFridgeDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    {selectedFridgeDetail.mosque_name}
                  </h3>
                  <span className="text-[10px] text-emerald-200">
                    {selectedFridgeDetail.governorate} - {selectedFridgeDetail.area}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFridgeDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Status Banner */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">حالة توفر الطعام:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedFridgeDetail.status === 'food_available'
                      ? 'يتوفر طعام جاهز للاستلام'
                      : selectedFridgeDetail.status === 'empty'
                      ? 'الثلاجة فارغة بانتظار تعبئة جديدة'
                      : 'غير متاح للتوزيع حالياً'}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    selectedFridgeDetail.status === 'food_available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedFridgeDetail.status === 'empty'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {selectedFridgeDetail.status === 'food_available'
                    ? `متوفر (${selectedFridgeDetail.estimated_meals_count} وجبة)`
                    : selectedFridgeDetail.status === 'empty'
                    ? 'فارغة حالياً'
                    : 'غير متاح'}
                </span>
              </div>

              {/* Food Description */}
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">محتوى الأطعمة المتاحة:</span>
                <p className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedFridgeDetail.food_description}
                </p>
              </div>

              {/* Real Google Map Embed for this specific Mosque */}
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">موقع المسجد على الخريطة:</span>
                <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <iframe
                    title={selectedFridgeDetail.mosque_name}
                    src={`https://maps.google.com/maps?q=${selectedFridgeDetail.lat},${selectedFridgeDetail.lng}&z=16&hl=ar&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Exact Address */}
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

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
              <a
                href={getGoogleMapsDirectionsUrl(selectedFridgeDetail.lat, selectedFridgeDetail.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
              >
                <Navigation className="w-4 h-4" />
                <span>فتح المسار المباشر في تطبيق خرائط Google</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedFridgeDetail(null)}
                className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SIMULATOR MODAL (ADMIN ONLY) ===================== */}
      {isAdmin && (
        <IoTSimulatorModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          refrigerators={refrigerators}
          onUpdateRefrigerator={handleUpdateRefrigerator}
        />
      )}
    </div>
  );
};

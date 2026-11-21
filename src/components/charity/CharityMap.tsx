'use client';

import React, { useState } from 'react';
import { CharityRefrigerator, FreeFoodRestaurant } from '@/types/charity';
import { getGoogleMapsDirectionsUrl } from '@/lib/data/charity-data';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Layers,
  Thermometer,
  Battery,
  Clock,
  Sparkles,
  Utensils,
  Maximize2,
  X,
  Compass
} from 'lucide-react';

interface CharityMapProps {
  refrigerators: CharityRefrigerator[];
  restaurants: FreeFoodRestaurant[];
  userLocation: { lat: number; lng: number } | null;
  selectedCategory: 'all' | 'refrigerators' | 'restaurants';
  onSelectRefrigerator: (refrigerator: CharityRefrigerator) => void;
  onSelectRestaurant: (restaurant: FreeFoodRestaurant) => void;
  selectedGovernorate: string;
}

export const CharityMap: React.FC<CharityMapProps> = ({
  refrigerators,
  restaurants,
  userLocation,
  selectedCategory,
  onSelectRefrigerator,
  onSelectRestaurant,
  selectedGovernorate,
}) => {
  const [activePin, setActivePin] = useState<{
    type: 'refrigerator' | 'restaurant';
    data: CharityRefrigerator | FreeFoodRestaurant;
  } | null>(null);

  // Jordan Western Corridor Bounding Box for High-Precision Marker Placement
  // North: 32.7 (Irbid/Ramtha), South: 29.4 (Aqaba)
  // West: 34.9 (Aqaba/Dead Sea), East: 36.4 (Zarqa/Mafraq)
  const MIN_LAT = 29.4;
  const MAX_LAT = 32.7;
  const MIN_LNG = 34.9;
  const MAX_LNG = 36.4;

  const getCoordinatesPercent = (lat: number, lng: number) => {
    // Clamp to bounds
    const clampedLat = Math.max(MIN_LAT, Math.min(MAX_LAT, lat));
    const clampedLng = Math.max(MIN_LNG, Math.min(MAX_LNG, lng));

    // Invert Y because SVG/HTML Y=0 is top (North)
    const y = ((MAX_LAT - clampedLat) / (MAX_LAT - MIN_LAT)) * 100;
    const x = ((clampedLng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;

    return {
      top: `${Math.max(6, Math.min(94, y))}%`,
      left: `${Math.max(6, Math.min(94, x))}%`,
    };
  };

  const filteredRefrigerators =
    selectedCategory === 'restaurants'
      ? []
      : selectedGovernorate === 'الكل'
      ? refrigerators
      : refrigerators.filter((r) => r.governorate === selectedGovernorate);

  const filteredRestaurants =
    selectedCategory === 'refrigerators'
      ? []
      : selectedGovernorate === 'الكل'
      ? restaurants
      : restaurants.filter((r) => r.governorate === selectedGovernorate);

  return (
    <div className="relative w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl select-none">
      
      {/* Top Map Header Controls */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-white shadow-lg text-xs font-bold">
          <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span>خريطة شبكة الخير التفاعلية - المملكة الأردنية الهاشمية</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl text-[11px] text-slate-300 font-bold hidden sm:flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>ثلاجة متوفرة</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>ثلاجة فارغة</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
              <span>غير متصلة</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span>مطعم وجبات</span>
            </span>
          </div>
        </div>
      </div>

      {/* Map Canvas with Stylized Jordan Topography */}
      <div className="relative w-full h-[450px] sm:h-[550px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden cursor-crosshair">
        
        {/* Subtle Map Grid Lines */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Jordan Stylized Geographical Regions Labels */}
        <div className="absolute inset-0 pointer-events-none text-slate-700 font-black text-[10px] sm:text-xs">
          <span className="absolute top-[8%] left-[70%] tracking-widest uppercase">إربد / الرمثا 🇯🇴</span>
          <span className="absolute top-[18%] left-[80%] tracking-widest uppercase">المفرق / البادية</span>
          <span className="absolute top-[28%] left-[62%] tracking-widest uppercase">جرش وعجلون</span>
          <span className="absolute top-[38%] left-[66%] tracking-widest uppercase text-emerald-500/40 text-sm">العاصمة عمّان</span>
          <span className="absolute top-[42%] left-[45%] tracking-widest uppercase">البلقاء / السلط</span>
          <span className="absolute top-[46%] left-[78%] tracking-widest uppercase">الزرقاء</span>
          <span className="absolute top-[55%] left-[58%] tracking-widest uppercase">مادبا</span>
          <span className="absolute top-[70%] left-[52%] tracking-widest uppercase">الكرك / مؤاب</span>
          <span className="absolute top-[80%] left-[48%] tracking-widest uppercase">الطفيلة</span>
          <span className="absolute top-[86%] left-[58%] tracking-widest uppercase">معان</span>
          <span className="absolute bottom-[6%] left-[25%] tracking-widest uppercase text-emerald-500/40 text-sm">العقبة / البحر الأحمر</span>
        </div>

        {/* User GPS Location Marker (Pulsing blue radar) */}
        {userLocation && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            style={getCoordinatesPercent(userLocation.lat, userLocation.lng)}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
              <span className="absolute w-5 h-5 rounded-full bg-blue-500/50" />
              <span className="w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow-md" />
            </div>
            <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-900/90 text-blue-200 border border-blue-600/60 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              موقعك الحالي
            </span>
          </div>
        )}

        {/* Refrigerator Mosque Pins */}
        {filteredRefrigerators.map((fridge) => {
          const coords = getCoordinatesPercent(fridge.lat, fridge.lng);
          const isAvailable = fridge.status === 'food_available';
          const isEmpty = fridge.status === 'empty';
          const isOffline = fridge.status === 'offline';

          return (
            <button
              key={fridge.id}
              type="button"
              onClick={() => setActivePin({ type: 'refrigerator', data: fridge })}
              className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none transition-transform hover:scale-125 hover:z-40"
              style={coords}
              title={`${fridge.mosque_name} (${fridge.status})`}
            >
              <div className="relative flex items-center justify-center">
                {/* Glow ring if food is available */}
                {isAvailable && (
                  <span className="absolute -inset-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
                )}

                {/* Marker Body */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-2xl flex items-center justify-center shadow-lg border-2 transition ${
                    isAvailable
                      ? 'bg-emerald-600 border-emerald-300 text-white'
                      : isEmpty
                      ? 'bg-amber-600 border-amber-300 text-white'
                      : 'bg-slate-700 border-slate-500 text-slate-300'
                  }`}
                >
                  {/* Mosque Crescent / Minaret Icon */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2c.5 1.5 2 2.5 3.5 2.5s3-1 3.5-2.5c.3 1.2 1.5 2 2.8 2 0 3-2 6-5.8 7.5V22h-8V11.5C4.2 10 2.2 7 2.2 4c1.3 0 2.5-.8 2.8-2 .5 1.5 2 2.5 3.5 2.5S11.5 3.5 12 2z" />
                  </svg>
                </div>

                {/* Mini badge for fill percentage */}
                {isAvailable && (
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-emerald-400 text-slate-950 font-black text-[9px] rounded-full border border-slate-900 shadow-xs">
                    {fridge.estimated_meals_count}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Restaurant Pins */}
        {filteredRestaurants.map((rest) => {
          const coords = getCoordinatesPercent(rest.lat, rest.lng);

          return (
            <button
              key={rest.id}
              type="button"
              onClick={() => setActivePin({ type: 'restaurant', data: rest })}
              className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none transition-transform hover:scale-125 hover:z-40"
              style={coords}
              title={`${rest.name} (${rest.available_meals_today} وجبة)`}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute -inset-1 rounded-full bg-orange-500/30 animate-pulse" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-2xl bg-orange-600 border-2 border-orange-300 text-white flex items-center justify-center shadow-lg">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-orange-400 text-slate-950 font-black text-[9px] rounded-full border border-slate-900 shadow-xs">
                  {rest.available_meals_today}
                </span>
              </div>
            </button>
          );
        })}

        {/* ===================== ACTIVE PIN DETAIL MODAL POPUP ===================== */}
        {activePin && (
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:w-96 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-3xl p-4 sm:p-5 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    activePin.type === 'refrigerator'
                      ? (activePin.data as CharityRefrigerator).status === 'food_available'
                        ? 'bg-emerald-600 text-white'
                        : (activePin.data as CharityRefrigerator).status === 'empty'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  {activePin.type === 'refrigerator' ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2c.5 1.5 2 2.5 3.5 2.5s3-1 3.5-2.5c.3 1.2 1.5 2 2.8 2 0 3-2 6-5.8 7.5V22h-8V11.5C4.2 10 2.2 7 2.2 4c1.3 0 2.5-.8 2.8-2 .5 1.5 2 2.5 3.5 2.5S11.5 3.5 12 2z" />
                    </svg>
                  ) : (
                    <Utensils className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {activePin.type === 'refrigerator'
                        ? 'ثلاجة مسجد ذكية'
                        : 'مطعم وجبات مجانية'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {activePin.data.governorate} • {activePin.data.area}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mt-0.5 leading-snug">
                    {activePin.type === 'refrigerator'
                      ? (activePin.data as CharityRefrigerator).mosque_name
                      : (activePin.data as FreeFoodRestaurant).name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePin(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Specific to Pin */}
            {activePin.type === 'refrigerator' ? (
              (() => {
                const fridge = activePin.data as CharityRefrigerator;
                const isAvail = fridge.status === 'food_available';
                const isEmpty = fridge.status === 'empty';

                return (
                  <div className="py-3 space-y-2.5 text-xs">
                    {/* Status Pill & Sensor Data */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isAvail
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isEmpty
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700 text-slate-300 border border-slate-600'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAvail ? 'bg-emerald-400 animate-pulse' : isEmpty ? 'bg-amber-400' : 'bg-slate-400'
                          }`}
                        />
                        <span>
                          {isAvail
                            ? `يوجد طعام (${fridge.estimated_meals_count} وجبة)`
                            : isEmpty
                            ? 'الثلاجة فارغة حالياً'
                            : 'جهاز الاستشعار غير متصل'}
                        </span>
                      </span>

                      {/* Sensor ID badge */}
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {fridge.id}
                      </span>
                    </div>

                    {/* Sensor Telemetry Bar */}
                    {isAvail && (
                      <div className="space-y-1 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>نسبة امتلاء الثلاجة:</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {fridge.fill_percentage}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${fridge.fill_percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-cyan-400" />
                            <span>{fridge.temperature_celsius}°C</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Battery className="w-3 h-3 text-emerald-400" />
                            <span>{fridge.sensor_battery_level}%</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Food Items Description */}
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {fridge.food_description}
                    </p>

                    <p className="text-slate-400 text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{fridge.address}</span>
                    </p>
                  </div>
                );
              })()
            ) : (
              (() => {
                const rest = activePin.data as FreeFoodRestaurant;

                return (
                  <div className="py-3 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>متوفر اليوم: {rest.available_meals_today} وجبة مجانية</span>
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {rest.phone}
                      </span>
                    </div>

                    <p className="text-slate-200 text-xs font-semibold">
                      {rest.meal_type}
                    </p>

                    <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 space-y-1 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>أوقات التوزيع: {rest.working_hours}</span>
                      </div>
                      <p className="text-emerald-300/90 text-[10px] leading-relaxed">
                        {rest.instructions}
                      </p>
                    </div>

                    <p className="text-slate-400 text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{rest.address}</span>
                    </p>
                  </div>
                );
              })()
            )}

            {/* Action Buttons: Full View & Google Maps Directions */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={getGoogleMapsDirectionsUrl(activePin.data.lat, activePin.data.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>الاتجاهات عبر Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (activePin.type === 'refrigerator') {
                    onSelectRefrigerator(activePin.data as CharityRefrigerator);
                  } else {
                    onSelectRestaurant(activePin.data as FreeFoodRestaurant);
                  }
                  setActivePin(null);
                }}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
              >
                <span>التفاصيل</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Map Legend Bar */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-4">
        <div className="flex items-center gap-4 text-[11px]">
          <span>
            الثلاجات المعروضة: <strong className="text-emerald-400 font-mono">{filteredRefrigerators.length}</strong>
          </span>
          <span>
            المطاعم المجانية: <strong className="text-orange-400 font-mono">{filteredRestaurants.length}</strong>
          </span>
          {userLocation && (
            <span className="text-blue-400 font-medium hidden sm:inline">
              ✓ تم تحديد موقعك الجغرافي لحساب المسافات بدقة
            </span>
          )}
        </div>

        <div className="text-[10px] text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>تحديث مباشر من حساسات إنترنت الأشياء (IoT)</span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useMemo } from 'react';
import { CharityRefrigerator } from '@/types/charity';
import { getGoogleMapsDirectionsUrl, calculateDistanceKm, GOVERNORATE_COORDINATES } from '@/lib/data/charity-data';
import {
  MapPin,
  Navigation,
  ExternalLink,
  CheckCircle2,
  Clock,
  Compass,
  Thermometer,
} from 'lucide-react';

interface CharityMapProps {
  refrigerators: CharityRefrigerator[];
  userLocation: { lat: number; lng: number } | null;
  onSelectRefrigerator: (refrigerator: CharityRefrigerator) => void;
  selectedGovernorate: string;
}

export const CharityMap: React.FC<CharityMapProps> = ({
  refrigerators,
  userLocation,
  onSelectRefrigerator,
  selectedGovernorate,
}) => {
  const filteredRefrigerators = useMemo(() => {
    let list =
      selectedGovernorate === 'الكل'
        ? refrigerators
        : refrigerators.filter((r) => r.governorate === selectedGovernorate);

    // Calculate distance if user location available
    if (userLocation) {
      list = [...list].sort((a, b) => {
        const distA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return list;
  }, [refrigerators, selectedGovernorate, userLocation]);

  const [activeFridge, setActiveFridge] = useState<CharityRefrigerator | null>(
    filteredRefrigerators[0] || null
  );

  // Sync active fridge when filtered list changes
  React.useEffect(() => {
    if (filteredRefrigerators.length > 0) {
      setActiveFridge(filteredRefrigerators[0]);
    } else {
      setActiveFridge(null);
    }
  }, [filteredRefrigerators]);

  // Center coordinate for Google Maps embed
  const mapCenter = useMemo(() => {
    if (activeFridge) {
      return `${activeFridge.lat},${activeFridge.lng}`;
    }
    if (selectedGovernorate !== 'الكل' && GOVERNORATE_COORDINATES[selectedGovernorate]) {
      const coords = GOVERNORATE_COORDINATES[selectedGovernorate];
      return `${coords.lat},${coords.lng}`;
    }
    if (userLocation) {
      return `${userLocation.lat},${userLocation.lng}`;
    }
    // Default: Amman, Jordan
    return '31.9539,35.9106';
  }, [activeFridge, selectedGovernorate, userLocation]);

  const embedUrl = `https://maps.google.com/maps?q=${mapCenter}&z=${activeFridge ? 16 : 12}&hl=ar&output=embed`;

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header */}
      <div className="p-4 bg-slate-800/90 border-b border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              خريطة Google التفاعلية لثلاجات المساجد
            </h3>
            <p className="text-[11px] text-slate-300">
              اختر أي مسجد لعرض موقعه المباشر والانتقال إليه فوراً عبر تطبيق خرائط Google
            </p>
          </div>
        </div>

        {activeFridge && (
          <a
            href={getGoogleMapsDirectionsUrl(activeFridge.lat, activeFridge.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>فتح المسار المباشر في خرائط Google</span>
          </a>
        )}
      </div>

      {/* Main Grid: Google Maps View + Mosque Quick List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Side: Real Google Maps Iframe */}
        <div className="lg:col-span-8 relative bg-slate-950 flex flex-col min-h-[380px] lg:min-h-[520px]">
          <iframe
            title="خريطة Google التفاعلية"
            src={embedUrl}
            className="w-full h-full min-h-[380px] lg:min-h-[520px] border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Floating active fridge info box over the map */}
          {activeFridge && (
            <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">
                      {activeFridge.mosque_name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        activeFridge.status === 'food_available'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : activeFridge.status === 'empty'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {activeFridge.status === 'food_available'
                        ? `متوفر طعام (${activeFridge.estimated_meals_count} وجبة)`
                        : activeFridge.status === 'empty'
                        ? 'الثلاجة فارغة حالياً'
                        : 'غير متاح للتوزيع حالياً'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{activeFridge.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getGoogleMapsDirectionsUrl(activeFridge.lat, activeFridge.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>الانتقال للمسجد</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelectRefrigerator(activeFridge)}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>التفاصيل</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Mosques List */}
        <div className="lg:col-span-4 bg-slate-900/90 border-t lg:border-t-0 lg:border-r border-slate-800 flex flex-col max-h-[520px]">
          <div className="p-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold">قائمة المساجد ({filteredRefrigerators.length})</span>
            {userLocation && (
              <span className="text-emerald-400 font-bold text-[11px]">✓ مرتبة بالأقرب لموقعك</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 space-y-1">
            {filteredRefrigerators.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                لا توجد ثلاجات مساجد مسجلة في هذه المحافظة حالياً
              </div>
            ) : (
              filteredRefrigerators.map((fridge) => {
                const isSelected = activeFridge?.id === fridge.id;
                const distance = userLocation
                  ? calculateDistanceKm(userLocation.lat, userLocation.lng, fridge.lat, fridge.lng)
                  : null;

                return (
                  <div
                    key={fridge.id}
                    onClick={() => setActiveFridge(fridge)}
                    className={`p-3 rounded-2xl cursor-pointer transition text-right space-y-2 ${
                      isSelected
                        ? 'bg-emerald-950/40 border border-emerald-500/40'
                        : 'bg-slate-800/40 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white leading-tight">
                          {fridge.mosque_name}
                        </h4>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {fridge.governorate} - {fridge.area}
                        </span>
                      </div>

                      {distance !== null && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 shrink-0 font-mono">
                          {distance} كم
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          fridge.status === 'food_available'
                            ? 'text-emerald-400'
                            : fridge.status === 'empty'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            fridge.status === 'food_available'
                              ? 'bg-emerald-400'
                              : fridge.status === 'empty'
                              ? 'bg-amber-400'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span>
                          {fridge.status === 'food_available'
                            ? `متوفر (${fridge.estimated_meals_count} وجبة)`
                            : fridge.status === 'empty'
                            ? 'فارغة حالياً'
                            : 'غير متاح'}
                        </span>
                      </span>

                      <a
                        href={getGoogleMapsDirectionsUrl(fridge.lat, fridge.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                      >
                        <span>خرائط Google</span>
                        <Navigation className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-4">
        <span>
          إجمالي الثلاجات المعروضة:{' '}
          <strong className="text-emerald-400 font-mono">{filteredRefrigerators.length}</strong>
        </span>
        <span className="text-[11px]">
          تفتح جميع الاتجاهات مباشرة داخل تطبيق خرائط Google الرسمي
        </span>
      </div>
    </div>
  );
};

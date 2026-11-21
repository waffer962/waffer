'use client';

import React, { useState } from 'react';
import { CharityRefrigerator } from '@/types/charity';
import {
  Cpu,
  X,
  Play,
  RotateCcw,
  Wifi,
  WifiOff,
  Battery,
  Thermometer,
  PackageCheck,
  PackageX,
  Radio,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Activity
} from 'lucide-react';

interface IoTSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  refrigerators: CharityRefrigerator[];
  onUpdateRefrigerator: (updated: CharityRefrigerator) => void;
}

export const IoTSimulatorModal: React.FC<IoTSimulatorModalProps> = ({
  isOpen,
  onClose,
  refrigerators,
  onUpdateRefrigerator,
}) => {
  const [selectedFridgeId, setSelectedFridgeId] = useState<string>(
    refrigerators[0]?.id || ''
  );
  const [logs, setLogs] = useState<Array<{ time: string; text: string; type: 'success' | 'warn' | 'error' | 'info' }>>([
    {
      time: new Date().toLocaleTimeString('ar-JO'),
      text: 'تم تشغيل محاكي بروتوكول MQTT / HTTP IoT لشبكة ثلاجات مساجد الأردن بنجاح.',
      type: 'info',
    },
  ]);
  const [isAutoPulsing, setIsAutoPulsing] = useState(false);
  const pulseIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  if (!isOpen) return null;

  const activeFridge =
    refrigerators.find((r) => r.id === selectedFridgeId) || refrigerators[0];

  const addLog = (text: string, type: 'success' | 'warn' | 'error' | 'info' = 'info') => {
    setLogs((prev) => [
      { time: new Date().toLocaleTimeString('ar-JO'), text, type },
      ...prev.slice(0, 19),
    ]);
  };

  // Scenario 1: Refrigerator Becomes Empty (Food runs out)
  const triggerEmptyScenario = async () => {
    if (!activeFridge) return;
    const now = new Date().toISOString();
    const updated: CharityRefrigerator = {
      ...activeFridge,
      status: 'empty',
      fill_percentage: 0,
      estimated_meals_count: 0,
      food_description: 'فارغة حالياً (سجّل حساس الوزن الرقمي نفاد كامل الوجبات وبانتظار متطوعين لإعادة التعبئة)',
      last_sensor_update: now,
    };
    onUpdateRefrigerator(updated);
    addLog(`[حساس ${activeFridge.sensor_device_id}] تم استشعار تفريغ ${activeFridge.mosque_name} -> الحالة: فارغة (0%).`, 'warn');

    // Post to API
    fetch('/api/iot/refrigerator-telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sensor_device_id: activeFridge.sensor_device_id,
        refrigerator_id: activeFridge.id,
        status: 'empty',
        fill_percentage: 0,
        estimated_meals_count: 0,
      }),
    }).catch(() => {});
  };

  // Scenario 2: Volunteer Restocks Food (Becomes Food Available)
  const triggerRestockScenario = async () => {
    if (!activeFridge) return;
    const now = new Date().toISOString();
    const count = 30;
    const updated: CharityRefrigerator = {
      ...activeFridge,
      status: 'food_available',
      fill_percentage: 85,
      estimated_meals_count: count,
      food_description: '30 وجبة ساخنة مغلفة حرارياً (دجاج مع أرز، معلبات، تمر، ولبن طازج) مضافة من متطوع',
      last_sensor_update: now,
      last_restocked_at: now,
    };
    onUpdateRefrigerator(updated);
    addLog(`[حساس ${activeFridge.sensor_device_id}] إشارة وزن جديدة! تم رصد إضافة ${count} وجبة في ${activeFridge.mosque_name} -> الحالة: متوفرة (85%).`, 'success');

    // Post to API
    fetch('/api/iot/refrigerator-telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sensor_device_id: activeFridge.sensor_device_id,
        refrigerator_id: activeFridge.id,
        status: 'food_available',
        fill_percentage: 85,
        estimated_meals_count: count,
      }),
    }).catch(() => {});
  };

  // Scenario 3: Sensor Disconnects (Offline)
  const triggerOfflineScenario = async () => {
    if (!activeFridge) return;
    const now = new Date().toISOString();
    const updated: CharityRefrigerator = {
      ...activeFridge,
      status: 'offline',
      fill_percentage: 0,
      estimated_meals_count: 0,
      sensor_battery_level: 0,
      sensor_signal_strength: 'offline',
      last_sensor_update: now,
      food_description: 'غير متصل بالشبكة - جهاز الاستشعار متوقف عن إرسال الإشارات',
    };
    onUpdateRefrigerator(updated);
    addLog(`[حساس ${activeFridge.sensor_device_id}] تحذير: انقطع الاتصال اللاسلكي مع ${activeFridge.mosque_name} -> الحالة: غير متصل (Offline).`, 'error');

    // Post to API
    fetch('/api/iot/refrigerator-telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sensor_device_id: activeFridge.sensor_device_id,
        refrigerator_id: activeFridge.id,
        status: 'offline',
        fill_percentage: 0,
        battery_level: 0,
        signal_strength: 'offline',
      }),
    }).catch(() => {});
  };

  // Scenario 4: Reconnect Sensor
  const triggerReconnectScenario = async () => {
    if (!activeFridge) return;
    const now = new Date().toISOString();
    const updated: CharityRefrigerator = {
      ...activeFridge,
      status: 'food_available',
      fill_percentage: 70,
      estimated_meals_count: 22,
      sensor_battery_level: 100,
      sensor_signal_strength: 'excellent',
      last_sensor_update: now,
      food_description: 'تمت الصيانة واستعادة الاتصال، يتوفر 22 وجبة طازجة معلبة',
    };
    onUpdateRefrigerator(updated);
    addLog(`[حساس ${activeFridge.sensor_device_id}] تمت استعادة الاتصال مع خادم المنصة لثلاجة ${activeFridge.mosque_name}.`, 'success');

    // Post to API
    fetch('/api/iot/refrigerator-telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sensor_device_id: activeFridge.sensor_device_id,
        refrigerator_id: activeFridge.id,
        status: 'food_available',
        battery_level: 100,
        signal_strength: 'excellent',
      }),
    }).catch(() => {});
  };

  // Toggle Automated Live Pulse
  const toggleAutoPulse = () => {
    if (isAutoPulsing) {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
      setIsAutoPulsing(false);
      addLog('تم إيقاف النبض التلقائي لحساسات IoT.', 'info');
    } else {
      setIsAutoPulsing(true);
      addLog('تم تفعيل النبض التلقائي الحي: الحساسات سترسل إشارات دورية كل 4 ثوانٍ...', 'info');
      pulseIntervalRef.current = setInterval(() => {
        // Pick a random refrigerator and fluctuate temperature or meals
        const randomIndex = Math.floor(Math.random() * refrigerators.length);
        const target = refrigerators[randomIndex];
        if (target && target.status !== 'offline') {
          const deltaTemp = (Math.random() * 0.4 - 0.2);
          const newTemp = Math.round((target.temperature_celsius + deltaTemp) * 10) / 10;
          const updated: CharityRefrigerator = {
            ...target,
            temperature_celsius: Math.max(2.5, Math.min(5.5, newTemp)),
            last_sensor_update: new Date().toISOString(),
          };
          onUpdateRefrigerator(updated);
          addLog(`[حساس ${target.sensor_device_id}] نبض دوري ناجح لـ ${target.mosque_name}: حرارة ${newTemp}°C.`, 'info');
        }
      }, 4000);
    }
  };

  React.useEffect(() => {
    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  محاكي حساسات ثلاجات الخير الذكية (IoT Simulator)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                اختبار تفاعلي يحاكي أجهزة الاستشعار الإلكترونية في مساجد الأردن لحظياً
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-700/60 hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-200 text-xs">
          
          {/* Target Refrigerator Selector */}
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              اختر الثلاجة المراد اختبار وتعديل حساساتها:
            </label>
            <select
              value={selectedFridgeId}
              onChange={(e) => setSelectedFridgeId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              {refrigerators.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.governorate} • {f.mosque_name} ({f.id} - {f.status})
                </option>
              ))}
            </select>

            {/* Currently Active Refrigerator Quick Telemetry */}
            {activeFridge && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">الحالة الحالية:</span>
                  <span
                    className={`font-bold ${
                      activeFridge.status === 'food_available'
                        ? 'text-emerald-400'
                        : activeFridge.status === 'empty'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {activeFridge.status === 'food_available'
                      ? 'يوجد طعام'
                      : activeFridge.status === 'empty'
                      ? 'فارغة'
                      : 'غير متصل (Offline)'}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">نسبة الامتلاء:</span>
                  <span className="font-bold text-white font-mono">{activeFridge.fill_percentage}%</span>
                </div>

                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">الحرارة الداخلية:</span>
                  <span className="font-bold text-cyan-400 font-mono">{activeFridge.temperature_celsius}°C</span>
                </div>

                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700/80">
                  <span className="text-slate-400 block text-[10px]">بطارية الحساس:</span>
                  <span className="font-bold text-emerald-400 font-mono">{activeFridge.sensor_battery_level}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Scenario Buttons */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>السيناريوهات الستة للمحاكاة الفورية:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Scenario 1: Empty */}
              <button
                type="button"
                onClick={triggerEmptyScenario}
                className="p-3 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-2xl text-right transition cursor-pointer flex items-start gap-3 active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <PackageX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-200 text-xs">
                    1. محاكاة نفاد الطعام (Empty)
                  </h4>
                  <p className="text-[10px] text-amber-300/70 mt-0.5">
                    استشعار تفريغ الوجبات وتحويل الحالة فوراً إلى «فارغة 0%».
                  </p>
                </div>
              </button>

              {/* Scenario 2: Restock */}
              <button
                type="button"
                onClick={triggerRestockScenario}
                className="p-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-2xl text-right transition cursor-pointer flex items-start gap-3 active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-200 text-xs">
                    2. إضافة وجبات من متطوع (Restock)
                  </h4>
                  <p className="text-[10px] text-emerald-300/70 mt-0.5">
                    استشعار وزن الوجبات الجديدة وتحويل الحالة إلى «يوجد طعام».
                  </p>
                </div>
              </button>

              {/* Scenario 3: Disconnect */}
              <button
                type="button"
                onClick={triggerOfflineScenario}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-right transition cursor-pointer flex items-start gap-3 active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">
                    3. انقطاع الاتصال (Offline)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    فصل الحساس لمنع إظهار الثلاجة كمتوفرة عند غياب البيانات.
                  </p>
                </div>
              </button>

              {/* Scenario 4: Reconnect */}
              <button
                type="button"
                onClick={triggerReconnectScenario}
                className="p-3 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-2xl text-right transition cursor-pointer flex items-start gap-3 active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-cyan-200 text-xs">
                    4. إعادة توصيل الحساس (Online)
                  </h4>
                  <p className="text-[10px] text-cyan-300/70 mt-0.5">
                    استعادة الإشارة وقراءة البيانات الحية بنجاح.
                  </p>
                </div>
              </button>
            </div>

            {/* Scenario 5: Automated Pulse Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={toggleAutoPulse}
                className={`w-full p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  isAutoPulsing
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>
                  {isAutoPulsing
                    ? 'إيقاف النبض التلقائي للحساسات (Active Telemetry)'
                    : '5. تشغيل النبض التلقائي للحساسات (Automated IoT Pulse)'}
                </span>
              </button>
            </div>
          </div>

          {/* IoT Telemetry Console Logs */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
              <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>سجل إشارات حساسات إنترنت الأشياء (Live Telemetry Log):</span>
              </span>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                مسح السجل
              </button>
            </div>

            <div className="space-y-1 font-mono text-[10px] max-h-32 overflow-y-auto leading-relaxed">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    log.type === 'success'
                      ? 'text-emerald-400'
                      : log.type === 'warn'
                      ? 'text-amber-400'
                      : log.type === 'error'
                      ? 'text-red-400'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/60 border-t border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            واجهة برمجية جاهزة للربط المستقبلي: <code className="text-emerald-400 font-mono">/api/iot/refrigerator-telemetry</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer transition shadow-sm"
          >
            إغلاق المحاكي
          </button>
        </div>
      </div>
    </div>
  );
};

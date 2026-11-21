'use client';

import React, { useState } from 'react';
import { CharityRefrigerator, FreeFoodRestaurant } from '@/types/charity';
import { ALL_JORDAN_GOVERNORATES } from '@/lib/data/charity-data';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Radio,
  Wifi,
  WifiOff,
  Battery,
  Thermometer,
  Utensils,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
} from 'lucide-react';

interface AdminCharityManagerProps {
  refrigerators: CharityRefrigerator[];
  restaurants: FreeFoodRestaurant[];
  onUpdateRefrigerators: (fridges: CharityRefrigerator[]) => void;
  onUpdateRestaurants: (rests: FreeFoodRestaurant[]) => void;
}

export const AdminCharityManager: React.FC<AdminCharityManagerProps> = ({
  refrigerators,
  restaurants,
  onUpdateRefrigerators,
  onUpdateRestaurants,
}) => {
  const [activeTab, setActiveTab] = useState<'refrigerators' | 'restaurants'>('refrigerators');

  // Add Refrigerator Form State
  const [isAddFridgeOpen, setIsAddFridgeOpen] = useState(false);
  const [fridgeForm, setFridgeForm] = useState<Partial<CharityRefrigerator>>({
    governorate: 'عمان',
    status: 'food_available',
    fill_percentage: 80,
    temperature_celsius: 4.0,
    estimated_meals_count: 25,
    sensor_battery_level: 95,
    sensor_signal_strength: 'excellent',
    food_description: 'وجبات ساخنة طازجة، خبز ومعلبات',
  });

  // Add Restaurant Form State
  const [isAddRestOpen, setIsAddRestOpen] = useState(false);
  const [restForm, setRestForm] = useState<Partial<FreeFoodRestaurant>>({
    governorate: 'عمان',
    available_meals_today: 30,
    working_hours: 'يومياً من 2:00 ظهراً حتى 6:00 مساءً',
    instructions: 'الاستلام مباشر بكل مودة واحترام وكرامة وبدون أي مقابل.',
    meal_type: 'وجبات ساخنة يومية (أرز ودجاج / خضار مطبوخ)',
  });

  // Refrigerator Actions
  const handleSaveFridge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fridgeForm.mosque_name || !fridgeForm.area) return;

    const newFridge: CharityRefrigerator = {
      id: fridgeForm.id || `FRIDGE-${Date.now().toString().slice(-4)}`,
      mosque_id: `MSQ-${Date.now().toString().slice(-4)}`,
      mosque_name: fridgeForm.mosque_name || 'مسجد جديد',
      governorate: fridgeForm.governorate || 'عمان',
      area: fridgeForm.area || '',
      address: fridgeForm.address || `${fridgeForm.area}، ${fridgeForm.governorate}`,
      lat: fridgeForm.lat || 31.9539,
      lng: fridgeForm.lng || 35.9106,
      status: fridgeForm.status || 'food_available',
      fill_percentage: Number(fridgeForm.fill_percentage) || 75,
      temperature_celsius: Number(fridgeForm.temperature_celsius) || 4.0,
      food_description: fridgeForm.food_description || 'وجبات غذائية طازجة',
      estimated_meals_count: Number(fridgeForm.estimated_meals_count) || 20,
      last_sensor_update: new Date().toISOString(),
      sensor_device_id: fridgeForm.sensor_device_id || `IOT-SENS-${Math.floor(1000 + Math.random() * 9000)}`,
      sensor_battery_level: Number(fridgeForm.sensor_battery_level) || 90,
      sensor_signal_strength: fridgeForm.sensor_signal_strength || 'excellent',
      is_demo: true,
    };

    onUpdateRefrigerators([newFridge, ...refrigerators]);
    setIsAddFridgeOpen(false);
    setFridgeForm({
      governorate: 'عمان',
      status: 'food_available',
      fill_percentage: 80,
      temperature_celsius: 4.0,
      estimated_meals_count: 25,
      sensor_battery_level: 95,
      sensor_signal_strength: 'excellent',
      food_description: 'وجبات ساخنة طازجة، خبز ومعلبات',
    });
  };

  const handleDeleteFridge = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الثلاجة من المنظومة؟')) {
      onUpdateRefrigerators(refrigerators.filter((f) => f.id !== id));
    }
  };

  const handleToggleFridgeStatus = (id: string, newStatus: CharityRefrigerator['status']) => {
    onUpdateRefrigerators(
      refrigerators.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            status: newStatus,
            fill_percentage: newStatus === 'empty' || newStatus === 'offline' ? 0 : f.fill_percentage || 70,
            estimated_meals_count: newStatus === 'empty' || newStatus === 'offline' ? 0 : f.estimated_meals_count || 20,
            last_sensor_update: new Date().toISOString(),
          };
        }
        return f;
      })
    );
  };

  // Restaurant Actions
  const handleSaveRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restForm.name || !restForm.area) return;

    const newRest: FreeFoodRestaurant = {
      id: `REST-${Date.now().toString().slice(-4)}`,
      name: restForm.name || 'مطعم خيري',
      governorate: restForm.governorate || 'عمان',
      area: restForm.area || '',
      address: restForm.address || `${restForm.area}، ${restForm.governorate}`,
      lat: restForm.lat || 31.9539,
      lng: restForm.lng || 35.9106,
      phone: restForm.phone || '065000000',
      available_meals_today: Number(restForm.available_meals_today) || 25,
      meal_type: restForm.meal_type || 'وجبات ساخنة يومية',
      working_hours: restForm.working_hours || 'يومياً من 2:00 ظهراً حتى 6:00 مساءً',
      instructions: restForm.instructions || 'الاستلام مباشر بكل مودة واحترام.',
      sponsor_name: restForm.sponsor_name,
    };

    onUpdateRestaurants([newRest, ...restaurants]);
    setIsAddRestOpen(false);
  };

  const handleDeleteRestaurant = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المطعم من القائمة الخيرية؟')) {
      onUpdateRestaurants(restaurants.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white space-y-6 select-none shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                إدارة شبكة ثلاجات الخير ومطاعم الوجبات المجانية (Admin Operations)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                لوحة المشرف
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              إضافة وتعديل ومراقبة ثلاجات المساجد الذكية وربط الحساسات الإلكترونية في كافة محافظات الأردن
            </p>
          </div>
        </div>

        {/* Switcher & Add Button */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-1 rounded-2xl border border-slate-700 flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('refrigerators')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'refrigerators'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ثلاجات المساجد ({refrigerators.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('restaurants')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'restaurants'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              مطاعم الوجبات ({restaurants.length})
            </button>
          </div>

          {activeTab === 'refrigerators' ? (
            <button
              type="button"
              onClick={() => setIsAddFridgeOpen(true)}
              className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة ثلاجة ذكية</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddRestOpen(true)}
              className="py-2 px-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مطعم خيري</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================== TAB 1: REFRIGERATORS MANAGEMENT ===================== */}
      {activeTab === 'refrigerators' && (
        <div className="space-y-4">
          
          {/* Add Form Drawer/Modal */}
          {isAddFridgeOpen && (
            <form onSubmit={handleSaveFridge} className="bg-slate-800/90 border border-slate-700 p-5 rounded-3xl space-y-4 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                <span className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>ربط ثلاجة ذكية جديدة بمسجد</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddFridgeOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم المسجد:</label>
                  <input
                    type="text"
                    required
                    value={fridgeForm.mosque_name || ''}
                    onChange={(e) => setFridgeForm({ ...fridgeForm, mosque_name: e.target.value })}
                    placeholder="مثال: مسجد الجامعة الأردنية"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المحافظة:</label>
                  <select
                    value={fridgeForm.governorate}
                    onChange={(e) => setFridgeForm({ ...fridgeForm, governorate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ALL_JORDAN_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المنطقة / الحي:</label>
                  <input
                    type="text"
                    required
                    value={fridgeForm.area || ''}
                    onChange={(e) => setFridgeForm({ ...fridgeForm, area: e.target.value })}
                    placeholder="مثال: الجبيهة"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">معرف جهاز الاستشعار (IoT Device ID):</label>
                  <input
                    type="text"
                    value={fridgeForm.sensor_device_id || ''}
                    onChange={(e) => setFridgeForm({ ...fridgeForm, sensor_device_id: e.target.value })}
                    placeholder="مثال: IOT-SENS-AMM-07"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">الحالة المبدئية:</label>
                  <select
                    value={fridgeForm.status}
                    onChange={(e) => setFridgeForm({ ...fridgeForm, status: e.target.value as CharityRefrigerator['status'] })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="food_available">يوجد طعام (Food Available)</option>
                    <option value="empty">فارغة (Empty)</option>
                    <option value="offline">غير متصل (Offline)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">عدد الوجبات التقديري:</label>
                  <input
                    type="number"
                    min="0"
                    value={fridgeForm.estimated_meals_count ?? 20}
                    onChange={(e) => setFridgeForm({ ...fridgeForm, estimated_meals_count: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">العنوان بالتفصيل ومكان الثلاجة:</label>
                <input
                  type="text"
                  value={fridgeForm.address || ''}
                  onChange={(e) => setFridgeForm({ ...fridgeForm, address: e.target.value })}
                  placeholder="مثال: مدخل صحن المسجد الخارجي، شارع الملكة رانيا"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddFridgeOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition shadow-md"
                >
                  حفظ الثلاجة والربط
                </button>
              </div>
            </form>
          )}

          {/* Table / List */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold">
                <tr>
                  <th className="p-3">المعرف والمسجد</th>
                  <th className="p-3">المحافظة والمنطقة</th>
                  <th className="p-3">حالة الحساس</th>
                  <th className="p-3">الامتلاء والحرارة</th>
                  <th className="p-3">بطارية الحساس</th>
                  <th className="p-3">تغيير الحالة السريع</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-medium">
                {refrigerators.map((fridge) => (
                  <tr key={fridge.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="font-bold text-white">{fridge.mosque_name}</div>
                      <div className="text-[10px] font-mono text-emerald-400">{fridge.id} • {fridge.sensor_device_id}</div>
                    </td>
                    <td className="p-3">
                      <div>{fridge.governorate}</div>
                      <div className="text-[10px] text-slate-400">{fridge.area}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          fridge.status === 'food_available'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : fridge.status === 'empty'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700 text-slate-300 border border-slate-600'
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
                            ? `${fridge.estimated_meals_count} وجبة`
                            : fridge.status === 'empty'
                            ? 'فارغة'
                            : 'Offline'}
                        </span>
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-slate-300">{fridge.fill_percentage}% امتلاء</div>
                      <div className="text-[10px] text-cyan-400 font-mono">{fridge.temperature_celsius}°C</div>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="text-emerald-400 font-bold">{fridge.sensor_battery_level}%</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleFridgeStatus(fridge.id, 'food_available')}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 cursor-pointer"
                          title="ضبط كمتوفر"
                        >
                          طعام
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFridgeStatus(fridge.id, 'empty')}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-amber-300 cursor-pointer"
                          title="ضبط كفارغ"
                        >
                          تفريغ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFridgeStatus(fridge.id, 'offline')}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 cursor-pointer"
                          title="ضبط كغير متصل"
                        >
                          فصل
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteFridge(fridge.id)}
                        className="p-1.5 text-red-400 hover:text-white rounded-lg hover:bg-red-950 cursor-pointer transition"
                        title="حذف الثلاجة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: RESTAURANTS MANAGEMENT ===================== */}
      {activeTab === 'restaurants' && (
        <div className="space-y-4">
          
          {/* Add Restaurant Form */}
          {isAddRestOpen && (
            <form onSubmit={handleSaveRestaurant} className="bg-slate-800/90 border border-slate-700 p-5 rounded-3xl space-y-4 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                <span className="font-bold text-sm text-orange-400 flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  <span>إضافة مطعم يقدم وجبات مجانية</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddRestOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اسم المطعم:</label>
                  <input
                    type="text"
                    required
                    value={restForm.name || ''}
                    onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                    placeholder="مثال: مطعم الأمانة الخيري"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المحافظة:</label>
                  <select
                    value={restForm.governorate}
                    onChange={(e) => setRestForm({ ...restForm, governorate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {ALL_JORDAN_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المنطقة:</label>
                  <input
                    type="text"
                    required
                    value={restForm.area || ''}
                    onChange={(e) => setRestForm({ ...restForm, area: e.target.value })}
                    placeholder="مثال: وسط البلد"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الوجبات المتاحة اليوم:</label>
                  <input
                    type="number"
                    min="1"
                    value={restForm.available_meals_today ?? 30}
                    onChange={(e) => setRestForm({ ...restForm, available_meals_today: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم الهاتف:</label>
                  <input
                    type="text"
                    value={restForm.phone || ''}
                    onChange={(e) => setRestForm({ ...restForm, phone: e.target.value })}
                    placeholder="064619876"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">أوقات التوزيع:</label>
                  <input
                    type="text"
                    value={restForm.working_hours || ''}
                    onChange={(e) => setRestForm({ ...restForm, working_hours: e.target.value })}
                    placeholder="يومياً من 2:00 ظهراً حتى 6:00 مساءً"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddRestOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold cursor-pointer transition shadow-md"
                >
                  حفظ المطعم
                </button>
              </div>
            </form>
          )}

          {/* Restaurants List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {restaurants.map((rest) => (
              <div key={rest.id} className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-orange-400 font-bold">
                      {rest.governorate} • {rest.area}
                    </span>
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-md font-mono text-[10px] font-bold">
                      {rest.available_meals_today} وجبة
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{rest.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{rest.meal_type}</p>
                  <p className="text-[10px] text-slate-500">{rest.working_hours}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-700/80 pt-2">
                  <span className="text-[10px] text-slate-400 font-mono">{rest.phone}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteRestaurant(rest.id)}
                    className="p-1 text-red-400 hover:text-white rounded hover:bg-red-950 cursor-pointer"
                    title="حذف المطعم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

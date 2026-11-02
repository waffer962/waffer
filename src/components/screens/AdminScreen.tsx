'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Store, Offer, Complaint } from '@/types';
import {
  ShieldAlert,
  Store as StoreIcon,
  ShoppingBag,
  Users,
  FileText,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Bell,
  Sparkles
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const {
    stores,
    updateStoreStatus,
    offers,
    deleteOffer,
    complaints,
    updateComplaintStatus,
    setCurrentScreen,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stores' | 'offers' | 'staff' | 'content' | 'complaints'>('stores');

  // Staff creation form
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [canComplaints, setCanComplaints] = useState(true);
  const [canTrack, setCanTrack] = useState(true);
  const [staffList, setStaffList] = useState([
    { id: '1', name: 'سارة المهيرات', email: 'sara@waffer.jo', role: 'موظف شكاوى', canComplaints: true, canTrack: true },
    { id: '2', name: 'عمر القضاة', email: 'omar@waffer.jo', role: 'موظف تتبع طلبات', canComplaints: false, canTrack: true }
  ]);
  const [staffCreatedMsg, setStaffCreatedMsg] = useState('');

  // Editable Site Announcement
  const [siteBanner, setSiteBanner] = useState('🌱 مرحباً بكم في وفّر - معاً للحد من هدر الطعام وتوفير وجبات طازجة بأسعار مخفضة في كافة محافظات الأردن!');
  const [bannerSavedMsg, setBannerSavedMsg] = useState('');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffName) return;
    setStaffList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newStaffName,
        email: newStaffEmail,
        role: 'موظف دعم وتتبع',
        canComplaints,
        canTrack
      }
    ]);
    setStaffCreatedMsg(`تم إنشاء حساب الموظف ${newStaffName} بنجاح!`);
    setNewStaffName('');
    setNewStaffEmail('');
    setTimeout(() => setStaffCreatedMsg(''), 2500);
  };

  const pendingStores = stores.filter((s) => s.status === 'pending');
  const approvedStores = stores.filter((s) => s.status === 'approved');

  return (
    <div className="flex-1 w-full bg-slate-950 text-slate-100 flex flex-col pb-16">
      {/* Top Admin Header */}
      <div className="w-full bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">لوحة تحكم الأدمن الرئيسي</h3>
              <p className="text-xs text-purple-400">صلاحيات إدارة مركزية شاملة لمنصة وفّر في الأردن</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-900/40"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-bold border-t border-slate-850 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'stores' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            المتاجر ({stores.length})
            {pendingStores.length > 0 && (
              <span className="mr-2 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {pendingStores.length} معلق
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'offers' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            مراقبة العروض ({offers.length})
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'staff' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            الموظفين والصلاحيات ({staffList.length})
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'content' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            محتوى الموقع
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'complaints' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            سجل الشكاوى ({complaints.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6 text-xs">
        {/* ================= STORES TAB ================= */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-black text-white flex items-center gap-2">
                <StoreIcon className="w-5 h-5 text-purple-400" />
                <span>إدارة طلبات المتاجر واعتمادها</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                مراجعة بيانات المخابز والمطاعم المتقدمة للاعتماد أو إيقاف المتاجر المخالفة
              </p>
            </div>

            {/* Pending Stores Approval Queue */}
            {pendingStores.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 block">
                  طلبات تسجيل جديدة بانتظار الموافقة ({pendingStores.length}):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingStores.map((s) => (
                    <div
                      key={s.id}
                      className="p-5 bg-amber-950/20 border border-amber-500/40 rounded-3xl space-y-3 shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-base text-white">{s.name}</h5>
                          <p className="text-xs text-slate-300 mt-0.5">المالك: {s.owner_name} • {s.phone}</p>
                          <p className="text-xs text-slate-400">الموقع: {s.governorate} - {s.area}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{s.description}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold">
                          طلب معلق
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-amber-900/40">
                        <button
                          onClick={() => updateStoreStatus(s.id, 'approved')}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>موافقة واعتماد المتجر</span>
                        </button>
                        <button
                          onClick={() => updateStoreStatus(s.id, 'rejected')}
                          className="py-2.5 px-4 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900 rounded-xl font-bold transition"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Stores List */}
            <div className="space-y-3 pt-2">
              <span className="text-sm font-bold text-slate-300 block">المتاجر النشطة المسجلة في الأردن:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedStores.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={s.logo_url} alt={s.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <h5 className="font-bold text-sm text-white truncate">{s.name}</h5>
                        <p className="text-xs text-slate-400 truncate">{s.governorate} • {s.store_type}</p>
                        <span className="text-[10px] text-emerald-400 font-bold">نشط في المنصة</span>
                      </div>
                    </div>

                    <button
                      onClick={() => updateStoreStatus(s.id, 'suspended')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition shrink-0"
                    >
                      إيقاف مؤقت
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= OFFERS TAB ================= */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <h4 className="text-xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <span>مراقبة وإدارة كافة العروض في المملكة</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={offer.image_url} alt={offer.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h5 className="font-bold text-sm text-white truncate">{offer.title}</h5>
                      <p className="text-xs text-slate-400 truncate">{offer.store_name} • {offer.discounted_price.toFixed(2)} د.أ</p>
                      <span className="text-[10px] text-teal-400">متبقي: {offer.quantity_available} قطع</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="p-2.5 text-red-400 hover:bg-red-950/40 rounded-xl transition shrink-0 border border-red-900/30"
                    title="حذف العرض"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STAFF TAB ================= */}
        {activeTab === 'staff' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h4 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>إنشاء حسابات الموظفين وتعيين الصلاحيات</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                تُنشأ هذه الحسابات من خلال الإدارة فقط لتسجيل الدخول عبر البريد الإلكتروني
              </p>
            </div>

            {staffCreatedMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-300 text-xs text-center font-bold">
                {staffCreatedMsg}
              </div>
            )}

            {/* New Staff Form */}
            <form onSubmit={handleAddStaff} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">اسم الموظف:</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">البريد الإلكتروني المخصص:</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="staff@waffer.jo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <span className="block text-slate-300 font-bold mb-2">تحديد الصلاحيات الممنوحة:</span>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canComplaints}
                      onChange={(e) => setCanComplaints(e.target.checked)}
                      className="accent-purple-600 rounded w-4 h-4"
                    />
                    <span>إدارة ومتابعة الشكاوى</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canTrack}
                      onChange={(e) => setCanTrack(e.target.checked)}
                      className="accent-purple-600 rounded w-4 h-4"
                    />
                    <span>تتبع الطلبات الميدانية والعالقة</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition shadow-lg shadow-purple-950/50"
              >
                إنشاء وتفعيل حساب الموظف
              </button>
            </form>

            {/* Staff List */}
            <div className="space-y-3">
              <span className="text-slate-300 font-bold block text-sm">الموظفين المعتمدين في النظام:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center"
                  >
                    <div>
                      <h5 className="font-bold text-white text-sm">{st.name}</h5>
                      <p className="text-xs text-slate-400">{st.email} • {st.role}</p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/15 px-2.5 py-1 rounded-lg border border-purple-500/30">
                      مفعل
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= CONTENT TAB ================= */}
        {activeTab === 'content' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h4 className="text-xl font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>إدارة محتوى الموقع والإعلانات</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                تعديل العناوين والشريط الإعلاني المعروض لجميع زوار المنصة
              </p>
            </div>

            {bannerSavedMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-300 text-xs text-center font-bold">
                {bannerSavedMsg}
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">شريط الإعلان الرئيسي أعلى الموقع:</label>
                <textarea
                  value={siteBanner}
                  onChange={(e) => setSiteBanner(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setBannerSavedMsg('تم حفظ وتحديث المحتوى في الموقع بنجاح!');
                  setTimeout(() => setBannerSavedMsg(''), 2000);
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition shadow-md shadow-purple-950/40"
              >
                حفظ التعديلات في الموقع
              </button>
            </div>
          </div>
        )}

        {/* ================= COMPLAINTS TAB ================= */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <h4 className="text-xl font-black text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-purple-400" />
              <span>سجل شكاوى المستخدمين والمتاجر</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-sm text-white">{c.subject}</h5>
                      <p className="text-xs text-slate-400 mt-0.5">من: {c.user_name} ({c.user_phone})</p>
                      <p className="text-xs text-slate-400">المتجر: {c.store_name}</p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs bg-slate-950 p-3 rounded-2xl">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

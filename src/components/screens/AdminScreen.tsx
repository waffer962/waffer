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
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex flex-col pb-16 min-h-screen">
      {/* Top Admin Header */}
      <div className="w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">لوحة تحكم الأدمن الرئيسي</h3>
              <p className="text-xs text-purple-700 font-medium">صلاحيات إدارة مركزية شاملة لمنصة وفّر في الأردن 🇯🇴</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-bold border-t border-slate-100 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'stores' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المتاجر ({stores.length})
            {pendingStores.length > 0 && (
              <span className="mr-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                {pendingStores.length} معلق
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'offers' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مراقبة العروض ({offers.length})
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'staff' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الموظفين والصلاحيات ({staffList.length})
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'content' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            محتوى الموقع
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'complaints' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <StoreIcon className="w-5 h-5 text-purple-600" />
                <span>إدارة طلبات المتاجر واعتمادها</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                مراجعة بيانات المخابز والمطاعم المتقدمة للاعتماد أو إيقاف المتاجر المخالفة
              </p>
            </div>

            {/* Pending Stores Approval Queue */}
            {pendingStores.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-700 block">
                  طلبات تسجيل جديدة بانتظار الموافقة ({pendingStores.length}):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingStores.map((s) => (
                    <div
                      key={s.id}
                      className="p-5 bg-amber-50/70 border border-amber-200 rounded-3xl space-y-3 shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-base text-slate-900">{s.name}</h5>
                          <p className="text-xs text-slate-700 mt-0.5">المالك: {s.owner_name} • {s.phone}</p>
                          <p className="text-xs text-slate-600">الموقع: {s.governorate} - {s.area}</p>
                          <p className="text-[11px] text-slate-600 mt-1">{s.description}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold">
                          طلب معلق
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-amber-200">
                        <button
                          onClick={() => updateStoreStatus(s.id, 'approved')}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>موافقة واعتماد المتجر</span>
                        </button>
                        <button
                          onClick={() => updateStoreStatus(s.id, 'rejected')}
                          className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold transition cursor-pointer"
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
              <span className="text-sm font-bold text-slate-800 block">المتاجر النشطة المسجلة في الأردن:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedStores.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-white border border-slate-200 rounded-3xl flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={s.logo_url} alt={s.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <h5 className="font-bold text-sm text-slate-900 truncate">{s.name}</h5>
                        <p className="text-xs text-slate-600 truncate">{s.governorate} • {s.store_type}</p>
                        <span className="text-[10px] text-emerald-700 font-bold">نشط في المنصة</span>
                      </div>
                    </div>

                    <button
                      onClick={() => updateStoreStatus(s.id, 'suspended')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
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
            <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <span>مراقبة وإدارة كافة العروض في المملكة</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 bg-white border border-slate-200 rounded-3xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={offer.image_url} alt={offer.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h5 className="font-bold text-sm text-slate-900 truncate">{offer.title}</h5>
                      <p className="text-xs text-slate-600 truncate">{offer.store_name} • {offer.discounted_price.toFixed(2)} د.أ</p>
                      <span className="text-[10px] text-emerald-700 font-bold">متبقي: {offer.quantity_available} قطع</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition shrink-0 border border-red-200 cursor-pointer"
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
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>إنشاء حسابات الموظفين وتعيين الصلاحيات</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                تُنشأ هذه الحسابات من خلال الإدارة فقط لتسجيل الدخول عبر البريد الإلكتروني
              </p>
            </div>

            {staffCreatedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs text-center font-bold">
                {staffCreatedMsg}
              </div>
            )}

            {/* New Staff Form */}
            <form onSubmit={handleAddStaff} className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم الموظف:</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني المخصص:</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="staff@waffer.jo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              <div>
                <span className="block text-slate-800 font-bold mb-2">تحديد الصلاحيات الممنوحة:</span>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={canComplaints}
                      onChange={(e) => setCanComplaints(e.target.checked)}
                      className="accent-purple-600 rounded w-4 h-4"
                    />
                    <span>إدارة ومتابعة الشكاوى</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
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
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition shadow-xs cursor-pointer"
              >
                إنشاء وتفعيل حساب الموظف
              </button>
            </form>

            {/* Staff List */}
            <div className="space-y-3">
              <span className="text-slate-800 font-bold block text-sm">الموظفين المعتمدين في النظام:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-xs"
                  >
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{st.name}</h5>
                      <p className="text-xs text-slate-600">{st.email} • {st.role}</p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
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
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>إدارة محتوى الموقع والإعلانات</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                تعديل العناوين والشريط الإعلاني المعروض لجميع زوار المنصة
              </p>
            </div>

            {bannerSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs text-center font-bold">
                {bannerSavedMsg}
              </div>
            )}

            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">شريط الإعلان الرئيسي أعلى الموقع:</label>
                <textarea
                  value={siteBanner}
                  onChange={(e) => setSiteBanner(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              <button
                onClick={() => {
                  setBannerSavedMsg('تم حفظ وتحديث المحتوى في الموقع بنجاح!');
                  setTimeout(() => setBannerSavedMsg(''), 2000);
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              >
                حفظ التعديلات في الموقع
              </button>
            </div>
          </div>
        )}

        {/* ================= COMPLAINTS TAB ================= */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-purple-600" />
              <span>سجل شكاوى المستخدمين والمتاجر</span>
            </h4>

            {complaints.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                <p className="text-slate-600 text-xs">لا توجد شكاوى مسجلة حالياً. سجل الشكاوى نظيف تماماً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{c.subject}</h5>
                        <p className="text-xs text-slate-600 mt-0.5">من: {c.user_name} ({c.user_phone})</p>
                        <p className="text-xs text-slate-600">المتجر: {c.store_name}</p>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">{c.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

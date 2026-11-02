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
    <div className="flex flex-col min-h-[680px] h-full bg-slate-950 text-slate-100 relative pb-16 overflow-y-auto select-none">
      {/* Top Admin Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">لوحة تحكم الأدمن الرئيسي</h4>
            <span className="text-[10px] text-purple-400">صلاحيات إدارة شاملة لمنصة وفّر</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-900/60 border-b border-slate-800 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium relative ${
            activeTab === 'stores' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          المتاجر ({stores.length})
          {pendingStores.length > 0 && (
            <span className="mr-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
              {pendingStores.length} معلق
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'offers' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          العروض ({offers.length})
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'staff' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          الموظفين ({staffList.length})
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'content' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          محتوى الموقع
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-3 py-1.5 rounded-xl shrink-0 transition font-medium ${
            activeTab === 'complaints' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          الشكاوى ({complaints.length})
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* ================= STORES TAB ================= */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <StoreIcon className="w-4 h-4 text-purple-400" />
              <span>إدارة طلبات المتاجر واعتمادها</span>
            </h3>

            {/* Pending Stores Approval Queue */}
            {pendingStores.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-400 block">
                  طلبات تسجيل جديدة بانتظار الموافقة:
                </span>
                {pendingStores.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-2xl space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-white">{s.name}</h5>
                        <p className="text-[11px] text-slate-400">المالك: {s.owner_name} • {s.phone}</p>
                        <p className="text-[11px] text-slate-400">الموقع: {s.governorate} - {s.area}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                        طلب معلق
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => updateStoreStatus(s.id, 'approved')}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>موافقة واعتماد المتجر</span>
                      </button>
                      <button
                        onClick={() => updateStoreStatus(s.id, 'rejected')}
                        className="py-1.5 px-3 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900 rounded-xl font-bold transition"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Approved Stores List */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-300 block">المتاجر النشطة المسجلة:</span>
              {approvedStores.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={s.logo_url} alt={s.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-white">{s.name}</h5>
                      <p className="text-[11px] text-slate-400">{s.governorate} • {s.store_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateStoreStatus(s.id, 'suspended')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                    >
                      إيقاف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= OFFERS TAB ================= */}
        {activeTab === 'offers' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>مراقبة وإدارة كافة العروض في المملكة</span>
            </h3>

            <div className="space-y-2">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={offer.image_url} alt={offer.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h5 className="font-bold text-white truncate">{offer.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{offer.store_name} • {offer.discounted_price.toFixed(2)} د.أ</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="p-2 text-red-400 hover:bg-red-950/40 rounded-xl transition shrink-0"
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
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" />
              <span>إنشاء حسابات الموظفين وتعيين الصلاحيات</span>
            </h3>

            {staffCreatedMsg && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs">
                {staffCreatedMsg}
              </div>
            )}

            {/* New Staff Form */}
            <form onSubmit={handleAddStaff} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">اسم الموظف:</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">البريد الإلكتروني المخصص:</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="staff@waffer.jo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <span className="block text-slate-400 mb-1">تحديد الصلاحيات:</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canComplaints}
                      onChange={(e) => setCanComplaints(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    <span>إدارة الشكاوى</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canTrack}
                      onChange={(e) => setCanTrack(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    <span>تتبع الطلبات العالقة</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition"
              >
                إنشاء حساب الموظف
              </button>
            </form>

            {/* Staff List */}
            <div className="space-y-2">
              <span className="text-slate-400 font-bold block">الموظفين المعتمدين:</span>
              {staffList.map((st) => (
                <div
                  key={st.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h5 className="font-bold text-white">{st.name}</h5>
                    <p className="text-[11px] text-slate-400">{st.email} • {st.role}</p>
                  </div>
                  <span className="text-[10px] text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-md">
                    مفعل
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CONTENT TAB ================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>إدارة محتوى الموقع والإعلانات</span>
            </h3>

            {bannerSavedMsg && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs">
                {bannerSavedMsg}
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">شريط الإعلان الرئيسي أعلى الموقع:</label>
                <textarea
                  value={siteBanner}
                  onChange={(e) => setSiteBanner(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setBannerSavedMsg('تم حفظ وتحديث المحتوى في الموقع بنجاح!');
                  setTimeout(() => setBannerSavedMsg(''), 2000);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        )}

        {/* ================= COMPLAINTS TAB ================= */}
        {activeTab === 'complaints' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-purple-400" />
              <span>سجل شكاوى المستخدمين والمتاجر</span>
            </h3>

            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-white">{c.subject}</h5>
                    <p className="text-[11px] text-slate-400">من: {c.user_name} ({c.user_phone})</p>
                    <p className="text-[11px] text-slate-400">المتجر المعني: {c.store_name}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    {c.status}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] bg-slate-950 p-2 rounded-xl">{c.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

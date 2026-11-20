'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Complaint } from '@/types';
import {
  LifeBuoy,
  MessageSquareWarning,
  Compass,
  CheckCircle2,
  Clock,
  Phone,
  LogOut,
  AlertCircle
} from 'lucide-react';

export const StaffScreen: React.FC = () => {
  const { complaints, updateComplaintStatus, reservations, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'complaints' | 'track_orders'>('complaints');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [staffNote, setStaffNote] = useState('');

  const handleResolve = (id: string) => {
    updateComplaintStatus(id, 'resolved', staffNote || 'تم حل الشكوى والتواصل مع الأطراف المعنية.');
    setSelectedComplaint(null);
    setStaffNote('');
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-900 flex flex-col pb-16 min-h-screen">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold">
              <LifeBuoy className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="font-black text-base text-slate-900">واجهة الدعم وإدارة الطلبات</h1>
              <p className="text-xs text-slate-500 font-medium">فريق الدعم والعمليات الميدانية - منصة وفّر الأردن</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 border-t border-slate-100 pt-2 pb-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'complaints'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>قسم الشكاوى ({complaints.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('track_orders')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'track_orders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>تتبع وتدقيق الطلبات ({reservations.length})</span>
          </button>
        </nav>
      </header>

      {/* Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6 text-xs">
        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-emerald-700" />
              <span>الشكاوى الواردة من الزبائن والمتاجر</span>
            </h2>

            {complaints.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">لا توجد شكاوى مسجلة حالياً</h3>
                <p className="text-xs text-slate-500 mt-1">سجل الدعم الفني مكتمل ولا توجد تذاكر مفتوحة.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{c.subject}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          مقدم الشكوى: {c.user_name} ({c.user_phone})
                        </p>
                        <p className="text-xs text-slate-500">المتجر المعني: {c.store_name}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          c.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.status === 'resolved' ? 'تم الحل' : 'قيد المتابعة'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-slate-700 text-xs leading-relaxed border border-slate-200">
                      {c.description}
                    </div>

                    {c.staff_notes && (
                      <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-xs">
                        <strong>ملاحظات الموظف:</strong> {c.staff_notes}
                      </div>
                    )}

                    {c.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(c)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                      >
                        معالجة الشكوى وحلها
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRACK ORDERS TAB */}
        {activeTab === 'track_orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-700" />
              <span>متابعة وتدقيق حالات الطلبات الميدانية في الأردن</span>
            </h2>

            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <p className="text-xs text-slate-500">لا توجد طلبات جارية حالياً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-black text-emerald-800 text-sm">
                          {res.booking_code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-0.5">{res.customer_name}</h3>
                        <p className="text-xs text-slate-600">{res.store_name}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : res.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : res.status === 'completed'
                            ? 'bg-slate-100 text-slate-800 border border-slate-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {res.status === 'confirmed'
                          ? 'مؤكد'
                          : res.status === 'pending'
                          ? 'قيد الانتظار'
                          : res.status === 'completed'
                          ? 'مكتمل ومستلم'
                          : 'ملغي'}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span>{res.offer_title}</span>
                      <span className="font-bold text-emerald-800 font-mono">
                        {res.total_price === 0 ? 'وجبة مجانية' : `${res.total_price.toFixed(2)} د.أ`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Resolve Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full text-right text-xs space-y-4 shadow-2xl text-slate-900">
            <h3 className="font-bold text-slate-900 text-base">حل الشكوى وإغلاق التذكرة</h3>
            <p className="text-slate-600">الموضوع: {selectedComplaint.subject}</p>
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">ملاحظات الحل وإجراءات المتابعة:</label>
              <textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="اكتب ما تم الاتفاق عليه مع الزبون أو المتجر..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
              />
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleResolve(selectedComplaint.id)}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              >
                تأكيد حل الشكوى
              </button>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

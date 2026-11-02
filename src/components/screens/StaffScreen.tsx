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
      <div className="w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">واجهة موظف الشكاوى وإدارة الطلبات</h3>
              <p className="text-xs text-blue-700 font-medium">فريق الدعم والعمليات الميدانية - منصة وفّر الأردن 🇯🇴</p>
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

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 border-t border-slate-100 pt-2 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'complaints'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>قسم الشكاوى ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('track_orders')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'track_orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>تتبع وتدقيق الطلبات ({reservations.length})</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6 text-xs">
        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-blue-600" />
              <span>الشكاوى الواردة من الزبائن والمتاجر</span>
            </h4>

            {complaints.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold mb-2">
                  ✓
                </div>
                <h5 className="font-bold text-slate-800 text-sm">لا توجد شكاوى مسجلة حالياً</h5>
                <p className="text-xs text-slate-500 mt-1">سجل الدعم الفني نظيف تماماً.</p>
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
                        <p className="text-xs text-slate-600 mt-0.5">
                          مقدم الشكوى: {c.user_name} ({c.user_phone})
                        </p>
                        <p className="text-xs text-slate-500">المتجر المعني: {c.store_name}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          c.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status === 'resolved' ? 'تم الحل ✅' : 'قيد المتابعة ⏳'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-700 text-xs leading-relaxed border border-slate-200">
                      {c.description}
                    </div>

                    {c.staff_notes && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs">
                        <strong>ملاحظات الموظف:</strong> {c.staff_notes}
                      </div>
                    )}

                    {c.status !== 'resolved' && (
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
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
            <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <span>متابعة وتدقيق حالات الطلبات الميدانية في الأردن</span>
            </h4>

            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <p className="text-xs text-slate-500">لا توجد طلبات جارية حالياً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-black text-emerald-700 text-sm">
                          {res.booking_code}
                        </span>
                        <h5 className="font-bold text-slate-900 text-sm mt-0.5">{res.customer_name}</h5>
                        <p className="text-xs text-slate-600">{res.store_name}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : res.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span>{res.offer_title}</span>
                      <span className="font-bold text-emerald-700">{res.total_price.toFixed(2)} د.أ نقدًا</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resolve Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full text-right text-xs space-y-4 shadow-2xl text-slate-900">
            <h4 className="font-bold text-slate-900 text-base">حل الشكوى وإغلاق التذكرة</h4>
            <p className="text-slate-600">الموضوع: {selectedComplaint.subject}</p>
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">ملاحظات الحل وإجراءات المتابعة:</label>
              <textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="اكتب ما تم الاتفاق عليه مع الزبون أو المتجر..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => handleResolve(selectedComplaint.id)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              >
                تأكيد حل الشكوى ✅
              </button>
              <button
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

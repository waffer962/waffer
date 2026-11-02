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
    <div className="flex-1 w-full bg-slate-950 text-slate-100 flex flex-col pb-16">
      {/* Top Header */}
      <div className="w-full bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">واجهة موظف الشكاوى وتتبع الطلبات</h3>
              <p className="text-xs text-blue-400">فريق الدعم الفني والعمليات الميدانية - وفّر الأردن</p>
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

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 border-t border-slate-850 pt-2 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'complaints'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>قسم الشكاوى ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('track_orders')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'track_orders'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
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
            <h4 className="text-xl font-black text-white flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-blue-400" />
              <span>الشكاوى الواردة من الزبائن والمتاجر</span>
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
                      <p className="text-xs text-slate-400 mt-0.5">
                        مقدم الشكوى: {c.user_name} ({c.user_phone})
                      </p>
                      <p className="text-xs text-slate-400">المتجر المعني: {c.store_name}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {c.status === 'resolved' ? 'تم الحل ✅' : 'قيد المتابعة ⏳'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl text-slate-300 text-xs leading-relaxed border border-slate-850">
                    {c.description}
                  </div>

                  {c.staff_notes && (
                    <div className="p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-blue-300 text-xs">
                      <strong>ملاحظات الموظف:</strong> {c.staff_notes}
                    </div>
                  )}

                  {c.status !== 'resolved' && (
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-md"
                    >
                      معالجة الشكوى وحلها
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRACK ORDERS TAB */}
        {activeTab === 'track_orders' && (
          <div className="space-y-4">
            <h4 className="text-xl font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>متابعة وتدقيق حالات الطلبات الميدانية في الأردن</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-black text-emerald-400 text-sm">
                        {res.booking_code}
                      </span>
                      <h5 className="font-bold text-white text-sm mt-0.5">{res.customer_name}</h5>
                      <p className="text-xs text-slate-400">{res.store_name}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        res.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : res.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : res.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                    <span>{res.offer_title}</span>
                    <span className="font-bold text-emerald-400">{res.total_price.toFixed(2)} د.أ نقدًا</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resolve Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-right text-xs space-y-4 shadow-2xl">
            <h4 className="font-bold text-white text-base">حل الشكوى وإغلاق التذكرة</h4>
            <p className="text-slate-400">الموضوع: {selectedComplaint.subject}</p>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">ملاحظات الحل وإجراءات المتابعة:</label>
              <textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="اكتب ما تم الاتفاق عليه مع الزبون أو المتجر..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => handleResolve(selectedComplaint.id)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition"
              >
                تأكيد حل الشكوى ✅
              </button>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="py-2.5 px-4 bg-slate-800 text-slate-300 rounded-xl"
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

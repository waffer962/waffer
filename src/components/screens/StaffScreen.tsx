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
    <div className="flex flex-col min-h-[680px] h-full bg-slate-950 text-slate-100 relative pb-16 overflow-y-auto select-none">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
            <LifeBuoy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">واجهة موظف الشكاوى وتتبع الطلبات</h4>
            <span className="text-[10px] text-blue-400">فريق الدعم الفني والعمليات - وفّر</span>
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

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-900/60 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquareWarning className="w-4 h-4" />
          <span>قسم الشكاوى ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('track_orders')}
          className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'track_orders'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>تتبع الطلبات ({reservations.length})</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <MessageSquareWarning className="w-4 h-4 text-blue-400" />
              <span>الشكاوى الواردة من الزبائن والمتاجر</span>
            </h3>

            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-white text-xs">{c.subject}</h5>
                    <p className="text-[11px] text-slate-400">
                      مقدم الشكوى: {c.user_name} ({c.user_phone})
                    </p>
                    <p className="text-[11px] text-slate-400">المتجر: {c.store_name}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {c.status === 'resolved' ? 'تم الحل ✅' : 'قيد المتابعة ⏳'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl text-slate-300 text-[11px] leading-relaxed">
                  {c.description}
                </div>

                {c.staff_notes && (
                  <div className="p-2 bg-blue-950/40 border border-blue-800/40 rounded-xl text-blue-300 text-[11px]">
                    <strong>ملاحظات الموظف:</strong> {c.staff_notes}
                  </div>
                )}

                {c.status !== 'resolved' && (
                  <button
                    onClick={() => setSelectedComplaint(c)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition"
                  >
                    معالجة الشكوى وحلها
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TRACK ORDERS TAB */}
        {activeTab === 'track_orders' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>متابعة وتدقيق حالات الطلبات الميدانية</span>
            </h3>

            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {res.booking_code}
                    </span>
                    <h5 className="font-bold text-white">{res.customer_name}</h5>
                    <p className="text-[11px] text-slate-400">{res.store_name}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

                <div className="flex justify-between text-slate-400 text-[11px] bg-slate-950 p-2 rounded-xl">
                  <span>{res.offer_title}</span>
                  <span className="font-bold text-white">{res.total_price.toFixed(2)} د.أ نقدًا</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolve Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-right text-xs space-y-3">
            <h4 className="font-bold text-white text-sm">حل الشكوى وإغلاق التذكرة</h4>
            <p className="text-slate-400">الموضوع: {selectedComplaint.subject}</p>
            <div>
              <label className="block text-slate-300 mb-1">ملاحظات الحل وإجراءات المتابعة:</label>
              <textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="اكتب ما تم الاتفاق عليه مع الزبون أو المتجر..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleResolve(selectedComplaint.id)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
              >
                تأكيد حل الشكوى ✅
              </button>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="py-2 px-3 bg-slate-800 text-slate-300 rounded-xl"
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

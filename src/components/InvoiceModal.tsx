'use client';

import React from 'react';
import { Reservation } from '@/types';
import { Printer, X, CheckCircle2, MapPin, Phone, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ reservation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden text-right text-slate-100 my-auto">
        
        {/* Modal Controls Bar */}
        <div className="flex justify-between items-center p-4 bg-slate-950 border-b border-slate-850 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة / حفظ PDF</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="invoice-sheet" className="p-6 bg-slate-900 print:bg-white print:text-black space-y-5">
          {/* Top Brand & Title */}
          <div className="flex justify-between items-start border-b border-dashed border-slate-750 print:border-slate-300 pb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xl font-black text-emerald-400 print:text-emerald-700">وفّر</span>
                <span className="text-xs font-bold text-slate-400 print:text-slate-600">Waffer Jordan</span>
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600">
                منصة تقليل هدر الطعام - فاتورة حجز رسمية
              </p>
            </div>

            <div className="text-left">
              <span className="inline-block px-2.5 py-1 bg-emerald-500/15 print:bg-emerald-100 text-emerald-400 print:text-emerald-800 text-xs font-bold rounded-lg border border-emerald-500/30 print:border-emerald-300">
                {reservation.status === 'confirmed' ? 'حجز مؤكد ✅' : 'قيد المعالجة'}
              </span>
              <p className="text-[10px] text-slate-400 print:text-slate-500 mt-1">
                {new Date(reservation.created_at).toLocaleDateString('ar-JO')}
              </p>
            </div>
          </div>

          {/* Booking Code Highlight (Used at store checkout) */}
          <div className="bg-slate-950 print:bg-slate-50 border-2 border-emerald-500/40 print:border-slate-300 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 print:text-slate-600 block mb-1">
              رقم الفاتورة والحجز (أظهره لصاحب المتجر عند الاستلام)
            </span>
            <div className="text-2xl font-black tracking-widest text-emerald-400 print:text-slate-900 font-mono">
              {reservation.booking_code}
            </div>
            {/* Visual Barcode mockup */}
            <div className="mt-2 flex justify-center items-center gap-1 opacity-70 print:opacity-100">
              <div className="h-5 w-1 bg-white print:bg-black" />
              <div className="h-5 w-0.5 bg-white print:bg-black" />
              <div className="h-5 w-2 bg-white print:bg-black" />
              <div className="h-5 w-1 bg-white print:bg-black" />
              <div className="h-5 w-1.5 bg-white print:bg-black" />
              <div className="h-5 w-0.5 bg-white print:bg-black" />
              <div className="h-5 w-2 bg-white print:bg-black" />
              <div className="h-5 w-1 bg-white print:bg-black" />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-850/60 print:bg-slate-100 p-3 rounded-xl border border-slate-800 print:border-slate-200">
              <span className="text-[10px] text-slate-400 print:text-slate-500 block">بيانات الزبون:</span>
              <p className="font-bold text-white print:text-slate-900 mt-0.5">{reservation.customer_name}</p>
              <p className="text-slate-300 print:text-slate-700 dir-ltr text-right text-[11px]">
                {reservation.customer_phone}
              </p>
            </div>

            <div className="bg-slate-850/60 print:bg-slate-100 p-3 rounded-xl border border-slate-800 print:border-slate-200">
              <span className="text-[10px] text-slate-400 print:text-slate-500 block">المتجر وموقعه:</span>
              <p className="font-bold text-white print:text-slate-900 mt-0.5">{reservation.store_name}</p>
              <p className="text-slate-300 print:text-slate-700 text-[11px] truncate">
                {reservation.store_location}
              </p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="border border-slate-800 print:border-slate-300 rounded-2xl overflow-hidden text-xs">
            <div className="bg-slate-950 print:bg-slate-200 px-3 py-2 font-bold text-slate-300 print:text-slate-800 grid grid-cols-12">
              <span className="col-span-6">العرض الغذائي</span>
              <span className="col-span-2 text-center">الكمية</span>
              <span className="col-span-4 text-left">المجموع</span>
            </div>
            <div className="px-3 py-3 grid grid-cols-12 items-center bg-slate-900 print:bg-white border-t border-slate-800 print:border-slate-200">
              <span className="col-span-6 font-medium text-white print:text-slate-900 truncate">
                {reservation.offer_title}
              </span>
              <span className="col-span-2 text-center text-slate-300 print:text-slate-700 font-bold">
                {reservation.quantity}
              </span>
              <span className="col-span-4 text-left font-bold text-emerald-400 print:text-emerald-700">
                {reservation.total_price === 0 ? (
                  <span>مجاناً (0.00 د.أ) 💚</span>
                ) : (
                  <span>{reservation.total_price.toFixed(2)} د.أ</span>
                )}
              </span>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 px-3 py-2.5 flex justify-between items-center border-t border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-300 print:text-slate-700">طريقة الدفع:</span>
              <span className="font-bold text-emerald-400 print:text-emerald-800">
                {reservation.total_price === 0 ? 'مجاناً لوجه الله تعالى 💚' : 'نقداً عند الاستلام بالمتجر 💵'}
              </span>
            </div>
          </div>

          {/* Pickup Window Notice */}
          <div className="flex items-start gap-2.5 p-3 bg-emerald-950/40 print:bg-emerald-50 border border-emerald-800/60 print:border-emerald-300 rounded-xl text-xs text-emerald-200 print:text-emerald-900">
            <Clock className="w-4 h-4 shrink-0 text-emerald-400 print:text-emerald-700 mt-0.5" />
            <div>
              <span className="font-bold block">موعد الاستلام المتوقع:</span>
              <span>{reservation.expected_arrival}</span>
            </div>
          </div>

          {/* Footer Guidelines */}
          <div className="text-[10px] text-slate-400 print:text-slate-600 text-center space-y-1 pt-2 border-t border-dashed border-slate-800 print:border-slate-300">
            <p>يتم تسليم الوجبات طازجة في نفس اليوم خلال فترة الاستلام المحددة.</p>
            <p>لأي استفسار أو شكوى يرجى مراجعة قسم الشكاوى في المنصة مع إرفاق رقم الفاتورة.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

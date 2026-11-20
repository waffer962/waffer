'use client';

import React from 'react';
import { Reservation } from '@/types';
import { Printer, X, CheckCircle2, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ reservation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const isConfirmed = reservation.status === 'confirmed';
  const isFree = reservation.total_price === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Modal Container: Clean Paper-White Commercial Receipt Card */}
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden text-right text-slate-900 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Controls Bar */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة / حفظ PDF</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق الفاتورة"
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="invoice-sheet" className="p-6 bg-white space-y-5">
          {/* Top Brand & Title */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black text-emerald-700">وفّـر</span>
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                  Waffer Jordan
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                المنصة الأردنية للحد من هدر الطعام
              </p>
            </div>

            <div className="text-left">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  isConfirmed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isConfirmed ? 'حجز مؤكد' : 'قيد المعالجة'}</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {new Date(reservation.created_at).toLocaleDateString('ar-JO')}
              </p>
            </div>
          </div>

          {/* Booking Code Highlight (Used at store checkout) */}
          <div className="bg-slate-50 border-2 border-emerald-600/30 rounded-2xl p-4 text-center">
            <span className="text-xs text-slate-600 block mb-1 font-medium">
              رقم الفاتورة والحجز (يُبرز لصاحب المتجر عند الاستلام)
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-widest text-emerald-800 font-mono">
              {reservation.booking_code}
            </div>
            {/* Visual Barcode mockup */}
            <div className="mt-2.5 flex justify-center items-center gap-1 opacity-80" aria-hidden="true">
              <div className="h-5 w-1 bg-slate-900" />
              <div className="h-5 w-0.5 bg-slate-900" />
              <div className="h-5 w-2 bg-slate-900" />
              <div className="h-5 w-1 bg-slate-900" />
              <div className="h-5 w-1.5 bg-slate-900" />
              <div className="h-5 w-0.5 bg-slate-900" />
              <div className="h-5 w-2 bg-slate-900" />
              <div className="h-5 w-1 bg-slate-900" />
              <div className="h-5 w-2.5 bg-slate-900" />
              <div className="h-5 w-0.5 bg-slate-900" />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">بيانات الزبون:</span>
              <p className="font-bold text-slate-900 mt-1 text-sm">{reservation.customer_name}</p>
              <p className="text-slate-600 dir-ltr text-right text-xs mt-0.5 font-mono">
                {reservation.customer_phone}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">المتجر وموقعه:</span>
              <p className="font-bold text-slate-900 mt-1 text-sm">{reservation.store_name}</p>
              <p className="text-slate-600 text-xs mt-0.5 truncate">
                {reservation.store_location}
              </p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-3.5 py-2.5 font-bold text-slate-700 grid grid-cols-12">
              <span className="col-span-6">العرض الغذائي</span>
              <span className="col-span-2 text-center">الكمية</span>
              <span className="col-span-4 text-left">المجموع</span>
            </div>
            <div className="px-3.5 py-3 grid grid-cols-12 items-center bg-white border-t border-slate-200">
              <span className="col-span-6 font-semibold text-slate-900 truncate">
                {reservation.offer_title}
              </span>
              <span className="col-span-2 text-center text-slate-700 font-bold font-mono">
                {reservation.quantity}
              </span>
              <span className="col-span-4 text-left font-bold text-emerald-700 text-sm">
                {isFree ? (
                  <span>0.00 د.أ (مجاناً)</span>
                ) : (
                  <span>{reservation.total_price.toFixed(2)} د.أ</span>
                )}
              </span>
            </div>
            <div className="bg-slate-50 px-3.5 py-2.5 flex justify-between items-center border-t border-slate-200">
              <span className="font-bold text-slate-600">طريقة الدفع:</span>
              <span className="font-bold text-slate-900">
                {isFree ? 'وجبة مجانية معتمدة' : 'نقداً عند الاستلام من المتجر'}
              </span>
            </div>
          </div>

          {/* Pickup Window Notice */}
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <Clock className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
            <div>
              <span className="font-bold block text-slate-900">موعد الاستلام المحدد:</span>
              <span className="text-slate-700">{reservation.expected_arrival}</span>
            </div>
          </div>

          {/* Footer Guidelines */}
          <div className="text-[11px] text-slate-500 text-center space-y-1 pt-2 border-t border-slate-200">
            <p>يتم تسليم الوجبات طازجة في نفس اليوم خلال فترة الاستلام المحددة من المتجر.</p>
            <p>لأي استفسار يرجى مراجعة قسم الشكاوى في المنصة مع إرفاق رقم الفاتورة.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

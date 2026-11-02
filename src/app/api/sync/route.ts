import { NextResponse } from 'next/server';
import { Reservation, AppNotification, Offer } from '@/types';
import { INITIAL_OFFERS } from '@/lib/mock-data';

// Server-side in-memory shared store for instant cross-device sync
// When Phone A places an order, Phone B instantly receives it on next poll (<2.5s)
let sharedReservations: Reservation[] = [];
let sharedNotifications: AppNotification[] = [];
let sharedOffers: Offer[] = [...INITIAL_OFFERS];

export async function GET() {
  return NextResponse.json({
    reservations: sharedReservations,
    notifications: sharedNotifications,
    offers: sharedOffers,
    serverTime: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === 'create_reservation') {
      const {
        offer_id,
        offer_title,
        offer_image,
        store_id,
        store_name,
        store_location,
        store_phone,
        customer_id,
        customer_name,
        customer_phone,
        quantity,
        unit_price,
        total_price,
        expected_arrival,
        notes,
        is_large_order
      } = payload;

      const newReservation: Reservation = {
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        booking_code: `WFR-${Math.floor(10000 + Math.random() * 90000)}`,
        offer_id,
        offer_title: offer_title || 'سلة طعام فائض توفيري',
        offer_image: offer_image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        store_id,
        store_name: store_name || 'المتجر',
        store_location: store_location || 'عمان، الأردن',
        store_phone: store_phone || '0790000000',
        customer_id: customer_id || 'customer-guest',
        customer_name: customer_name || 'عميل وفّر',
        customer_phone: customer_phone || '0790000000',
        quantity: Number(quantity) || 1,
        unit_price: Number(unit_price) || 0,
        total_price: Number(total_price) || 0,
        expected_arrival: expected_arrival || 'اليوم',
        status: 'pending',
        is_large_order: Boolean(is_large_order),
        notes: notes || '',
        created_at: new Date().toISOString()
      };

      sharedReservations = [newReservation, ...sharedReservations];

      // Add corresponding notification
      const newNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        user_id: customer_id,
        store_id,
        reservation_id: newReservation.id,
        title: is_large_order ? '🚨 تنبيه عاجل: طلب كمية كبيرة (>50%)' : 'طلب حجز جديد 🛎️',
        message: is_large_order
          ? `العميل ${newReservation.customer_name} حجز ${newReservation.quantity} وجبات بنسبة تتجاوز 50% من المعروض! يرجى التأكيد اليدوي فوراً.`
          : `حجز جديد للوجبة برقم ${newReservation.booking_code}. يرجى تأكيد الطلب للمشتري.`,
        type: is_large_order ? 'urgent' : 'regular',
        is_read: false,
        created_at: new Date().toISOString()
      };

      sharedNotifications = [newNotification, ...sharedNotifications];

      // Update offer stock
      sharedOffers = sharedOffers.map((offer) => {
        if (offer.id === offer_id) {
          const newQty = Math.max(0, offer.quantity_available - newReservation.quantity);
          return {
            ...offer,
            quantity_available: newQty,
            is_active: newQty > 0
          };
        }
        return offer;
      });

      return NextResponse.json({
        success: true,
        reservation: newReservation,
        notification: newNotification
      });
    }

    if (action === 'update_reservation_status') {
      const { id, status } = payload;
      let updatedRes: Reservation | null = null;

      sharedReservations = sharedReservations.map((r) => {
        if (r.id === id) {
          updatedRes = { ...r, status };
          return updatedRes;
        }
        return r;
      });

      if (updatedRes) {
        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          reservation_id: id,
          title: status === 'confirmed' ? 'تم تأكيد طلبك بنجاح ✅' : status === 'rejected' ? 'تم رفض الحجز ❌' : 'تحديث على حالة الطلب',
          message: status === 'confirmed'
            ? `قام المتجر بالموافقة على حجزك (${(updatedRes as Reservation).booking_code}). يرجى الحضور للاستلام والدفع نقداً.`
            : `نعتذر، لم يتمكن المتجر من تلبية الحجز (${(updatedRes as Reservation).booking_code}).`,
          type: 'regular',
          is_read: false,
          created_at: new Date().toISOString()
        };
        sharedNotifications = [notif, ...sharedNotifications];
      }

      return NextResponse.json({ success: true, reservation: updatedRes });
    }

    if (action === 'clear_all') {
      sharedReservations = [];
      sharedNotifications = [];
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process sync request', details: String(error) },
      { status: 500 }
    );
  }
}

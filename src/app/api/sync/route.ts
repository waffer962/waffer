import { NextResponse } from 'next/server';
import { Reservation, AppNotification, Offer, Store } from '@/types';
import { INITIAL_OFFERS, INITIAL_STORES } from '@/lib/mock-data';
import { createClient } from '@supabase/supabase-js';

// Supabase server connection helper
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qdbcyqusgmqayyswaotp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Y-pioxtwjYryBfensuQ9oQ_Gxwwl-f8';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserLog {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  login_time: string;
  last_seen: string;
}

function ensureValidUuid(id: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < id.length; i++) {
    hash1 = (hash1 * 31 + id.charCodeAt(i)) >>> 0;
    hash2 = (hash2 * 17 + id.charCodeAt(i)) >>> 0;
  }
  const part1 = hash1.toString(16).padStart(8, '0');
  const part2 = hash2.toString(16).padStart(8, '0');
  return `${part1.slice(0, 8)}-4000-8000-${part2.slice(0, 4)}-${(part1 + part2).slice(0, 12)}`;
}

// Server-side in-memory shared store for instant cross-device sync & Admin Control
let sharedReservations: Reservation[] = [];
let sharedNotifications: AppNotification[] = [];
let sharedOffers: Offer[] = [...INITIAL_OFFERS];
let sharedStores: Store[] = [...INITIAL_STORES];
let sharedUsers: UserLog[] = [];

export async function GET() {
  // Sync profiles from Supabase if available
  try {
    const { data: dbProfiles } = await supabase.from('profiles').select('*').limit(50);
    if (Array.isArray(dbProfiles) && dbProfiles.length > 0) {
      for (const p of dbProfiles) {
        if (!sharedUsers.some((u) => u.id === p.id || (p.phone && u.phone === p.phone))) {
          sharedUsers.push({
            id: p.id,
            email: p.email || `${p.full_name?.toLowerCase().replace(/\s+/g, '') || 'user'}@waffer.jo`,
            full_name: p.full_name || 'مستخدم مسجل',
            phone: p.phone || '',
            role: p.role || 'customer',
            login_time: p.updated_at || p.created_at || new Date().toISOString(),
            last_seen: p.updated_at || new Date().toISOString()
          });
        }
      }
    }
  } catch {
    // fallback to in-memory
  }

  return NextResponse.json({
    reservations: sharedReservations,
    notifications: sharedNotifications,
    offers: sharedOffers,
    stores: sharedStores,
    users: sharedUsers,
    serverTime: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    // 1. Log and save user logins in database
    if (action === 'log_user_login') {
      const { id, email, full_name, phone, role } = payload;
      const now = new Date().toISOString();

      const existingIndex = sharedUsers.findIndex((u) => u.email === email || u.id === id);
      const userEntry: UserLog = {
        id: id || `usr-${Date.now()}`,
        email: email || 'user@waffer.jo',
        full_name: full_name || 'مستخدم وفّر',
        phone: phone || '',
        role: role || 'customer',
        login_time: now,
        last_seen: now
      };

      if (existingIndex >= 0) {
        sharedUsers[existingIndex] = {
          ...sharedUsers[existingIndex],
          full_name: userEntry.full_name,
          phone: userEntry.phone || sharedUsers[existingIndex].phone,
          last_seen: now,
          login_time: now
        };
      } else {
        sharedUsers = [userEntry, ...sharedUsers];
      }

      // Persist to Supabase profiles table in background
      try {
        await supabase.from('profiles').upsert({
          id: ensureValidUuid(userEntry.id),
          full_name: userEntry.full_name,
          phone: userEntry.phone,
          role: userEntry.role,
          updated_at: now
        });
      } catch {
        // Fallback gracefully
      }

      return NextResponse.json({ success: true, user: userEntry, totalUsers: sharedUsers.length });
    }

    // 2. Admin Action: Delete User Account
    if (action === 'delete_user') {
      const { id, email } = payload;
      sharedUsers = sharedUsers.filter((u) => u.id !== id && u.email !== email);
      try {
        if (id) await supabase.from('profiles').delete().eq('id', ensureValidUuid(id));
      } catch {}
      return NextResponse.json({ success: true, remainingUsers: sharedUsers.length });
    }

    // 3. Create reservation with large order check (>50%)
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

    // 4. Update reservation status
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

    // 5. Admin Action: In-Place Edit Offer (Edit text, price, image via pencil ✏️)
    if (action === 'admin_edit_offer') {
      const { id, updates } = payload;
      sharedOffers = sharedOffers.map((o) => (o.id === id ? { ...o, ...updates } : o));
      return NextResponse.json({ success: true, offers: sharedOffers });
    }

    // 6. Admin Action: Delete Offer
    if (action === 'admin_delete_offer') {
      const { id } = payload;
      sharedOffers = sharedOffers.filter((o) => o.id !== id);
      return NextResponse.json({ success: true, offers: sharedOffers });
    }

    // 7. Admin Action: Delete Store
    if (action === 'admin_delete_store') {
      const { id } = payload;
      sharedStores = sharedStores.filter((s) => s.id !== id);
      sharedOffers = sharedOffers.filter((o) => o.store_id !== id);
      return NextResponse.json({ success: true, stores: sharedStores, offers: sharedOffers });
    }

    // 8. Admin Action: Delete Duplicate or Fake Reservation
    if (action === 'admin_delete_reservation') {
      const { id } = payload;
      sharedReservations = sharedReservations.filter((r) => r.id !== id);
      return NextResponse.json({ success: true, reservations: sharedReservations });
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

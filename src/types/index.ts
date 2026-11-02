export type UserRole = 'customer' | 'store_owner' | 'admin' | 'staff' | 'guest';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export type StoreStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Store {
  id: string;
  owner_id?: string;
  name: string;
  logo_url: string;
  cover_image?: string;
  governorate: string; // عمان, إربد, الزرقاء, etc.
  area: string; // الجبيهة, عبدون, صويلح, etc.
  address?: string;
  lat?: number;
  lng?: number;
  phone: string;
  phone_secondary?: string;
  store_type: 'مخبز' | 'مطعم' | 'وجبات سريعة' | 'سوبرماركت' | 'حلويات' | 'أخرى';
  description: string;
  working_days: string;
  working_hours: string;
  owner_name: string;
  status: StoreStatus;
  is_accepting_orders: boolean;
  created_at: string;
}

export interface Offer {
  id: string;
  store_id: string;
  store_name?: string;
  store_logo?: string;
  store_location?: string;
  store_phone?: string;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  quantity_available: number;
  initial_quantity: number;
  pickup_start: string; // e.g. "19:00"
  pickup_end: string; // e.g. "23:00"
  category: string;
  is_active: boolean;
  created_at: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  booking_code: string; // e.g. WFR-82914
  offer_id: string;
  offer_title: string;
  offer_image?: string;
  store_id: string;
  store_name: string;
  store_location: string;
  store_phone: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  expected_arrival: string;
  status: ReservationStatus;
  is_large_order: boolean; // true if quantity > 50% of available
  notes?: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id?: string;
  store_id?: string;
  reservation_id?: string;
  title: string;
  message: string;
  type: 'regular' | 'urgent';
  is_read: boolean;
  created_at: string;
}

export interface Complaint {
  id: string;
  reservation_id?: string;
  user_id?: string;
  user_name: string;
  user_phone: string;
  store_id?: string;
  store_name?: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  staff_notes?: string;
  created_at: string;
}

export interface StaffPermission {
  staff_id: string;
  can_manage_complaints: boolean;
  can_track_orders: boolean;
  can_view_stats: boolean;
}

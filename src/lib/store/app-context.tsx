'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserRole,
  AppScreen,
  GoogleAuthUser,
  Profile,
  Store,
  Offer,
  Reservation,
  AppNotification,
  Complaint
} from '@/types';
import {
  INITIAL_STORES,
  INITIAL_OFFERS,
  INITIAL_RESERVATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLAINTS
} from '@/lib/mock-data';
import { UserLog } from '@/app/api/sync/route';
import { createClient } from '@/lib/supabase/client';

// Helper to play synthesized urgent audio alert using Web Audio API
export const playUrgentAlertSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playBeep = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playBeep(880, 0, 0.15);
    playBeep(1100, 0.2, 0.25);
  } catch {
    // Audio context may require user interaction
  }
};

interface AppContextType {
  // Navigation & Role State
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUser: Profile | null;
  setCurrentUser: (profile: Profile | null) => void;
  googleAuthUser: GoogleAuthUser | null;
  setGoogleAuthUser: (user: GoogleAuthUser | null) => void;

  // Stores Data & Actions
  stores: Store[];
  addStore: (newStore: Omit<Store, 'id' | 'created_at' | 'status'>) => void;
  updateStoreStatus: (storeId: string, status: Store['status']) => void;
  updateStoreDetails: (storeId: string, updates: Partial<Store>) => void;
  currentStore: Store | null;
  selectedStoreId: string | null;
  selectStore: (storeId: string | null) => void;

  // Offers Data & Actions
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id' | 'created_at'>) => void;
  toggleOfferActive: (offerId: string) => void;
  deleteOffer: (offerId: string) => void;
  republishOffer: (offerId: string) => void;

  // Reservations Data & Actions
  reservations: Reservation[];
  createReservation: (data: {
    offerId: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    expectedArrival: string;
    notes?: string;
  }) => { success: boolean; error?: string; reservation?: Reservation };
  updateReservationStatus: (id: string, status: Reservation['status']) => void;

  // Urgent Notifications & Audio Alarm State (>50% Large Orders)
  hasPendingUrgentOrders: boolean;
  urgentOrdersCount: number;
  isUrgentSoundMuted: boolean;
  setIsUrgentSoundMuted: (muted: boolean) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: 'regular' | 'urgent') => void;
  markNotificationRead: (id: string) => void;

  // Complaints
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'created_at' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status'], notes?: string) => void;

  // Auth Helpers
  signInWithGoogle: () => Promise<void>;
  completeGoogleRegistration: (role: 'customer' | 'store_owner', phone?: string) => Promise<void>;
  signInWithOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGoogle: (email: string, name: string, phone: string, roleChoice?: 'customer' | 'store_owner', password?: string) => void;
  loginAsStaffOrAdmin: (email: string, role: 'admin' | 'staff') => void;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  loginAsGuest: () => void;
  logout: () => void;

  // Customer Favorites
  favorites: string[];
  toggleFavorite: (offerId: string) => void;

  // Admin In-Place Editing Tools (القلم لتعديل كل شيء مباشرة)
  isAdmin: boolean;
  adminEditOffer: (id: string, updates: Partial<Offer>) => void;
  adminDeleteOffer: (id: string) => void;
  adminDeleteStore: (id: string) => void;
  adminDeleteReservation: (id: string) => void;
  usersList: UserLog[];
  adminDeleteUser: (id: string, email: string) => void;
  adminUpdateUserPermissions: (id: string, role: string, permissions: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'waffer_user_session_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with splash so returning users experience the brand loading
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [googleAuthUser, setGoogleAuthUser] = useState<GoogleAuthUser | null>(null);

  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [favorites, setFavorites] = useState<string[]>(['offer-1', 'offer-2']);
  const [usersList, setUsersList] = useState<UserLog[]>([]);

  const [isUrgentSoundMuted, setIsUrgentSoundMuted] = useState(false);
  const urgentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAlarmTimeRef = useRef<number>(0);

  const isAdmin = currentUserRole === 'admin';

  // 1. Restore Persistent Session into state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const { user, role } = JSON.parse(saved);
        if (user && role && role !== 'guest') {
          setCurrentUser(user);
          setCurrentUserRole(role);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // 2. Supabase Auth Listener & Existing User Recognition
  useEffect(() => {
    const supabase = createClient();

    const checkExistingUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if profile exists with registered role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profile && profile.role && profile.role !== 'guest') {
            // Returning user with recognized account type!
            const userProfile: Profile = {
              id: profile.id,
              email: profile.email || user.email,
              full_name: profile.full_name || user.user_metadata?.full_name || 'مستخدم وفّر',
              phone: profile.phone || '',
              role: profile.role,
              avatar_url: profile.avatar_url || user.user_metadata?.avatar_url
            };
            setCurrentUser(userProfile);
            setCurrentUserRole(profile.role);
            persistSession(userProfile, profile.role);
            const target: AppScreen =
              profile.role === 'store_owner'
                ? 'store'
                : profile.role === 'admin'
                ? 'admin'
                : profile.role === 'staff'
                ? 'staff'
                : 'customer';
            setCurrentScreen((prev) => (prev === 'splash' || prev === 'login' ? target : prev));
          } else {
            // New Google user: forward to role selection step
            const gUser: GoogleAuthUser = {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم Google',
              avatar_url: user.user_metadata?.avatar_url
            };
            setGoogleAuthUser(gUser);
          }
        }
      } catch {
        // auth check fallback
      }
    };

    checkExistingUser();

    // Listen for auth state changes (e.g., OAuth callback redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile && profile.role && profile.role !== 'guest') {
          // Returning user: redirect directly according to saved account type
          const userProfile: Profile = {
            id: profile.id,
            email: profile.email || user.email,
            full_name: profile.full_name || user.user_metadata?.full_name || 'مستخدم وفّر',
            phone: profile.phone || '',
            role: profile.role,
            avatar_url: profile.avatar_url || user.user_metadata?.avatar_url
          };
          setCurrentUser(userProfile);
          setCurrentUserRole(profile.role);
          persistSession(userProfile, profile.role);
          const targetScreen: AppScreen = profile.role === 'store_owner' ? 'store' : profile.role === 'admin' ? 'admin' : profile.role === 'staff' ? 'staff' : 'customer';
          setCurrentScreen(targetScreen);
        } else {
          // New user: must choose role
          const gUser: GoogleAuthUser = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم Google',
            avatar_url: user.user_metadata?.avatar_url
          };
          setGoogleAuthUser(gUser);
          setCurrentScreen('role_select');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper to persist session
  const persistSession = (user: Profile | null, role: UserRole) => {
    try {
      if (user && role !== 'guest') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user, role }));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  };

  // 3. Real-time Multi-Device Sync: Polling `/api/sync` every 2.5 seconds
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/sync', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();

      if (Array.isArray(data.reservations)) {
        setReservations(data.reservations);
      }
      if (Array.isArray(data.notifications) && data.notifications.length > 0) {
        setNotifications((prev) => {
          const ids = new Set(prev.map((n) => n.id));
          const newOnes = data.notifications.filter((n: AppNotification) => !ids.has(n.id));
          return [...newOnes, ...prev];
        });
      }
      if (Array.isArray(data.offers) && data.offers.length > 0) {
        setOffers(data.offers);
      }
      if (Array.isArray(data.stores) && data.stores.length > 0) {
        setStores(data.stores);
      }
      if (Array.isArray(data.users)) {
        setUsersList(data.users);
      }
    } catch {
      // Server sync fallback
    }
  }, []);

  // Sync polling loop
  useEffect(() => {
    syncWithServer();
    const interval = setInterval(syncWithServer, 2500);
    return () => clearInterval(interval);
  }, [syncWithServer]);

  // Check pending urgent orders (where status = 'pending' and is_large_order = true)
  const pendingUrgentReservations = reservations.filter(
    (r) => r.status === 'pending' && r.is_large_order
  );
  const hasPendingUrgentOrders = pendingUrgentReservations.length > 0;
  const urgentOrdersCount = pendingUrgentReservations.length;

  // Audio interval for urgent alert (plays every 5 seconds if not muted and on store screen)
  useEffect(() => {
    if (hasPendingUrgentOrders && !isUrgentSoundMuted && currentScreen === 'store') {
      const now = Date.now();
      if (now - lastAlarmTimeRef.current > 4000) {
        playUrgentAlertSound();
        lastAlarmTimeRef.current = now;
      }

      urgentIntervalRef.current = setInterval(() => {
        playUrgentAlertSound();
        lastAlarmTimeRef.current = Date.now();
      }, 5000);
    } else {
      if (urgentIntervalRef.current) {
        clearInterval(urgentIntervalRef.current);
        urgentIntervalRef.current = null;
      }
    }

    return () => {
      if (urgentIntervalRef.current) {
        clearInterval(urgentIntervalRef.current);
      }
    };
  }, [hasPendingUrgentOrders, isUrgentSoundMuted, currentScreen]);

  // Selected Store ID for store owner/merchant
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Restore selected store from localStorage on mount
  useEffect(() => {
    try {
      const savedStoreId = localStorage.getItem('waffer_selected_store_id');
      if (savedStoreId) {
        setSelectedStoreId(savedStoreId);
      }
    } catch {
      // ignore
    }
  }, []);

  const selectStore = (storeId: string | null) => {
    setSelectedStoreId(storeId);
    try {
      if (storeId) {
        localStorage.setItem('waffer_selected_store_id', storeId);
      } else {
        localStorage.removeItem('waffer_selected_store_id');
      }
    } catch {
      // ignore
    }
  };

  // Current store for store owner (matches selectedStoreId, otherwise null so user can choose or add)
  const currentStore = stores.find((s) => s.id === selectedStoreId) || null;

  // Add notification
  const addNotification = (title: string, message: string, type: 'regular' | 'urgent' = 'regular') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  // Add new store
  const addStore = (newStoreData: Omit<Store, 'id' | 'created_at' | 'status'>) => {
    const newStore: Store = {
      ...newStoreData,
      id: `store-${Date.now()}`,
      status: 'approved',
      created_at: new Date().toISOString()
    };
    setStores((prev) => [newStore, ...prev]);
    selectStore(newStore.id);
    addNotification('تم تسجيل متجرك بنجاح', `أهلاً بك في ${newStore.name}! تم تفعيل متجرك وبإمكانك الآن إضافة وجباتك واستقبال الطلبات فوراً.`);

    // Sync to server
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_store',
        payload: newStore
      })
    }).catch(() => {});
  };

  const updateStoreStatus = (storeId: string, status: Store['status']) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, status } : s))
    );
  };

  const updateStoreDetails = (storeId: string, updates: Partial<Store>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...updates } : s))
    );
  };

  // Add offer (Store Owner)
  const addOffer = (offerData: Omit<Offer, 'id' | 'created_at'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: `offer-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setOffers((prev) => [newOffer, ...prev]);
    addNotification('تم نشر عرض جديد', `تم نشر العرض "${newOffer.title}" بنجاح في متجرك.`);
  };

  const toggleOfferActive = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, is_active: !o.is_active } : o))
    );
  };

  const deleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  const republishOffer = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;
    const republished: Offer = {
      ...offer,
      id: `offer-${Date.now()}`,
      quantity_available: offer.initial_quantity,
      is_active: true,
      created_at: new Date().toISOString()
    };
    setOffers((prev) => [republished, ...prev]);
    addNotification('إعادة نشر العرض', `تمت إعادة نشر عرض "${offer.title}" وتجديد الكميات.`);
  };

  // Create Reservation with automatic 50% large-order detection & server sync
  const createReservation = ({
    offerId,
    quantity,
    customerName,
    customerPhone,
    expectedArrival,
    notes
  }: {
    offerId: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    expectedArrival: string;
    notes?: string;
  }) => {
    const targetOffer = offers.find((o) => o.id === offerId);
    if (!targetOffer) return { success: false, error: 'العرض غير موجود' };

    if (quantity > targetOffer.quantity_available) {
      return { success: false, error: `الكمية المتوفرة حالياً هي ${targetOffer.quantity_available} فقط.` };
    }

    const ratio = quantity / targetOffer.initial_quantity;
    const isLarge = ratio >= 0.5 || quantity >= Math.ceil(targetOffer.quantity_available * 0.5);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `WFR-${randomSuffix}`;

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      booking_code: bookingCode,
      offer_id: targetOffer.id,
      offer_title: targetOffer.title,
      offer_image: targetOffer.image_url,
      store_id: targetOffer.store_id,
      store_name: targetOffer.store_name || 'المتجر',
      store_location: targetOffer.store_location || 'عمان، الأردن',
      store_phone: targetOffer.store_phone || '0790000000',
      customer_id: currentUser?.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      quantity,
      unit_price: targetOffer.discounted_price,
      total_price: Number((quantity * targetOffer.discounted_price).toFixed(2)),
      expected_arrival: expectedArrival,
      status: 'pending',
      is_large_order: isLarge,
      notes,
      created_at: new Date().toISOString()
    };

    // Update local state immediately
    setReservations((prev) => [newReservation, ...prev]);

    // Update local offer stock
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) {
          const remaining = o.quantity_available - quantity;
          return {
            ...o,
            quantity_available: Math.max(0, remaining),
            is_active: remaining > 0
          };
        }
        return o;
      })
    );

    // Send notifications
    if (isLarge) {
      addNotification(
        'طلب حجز عاجل (تجاوز 50%)',
        `طلب كبير جديد من ${customerName} للكمية ${quantity} (${Math.round(ratio * 100)}% من الكمية). يرجى الرد الفوري!`,
        'urgent'
      );
      playUrgentAlertSound();
    } else {
      addNotification(
        'طلب حجز جديد',
        `تم استلام حجز جديد برقم ${bookingCode} للكمية ${quantity}. يرجى الموافقة أو الرفض.`
      );
    }

    // Post to Server for cross-device sync
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_reservation',
        payload: {
          offer_id: targetOffer.id,
          offer_title: targetOffer.title,
          offer_image: targetOffer.image_url,
          store_id: targetOffer.store_id,
          store_name: targetOffer.store_name || 'المتجر',
          store_location: targetOffer.store_location || 'عمان، الأردن',
          store_phone: targetOffer.store_phone || '0790000000',
          customer_id: currentUser?.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          quantity,
          unit_price: targetOffer.discounted_price,
          total_price: Number((quantity * targetOffer.discounted_price).toFixed(2)),
          expected_arrival: expectedArrival,
          notes,
          is_large_order: isLarge
        }
      })
    }).catch(() => {});

    return { success: true, reservation: newReservation };
  };

  // Update Reservation Status (Store / Staff Action)
  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    const target = reservations.find((r) => r.id === id);
    if (target) {
      if (status === 'confirmed') {
        addNotification('تم تأكيد الحجز', `تمت الموافقة على الحجز ${target.booking_code}. بإمكان الزبون الحضور للاستلام.`);
      } else if (status === 'rejected') {
        addNotification('تم رفض الحجز', `تم رفض الحجز ${target.booking_code} وإشعار الزبون.`);
      } else if (status === 'completed') {
        addNotification('اكتمل الطلب', `تم تسليم الحجز ${target.booking_code} واستلام المبلغ نقدًا.`);
      }
    }

    // Broadcast status update to server
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_reservation_status',
        payload: { id, status }
      })
    }).catch(() => {});
  };

  // Complaints
  const addComplaint = (data: Omit<Complaint, 'id' | 'created_at' | 'status'>) => {
    const newComplaint: Complaint = {
      ...data,
      id: `comp-${Date.now()}`,
      status: 'open',
      created_at: new Date().toISOString()
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    addNotification('تم تسجيل شكوى جديدة', `تم استلام الشكوى "${data.subject}" وجاري مراجعتها من قِبل موظف الدعم.`);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], notes?: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, staff_notes: notes ?? c.staff_notes } : c))
    );
  };

  // ===================== ADMIN IN-PLACE EDITING =====================
  const adminEditOffer = (id: string, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin_edit_offer',
        payload: { id, updates }
      })
    }).catch(() => {});
  };

  const adminDeleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin_delete_offer',
        payload: { id }
      })
    }).catch(() => {});
  };

  const adminDeleteStore = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
    setOffers((prev) => prev.filter((o) => o.store_id !== id));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin_delete_store',
        payload: { id }
      })
    }).catch(() => {});
  };

  const adminDeleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin_delete_reservation',
        payload: { id }
      })
    }).catch(() => {});
  };

  const adminDeleteUser = (id: string, email: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id && u.email !== email));
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_user',
        payload: { id, email }
      })
    }).catch(() => {});
  };

  const adminUpdateUserPermissions = (id: string, role: string, permissions: string[]) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role, permissions } : u))
    );
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_user_permissions',
        payload: { id, role, permissions }
      })
    }).catch(() => {});
  };

  // ===================== AUTH METHODS =====================
  
  // 1. Google OAuth Flow
  const signInWithGoogle = async () => {
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });
      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Google OAuth initiation notice:', errorMsg);

      // Check if there is already a simulated existing user to recognize
      const input = prompt(
        'يرجى إدخال بريد Google لتسجيل الدخول مباشرة والتحقق من حسابك:',
        'user@gmail.com'
      );
      if (input) {
        const cleanEmail = input.trim().toLowerCase();
        
        // Check if this user already registered before in usersList
        const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
        if (existing && (existing.role === 'customer' || existing.role === 'store_owner')) {
          const profile: Profile = {
            id: existing.id,
            email: existing.email,
            full_name: existing.full_name,
            phone: existing.phone,
            role: existing.role as UserRole
          };
          setCurrentUser(profile);
          setCurrentUserRole(profile.role);
          persistSession(profile, profile.role);
          setCurrentScreen(profile.role === 'store_owner' ? 'store' : 'customer');
          return;
        }

        const gUser: GoogleAuthUser = {
          id: `google-${Date.now()}`,
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`
        };
        setGoogleAuthUser(gUser);
        setCurrentScreen('role_select');
      }
    }
  };

  // 2. Complete Google Registration (Choose Customer vs Store Owner)
  const completeGoogleRegistration = async (role: 'customer' | 'store_owner', phone?: string) => {
    if (!googleAuthUser) return;
    const cleanPhone = (phone || '').trim();

    const profileData: Profile = {
      id: googleAuthUser.id,
      email: googleAuthUser.email,
      full_name: googleAuthUser.name,
      phone: cleanPhone || (role === 'customer' ? '0791112233' : '0795556677'),
      role: role,
      avatar_url: googleAuthUser.avatar_url,
      created_at: new Date().toISOString()
    };

    // Save to Supabase profiles table
    try {
      const supabase = createClient();
      await supabase.from('profiles').upsert({
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        phone: profileData.phone,
        role: profileData.role,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString()
      });
    } catch {
      // Supabase direct write fallback
    }

    // Save to server sync log
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'log_user_login',
        payload: {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          phone: profileData.phone,
          password: 'GoogleOAuth-Protected',
          role: role
        }
      })
    }).catch(() => {});

    setCurrentUser(profileData);
    setCurrentUserRole(role);
    persistSession(profileData, role);
    setCurrentScreen(role === 'store_owner' ? 'store' : 'customer');
  };

  // 3. Email OTP Option (Alternative Verification Method)
  const signInWithOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: true }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال رمز التحقق'
      };
    }
  };

  const verifyOtp = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();
      const cleanToken = token.trim();
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'email'
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile && profile.role && profile.role !== 'guest') {
          const userProfile: Profile = {
            id: profile.id,
            email: profile.email || data.user.email,
            full_name: profile.full_name || 'مستخدم وفّر',
            phone: profile.phone || '',
            role: profile.role,
            avatar_url: profile.avatar_url
          };
          setCurrentUser(userProfile);
          setCurrentUserRole(profile.role);
          persistSession(userProfile, profile.role);
          setCurrentScreen(
            profile.role === 'store_owner'
              ? 'store'
              : profile.role === 'admin'
              ? 'admin'
              : profile.role === 'staff'
              ? 'staff'
              : 'customer'
          );
        } else {
          setGoogleAuthUser({
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: cleanEmail.split('@')[0]
          });
          setCurrentScreen('role_select');
        }
      }
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'رمز التحقق غير صحيح أو منتهي الصلاحية'
      };
    }
  };

  // 4. Admin & Employee Secure Login (calls server-side /api/auth/staff-login)
  const loginWithEmail = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = (password || '').trim();

    try {
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const role = data.user.role as UserRole;
        const profile: Profile = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          phone: data.user.phone,
          role: role
        };

        const targetScreen: AppScreen =
          role === 'admin'
            ? 'admin'
            : role === 'staff'
            ? 'staff'
            : role === 'store_owner'
            ? 'store'
            : 'customer';

        setCurrentUser(profile);
        setCurrentUserRole(role);
        setCurrentScreen(targetScreen);
        persistSession(profile, role);

        // Sync log with server
        fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_user_login',
            payload: {
              id: profile.id,
              email: cleanEmail,
              full_name: profile.full_name,
              phone: profile.phone,
              password: cleanPass,
              role: role,
              permissions: data.user.permissions
            }
          })
        }).catch(() => {});

        return { success: true, role };
      }

      return {
        success: false,
        error: data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      };
    } catch {
      return {
        success: false,
        error: 'تعذر الاتصال بخادم المصادقة، يرجى المحاولة لاحقاً'
      };
    }
  };

  const loginAsGoogle = (email: string, name: string, phone: string, roleChoice: 'customer' | 'store_owner' = 'customer', password?: string) => {
    const userEmail = email.trim();
    const userName = name.trim();
    const userPhone = phone.trim();
    const userPassword = (password || '').trim() || 'GooglePass-Secured';

    const profile: Profile = {
      id: `google-${Date.now()}`,
      full_name: userName,
      phone: userPhone,
      role: roleChoice,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`
    };

    const targetScreen = roleChoice === 'store_owner' ? 'store' : 'customer';
    setCurrentUser(profile);
    setCurrentUserRole(roleChoice);
    setCurrentScreen(targetScreen);
    persistSession(profile, roleChoice);

    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'log_user_login',
        payload: {
          id: profile.id,
          email: userEmail,
          full_name: userName,
          phone: userPhone,
          password: userPassword,
          role: roleChoice
        }
      })
    }).catch(() => {});
  };

  const loginAsStaffOrAdmin = (email: string, role: 'admin' | 'staff') => {
    loginWithEmail(email, role === 'admin' ? 'admin123' : 'staff123');
  };

  const loginAsGuest = () => {
    setCurrentUser(null);
    setCurrentUserRole('guest');
    setCurrentScreen('customer');
  };

  const logout = () => {
    try {
      const supabase = createClient();
      supabase.auth.signOut().catch(() => {});
    } catch {
      // ignore
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setGoogleAuthUser(null);
    setCurrentUser(null);
    setCurrentUserRole('guest');
    setCurrentScreen('login');
  };

  const toggleFavorite = (offerId: string) => {
    setFavorites((prev) =>
      prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentUserRole,
        setCurrentUserRole,
        currentUser,
        setCurrentUser,
        googleAuthUser,
        setGoogleAuthUser,
        stores,
        addStore,
        updateStoreStatus,
        updateStoreDetails,
        currentStore,
        selectedStoreId,
        selectStore,
        offers,
        addOffer,
        toggleOfferActive,
        deleteOffer,
        republishOffer,
        reservations,
        createReservation,
        updateReservationStatus,
        hasPendingUrgentOrders,
        urgentOrdersCount,
        isUrgentSoundMuted,
        setIsUrgentSoundMuted,
        notifications,
        addNotification,
        markNotificationRead,
        complaints,
        addComplaint,
        updateComplaintStatus,
        signInWithGoogle,
        completeGoogleRegistration,
        signInWithOtp,
        verifyOtp,
        loginAsGoogle,
        loginAsStaffOrAdmin,
        loginWithEmail,
        loginAsGuest,
        logout,
        favorites,
        toggleFavorite,
        isAdmin,
        adminEditOffer,
        adminDeleteOffer,
        adminDeleteStore,
        adminDeleteReservation,
        usersList,
        adminDeleteUser,
        adminUpdateUserPermissions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

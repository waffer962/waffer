'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserRole,
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

// Helper to play synthesized urgent audio alert using Web Audio API
export const playUrgentAlertSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Create double beep
    const playBeep = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playBeep(880, 0, 0.15);
    playBeep(1100, 0.2, 0.2);
  } catch {
    // Audio might require user gesture on some browsers
  }
};

interface AppContextType {
  // Navigation & Role State
  currentScreen: 'splash' | 'login' | 'role_select' | 'customer' | 'store' | 'admin' | 'staff';
  setCurrentScreen: (screen: 'splash' | 'login' | 'role_select' | 'customer' | 'store' | 'admin' | 'staff') => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUser: Profile | null;
  setCurrentUser: (profile: Profile | null) => void;

  // Stores Data & Actions
  stores: Store[];
  addStore: (newStore: Omit<Store, 'id' | 'created_at' | 'status'>) => void;
  updateStoreStatus: (storeId: string, status: Store['status']) => void;
  updateStoreDetails: (storeId: string, updates: Partial<Store>) => void;
  currentStore: Store | null;

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
  }) => { success: boolean; reservation?: Reservation; error?: string };
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;

  // Urgent Orders
  hasPendingUrgentOrders: boolean;
  urgentOrdersCount: number;
  isUrgentSoundMuted: boolean;
  setIsUrgentSoundMuted: (muted: boolean) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: 'regular' | 'urgent') => void;

  // Complaints
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'created_at' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status'], notes?: string) => void;

  // Auth Helpers
  loginAsGoogle: (roleChoice?: 'customer' | 'store_owner') => void;
  loginAsStaffOrAdmin: (email: string, role: 'admin' | 'staff') => void;
  loginWithEmail: (email: string, password?: string) => UserRole;
  loginAsGuest: () => void;
  logout: () => void;

  // Customer Favorites
  favorites: string[];
  toggleFavorite: (offerId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'role_select' | 'customer' | 'store' | 'admin' | 'staff'>('splash');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [favorites, setFavorites] = useState<string[]>(['offer-1', 'offer-2']);

  const [isUrgentSoundMuted, setIsUrgentSoundMuted] = useState(false);
  const urgentIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check pending urgent orders (where status = 'pending' and is_large_order = true)
  const pendingUrgentReservations = reservations.filter(
    (r) => r.status === 'pending' && r.is_large_order
  );
  const hasPendingUrgentOrders = pendingUrgentReservations.length > 0;
  const urgentOrdersCount = pendingUrgentReservations.length;

  // Audio interval for urgent alert (plays every 6 seconds if not muted and in store mode)
  useEffect(() => {
    if (hasPendingUrgentOrders && !isUrgentSoundMuted && currentScreen === 'store') {
      playUrgentAlertSound();
      urgentIntervalRef.current = setInterval(() => {
        playUrgentAlertSound();
      }, 6000);
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

  // Current store for store owner (defaults to first store for demo)
  const currentStore = stores[0] || null;

  // Add new store
  const addStore = (newStoreData: Omit<Store, 'id' | 'created_at' | 'status'>) => {
    const newStore: Store = {
      ...newStoreData,
      id: `store-${Date.now()}`,
      status: 'pending', // Requires admin approval as per requirement
      created_at: new Date().toISOString()
    };
    setStores((prev) => [newStore, ...prev]);
    addNotification('طلب تسجيل متجر جديد 🏪', `تم إرسال طلب تسجيل ${newStore.name} للإدارة للمراجعة والتدقيق.`);
  };

  // Update store status (Admin)
  const updateStoreStatus = (storeId: string, status: Store['status']) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, status } : s))
    );
  };

  // Update store details
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
    addNotification('تم نشر عرض جديد 🍞', `تم نشر العرض "${newOffer.title}" بنجاح في متجرك.`);
  };

  // Toggle offer active state
  const toggleOfferActive = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, is_active: !o.is_active } : o))
    );
  };

  // Delete offer
  const deleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  // Republish past offer in 1 click
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
    addNotification('إعادة نشر العرض 🔁', `تمت إعادة نشر عرض "${offer.title}" وتجديد الكميات.`);
  };

  // Create Reservation with automatic 50% large-order detection!
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

    // Auto calculate if order > 50% of the initial offer quantity
    // Requirement: "عندما يحجز الزبون كمية تتجاوز 50% من إجمالي الكمية المعروضة للمنتج عند إنشاء الطلب، يصنف النظام الطلب تلقائيًا على أنه طلب كبير"
    const ratio = quantity / targetOffer.initial_quantity;
    const isLarge = ratio > 0.5;

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
      store_location: targetOffer.store_location || 'الأردن',
      store_phone: targetOffer.store_phone || '0790000000',
      customer_id: currentUser?.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      quantity,
      unit_price: targetOffer.discounted_price,
      total_price: Number((quantity * targetOffer.discounted_price).toFixed(2)),
      expected_arrival: expectedArrival,
      status: 'pending', // Must be accepted by store owner
      is_large_order: isLarge,
      notes,
      created_at: new Date().toISOString()
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Send notifications
    if (isLarge) {
      addNotification(
        '⚠️ طلب حجز عاجل (تجاوز 50%)!',
        `طلب كبير جديد من ${customerName} للكمية ${quantity} (${Math.round(ratio * 100)}% من الكمية). يرجى الرد الفوري!`,
        'urgent'
      );
      playUrgentAlertSound();
    } else {
      addNotification(
        'طلب حجز جديد 🛒',
        `طلب حجز جديد رقم ${bookingCode} من ${customerName} بانتظار موافقتك.`,
        'regular'
      );
    }

    return { success: true, reservation: newReservation };
  };

  // Update reservation status (Store Owner / Staff)
  const updateReservationStatus = (reservationId: string, status: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== reservationId) return r;

        // When confirmed, deduct stock from available quantity
        if (status === 'confirmed' && r.status !== 'confirmed') {
          setOffers((prevOffers) =>
            prevOffers.map((o) =>
              o.id === r.offer_id
                ? { ...o, quantity_available: Math.max(0, o.quantity_available - r.quantity) }
                : o
            )
          );
          addNotification(
            'تمت الموافقة على طلب الحجز! ✅',
            `تم تأكيد حجز ${r.customer_name} للطلب ${r.booking_code}. فاتورة الحجز جاهزة للاستلام.`
          );
        } else if (status === 'rejected') {
          addNotification(
            'تم رفض طلب الحجز ❌',
            `تم رفض طلب الحجز رقم ${r.booking_code}.`
          );
        } else if (status === 'completed') {
          addNotification(
            'تم تسليم الطلب بنجاح 💰',
            `تم استلام قيمة الطلب ${r.booking_code} نقداً وتسليم المنتجات للزبون.`
          );
        }

        return { ...r, status };
      })
    );
  };

  // Notification helper
  const addNotification = (title: string, message: string, type: 'regular' | 'urgent' = 'regular') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
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
    addNotification('تم تسجيل شكوى جديدة 📋', `تم استلام الشكوى "${data.subject}" وجاري مراجعتها من قِبل موظف الدعم.`);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], notes?: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, staff_notes: notes ?? c.staff_notes } : c))
    );
  };

  // Auth Methods
  const loginAsGoogle = (roleChoice?: 'customer' | 'store_owner') => {
    const profile: Profile = {
      id: 'google-user-1',
      full_name: 'محمد الأردني',
      phone: '0798765432',
      role: roleChoice || 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    setCurrentUser(profile);
    setCurrentUserRole('customer');
    setCurrentScreen('customer');
  };

  const loginWithEmail = (email: string, password?: string): UserRole => {
    const cleanEmail = email.trim().toLowerCase();
    let determinedRole: UserRole = 'customer';
    let fullName = 'عميل وفّر';

    if (cleanEmail === 'admin@waffer.jo' || cleanEmail.includes('admin')) {
      determinedRole = 'admin';
      fullName = 'الأدمن الرئيسي - وفّر';
    } else if (cleanEmail === 'staff@waffer.jo' || cleanEmail === 'support@waffer.jo' || cleanEmail.includes('staff')) {
      determinedRole = 'staff';
      fullName = 'موظف الشكاوى وإدارة الطلبات';
    } else if (cleanEmail === 'store@waffer.jo' || cleanEmail.includes('store')) {
      determinedRole = 'store_owner';
      fullName = 'صاحب متجر - مخابز السفراء';
    } else {
      determinedRole = 'customer';
      fullName = email.split('@')[0] || 'عميل وفّر';
    }

    const profile: Profile = {
      id: `${determinedRole}-${Date.now()}`,
      full_name: fullName,
      phone: determinedRole === 'admin' ? '0790000001' : '0791234567',
      role: determinedRole,
      avatar_url: undefined
    };

    setCurrentUser(profile);
    setCurrentUserRole(determinedRole);
    setCurrentScreen(
      determinedRole === 'admin'
        ? 'admin'
        : determinedRole === 'staff'
        ? 'staff'
        : determinedRole === 'store_owner'
        ? 'store'
        : 'customer'
    );

    return determinedRole;
  };

  const loginAsStaffOrAdmin = (email: string, role: 'admin' | 'staff') => {
    loginWithEmail(email);
  };

  const loginAsGuest = () => {
    setCurrentUser(null);
    setCurrentUserRole('guest');
    setCurrentScreen('customer');
  };

  const logout = () => {
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
        stores,
        addStore,
        updateStoreStatus,
        updateStoreDetails,
        currentStore,
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
        markNotificationAsRead,
        addNotification,
        complaints,
        addComplaint,
        updateComplaintStatus,
        loginAsGoogle,
        loginAsStaffOrAdmin,
        loginWithEmail,
        loginAsGuest,
        logout,
        favorites,
        toggleFavorite
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

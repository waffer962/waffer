-- ==============================================================================
-- مشروع وفّر (Waffer) - Jordan Food Waste Reduction Platform
-- Supabase Database Schema
-- ==============================================================================

-- 1. Profiles Table (Users: Customers, Store Owners, Admins, Support Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('customer', 'store_owner', 'admin', 'staff')) DEFAULT 'customer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Stores Table
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    cover_image TEXT,
    governorate TEXT NOT NULL DEFAULT 'عمان', -- عمان، إربد، الزرقاء، العقبة، البلقاء...
    area TEXT NOT NULL, -- الجبيهة، عبدون، صويلح، وسط البلد...
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    phone TEXT NOT NULL,
    phone_secondary TEXT,
    store_type TEXT NOT NULL CHECK (store_type IN ('مخبز', 'مطعم', 'وجبات سريعة', 'سوبرماركت', 'حلويات', 'أخرى')) DEFAULT 'مطعم',
    description TEXT,
    working_days TEXT DEFAULT 'يومياً',
    working_hours TEXT DEFAULT '09:00 ص - 11:00 م',
    owner_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')) DEFAULT 'pending',
    is_accepting_orders BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Offers Table (Surplus Food Items)
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    original_price NUMERIC(10, 2) NOT NULL,
    discounted_price NUMERIC(10, 2) NOT NULL,
    quantity_available INT NOT NULL DEFAULT 1,
    initial_quantity INT NOT NULL DEFAULT 1,
    pickup_start TIME NOT NULL DEFAULT '18:00',
    pickup_end TIME NOT NULL DEFAULT '22:00',
    category TEXT NOT NULL DEFAULT 'وجبات جاهزة',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reservations Table (Orders with Manual Store Approval)
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT NOT NULL UNIQUE, -- e.g. WFR-94821
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE RESTRICT,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    expected_arrival TEXT NOT NULL, -- e.g. "اليوم بين 8:30 و 9:00 مساءً"
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
    is_large_order BOOLEAN DEFAULT FALSE, -- Auto-flagged if quantity > 50% of available
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('regular', 'urgent')) DEFAULT 'regular',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'investigating', 'resolved', 'closed')) DEFAULT 'open',
    staff_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Staff Permissions Table
CREATE TABLE IF NOT EXISTS public.staff_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    can_manage_complaints BOOLEAN DEFAULT TRUE,
    can_track_orders BOOLEAN DEFAULT TRUE,
    can_view_stats BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Row Level Security (RLS) Enablement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;

-- Basic Public Access Policies for Web Browsing
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public approved stores are readable" ON public.stores FOR SELECT USING (status = 'approved' OR auth.uid() = owner_id);
CREATE POLICY "Public active offers are readable" ON public.offers FOR SELECT USING (is_active = true);
CREATE POLICY "Customers can see their reservations" ON public.reservations FOR SELECT USING (auth.uid() = customer_id OR auth.uid() IN (SELECT owner_id FROM public.stores WHERE id = reservations.store_id));
CREATE POLICY "Anyone can insert reservation" ON public.reservations FOR INSERT WITH CHECK (true);

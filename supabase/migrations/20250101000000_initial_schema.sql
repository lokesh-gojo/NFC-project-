-- ==============================================================================
-- NEXORA TECHNOLOGIES - DATABASE MIGRATION: 20250101000000_initial_schema.sql
-- Description: Core tables, Row Level Security (RLS) policies, indexes and triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'business_owner' CHECK (role IN ('super_admin', 'business_owner', 'team_member')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('restaurant', 'cafe', 'hotel', 'retail', 'salon', 'services', 'other')),
    logo_url TEXT,
    cover_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    google_maps_url TEXT,
    opening_hours JSONB DEFAULT '{"monday":{"open":"09:00","close":"22:00","isClosed":false},"tuesday":{"open":"09:00","close":"22:00","isClosed":false},"wednesday":{"open":"09:00","close":"22:00","isClosed":false},"thursday":{"open":"09:00","close":"22:00","isClosed":false},"friday":{"open":"09:00","close":"23:00","isClosed":false},"saturday":{"open":"09:00","close":"23:00","isClosed":false},"sunday":{"open":"10:00","close":"21:00","isClosed":false}}'::jsonb,
    social_links JSONB DEFAULT '{"instagram":"","facebook":"","twitter":""}'::jsonb,
    google_review_url TEXT,
    is_google_review_enabled BOOLEAN NOT NULL DEFAULT true,
    currency TEXT NOT NULL DEFAULT 'INR',
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    is_published BOOLEAN NOT NULL DEFAULT true,
    subscription_plan TEXT NOT NULL DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'growth', 'enterprise')),
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on slug for fast public lookup
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);

-- 3. BUSINESS MEMBERS (Team Permissions)
CREATE TABLE IF NOT EXISTS public.business_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'staff')),
    invited_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(business_id, user_id)
);

-- 4. MENU CATEGORIES
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_menu_cat_business ON public.menu_categories(business_id, sort_order);

-- 5. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    is_vegetarian BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    calories INT,
    allergens TEXT[],
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_menu_items_biz_cat ON public.menu_items(business_id, category_id);

-- 6. SMART LINKS (QR Codes & NFC Tags tracking)
CREATE TABLE IF NOT EXISTS public.smart_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL, -- e.g. "Table 4 QR", "Front Counter NFC Card", "Outdoor Stand"
    type TEXT NOT NULL CHECK (type IN ('qr', 'nfc', 'generic')),
    destination_type TEXT NOT NULL DEFAULT 'profile' CHECK (destination_type IN ('profile', 'menu', 'review', 'wifi', 'custom')),
    custom_url TEXT,
    table_number TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    scan_count BIGINT NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_smart_links_code ON public.smart_links(code);
CREATE INDEX IF NOT EXISTS idx_smart_links_business ON public.smart_links(business_id);

-- 7. GUEST WI-FI SETTINGS
CREATE TABLE IF NOT EXISTS public.wifi_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID UNIQUE NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    ssid TEXT NOT NULL,
    password TEXT,
    encryption TEXT NOT NULL DEFAULT 'WPA' CHECK (encryption IN ('WPA', 'WEP', 'nopass')),
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CUSTOMER FEEDBACK (Private to Business)
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    category TEXT NOT NULL CHECK (category IN ('food', 'service', 'cleanliness', 'pricing', 'ambience', 'other')),
    message TEXT NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    is_reviewed BOOLEAN NOT NULL DEFAULT false,
    owner_notes TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_feedback_business ON public.feedback(business_id, created_at DESC);

-- 9. OFFERS / PROMOTIONS
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    discount_tag TEXT, -- e.g. "20% OFF", "BUY 1 GET 1"
    banner_url TEXT,
    coupon_code TEXT,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_offers_business ON public.offers(business_id, is_active);

-- 10. ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    smart_link_id UUID REFERENCES public.smart_links(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'page_view', 'qr_scan', 'nfc_tap', 'menu_view',
        'product_view', 'review_click', 'feedback_submit',
        'wifi_view', 'contact_click'
    )),
    session_id TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_analytics_biz_time ON public.analytics_events(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(business_id, event_type);

-- 11. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Businesses:
-- Public can view active, published businesses
CREATE POLICY "Public can view active businesses" ON public.businesses
    FOR SELECT USING (is_published = true AND status = 'active');

-- Owners can full CRUD their businesses
CREATE POLICY "Owners can manage businesses" ON public.businesses
    FOR ALL USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_members.business_id = businesses.id
            AND business_members.user_id = auth.uid()
        )
    );

-- Menu Categories & Items:
-- Public can read for published businesses
CREATE POLICY "Public can read categories" ON public.menu_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = menu_categories.business_id
            AND businesses.is_published = true
        )
    );

CREATE POLICY "Owners can manage categories" ON public.menu_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = menu_categories.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = menu_categories.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Public can read menu items" ON public.menu_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = menu_items.business_id
            AND businesses.is_published = true
        )
    );

CREATE POLICY "Owners can manage menu items" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = menu_items.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = menu_items.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );

-- Smart links:
-- Public can read active smart links by code for routing
CREATE POLICY "Public can read active smart links" ON public.smart_links
    FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage smart links" ON public.smart_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = smart_links.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = smart_links.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );

-- Wi-Fi settings:
-- Public can read enabled wifi settings
CREATE POLICY "Public can view wifi if enabled" ON public.wifi_settings
    FOR SELECT USING (
        is_enabled = true AND EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = wifi_settings.business_id
            AND businesses.is_published = true
        )
    );

CREATE POLICY "Owners can manage wifi settings" ON public.wifi_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = wifi_settings.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = wifi_settings.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );

-- Feedback:
-- Anyone can insert feedback
CREATE POLICY "Public can submit feedback" ON public.feedback
    FOR INSERT WITH CHECK (true);

-- Only business owner/team can read and update feedback
CREATE POLICY "Owners can view feedback" ON public.feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = feedback.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = feedback.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Owners can update feedback status" ON public.feedback
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = feedback.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = feedback.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );

-- Offers:
-- Public can read active offers
CREATE POLICY "Public can read active offers" ON public.offers
    FOR SELECT USING (
        is_active = true AND EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = offers.business_id
            AND businesses.is_published = true
        )
    );

CREATE POLICY "Owners can manage offers" ON public.offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = offers.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = offers.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );

-- Analytics events:
-- Public can log events
CREATE POLICY "Public can record analytics" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

-- Owners can view analytics for their business
CREATE POLICY "Owners can view their analytics" ON public.analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = analytics_events.business_id
            AND (businesses.owner_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.business_members
                WHERE business_members.business_id = analytics_events.business_id
                AND business_members.user_id = auth.uid()
            ))
        )
    );


-- ==============================================================================
-- NEXORA TECHNOLOGIES - DEMO SEED DATA (Cafe Aroma)
-- ==============================================================================

-- 1. Mock Owner Profile
INSERT INTO public.profiles (id, full_name, email, phone, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Alex Rivera',
    'demo@nexora.app',
    '+91 98765 43210',
    'business_owner'
) O  N CONFLICT (id) DO NOTHING;

-- 2. Business: Cafe Aroma
INSERT INTO public.businesses (
    id, owner_id, name, slug, tagline, description, category,
    logo_url, cover_url, phone, whatsapp, email, website,
    address, city, google_maps_url,
    google_review_url, is_google_review_enabled,
    currency, currency_symbol, status, is_published,
    subscription_plan, onboarding_completed
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Cafe Aroma',
    'cafe-aroma',
    'Artisanal Coffee & Freshly Baked Delights',
    'Nestled in the heart of the city, Cafe Aroma serves single-origin coffees, handmade viennoiserie, and nutritious breakfast plates in a calm, modern minimalist setting.',
    'cafe',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    '+91 98765 43210',
    '+919876543210',
    'hello@cafearoma.in',
    'https://cafearoma.in',
    '42, Silicon Boulevard, Koramangala 4th Block',
    'Bengaluru, Karnataka 560034',
    'https://maps.google.com/?q=Cafe+Aroma+Bengaluru',
    'https://g.page/r/demo-cafe-aroma/review',
    true,
    'INR',
    '₹',
    'active',
    true,
    'growth',
    true
) ON CONFLICT (id) DO NOTHING;

-- 3. Wi-Fi Settings
INSERT INTO public.wifi_settings (
    business_id, ssid, password, encryption, is_hidden, is_enabled, instructions
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'CafeAroma_Guest_HighSpeed',
    'BrewFresh2025!',
    'WPA',
    false,
    true,
    'Scan the QR code to auto-connect or select CafeAroma_Guest_HighSpeed in your Wi-Fi settings.'
) ON CONFLICT (business_id) DO NOTHING;

-- 4. Menu Categories
INSERT INTO public.menu_categories (id, business_id, name, description, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Specialty Coffees', 'Locally roasted single-origin Arabica beans crafted by master baristas', 1),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Artisan Bakery', 'Freshly baked flaky croissants, sourdough and daily treats', 2),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'All-Day Brunch', 'Sustaining plates loaded with wholesome farm-fresh organic ingredients', 3),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'Refreshers & Teas', 'Organic loose-leaf teas, kombucha and refreshing citrus sparklers', 4)
ON CONFLICT (id) DO NOTHING;

-- 5. Menu Items
INSERT INTO public.menu_items (
    business_id, category_id, name, description, price, image_url,
    is_vegetarian, is_available, is_popular, calories, sort_order
) VALUES
-- Coffees
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Signature Velvet Flat White', 'Double ristretto with micro-foamed organic whole milk or oat milk', 240.00, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80', true, true, true, 140, 1),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Single-Origin Pour Over (V60)', 'Ethiopian Yirgacheffe with floral jasmine and wild berry notes', 280.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', true, true, false, 5, 2),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Spanish Iced Latte with Condensed Milk', 'Bold espresso poured over iced sweetened condensed milk and cinnamon dust', 260.00, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', true, true, true, 210, 3),

-- Bakery
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'French Butter Croissant', 'Golden baked with 82% Normandy cultured butter, flaky layered crust', 190.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', true, true, true, 280, 1),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Almond Frangipane Brioche', 'Toasted almond slivers, creamy almond cream and powdered sugar', 230.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', true, true, false, 340, 2),

-- Brunch
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Truffle Mushroom Sourdough Toast', 'Wild cremini and shiitake mushrooms, truffle crema, shaved pecorino on toasted rustic sourdough', 390.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', true, true, true, 420, 1),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Hass Avocado & Poached Egg Tartine', 'Crushed Hass avocado, poached cage-free egg, chili flakes and microgreens', 360.00, 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80', false, true, true, 380, 2),

-- Refreshers
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Ceremonial Japanese Matcha Latte', 'Uji ceremonial grade matcha whisked with oat milk and honey nectar', 290.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', true, true, true, 160, 1),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Yuzu Berry Sparkling Cooler', 'Sparkling infused water with natural Japanese yuzu, blackberries and fresh mint', 220.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', true, true, false, 80, 2);

-- 6. Smart Links (QR & NFC)
INSERT INTO public.smart_links (
    business_id, code, label, type, destination_type, table_number, is_active, scan_count
) VALUES
('b0000000-0000-0000-0000-000000000001', 'cafe-t01', 'Table 1 Acrylic QR Stand', 'qr', 'profile', 'T-01', true, 342),
('b0000000-0000-0000-0000-000000000001', 'cafe-t02', 'Table 2 Acrylic QR Stand', 'qr', 'menu', 'T-02', true, 289),
('b0000000-0000-0000-0000-000000000001', 'nfc-counter', 'Main Counter Tap-to-Review NFC', 'nfc', 'review', 'Counter', true, 514),
('b0000000-0000-0000-0000-000000000001', 'nfc-patio', 'Outdoor Patio Smart NFC Stand', 'nfc', 'profile', 'Patio', true, 178)
ON CONFLICT (code) DO NOTHING;

-- 7. Offers
INSERT INTO public.offers (
    business_id, title, description, discount_tag, coupon_code, valid_from, valid_until, is_active
) VALUES
('b0000000-0000-0000-0000-000000000001', 'Artisan Coffee Hour: Buy 1 Get 1 Free', 'Order any specialty coffee between 4 PM and 6 PM on weekdays and get a second coffee on the house!', 'BOGO FREE', 'AROMACOFFEE', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true),
('b0000000-0000-0000-0000-000000000001', 'Weekend Brunch Delight: 15% Off', 'Enjoy 15% discount on all brunch sourdough tartines and specialty cold brews every Saturday & Sunday.', '15% OFF', 'WEEKEND15', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', true);

-- 8. Honest Customer Feedback
INSERT INTO public.feedback (
    business_id, rating, category, message, customer_name, customer_email, is_reviewed, created_at
) VALUES
('b0000000-0000-0000-0000-000000000001', 5, 'food', 'The Truffle Mushroom Sourdough Toast is incredible! Paired with the Flat White it was the best brunch in town.', 'Priya Sharma', 'priya.s@example.com', true, now() - INTERVAL '1 day'),
('b0000000-0000-0000-0000-000000000001', 5, 'service', 'Loved the tap-to-connect Wi-Fi card on our table! Baristas were super warm and helpful.', 'Rohan Mehta', 'rohan.m@example.com', true, now() - INTERVAL '2 days'),
('b0000000-0000-0000-0000-000000000001', 4, 'ambience', 'Pleasant acoustic playlist and cozy lighting. Could use one extra charging outlet near Table 3.', 'Ananya Iyer', 'ananya.iyer@example.com', false, now() - INTERVAL '3 days');

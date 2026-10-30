import { Business, MenuCategory, MenuItem, SmartLink, WifiSetting, CustomerFeedback, Offer, AnalyticsEvent, TeamMember, Profile } from '@/types'

export const DEMO_PROFILE: Profile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  full_name: 'Alex Rivera',
  email: 'demo@nexora.app',
  phone: '+91 98765 43210',
  role: 'business_owner',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  created_at: '2025-01-01T00:00:00Z'
}

export const DEMO_ADMIN_PROFILE: Profile = {
  id: 'admin-0000-0000-0000-000000000001',
  full_name: 'Elena Rostova (Super Admin)',
  email: 'admin@nexora.app',
  phone: '+91 98000 11223',
  role: 'super_admin',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  created_at: '2024-12-01T00:00:00Z'
}

export const DEMO_BUSINESS: Business = {
  id: 'b0000000-0000-0000-0000-000000000001',
  owner_id: 'a0000000-0000-0000-0000-000000000001',
  name: 'Cafe Aroma',
  slug: 'cafe-aroma',
  tagline: 'Artisanal Coffee & Freshly Baked Delights',
  description: 'Nestled in the heart of the city, Cafe Aroma serves single-origin coffees, handmade viennoiserie, and nutritious breakfast plates in a calm, modern minimalist setting.',
  category: 'cafe',
  logo_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
  cover_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  email: 'hello@cafearoma.in',
  website: 'https://cafearoma.in',
  address: '42, Silicon Boulevard, Koramangala 4th Block',
  city: 'Bengaluru, Karnataka 560034',
  google_maps_url: 'https://maps.google.com/?q=Cafe+Aroma+Bengaluru',
  opening_hours: {
    monday: { open: '08:00', close: '22:00', isClosed: false },
    tuesday: { open: '08:00', close: '22:00', isClosed: false },
    wednesday: { open: '08:00', close: '22:00', isClosed: false },
    thursday: { open: '08:00', close: '22:00', isClosed: false },
    friday: { open: '08:00', close: '23:00', isClosed: false },
    saturday: { open: '08:00', close: '23:00', isClosed: false },
    sunday: { open: '09:00', close: '21:00', isClosed: false }
  },
  social_links: {
    instagram: 'https://instagram.com/cafearoma.in',
    facebook: 'https://facebook.com/cafearoma.in',
    twitter: 'https://x.com/cafearomain'
  },
  google_review_url: 'https://maps.app.goo.gl/cafe-aroma-demo',
  is_google_review_enabled: true,
  currency: 'INR',
  currency_symbol: '₹',
  status: 'active',
  is_published: true,
  subscription_plan: 'growth',
  onboarding_completed: true,
  created_at: '2025-01-01T00:00:00Z'
}

export const DEMO_WIFI: WifiSetting = {
  id: 'w0000000-0000-0000-0000-000000000001',
  business_id: 'b0000000-0000-0000-0000-000000000001',
  ssid: 'CafeAroma_Guest_HighSpeed',
  password: 'BrewFresh2025!',
  encryption: 'WPA',
  is_hidden: false,
  is_enabled: true,
  instructions: 'Scan the Wi-Fi QR code with your phone camera to auto-connect or select CafeAroma_Guest_HighSpeed manually.',
  created_at: '2025-01-01T00:00:00Z'
}

export const DEMO_CATEGORIES: MenuCategory[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Specialty Coffees',
    description: 'Locally roasted single-origin Arabica crafted by master baristas',
    sort_order: 1,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Artisan Bakery',
    description: 'Freshly baked flaky croissants, sourdough and daily viennoiserie',
    sort_order: 2,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'All-Day Brunch',
    description: 'Sustaining plates loaded with wholesome organic farm-fresh ingredients',
    sort_order: 3,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Refreshers & Teas',
    description: 'Organic loose-leaf teas, kombucha and refreshing citrus sparklers',
    sort_order: 4,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  }
]

export const DEMO_ITEMS: MenuItem[] = [
  {
    id: 'm0000000-0000-0000-0000-000000000001',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Signature Velvet Flat White',
    description: 'Double ristretto with micro-foamed organic whole milk or steamed oat milk with velvet texture.',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: true,
    calories: 140,
    allergens: ['Dairy'],
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000002',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Single-Origin Pour Over (V60)',
    description: 'Ethiopian Yirgacheffe slow-brewed hand-pour with floral jasmine notes and bright wild berries.',
    price: 280,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: false,
    calories: 5,
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000003',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Spanish Iced Latte with Condensed Milk',
    description: 'Bold espresso shot poured over chilled spiced milk, sweetened condensed milk and cinnamon dust.',
    price: 260,
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: true,
    calories: 210,
    allergens: ['Dairy'],
    sort_order: 3,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000004',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'French Butter Croissant',
    description: 'Golden baked daily with 82% Normandy cultured butter. Multi-layered flaky exterior, honeycomb interior.',
    price: 190,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: true,
    calories: 280,
    allergens: ['Gluten', 'Dairy'],
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000005',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Almond Frangipane Brioche',
    description: 'Toasted almond slivers, creamy vanilla almond cream and snowy powdered sugar dusting.',
    price: 230,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: false,
    calories: 340,
    allergens: ['Gluten', 'Nuts', 'Dairy'],
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000006',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Truffle Mushroom Sourdough Toast',
    description: 'Wild cremini and shiitake mushrooms, truffle mascarpone cream, thyme, pecorino on thick grilled sourdough.',
    price: 390,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: true,
    calories: 420,
    allergens: ['Gluten', 'Dairy'],
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000007',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Hass Avocado & Poached Egg Tartine',
    description: 'Hand-mashed Hass avocado, organic poached cage-free egg, toasted pepitas, Aleppo chili flakes and alfalfa microgreens.',
    price: 360,
    image_url: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: false,
    is_available: true,
    is_popular: true,
    calories: 380,
    allergens: ['Egg', 'Gluten'],
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000008',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Ceremonial Japanese Matcha Latte',
    description: 'First-harvest Uji ceremonial matcha hand-whisked with steaming oat milk and honey syrup.',
    price: 290,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: true,
    calories: 160,
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'm0000000-0000-0000-0000-000000000009',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Yuzu Berry Sparkling Cooler',
    description: 'Sparkling mineral water infused with Japanese citrus yuzu extract, muddled blackberries and organic mint.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: true,
    is_available: true,
    is_popular: false,
    calories: 80,
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z'
  }
]

export const DEMO_SMART_LINKS: SmartLink[] = [
  {
    id: 'l0000000-0000-0000-0000-000000000001',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    code: 'cafe-t01',
    label: 'Table 1 Acrylic QR Stand',
    type: 'qr',
    destination_type: 'profile',
    table_number: 'T-01',
    is_active: true,
    scan_count: 342,
    last_accessed_at: '2025-02-14T11:45:00Z',
    created_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 'l0000000-0000-0000-0000-000000000002',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    code: 'cafe-t02',
    label: 'Table 2 Acrylic QR Stand',
    type: 'qr',
    destination_type: 'menu',
    table_number: 'T-02',
    is_active: true,
    scan_count: 289,
    last_accessed_at: '2025-02-14T12:10:00Z',
    created_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 'l0000000-0000-0000-0000-000000000003',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    code: 'nfc-counter',
    label: 'Main Counter Tap-to-Review NFC Tag',
    type: 'nfc',
    destination_type: 'review',
    table_number: 'Counter',
    is_active: true,
    scan_count: 514,
    last_accessed_at: '2025-02-14T13:00:00Z',
    created_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 'l0000000-0000-0000-0000-000000000004',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    code: 'nfc-patio',
    label: 'Outdoor Garden NFC Disc',
    type: 'nfc',
    destination_type: 'profile',
    table_number: 'Garden-P1',
    is_active: true,
    scan_count: 178,
    last_accessed_at: '2025-02-13T18:22:00Z',
    created_at: '2025-01-02T00:00:00Z'
  }
]

export const DEMO_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    rating: 5,
    category: 'food',
    message: 'The Truffle Mushroom Sourdough Toast is incredible! Paired with the Flat White it was the best brunch in town.',
    customer_name: 'Priya Sharma',
    customer_email: 'priya.s@example.com',
    customer_phone: '+91 98451 22334',
    is_reviewed: true,
    owner_notes: 'Acknowledged! Send thanks coupon on next visit.',
    created_at: '2025-02-13T10:15:00Z'
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    rating: 5,
    category: 'service',
    message: 'Loved the tap-to-connect Wi-Fi card on our table! Baristas were super warm and helpful.',
    customer_name: 'Rohan Mehta',
    customer_email: 'rohan.m@example.com',
    is_reviewed: true,
    created_at: '2025-02-12T14:40:00Z'
  },
  {
    id: 'f0000000-0000-0000-0000-000000000003',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    rating: 4,
    category: 'ambience',
    message: 'Pleasant acoustic playlist and cozy lighting. Could use one extra charging outlet near Table 3.',
    customer_name: 'Ananya Iyer',
    customer_email: 'ananya.iyer@example.com',
    is_reviewed: false,
    created_at: '2025-02-11T16:20:00Z'
  },
  {
    id: 'f0000000-0000-0000-0000-000000000004',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    rating: 5,
    category: 'food',
    message: 'Best French butter croissant outside Paris. Flaky layers were pristine.',
    customer_name: 'Vikram Joshi',
    is_reviewed: true,
    created_at: '2025-02-10T09:30:00Z'
  }
]

export const DEMO_OFFERS: Offer[] = [
  {
    id: 'o0000000-0000-0000-0000-000000000001',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    title: 'Artisan Coffee Hour: Buy 1 Get 1 Free',
    description: 'Order any specialty coffee between 4 PM and 6 PM on weekdays and get a second coffee on the house!',
    discount_tag: 'BOGO FREE',
    coupon_code: 'AROMACOFFEE',
    valid_from: '2025-01-01',
    valid_until: '2025-12-31',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'o0000000-0000-0000-0000-000000000002',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    title: 'Weekend Brunch Delight: 15% Off',
    description: 'Enjoy a 15% discount on all artisanal sourdough tartines and cold brews every Saturday & Sunday.',
    discount_tag: '15% OFF',
    coupon_code: 'WEEKEND15',
    valid_from: '2025-01-01',
    valid_until: '2025-12-31',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  }
]

export const DEMO_TEAM: TeamMember[] = [
  {
    id: 't0000000-0000-0000-0000-000000000001',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    role: 'owner',
    full_name: 'Alex Rivera',
    invited_email: 'demo@nexora.app',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 't0000000-0000-0000-0000-000000000002',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000002',
    role: 'admin',
    full_name: 'Mira Kapoor',
    invited_email: 'mira@cafearoma.in',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-05T00:00:00Z'
  },
  {
    id: 't0000000-0000-0000-0000-000000000003',
    business_id: 'b0000000-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000003',
    role: 'staff',
    full_name: 'Rahul Nair',
    invited_email: 'rahul@cafearoma.in',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-10T00:00:00Z'
  }
]

export const DEMO_ALL_BUSINESSES: Business[] = [
  DEMO_BUSINESS,
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    owner_id: 'owner-2',
    name: 'Saffron & Spice Fine Dining',
    slug: 'saffron-spice',
    tagline: 'Royal Indian Gastronomy',
    category: 'restaurant',
    logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    city: 'Mumbai, Maharashtra',
    status: 'active',
    is_published: true,
    subscription_plan: 'enterprise',
    currency: 'INR',
    currency_symbol: '₹',
    is_google_review_enabled: true,
    onboarding_completed: true,
    created_at: '2024-11-20T00:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    owner_id: 'owner-3',
    name: 'Aura Luxury Spa & Wellness',
    slug: 'aura-spa',
    tagline: 'Holistic Rejuvenation & Organic Therapies',
    category: 'salon',
    logo_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    city: 'Goa',
    status: 'active',
    is_published: true,
    subscription_plan: 'growth',
    currency: 'INR',
    currency_symbol: '₹',
    is_google_review_enabled: true,
    onboarding_completed: true,
    created_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    owner_id: 'owner-4',
    name: 'Velvet Threads Boutique',
    slug: 'velvet-threads',
    tagline: 'Contemporary Sustainable Fashion',
    category: 'retail',
    logo_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
    city: 'Delhi NCR',
    status: 'pending',
    is_published: false,
    subscription_plan: 'starter',
    currency: 'INR',
    currency_symbol: '₹',
    is_google_review_enabled: false,
    onboarding_completed: false,
    created_at: '2025-01-20T00:00:00Z'
  }
]

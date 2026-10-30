export type UserRole = 'super_admin' | 'business_owner' | 'team_member'

export type BusinessCategory =
  | 'restaurant'
  | 'cafe'
  | 'hotel'
  | 'retail'
  | 'salon'
  | 'services'
  | 'other'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at?: string
}

export interface DayHours {
  open: string
  close: string
  isClosed: boolean
}

export interface OpeningHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface SocialLinks {
  instagram?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  youtube?: string
}

export interface Business {
  id: string
  owner_id: string
  name: string
  slug: string
  tagline?: string
  description?: string
  category: BusinessCategory
  logo_url?: string
  cover_url?: string
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
  address?: string
  city?: string
  google_maps_url?: string
  opening_hours?: OpeningHours
  social_links?: SocialLinks
  google_review_url?: string
  is_google_review_enabled: boolean
  currency: string
  currency_symbol: string
  status: 'active' | 'suspended' | 'pending'
  is_published: boolean
  subscription_plan: 'starter' | 'growth' | 'enterprise'
  onboarding_completed: boolean
  created_at: string
  updated_at?: string
}

export interface MenuCategory {
  id: string
  business_id: string
  name: string
  description?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface MenuItem {
  id: string
  business_id: string
  category_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  is_vegetarian: boolean
  is_available: boolean
  is_popular: boolean
  calories?: number
  allergens?: string[]
  sort_order: number
  created_at: string
  updated_at?: string
}

export type SmartLinkType = 'qr' | 'nfc' | 'generic'
export type SmartDestinationType = 'profile' | 'menu' | 'review' | 'wifi' | 'custom'

export interface SmartLink {
  id: string
  business_id: string
  code: string
  label: string
  type: SmartLinkType
  destination_type: SmartDestinationType
  custom_url?: string
  table_number?: string
  is_active: boolean
  scan_count: number
  last_accessed_at?: string
  created_at: string
  updated_at?: string
}

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass'

export interface WifiSetting {
  id: string
  business_id: string
  ssid: string
  password?: string
  encryption: WifiEncryption
  is_hidden: boolean
  is_enabled: boolean
  instructions?: string
  created_at: string
  updated_at?: string
}

export type FeedbackCategory =
  | 'food'
  | 'service'
  | 'cleanliness'
  | 'pricing'
  | 'ambience'
  | 'other'

export interface CustomerFeedback {
  id: string
  business_id: string
  rating: number
  category: FeedbackCategory
  message: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  is_reviewed: boolean
  owner_notes?: string
  session_id?: string
  created_at: string
}

export interface Offer {
  id: string
  business_id: string
  title: string
  description?: string
  discount_tag?: string
  banner_url?: string
  coupon_code?: string
  valid_from: string
  valid_until?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export type AnalyticsEventType =
  | 'page_view'
  | 'qr_scan'
  | 'nfc_tap'
  | 'menu_view'
  | 'product_view'
  | 'review_click'
  | 'feedback_submit'
  | 'wifi_view'
  | 'contact_click'

export interface AnalyticsEvent {
  id: string
  business_id: string
  smart_link_id?: string
  event_type: AnalyticsEventType
  session_id: string
  referrer?: string
  user_agent?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
  meta?: Record<string, any>
  created_at: string
}

export type MemberRole = 'owner' | 'admin' | 'staff'

export interface TeamMember {
  id: string
  business_id: string
  user_id: string
  role: MemberRole
  invited_email?: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface SupportTicket {
  id: string
  business_id?: string
  user_id?: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  updated_at?: string
}


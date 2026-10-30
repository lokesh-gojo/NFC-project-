import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  Business,
  MenuCategory,
  MenuItem,
  SmartLink,
  WifiSetting,
  CustomerFeedback,
  Offer,
  AnalyticsEvent,
  AnalyticsEventType,
  TeamMember,
  Profile
} from '@/types'
import {
  DEMO_BUSINESS,
  DEMO_CATEGORIES,
  DEMO_ITEMS,
  DEMO_SMART_LINKS,
  DEMO_WIFI,
  DEMO_FEEDBACK,
  DEMO_OFFERS,
  DEMO_TEAM,
  DEMO_ALL_BUSINESSES,
  DEMO_PROFILE,
  DEMO_ADMIN_PROFILE
} from './mockData'

const STORAGE_KEYS = {
  BUSINESSES: 'nexora_businesses',
  CURRENT_BIZ: 'nexora_current_business',
  CATEGORIES: 'nexora_categories',
  ITEMS: 'nexora_menu_items',
  SMART_LINKS: 'nexora_smart_links',
  WIFI: 'nexora_wifi_settings',
  FEEDBACK: 'nexora_feedback',
  OFFERS: 'nexora_offers',
  TEAM: 'nexora_team',
  ANALYTICS: 'nexora_analytics_events',
  SESSION_ID: 'nexora_session_id',
  AUTH_USER: 'nexora_auth_user'
}

// Anonymous Session ID Generator
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session'
  let id = localStorage.getItem(STORAGE_KEYS.SESSION_ID)
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, id)
  }
  return id
}

// Helper to initialize local storage demo data if empty
function initializeLocalStorage() {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(DEMO_ALL_BUSINESSES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_BIZ)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BIZ, JSON.stringify(DEMO_BUSINESS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEMO_CATEGORIES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(DEMO_ITEMS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SMART_LINKS)) {
    localStorage.setItem(STORAGE_KEYS.SMART_LINKS, JSON.stringify(DEMO_SMART_LINKS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.WIFI)) {
    localStorage.setItem(STORAGE_KEYS.WIFI, JSON.stringify([DEMO_WIFI]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(DEMO_FEEDBACK))
  }
  if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(DEMO_OFFERS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEAM)) {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(DEMO_TEAM))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    // Generate realistic initial analytics events for the past 7 days
    const events: AnalyticsEvent[] = []
    const now = Date.now()
    const types: AnalyticsEventType[] = ['page_view', 'qr_scan', 'nfc_tap', 'menu_view', 'review_click', 'wifi_view']
    
    for (let i = 0; i < 180; i++) {
      const pastTime = new Date(now - Math.floor(Math.random() * 7 * 86400000)).toISOString()
      const eventType = types[Math.floor(Math.random() * types.length)]
      events.push({
        id: `ev-${i}`,
        business_id: DEMO_BUSINESS.id,
        smart_link_id: eventType === 'qr_scan' ? DEMO_SMART_LINKS[0].id : eventType === 'nfc_tap' ? DEMO_SMART_LINKS[2].id : undefined,
        event_type: eventType,
        session_id: 'sess_' + Math.floor(Math.random() * 30),
        device_type: Math.random() > 0.3 ? 'mobile' : 'desktop',
        created_at: pastTime
      })
    }
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events))
  }
}

// Call on module load
initializeLocalStorage()

// ==========================================
// BUSINESS & PROFILE APIS
// ==========================================

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (!error && data) return data as Business
  }

  // Fallback to local storage
  const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const found = businesses.find((b) => b.slug.toLowerCase() === slug.toLowerCase())
  return found || (slug === 'cafe-aroma' ? DEMO_BUSINESS : null)
}

export async function getCurrentBusiness(ownerId?: string): Promise<Business> {
  if (isSupabaseConfigured && supabase && ownerId) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!error && data) return data as Business
  }

  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_BIZ)
  return raw ? JSON.parse(raw) : DEMO_BUSINESS
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) return data as Business
  }

  // Local storage update
  const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
  const idx = businesses.findIndex((b) => b.id === id)
  const current = businesses[idx] || DEMO_BUSINESS
  const updated = { ...current, ...updates, updated_at: new Date().toISOString() }

  if (idx >= 0) businesses[idx] = updated
  else businesses.push(updated)

  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses))
  localStorage.setItem(STORAGE_KEYS.CURRENT_BIZ, JSON.stringify(updated))
  return updated
}

export async function getAllBusinesses(): Promise<Business[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('businesses').select('*').order('created_at', { ascending: false })
    if (!error && data) return data as Business[]
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]')
}

// ==========================================
// MENU APIS
// ==========================================

export async function getMenuCategories(businessId: string): Promise<MenuCategory[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
    if (!error && data) return data as MenuCategory[]
  }

  const list: MenuCategory[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  return list.filter((c) => c.business_id === businessId).sort((a, b) => a.sort_order - b.sort_order)
}

export async function saveMenuCategory(category: Partial<MenuCategory> & { business_id: string; name: string }): Promise<MenuCategory> {
  const isNew = !category.id
  const catToSave: MenuCategory = {
    id: category.id || 'cat_' + Math.random().toString(36).substring(2, 9),
    business_id: category.business_id,
    name: category.name,
    description: category.description || '',
    sort_order: category.sort_order ?? 99,
    is_active: category.is_active ?? true,
    created_at: category.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (isSupabaseConfigured && supabase) {
    if (isNew) {
      const { data } = await supabase.from('menu_categories').insert(catToSave).select().single()
      if (data) return data as MenuCategory
    } else {
      const { data } = await supabase.from('menu_categories').update(catToSave).eq('id', catToSave.id).select().single()
      if (data) return data as MenuCategory
    }
  }

  const list: MenuCategory[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  const existingIdx = list.findIndex((c) => c.id === catToSave.id)
  if (existingIdx >= 0) list[existingIdx] = catToSave
  else list.push(catToSave)
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list))
  return catToSave
}

export async function deleteMenuCategory(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('menu_categories').delete().eq('id', id)
  }
  const list: MenuCategory[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list.filter((c) => c.id !== id)))
}

export async function getMenuItems(businessId: string): Promise<MenuItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
    if (!error && data) return data as MenuItem[]
  }

  const list: MenuItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')
  return list.filter((i) => i.business_id === businessId).sort((a, b) => a.sort_order - b.sort_order)
}

export async function saveMenuItem(item: Partial<MenuItem> & { business_id: string; category_id: string; name: string; price: number }): Promise<MenuItem> {
  const isNew = !item.id
  const itemToSave: MenuItem = {
    id: item.id || 'item_' + Math.random().toString(36).substring(2, 9),
    business_id: item.business_id,
    category_id: item.category_id,
    name: item.name,
    description: item.description || '',
    price: item.price,
    image_url: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    is_vegetarian: item.is_vegetarian ?? true,
    is_available: item.is_available ?? true,
    is_popular: item.is_popular ?? false,
    calories: item.calories,
    allergens: item.allergens || [],
    sort_order: item.sort_order ?? 99,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (isSupabaseConfigured && supabase) {
    if (isNew) {
      const { data } = await supabase.from('menu_items').insert(itemToSave).select().single()
      if (data) return data as MenuItem
    } else {
      const { data } = await supabase.from('menu_items').update(itemToSave).eq('id', itemToSave.id).select().single()
      if (data) return data as MenuItem
    }
  }

  const list: MenuItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')
  const idx = list.findIndex((i) => i.id === itemToSave.id)
  if (idx >= 0) list[idx] = itemToSave
  else list.push(itemToSave)
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(list))
  return itemToSave
}

export async function deleteMenuItem(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('menu_items').delete().eq('id', id)
  }
  const list: MenuItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(list.filter((i) => i.id !== id)))
}

// ==========================================
// SMART LINKS (QR & NFC) APIS
// ==========================================

export async function getSmartLinks(businessId: string): Promise<SmartLink[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('smart_links')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    if (!error && data) return data as SmartLink[]
  }

  const list: SmartLink[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SMART_LINKS) || '[]')
  return list.filter((l) => l.business_id === businessId)
}

export async function getSmartLinkByCode(code: string): Promise<SmartLink | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('smart_links')
      .select('*')
      .eq('code', code)
      .maybeSingle()
    if (!error && data) return data as SmartLink
  }

  const list: SmartLink[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SMART_LINKS) || '[]')
  return list.find((l) => l.code.toLowerCase() === code.toLowerCase()) || null
}

export async function saveSmartLink(link: Partial<SmartLink> & { business_id: string; label: string; type: SmartLink['type'] }): Promise<SmartLink> {
  const isNew = !link.id
  const linkToSave: SmartLink = {
    id: link.id || 'link_' + Math.random().toString(36).substring(2, 9),
    business_id: link.business_id,
    code: link.code || (link.type === 'nfc' ? `nfc-${Math.random().toString(36).substring(2, 7)}` : `qr-${Math.random().toString(36).substring(2, 7)}`),
    label: link.label,
    type: link.type,
    destination_type: link.destination_type || 'profile',
    custom_url: link.custom_url,
    table_number: link.table_number,
    is_active: link.is_active ?? true,
    scan_count: link.scan_count || 0,
    created_at: link.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (isSupabaseConfigured && supabase) {
    if (isNew) {
      const { data } = await supabase.from('smart_links').insert(linkToSave).select().single()
      if (data) return data as SmartLink
    } else {
      const { data } = await supabase.from('smart_links').update(linkToSave).eq('id', linkToSave.id).select().single()
      if (data) return data as SmartLink
    }
  }

  const list: SmartLink[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SMART_LINKS) || '[]')
  const idx = list.findIndex((l) => l.id === linkToSave.id)
  if (idx >= 0) list[idx] = linkToSave
  else list.unshift(linkToSave)
  localStorage.setItem(STORAGE_KEYS.SMART_LINKS, JSON.stringify(list))
  return linkToSave
}

export async function deleteSmartLink(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('smart_links').delete().eq('id', id)
  }
  const list: SmartLink[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SMART_LINKS) || '[]')
  localStorage.setItem(STORAGE_KEYS.SMART_LINKS, JSON.stringify(list.filter((l) => l.id !== id)))
}

// ==========================================
// WI-FI SETTINGS APIS
// ==========================================

export async function getWifiSettings(businessId: string): Promise<WifiSetting | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('wifi_settings')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle()
    if (!error && data) return data as WifiSetting
  }

  const list: WifiSetting[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WIFI) || '[]')
  return list.find((w) => w.business_id === businessId) || DEMO_WIFI
}

export async function saveWifiSettings(settings: Partial<WifiSetting> & { business_id: string; ssid: string }): Promise<WifiSetting> {
  const updated: WifiSetting = {
    id: settings.id || 'wifi_' + Math.random().toString(36).substring(2, 9),
    business_id: settings.business_id,
    ssid: settings.ssid,
    password: settings.password || '',
    encryption: settings.encryption || 'WPA',
    is_hidden: settings.is_hidden || false,
    is_enabled: settings.is_enabled ?? true,
    instructions: settings.instructions || 'Scan with your camera to auto-connect or enter credentials manually.',
    created_at: settings.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('wifi_settings').upsert(updated, { onConflict: 'business_id' }).select().single()
    if (data) return data as WifiSetting
  }

  const list: WifiSetting[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WIFI) || '[]')
  const idx = list.findIndex((w) => w.business_id === settings.business_id)
  if (idx >= 0) list[idx] = updated
  else list.push(updated)
  localStorage.setItem(STORAGE_KEYS.WIFI, JSON.stringify(list))
  return updated
}

// ==========================================
// FEEDBACK APIS
// ==========================================

export async function submitFeedback(feedback: Omit<CustomerFeedback, 'id' | 'created_at' | 'is_reviewed'>): Promise<CustomerFeedback> {
  const newFeedback: CustomerFeedback = {
    id: 'fb_' + Math.random().toString(36).substring(2, 9),
    ...feedback,
    is_reviewed: false,
    created_at: new Date().toISOString()
  }

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('feedback').insert(newFeedback).select().single()
    if (data) return data as CustomerFeedback
  }

  const list: CustomerFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]')
  list.unshift(newFeedback)
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list))
  return newFeedback
}

export async function getFeedback(businessId: string): Promise<CustomerFeedback[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    if (!error && data) return data as CustomerFeedback[]
  }

  const list: CustomerFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]')
  return list.filter((f) => f.business_id === businessId)
}

export async function markFeedbackReviewed(id: string, isReviewed: boolean = true): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('feedback').update({ is_reviewed: isReviewed }).eq('id', id)
  }
  const list: CustomerFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]')
  const item = list.find((f) => f.id === id)
  if (item) {
    item.is_reviewed = isReviewed
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list))
  }
}

// ==========================================
// OFFERS APIS
// ==========================================

export async function getOffers(businessId: string): Promise<Offer[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    if (!error && data) return data as Offer[]
  }

  const list: Offer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS) || '[]')
  return list.filter((o) => o.business_id === businessId)
}

export async function saveOffer(offer: Partial<Offer> & { business_id: string; title: string; valid_from: string }): Promise<Offer> {
  const isNew = !offer.id
  const offerToSave: Offer = {
    id: offer.id || 'off_' + Math.random().toString(36).substring(2, 9),
    business_id: offer.business_id,
    title: offer.title,
    description: offer.description || '',
    discount_tag: offer.discount_tag || '',
    banner_url: offer.banner_url || '',
    coupon_code: offer.coupon_code || '',
    valid_from: offer.valid_from,
    valid_until: offer.valid_until,
    is_active: offer.is_active ?? true,
    created_at: offer.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (isSupabaseConfigured && supabase) {
    if (isNew) {
      const { data } = await supabase.from('offers').insert(offerToSave).select().single()
      if (data) return data as Offer
    } else {
      const { data } = await supabase.from('offers').update(offerToSave).eq('id', offerToSave.id).select().single()
      if (data) return data as Offer
    }
  }

  const list: Offer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS) || '[]')
  const idx = list.findIndex((o) => o.id === offerToSave.id)
  if (idx >= 0) list[idx] = offerToSave
  else list.unshift(offerToSave)
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(list))
  return offerToSave
}

export async function deleteOffer(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('offers').delete().eq('id', id)
  }
  const list: Offer[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS) || '[]')
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(list.filter((o) => o.id !== id)))
}

// ==========================================
// ANALYTICS & EVENT TRACKING
// ==========================================

export async function trackEvent(params: {
  business_id: string
  event_type: AnalyticsEventType
  smart_link_id?: string
  meta?: Record<string, any>
}): Promise<void> {
  const sessionId = getOrCreateSessionId()
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent)
  const deviceType = isMobile ? 'mobile' : 'desktop'

  const newEvent: AnalyticsEvent = {
    id: 'ev_' + Math.random().toString(36).substring(2, 9),
    business_id: params.business_id,
    smart_link_id: params.smart_link_id,
    event_type: params.event_type,
    session_id: sessionId,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    device_type: deviceType,
    meta: params.meta || {},
    created_at: new Date().toISOString()
  }

  // Also increment smart_link scan count if applicable
  if (params.smart_link_id) {
    const links: SmartLink[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SMART_LINKS) || '[]')
    const link = links.find((l) => l.id === params.smart_link_id)
    if (link) {
      link.scan_count = (link.scan_count || 0) + 1
      link.last_accessed_at = new Date().toISOString()
      localStorage.setItem(STORAGE_KEYS.SMART_LINKS, JSON.stringify(links))
    }
  }

  if (isSupabaseConfigured && supabase) {
    await supabase.from('analytics_events').insert(newEvent)
    if (params.smart_link_id) {
      await supabase.rpc('increment_smart_link_scans', { link_id: params.smart_link_id })
    }
    return
  }

  const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]')
  events.push(newEvent)
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events))
}

export async function getAnalyticsSummary(businessId: string) {
  let events: AnalyticsEvent[] = []

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('business_id', businessId)
    if (data) events = data as AnalyticsEvent[]
  } else {
    events = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]').filter(
      (e: AnalyticsEvent) => e.business_id === businessId
    )
  }

  const totalInteractions = events.length
  const qrScans = events.filter((e) => e.event_type === 'qr_scan').length
  const nfcTaps = events.filter((e) => e.event_type === 'nfc_tap').length
  const pageViews = events.filter((e) => e.event_type === 'page_view').length
  const menuViews = events.filter((e) => e.event_type === 'menu_view').length
  const reviewClicks = events.filter((e) => e.event_type === 'review_click').length
  const wifiViews = events.filter((e) => e.event_type === 'wifi_view').length
  const feedbackSubmits = events.filter((e) => e.event_type === 'feedback_submit').length

  const uniqueVisitors = new Set(events.map((e) => e.session_id)).size

  // Group events by last 7 days
  const last7Days: { date: string; scans: number; taps: number; views: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
    
    const dayEvents = events.filter((e) => e.created_at.startsWith(dateStr))
    last7Days.push({
      date: label,
      scans: dayEvents.filter((e) => e.event_type === 'qr_scan').length,
      taps: dayEvents.filter((e) => e.event_type === 'nfc_tap').length,
      views: dayEvents.filter((e) => e.event_type === 'page_view' || e.event_type === 'menu_view').length
    })
  }

  return {
    totalInteractions,
    uniqueVisitors,
    qrScans,
    nfcTaps,
    pageViews,
    menuViews,
    reviewClicks,
    wifiViews,
    feedbackSubmits,
    dailyChart: last7Days
  }
}

// ==========================================
// TEAM APIS
// ==========================================

export async function getTeamMembers(businessId: string): Promise<TeamMember[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('business_members').select('*').eq('business_id', businessId)
    if (data) return data as TeamMember[]
  }
  const list: TeamMember[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM) || '[]')
  return list.filter((m) => m.business_id === businessId)
}

export async function addTeamMember(member: { business_id: string; invited_email: string; role: TeamMember['role']; full_name: string }): Promise<TeamMember> {
  const newMember: TeamMember = {
    id: 'tm_' + Math.random().toString(36).substring(2, 9),
    business_id: member.business_id,
    user_id: 'user_' + Math.random().toString(36).substring(2, 9),
    role: member.role,
    invited_email: member.invited_email,
    full_name: member.full_name,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  }

  const list: TeamMember[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM) || '[]')
  list.push(newMember)
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(list))
  return newMember
}

export async function removeTeamMember(id: string): Promise<void> {
  const list: TeamMember[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM) || '[]')
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(list.filter((m) => m.id !== id)))
}


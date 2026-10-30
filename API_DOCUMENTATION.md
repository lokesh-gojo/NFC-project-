# NEXORA TECHNOLOGIES – API & SERVICE DOCUMENTATION

Nexora Technologies provides a unified data service layer in `src/services/dataService.ts` that interacts with either **Supabase PostgreSQL** via `@supabase/supabase-js` or the reactive local state engine.

---

## 1. Smart Link Routing Protocol (`/go/:code`)

### `GET /go/:code`
Resolves physical QR scans and NFC tag taps.

**Execution Flow:**
1. Looks up the `code` in the `smart_links` registry.
2. Checks `is_active` status.
3. Automatically categorizes physical entry mechanism:
   - If `link.type === 'nfc'`, logs `event_type: 'nfc_tap'`.
   - If `link.type === 'qr'`, logs `event_type: 'qr_scan'`.
4. Attaches persistent anonymous browser session ID (`getOrCreateSessionId()`).
5. Increments `scan_count` atomically.
6. Performs client-side redirection to destination target:
   - Default: `/b/:slug`
   - If destination is `menu`: `/b/:slug/menu`
   - If destination is `review`: Google Review external URL.

---

## 2. Business & Profile APIs

### `getBusinessBySlug(slug: string): Promise<Business | null>`
Fetches the public profile for an active tenant by its unique URL slug.
- **Parameters:** `slug` (string)
- **RLS Policy:** Allows public access only if `is_published = true AND status = 'active'`.

### `getCurrentBusiness(ownerId?: string): Promise<Business>`
Retrieves the active business managed by the logged-in owner.

### `updateBusiness(id: string, updates: Partial<Business>): Promise<Business>`
Applies partial updates to business branding, operational hours, contacts, or publication status.
- **RLS Policy:** Enforced to authenticated business owners and assigned administrators.

---

## 3. Digital Menu Management APIs

### `getMenuCategories(businessId: string): Promise<MenuCategory[]>`
Returns sorted menu category records.

### `saveMenuCategory(category): Promise<MenuCategory>`
Creates or updates a menu category.

### `deleteMenuCategory(id: string): Promise<void>`
Removes a menu category.

### `getMenuItems(businessId: string): Promise<MenuItem[]>`
Retrieves active dishes, prices, descriptions, vegetarian status, and allergen arrays.

### `saveMenuItem(item): Promise<MenuItem>`
Upserts a menu product including price, availability toggle, and dietary indicators.

### `deleteMenuItem(id: string): Promise<void>`
Deletes a menu product.

---

## 4. Smart Links (QR & NFC) APIs

### `getSmartLinks(businessId: string): Promise<SmartLink[]>`
Returns registered QR table stands and NFC tag records.

### `saveSmartLink(link): Promise<SmartLink>`
Registers a new physical touchpoint with a short identifier (e.g. `nfc-patio` or `cafe-t02`).

### `deleteSmartLink(id: string): Promise<void>`
Removes a physical tracking link.

---

## 5. Customer Feedback APIs

### `submitFeedback(feedback): Promise<CustomerFeedback>`
Public insertion endpoint for customer ratings and comments.
- **Parameters:** `business_id`, `rating` (1-5), `category`, `message`, `customer_name?`, `customer_email?`, `session_id`.
- **Security:** Public write allowed; read permission is restricted exclusively to the business owner/team.

### `getFeedback(businessId: string): Promise<CustomerFeedback[]>`
Retrieves private feedback submissions for a business.

### `markFeedbackReviewed(id: string, isReviewed: boolean): Promise<void>`
Updates management acknowledgement status.

---

## 6. Smart Analytics & Event Tracking

### `trackEvent(params): Promise<void>`
Records anonymous customer interactions.
- **Supported Event Types:**
  - `page_view`: Landing page viewed
  - `qr_scan`: Physical QR code scanned
  - `nfc_tap`: Physical NFC tag tapped
  - `menu_view`: Digital menu browsing
  - `product_view`: Dish details opened
  - `review_click`: Google Review link opened
  - `feedback_submit`: Feedback form sent
  - `wifi_view`: Wi-Fi credentials or QR opened
  - `contact_click`: Call, WhatsApp or Directions clicked

### `getAnalyticsSummary(businessId: string)`
Aggregates interactions over the last 7 to 90 days, returning unique visitor count, QR vs NFC comparison ratios, and daily trend time-series.


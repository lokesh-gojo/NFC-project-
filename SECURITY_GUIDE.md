# NEXORA TECHNOLOGIES – SECURITY & DATA PRIVACY GUIDE

Nexora Technologies adheres to enterprise SaaS security and data isolation standards.

---

## 1. Multi-Tenant Data Isolation (Row Level Security)
Every exposed table in PostgreSQL enforces Supabase Row Level Security (RLS):

- **Businesses Isolation**:
  ```sql
  CREATE POLICY "Owners can manage businesses" ON public.businesses
      FOR ALL USING (
          auth.uid() = owner_id OR
          EXISTS (
              SELECT 1 FROM public.business_members
              WHERE business_members.business_id = businesses.id
              AND business_members.user_id = auth.uid()
          )
      );
  ```
- **Public Visibility Restriction**:
  Public customers are only permitted to query businesses where `is_published = true AND status = 'active'`.

---

## 2. Customer Feedback Privacy
Honest customer reviews and private criticism must remain strictly confidential between the guest and the management:
- Public unauthenticated visitors have `INSERT WITH CHECK (true)` access to submit feedback.
- `SELECT` and `UPDATE` permissions on `feedback` records are granted exclusively to verified business owners and team members. Other customers cannot read or scrape private reviews.

---

## 3. Google Anti-Gating Policy Compliance
Google strictly prohibits "review gating" (filtering customers and only requesting reviews from positive responders while routing negative responders to a private form).
- In Nexora, the **Rate us on Google** button is a direct, unfiltered conduit to the business's official Google Maps listing.
- The **Honest Customer Feedback** module operates alongside as an independent, voluntary suggestions channel.

---

## 4. Anonymous Session Identifier vs Fingerprinting
In compliance with global privacy regulations (GDPR, CCPA), Nexora does not execute invasive hardware fingerprinting or canvas spoofing:
- Sessions are maintained using a randomized anonymous string (`sess_xxxxxx`) generated in `localStorage`.
- No personally identifiable information (PII) is recorded during physical QR scans or NFC tag taps unless the customer voluntarily submits their name or email in the feedback form.

---

## 5. Frontend Secret Hygiene
- The frontend bundle strictly accesses `VITE_SUPABASE_ANON_KEY`, which is safeguarded by PostgreSQL RLS.
- The `supabase_service_role_key` is **NEVER** imported or referenced in client-side code.


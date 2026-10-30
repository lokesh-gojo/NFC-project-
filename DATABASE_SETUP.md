# NEXORA TECHNOLOGIES – DATABASE SETUP GUIDE

This step-by-step guide explains how to deploy the Nexora PostgreSQL schema on Supabase (Free Tier) or run the zero-config local demo mode.

---

## Option A: Connect to Live Supabase (Recommended for Production)

### 1. Create a Free Supabase Project
1. Navigate to [https://supabase.com](https://supabase.com) and sign in with GitHub or email.
2. Click **New Project**.
3. Choose a project name (e.g., `nexora-production`), set a secure database password, and choose your nearest region (e.g. `ap-south-1 Mumbai` or `us-east-1`).
4. Click **Create new project** and wait ~2 minutes for provisioning.

### 2. Execute SQL Migrations
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Click **New query**.
3. Open `supabase/migrations/20250101000000_initial_schema.sql` from this codebase, copy its entire contents, paste it into the SQL Editor, and click **Run**.
   - This creates all 11 relational tables, primary keys, foreign keys, indexes, and enables Row Level Security (RLS) policies.
4. Next, copy and paste the contents of `supabase/seed.sql` and click **Run**.
   - This seeds the complete demo establishment: **Cafe Aroma**, including sample menu items, QR links, and Wi-Fi credentials.

### 3. Retrieve Environment Variables
1. Go to **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Project API anon public key** (starts with `ey...`)

### 4. Configure Your Frontend `.env`
In the root directory of this repository, create or edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
VITE_APP_URL=http://localhost:5173
```

Restart your dev server:
```bash
npm run dev
```
Nexora will automatically detect the Supabase configuration and route all reads and writes directly to PostgreSQL!

---

## Option B: Zero-Config Local / Offline Demo Mode

If you do not have a Supabase account or are demonstrating this project offline:
- **No setup required!**
- Nexora automatically boots into its reactive client-side demo layer initialized with **Cafe Aroma**.
- All CRUD operations (creating menu items, adding QR codes, submitting feedback, updating Wi-Fi) persist in your browser's local state.
- You can switch seamlessly between the **Merchant Owner** persona and the **Super Admin** console using the top banner.


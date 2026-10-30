# NEXORA TECHNOLOGIES – DEPLOYMENT GUIDE (CLOUDFLARE PAGES & SUPABASE)

This guide walks through deploying Nexora Technologies to **Cloudflare Pages** on the 100% free plan.

---

## 1. Prerequisites
- A GitHub repository with your Nexora codebase.
- A free [Cloudflare](https://dash.cloudflare.com) account.
- A free [Supabase](https://supabase.com) project (optional, or use Demo mode).

---

## 2. Deploying on Cloudflare Pages

### Step 1: Push Project to GitHub
Initialize your git repository and push your project:
```bash
git init
git add .
git commit -m "feat: initial commit of Nexora Technologies full-stack SaaS"
git branch -M main
git remote add origin https://github.com/your-username/nexora-smart-business.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages
1. Sign in to your [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your GitHub repository (`nexora-smart-business`).
4. Set the build configuration:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** (Optional: in Environment Variables, set `NODE_VERSION` to `20` or higher).

### Step 3: Add Environment Variables
In the Cloudflare Pages settings under **Environment variables**, add:
- `VITE_SUPABASE_URL`: Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase public anonymous API key
- `VITE_APP_URL`: Your Cloudflare Pages domain (e.g. `https://nexora.pages.dev`)

### Step 4: Single Page Application (SPA) Redirects
Nexora includes `public/_redirects`:
```
/*    /index.html   200
```
This ensures that direct deep links like `/b/cafe-aroma`, `/b/cafe-aroma/menu`, and `/go/nfc-counter` resolve smoothly on refresh without 404 errors.

### Step 5: Deploy
Click **Save and Deploy**. Cloudflare Pages will build the application in under 1 minute and assign you a fast, globally-distributed CDN URL (e.g. `https://nexora-smart-business.pages.dev`).

---

## 3. Custom Domain Configuration (Optional)
1. In Cloudflare Pages, go to **Custom domains** tab.
2. Click **Set up a domain** and enter your custom domain (e.g. `nexora.in` or `app.nexora.in`).
3. Cloudflare will automatically provision SSL/TLS certificates with zero configuration.


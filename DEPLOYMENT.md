# Deployment Guide

Complete guide for deploying all ChristianAI services.

## 📋 Overview

| Service | URL | Platform | Status |
|---------|-----|----------|--------|
| Website | `christianai.world` | GitHub Pages | ✅ Auto-deploy |
| App | `app.christianai.world` | Vercel | ⏳ Manual setup |
| API | `api.christianai.world` | Render | ✅ Deployed |

---

## 🌐 Website Deployment (GitHub Pages)

### Status: ✅ Configured & Auto-deploying

The marketing website deploys automatically when you push changes to `packages/website/**`.

### Workflow
- **File**: `.github/workflows/deploy-website.yml`
- **Trigger**: Push to `main` with changes in `packages/website/`
- **Build**: `bun install` → `bun run build`
- **Deploy**: GitHub Actions → GitHub Pages

### DNS Configuration
```
Type: CNAME
Name: @
Value: [your-github-username].github.io
```

### Manual Verification
```bash
cd packages/website
bun install
bun --bun run build
```

---

## 📱 App Deployment (Vercel)

### Status: ⏳ Needs Setup

Follow these steps to deploy the app to Vercel:

### 1. Create Vercel Project

**Option A: Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project settings (see below)

**Option B: Vercel CLI**
```bash
cd packages/app
vercel
```

### 2. Project Configuration

```
Framework Preset: Vite
Root Directory: packages/app
Build Command: bun --bun run build (or leave default)
Output Directory: dist (or leave default)
Install Command: bun install (or leave default)
```

### 3. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=https://api.christianai.world
```

### 4. Custom Domain

1. Go to Vercel Project → Settings → Domains
2. Add domain: `app.christianai.world`
3. Vercel will provide DNS records

### 5. DNS Configuration

Add CNAME record to your DNS provider:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### 6. Deploy

**Automatic**: Push to `main` branch
```bash
git push origin main
```

**Manual**: Via Vercel Dashboard
```bash
cd packages/app
vercel --prod
```

### 7. Verify Deployment

1. Check build logs in Vercel dashboard
2. Visit `https://app.christianai.world`
3. Test authentication flow

---

## 🔧 API Deployment (Render)

### Status: ✅ Already Deployed

The API is already deployed at `api.christianai.world`. No action needed.

### Configuration
- **Service**: Web Service
- **Runtime**: Node (with Bun)
- **Build Command**: `bun install`
- **Start Command**: `bun run start`
- **Root Directory**: `packages/api`

---

## 🔄 CI/CD Workflows

### Website (GitHub Actions)

**Triggers**:
- Push to `main` with changes in `packages/website/**`
- Manual via Actions tab

**Steps**:
1. Checkout code
2. Setup Bun
3. Install dependencies
4. Build website (`cd packages/website && bun --bun run build`)
5. Upload to GitHub Pages
6. Deploy

### App (Vercel)

**Triggers**:
- Push to any branch (preview deployment)
- Push to `main` (production deployment)
- Manual via Vercel dashboard

**Steps**:
1. Vercel auto-detects changes in `packages/app`
2. Runs build command
3. Deploys to Vercel CDN

### API (Render)

**Triggers**:
- Push to `main` with changes in `packages/api/**`
- Manual redeploy via Render dashboard

---

## 🧪 Testing Deployments Locally

### Website
```bash
cd packages/website
bun install
bun --bun run build
bun run preview
# Visit http://localhost:4173
```

### App
```bash
cd packages/app
bun install
bun --bun run build
bun run preview
# Visit http://localhost:4173
```

### API
```bash
cd packages/api
bun install
bun run dev
# Visit http://localhost:3001/api/health
```

---

## 🚨 Troubleshooting

### Website Build Fails

**Error**: `crypto.hash is not a function`
**Solution**: Use `bun --bun run build` instead of `bun run build`

GitHub Actions workflow already uses correct command.

### App Won't Deploy on Vercel

**Common Issues**:
1. **Missing env vars**: Add Supabase credentials in Vercel dashboard
2. **Wrong root directory**: Ensure `packages/app` is set
3. **Build fails**: Check build logs in Vercel dashboard

**Fix**:
```bash
# Test build locally
cd packages/app
bun install
bun --bun run build
```

### DNS Not Resolving

**TTL**: DNS changes can take 5-30 minutes to propagate
**Check**: Use `dig app.christianai.world` or `nslookup app.christianai.world`

### App Shows 404 on Refresh

**Cause**: SPA routing not configured
**Solution**: Already handled by `vercel.json` rewrites

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📊 Monitoring

### Website
- **Analytics**: Google Analytics (G-F2FVEHRW7E)
- **Uptime**: GitHub Status page
- **Logs**: GitHub Actions logs

### App
- **Analytics**: Google Analytics (G-F2FVEHRW7E)
- **Uptime**: Vercel dashboard
- **Logs**: Vercel deployment logs
- **Speed**: Vercel Analytics (free tier)

### API
- **Health Check**: `https://api.christianai.world/api/health`
- **Uptime**: Render dashboard
- **Logs**: Render logs page

---

## 🔐 Environment Variables Reference

### Website (`.env.local`)
```env
VITE_API_URL=https://api.christianai.world
```

### App (Vercel Environment Variables)
```env
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://api.christianai.world
```

### API (Render Environment Variables)
```env
PORT=3001
# Add database URLs, API keys as needed
```

---

## 📝 Post-Deployment Checklist

### Website
- [ ] Visit `https://christianai.world`
- [ ] Test waitlist form submission
- [ ] Verify "Launch App" button links to `https://app.christianai.world`
- [ ] Check mobile responsiveness
- [ ] Verify Google Analytics tracking

### App
- [ ] Visit `https://app.christianai.world`
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test chat functionality
- [ ] Verify protected routes redirect to auth
- [ ] Test logout
- [ ] Check mobile responsiveness

### API
- [ ] Visit `https://api.christianai.world/api/health`
- [ ] Verify `/api/waitlist` accepts POST requests
- [ ] Check CORS headers if needed

---

## 🎉 Success!

Once all services are deployed and verified:

1. ✅ Website: `https://christianai.world`
2. ✅ App: `https://app.christianai.world`
3. ✅ API: `https://api.christianai.world`

Your ChristianAI platform is live! 🚀

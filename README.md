# ChristianAI

A platform for meaningful conversations with biblical figures using advanced AI technology.

## 🏗️ Project Structure

```
christianai/
├── packages/
│   ├── website/        # Marketing website (GitHub Pages)
│   ├── app/           # Main application (Vercel)
│   └── api/           # Backend API (Render)
├── .github/
│   └── workflows/
│       └── deploy-website.yml  # Auto-deploy website to GitHub Pages
└── package.json       # Workspace root
```

## 🚀 Quick Start

### Install Dependencies
```bash
bun install
```

### Development
```bash
# Run all services
bun run dev

# Run individually
bun run dev:website   # http://localhost:5173
bun run dev:app      # http://localhost:5174
bun run dev:api      # http://localhost:3001
```

### Build
```bash
# Build all
bun run build

# Build individually
bun run build:website
bun run build:app
```

## 🌍 Deployment

### Architecture
| Service | Hosting | Domain | Auto-Deploy |
|---------|---------|--------|-------------|
| **Website** | GitHub Pages | `christianai.world` | ✅ On push to `packages/website` |
| **App** | Vercel | `app.christianai.world` | ✅ On push to `packages/app` |
| **API** | Render | `api.christianai.world` | ✅ On push to `packages/api` |

### Setup Guide

#### 1. Website (GitHub Pages)
Already configured. Deploys automatically via GitHub Actions when `packages/website` changes.

**DNS**: CNAME `@` → `[username].github.io`

#### 2. App (Vercel)
1. Connect GitHub repo to Vercel
2. Configure:
   - Root Directory: `packages/app`
   - Framework: Vite
   - Build Command: `bun run build`
3. Add environment variables (Supabase credentials)
4. Set custom domain: `app.christianai.world`

**DNS**: CNAME `app` → `cname.vercel-dns.com`

#### 3. API (Render)
Already deployed at `api.christianai.world`.

## 📦 Packages

### [Website](./packages/website)
Static marketing site built with Vite + Tailwind CSS.
- Landing page
- Waitlist forms
- SEO optimized

### [App](./packages/app)
React SPA with authentication and chat features.
- Supabase authentication
- Chat with biblical figures
- Protected routes

### [API](./packages/api)
Bun-based backend API.
- Waitlist management
- Future: Chat API endpoints

## 🛠️ Development

### Code Quality
```bash
# Lint
bun run lint

# Format
bun run format

# Type check
bun run typecheck
```

### Pre-commit Hooks
Husky + lint-staged automatically format and lint staged files before commit.

## 🔧 Environment Variables

### Website
```env
VITE_API_URL=https://api.christianai.world
```

### App
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://api.christianai.world
```

### API
```env
PORT=3001
```

## 📚 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Backend**: Bun
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: GitHub Pages, Vercel, Render
- **CI/CD**: GitHub Actions
- **Package Manager**: Bun

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run `bun run lint` and `bun run typecheck`
4. Submit a pull request

## 📄 License

Copyright © 2024 ChristianAI

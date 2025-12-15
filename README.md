# ChristianAI

A full-stack web application for spiritual guidance and biblical conversations, built with React frontend and Bun backend.

## 🌟 Live Demo

- **Frontend**: [https://christianai.world](https://christianai.world)
- **API**: [https://api.christianai.world](https://api.christianai.world)

## 📋 Overview

ChristianAI provides an interactive platform where users can engage in meaningful conversations with biblical figures like Moses, Joshua, and Jesus, powered by advanced AI technology.

## 🏗️ Project Structure

```
christianai/
├── packages/
│   ├── web/          # React + Vite frontend (deployed to GitHub Pages)
│   └── api/          # Bun backend API (deployed to Render)
├── .github/workflows/ # CI/CD pipelines
├── render.yaml       # Backend deployment configuration
└── AGENTS.md         # Agent development instructions
```

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) (for some tooling)

### Installation
```bash
bun install
```

### Development
```bash
# Start both frontend and backend
bun run dev

# Or start individually:
bun run dev:web    # Frontend at http://localhost:5173
bun run dev:api    # Backend at http://localhost:3001
```

## 🚀 Deployment

### Frontend (GitHub Pages)
- **Domain**: `christianai.world`
- **Auto-deploys** when `packages/web/**` files change
- **Workflow**: `.github/workflows/deploy.yml`

### Backend (Render)
- **Domain**: `api.christianai.world`
- **Auto-deploys** when `packages/api/**` files change
- **Config**: `render.yaml`

## 🔧 Environment Setup

### Frontend
Create `packages/web/.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=https://api.christianai.world
```

### Backend
Environment variables set in Render dashboard:
```env
NODE_ENV=production
PORT=10000  # Auto-assigned by Render
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Router** for navigation
- **Supabase** for authentication
- **Google Analytics** for tracking

### Backend
- **Bun** runtime with TypeScript
- **Native Bun.serve()** for HTTP server
- RESTful API design
- CORS configured for frontend domain

### DevOps & Tooling
- **Ultracite** (Biome-based) for linting/formatting
- **GitHub Actions** for CI/CD
- **Render** for backend hosting
- **GitHub Pages** for frontend hosting
- **Supabase** for database and auth

## 📡 API Endpoints

- `GET /api/health` - Health check endpoint
- Returns: `{"status": "ok"}`

## 🔧 Development Commands

```bash
# Root level
bun run dev              # Start all services
bun run dev:web          # Frontend only
bun run dev:api          # Backend only
bun run build            # Build frontend
bun run lint             # Check code quality
bun run lint:fix         # Auto-fix issues
bun run format           # Format code
bun run typecheck        # Type check all packages
```

## 🤝 Contributing

### For AI Agents
See `AGENTS.md` for comprehensive development guidelines, project structure, and agent-specific instructions.

### Code Quality
- Uses Ultracite for consistent code formatting
- TypeScript for type safety
- ESLint rules enforced
- Pre-commit hooks for quality checks

## 📚 Documentation

- **Frontend**: See `packages/web/README.md`
- **Backend**: See `packages/api/README.md`
- **Agents**: See `AGENTS.md`

## 🐛 Troubleshooting

### Common Issues
- **API calls failing**: Check `VITE_API_URL` in frontend `.env`
- **Auth not working**: Verify Supabase credentials
- **Build failing**: Ensure all dependencies installed with `bun install`
- **DNS issues**: Custom domain propagation takes 5-30 minutes

### Health Checks
- **API Health**: `https://api.christianai.world/api/health`
- **Frontend**: `https://christianai.world`

## 📄 License

This project is private and proprietary.

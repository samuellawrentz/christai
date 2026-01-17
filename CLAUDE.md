# ChristianAI

AI-powered conversations with biblical figures. SaaS platform combining React SPA + Bun/Elysia backend with Supabase.

## Project Structure

```
packages/
├── api/      # Bun + Elysia backend (api.christianai.world)
├── app/      # React + Vite SPA (app.christianai.world)
├── ui/       # Shared Radix/shadcn component library
├── shared/   # Shared types & utils
└── website/  # Marketing site - Astro (christianai.world)
```

## Tech Stack

**Frontend:** React 19, Vite, React Router v7, TanStack Query, Zustand, Tailwind CSS 4
**Backend:** Bun, Elysia, AI SDK + OpenRouter, Supabase (auth + postgres)
**Tooling:** TypeScript, Biome (lint/format), Husky

## Development

```bash
# Install deps
bun install

# Run API (from packages/api)
bun --hot src/index.ts

# Run App (from packages/app)
bun run dev
```

## Key Patterns

- **Auth:** Supabase Auth + JWT → RLS policies filter data by user
- **State:** Zustand (auth), React Query (server state)
- **AI Chat:** `useChat()` from @ai-sdk/react → streams to `/chats/converse`
- **Prompts:** Layered system - figure prompt + global.md + user preferences

## API Endpoints

- `GET /figures` - Active biblical figures
- `POST /conversations` - Create conversation
- `GET /conversations` - List user conversations
- `GET /conversations/:id/messages` - Message history
- `POST /chats/converse` - Stream AI response
- `GET/PATCH /users/me` - User profile

## Environment Variables

```bash
# API
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
PORT=3001

# App
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=https://api.christianai.world
```

## Bun Guidelines

- Use `bun` instead of node/npm/yarn
- Bun auto-loads .env
- Use `bun test` for testing

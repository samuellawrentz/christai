# ChristianAI Development Guide

## Project Structure

Monorepo with 4 packages:
- `packages/website` - Marketing site (GitHub Pages)
- `packages/app` - Main app (Vercel) 
- `packages/api` - Backend API (Render)
- `packages/ui` - Shared UI components

## Coding Guidelines

### Code Quality
- Use TypeScript for type safety
- Follow Biome's linting rules (no manual config needed)
- Keep functions small and focused
- Prefer composition over inheritance
- Use meaningful variable names

### Code Style
- Use `const` over `let` when possible
- Prefer arrow functions for callbacks
- Use template literals over string concatenation
- Destructure objects and arrays when appropriate
- Avoid nested ternaries

### React Best Practices
- Use functional components with hooks
- Keep components small and reusable
- Lift state up when shared between components
- Use `zustand` for global state management
- Avoid prop drilling - use context or state management

### TypeScript
- Avoid `any` type - use `unknown` if needed
- Define interfaces for props and data structures
- Use type inference when obvious
- Enable strict mode (already configured)

### Imports
- Group imports: external → internal → relative
- Use absolute imports with `@/` for app code
- Import types separately when needed

### Package Management
- Always install dependencies in the root package.json. Bun stores dependencies in a common place unless versions differ, so keep versions consistent and install only in the root.
- Always use `bun` and `bunx` instead of npm.

### Pre-commit Checks
Automatically runs on commit:
1. Biome formats and lints staged files
2. TypeScript checks affected packages
3. Commit blocked if errors exist

## Package Details

### Website
- Astro + Tailwind
- Static marketing site
- Auto-deploys to `christianai.world`
- **Blog Images**: Blog images are automatically loaded from `packages/website/src/assets/blog/`. Just add your image there and reference it in the blog frontmatter

### App  
- Vite + React + Zustand
- Supabase auth
- Chat interface
- Auto-deploys to `app.christianai.world`

### API
- Bun server
- Health check endpoint
- Auto-deploys to `api.christianai.world`

### UI
- Shared React components
- Radix UI primitives
- Tailwind styles

## Tech Stack

- Runtime: Bun
- Frontend: React 19, Vite, Tailwind 4
- Backend: Bun.serve()
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Hosting: GitHub Pages, Vercel, Render


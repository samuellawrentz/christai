# ChristianAI

A monorepo project with React frontend and Bun backend, using Ultracite for linting and Tailwind + Shadcn/ui for styling.

## Project Structure

```
christianai/
├── packages/
│   ├── web/          # React + Vite frontend
│   └── api/          # Bun backend API
```

## Setup

Install dependencies:

```bash
bun install
```

## Development

Start both frontend and backend:

```bash
bun run dev
```

Or start them individually:

```bash
# Frontend only (http://localhost:5173)
bun run dev:web

# Backend only (http://localhost:3001)
bun run dev:api
```

## Build

Build the frontend for production:

```bash
bun run build
```

## Code Quality

This project uses [Ultracite](https://www.ultracite.ai/) for linting and formatting, built on top of [Biome](https://biomejs.dev/).

```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run lint:fix

# Format code
bun run format
```

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Shadcn/ui
- **Backend**: Bun, TypeScript
- **Tooling**: Ultracite (Biome), TypeScript
- **Package Manager**: Bun workspaces

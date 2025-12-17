# ChristianAI App

The main application for ChristianAI - chat with biblical figures.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Environment Variables
Create a `.env.local` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://api.christianai.world
```

## 🚀 Deployment

### Vercel Setup
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Project**:
   - Framework Preset: Vite
   - Root Directory: `packages/app`
   - Build Command: `bun run build` (or leave default)
   - Output Directory: `dist` (or leave default)
3. **Environment Variables**: Add the Supabase credentials in Vercel settings
4. **Custom Domain**: Add `app.christianai.world` in Vercel domain settings
5. **Deploy**: Push to main branch

### DNS Configuration
Add a CNAME record:
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

## 📁 Project Structure

```
packages/app/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (auth)
│   ├── lib/            # Utilities and API clients
│   ├── main.tsx        # App entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML entry point
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies
```

## 🔧 Features

- **Authentication**: Supabase-based auth with email/password
- **Protected Routes**: Auth-gated chat interface
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool

## 📊 Monitoring

- **Analytics**: Google Analytics (G-F2FVEHRW7E)
- **Deployment**: Vercel dashboard
- **Logs**: Available in Vercel deployment logs

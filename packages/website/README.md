# ChristianAI Website

Marketing website for ChristianAI - landing page, waitlist, and information.

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
VITE_API_URL=https://api.christianai.world
```

## 🚀 Deployment

### GitHub Pages (Automatic)
The website automatically deploys to GitHub Pages when changes are pushed to `main` branch in the `packages/website` folder.

**Workflow**: `.github/workflows/deploy-website.yml`

**DNS Configuration**:
```
Type: CNAME
Name: @
Value: [your-username].github.io
```

**GitHub Settings**:
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Custom domain: `christianai.world`

## 📁 Project Structure

```
packages/website/
├── src/
│   ├── main.ts         # TypeScript logic (forms, API calls)
│   └── style.css       # Tailwind imports
├── public/             # Static assets
├── index.html          # Landing page HTML
└── package.json        # Dependencies
```

## 🎨 Features

- **Static Site**: Pure HTML/CSS/TypeScript compiled by Vite
- **Waitlist Forms**: Email collection with API integration
- **Tailwind CSS**: Utility-first styling
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Analytics**: Google Analytics tracking

## 📊 Monitoring

- **Analytics**: Google Analytics (G-F2FVEHRW7E)
- **Deployment**: GitHub Actions logs
- **Uptime**: GitHub Pages SLA

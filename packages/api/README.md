# ChristianAI API

A Bun-based API server for ChristianAI, providing backend services for the spiritual guidance platform.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Environment Variables
The API uses the following environment variables:
- `PORT`: Server port (defaults to 3001 in development, required in production)
- `SUPABASE_URL`: Supabase project URL (required)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (required, RLS policies enforced)

**Example `.env` file:**
```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 📡 API Endpoints

### Health Check
- **GET** `/api/health`
- Returns: `{"status": "ok"}`
- Used to verify API is running

### Waitlist
- **POST** `/api/waitlist`
- Body: `{"email": "user@example.com", "source": "hero"}`
- Returns: `{"success": true}`
- Adds email to waitlist in Supabase

## 🏗️ Project Structure

```
packages/api/
├── src/
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration
│   └── index.ts            # Main API server
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

## 🚀 Deployment

### Render Configuration
- **Runtime**: Node (with Bun support)
- **Build Command**: `bun install`
- **Start Command**: `bun run start`
- **Root Directory**: `packages/api`
- **Custom Domain**: `api.christianai.world`

### Environment Setup
1. Connect GitHub repository to Render
2. Create Web Service with the above configuration
3. Add environment variables in Render dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Add custom domain `api.christianai.world`
5. Configure DNS CNAME record: `api` → `[your-render-service].onrender.com`

## 🔧 Development

### Adding New Endpoints
1. Add route handlers in `src/index.ts`
2. Follow the existing pattern:
```typescript
if (url.pathname === "/api/your-endpoint") {
  // Handle request
  return Response.json({ data: "response" });
}
```

### CORS Handling
CORS is configured to support:
- Development: `http://localhost:5173`
- Production: `https://christianai.world`
- Production (www): `https://www.christianai.world`

The server automatically detects the origin and allows requests from these domains.

## 📊 Monitoring

- **Health Check**: Visit `https://api.christianai.world/api/health`
- **Logs**: Available in Render dashboard
- **Uptime**: Monitored by Render's free tier monitoring

## 🔒 Security

- HTTPS enforced by Render
- Rate limiting handled by Render
- Uses Supabase anon key with RLS policies enforced (no bypass)
- Email validation on both frontend and backend
- Duplicate email handling (returns success without revealing existence)

## 🐛 Troubleshooting

### Build Issues
- Ensure Bun is properly installed
- Check that all dependencies are in `package.json`

### Runtime Issues
- Verify PORT environment variable is set
- Check Render logs for error details
- Test locally with `bun run dev`

### DNS Issues
- Custom domain propagation can take 5-30 minutes
- Verify CNAME record is correctly set
- Check domain verification status in Render

### Supabase Connection Issues
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly
- Check Supabase dashboard for project status
- Ensure RLS policies allow anonymous inserts on waitlist table

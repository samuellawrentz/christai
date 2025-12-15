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

## 📡 API Endpoints

### Health Check
- **GET** `/api/health`
- Returns: `{"status": "ok"}`
- Used to verify API is running

## 🏗️ Project Structure

```
packages/api/
├── src/
│   └── index.ts          # Main API server
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
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
3. Add custom domain `api.christianai.world`
4. Configure DNS CNAME record: `api` → `[your-render-service].onrender.com`

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
Since this API serves a specific frontend domain, consider adding CORS headers if needed:
```typescript
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://christianai.world',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
});
```

## 📊 Monitoring

- **Health Check**: Visit `https://api.christianai.world/api/health`
- **Logs**: Available in Render dashboard
- **Uptime**: Monitored by Render's free tier monitoring

## 🔒 Security

- HTTPS enforced by Render
- Rate limiting handled by Render
- No authentication required for current endpoints
- Consider adding API keys for future protected endpoints

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
- Check domain verification status in Render</content>
<parameter name="filePath">packages/api/README.md
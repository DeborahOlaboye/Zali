# Events Indexer Deployment Guide

This guide covers deploying the Smart Contract Events Indexer for the Zali Trivia Game.

## Prerequisites

- Node.js 18+
- Next.js 14+
- Access to Base Mainnet RPC endpoint
- (Optional) Alchemy/Infura API key for WebSocket support

## Environment Configuration

### Required Environment Variables

Create or update `.env.local` with the following:

```env
# ===========================================
# SMART CONTRACT EVENTS INDEXER CONFIGURATION
# ===========================================

# Contract address on Base Mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d

# Block number when contract was deployed (for historical sync)
NEXT_PUBLIC_DEPLOYED_BLOCK=0

# RPC Configuration
# Primary HTTP endpoint
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

# WebSocket endpoint for real-time updates (recommended: use Alchemy/Infura)
NEXT_PUBLIC_WS_RPC_URL=wss://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# USDC token address on Base
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

### Production Environment Variables

For production deployments (Vercel, etc.):

```env
# Production optimizations
NODE_ENV=production

# Use production RPC with higher rate limits
NEXT_PUBLIC_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_WS_RPC_URL=wss://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
   vercel env add NEXT_PUBLIC_RPC_URL
   vercel env add NEXT_PUBLIC_WS_RPC_URL
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Vercel Settings**
   - Framework Preset: Next.js
   - Node.js Version: 18.x
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Option 2: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t zali-indexer .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_CONTRACT_ADDRESS=0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d \
  -e NEXT_PUBLIC_RPC_URL=https://mainnet.base.org \
  zali-indexer
```

### Option 3: Traditional Node.js

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start in production**
   ```bash
   npm start
   ```

3. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "zali-indexer" -- start
   pm2 save
   ```

## API Endpoints

After deployment, the following endpoints are available:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | Query events with filtering |
| `/api/events/stats` | GET | Get event statistics |
| `/api/events/leaderboard` | GET | Get player leaderboard |
| `/api/events/player/[address]` | GET | Get player details |
| `/api/events/stream` | GET | SSE event stream |
| `/api/events/health` | GET | Health check |

## Health Check Integration

### Uptime Monitoring

Add health check endpoint to your monitoring service:

```bash
# Check health status
curl https://your-domain.com/api/events/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 3600000,
    "components": [
      {"name": "RPC Connection", "status": "healthy"},
      {"name": "IndexedDB", "status": "healthy"}
    ]
  }
}
```

### Alerting Thresholds

Configure alerts for:
- Health status != "healthy"
- Response time > 5s
- Error rate > 5%
- Memory usage > 80%

## Performance Optimization

### CDN Configuration

For static assets and API caching:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/events/stats',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=30, stale-while-revalidate' },
        ],
      },
      {
        source: '/api/events/leaderboard',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=10, stale-while-revalidate' },
        ],
      },
    ];
  },
};
```

### Rate Limiting

For high-traffic deployments, add rate limiting:

```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'anonymous';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;

  const requestLog = rateLimit.get(ip) || [];
  const recentRequests = requestLog.filter((time: number) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## Monitoring & Logging

### Structured Logging

Add structured logging for production:

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...data, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: Error, data?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      ...data,
      timestamp: new Date().toISOString()
    }));
  },
};
```

### Metrics Collection

For detailed metrics, integrate with your observability platform:

```typescript
// Example: Custom metrics endpoint
app.get('/api/metrics', async (req, res) => {
  const health = await getHealthCheckService().runHealthCheck();

  res.setHeader('Content-Type', 'text/plain');
  res.send(`
# HELP indexer_events_processed_total Total events processed
# TYPE indexer_events_processed_total counter
indexer_events_processed_total ${health.metrics.eventsProcessed}

# HELP indexer_active_connections Active SSE connections
# TYPE indexer_active_connections gauge
indexer_active_connections ${health.metrics.activeConnections}

# HELP indexer_error_rate Error rate percentage
# TYPE indexer_error_rate gauge
indexer_error_rate ${health.metrics.errorRate}
  `);
});
```

## Troubleshooting Production Issues

### Common Issues

1. **SSE Connections Dropping**
   - Ensure load balancer timeout > 30s
   - Check for proxy buffering (nginx: `proxy_buffering off`)

2. **High Memory Usage**
   - Reduce `maxEventsInMemory` in config
   - Enable garbage collection logging: `NODE_OPTIONS="--expose-gc"`

3. **RPC Rate Limits**
   - Use dedicated RPC provider (Alchemy, Infura)
   - Implement request queuing

4. **WebSocket Connection Failures**
   - Verify WebSocket URL is correct
   - Check firewall rules for WSS traffic

### Debug Mode

Enable verbose logging:

```bash
DEBUG=indexer:* npm start
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management in production

2. **API Security**
   - Implement rate limiting
   - Add request validation
   - Use CORS restrictions

3. **Data Privacy**
   - Wallet addresses are public on-chain
   - Don't store additional PII

## Backup & Recovery

### IndexedDB Data

Client-side IndexedDB data is browser-specific. For server-side persistence:

1. Export events periodically
2. Store in external database
3. Implement import on startup

### Disaster Recovery

1. Health check alerts
2. Automatic restart (PM2, Docker)
3. Fallback RPC endpoints

## Scaling Considerations

For high-traffic applications:

1. **Horizontal Scaling**
   - Use serverless functions
   - Implement distributed caching

2. **Database Backend**
   - Replace IndexedDB with PostgreSQL/MongoDB
   - Use Redis for caching

3. **Event Streaming**
   - Consider dedicated event streaming (Kafka)
   - Implement event replay

## Support

For issues and questions:
- GitHub Issues: [Zali Repository](https://github.com/DeborahOlaboye/Zali)
- Documentation: See README in `/frontend/src/services/indexer/`

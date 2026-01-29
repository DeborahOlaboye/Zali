# Zali Frontend Deployment Guide

This guide provides comprehensive instructions for deploying the Zali frontend application to production.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deployment Platforms](#deployment-platforms)
- [Domain Setup](#domain-setup)
- [Monitoring Setup](#monitoring-setup)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

## Overview

The Zali frontend is a Next.js 14 application built with React 18 and TypeScript. It features:

- **Framework**: Next.js 14.1.0 with App Router
- **Blockchain Integration**: Web3 functionality via WalletConnect and Wagmi
- **Styling**: Tailwind CSS 4.0
- **Testing**: Jest for unit tests, Playwright for E2E tests
- **Monitoring**: Sentry for error tracking
- **Analytics**: Mixpanel for user analytics

### Deployment Options

This guide covers deployment to:
1. **Vercel** (Recommended) - Optimized for Next.js applications
2. **Netlify** - Alternative serverless platform
3. **Custom Server** - Self-hosted deployment options
4. **Docker** - Containerized deployment

## Prerequisites

Before deploying, ensure you have:

### Required Accounts
- [ ] Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Deployment platform account (Vercel, Netlify, etc.)
- [ ] WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com))
- [ ] Sentry account for error monitoring ([Sign up](https://sentry.io))
- [ ] Mixpanel account for analytics ([Sign up](https://mixpanel.com))

### Required Services
- [ ] The Graph subgraph deployed and accessible
- [ ] Smart contracts deployed on Base network
- [ ] RPC endpoint (Alchemy, Infura, or custom)
- [ ] Domain name (for custom domains)

### Development Tools
- Node.js 18.x or later
- npm or yarn package manager
- Git CLI

### Build Verification
Before deploying, verify the build locally:

```bash
cd frontend
npm install
npm run build
npm run start
```

Visit `http://localhost:3000` to verify the production build works correctly.

## Environment Variables

All environment variables must be set in your deployment platform. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

### Required Variables

#### Blockchain Configuration

```bash
# The Graph Subgraph URL for querying blockchain data
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/your-subgraph-id/zali-trivia/v1.0.0

# Main Zali contract address on Base network
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d

# USDC token contract address on Base
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Base network chain ID
NEXT_PUBLIC_CHAIN_ID=8453

# Network name
NEXT_PUBLIC_NETWORK_NAME=base
```

#### Web3 Wallet Configuration

```bash
# WalletConnect Project ID (Get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

#### RPC Configuration

```bash
# RPC endpoint for Base network
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

# Alchemy API key (optional, for enhanced RPC)
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_id_here
```

#### Feature Flags

```bash
# Enable/disable subgraph data fetching
NEXT_PUBLIC_USE_SUBGRAPH=true

# Enable/disable query caching
NEXT_PUBLIC_ENABLE_CACHING=true
```

### Optional Variables

#### Monitoring (Sentry)

```bash
# Sentry DSN for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Sentry environment (production, staging, etc.)
SENTRY_ENVIRONMENT=production

# Sentry release version (typically set automatically by CI/CD)
SENTRY_RELEASE=your-release-version
```

#### Analytics (Mixpanel)

```bash
# Mixpanel project token
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
```

### Environment Variable Setup by Platform

See the [Deployment Platforms](#deployment-platforms) section for platform-specific instructions on setting environment variables.

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform as it's built by the Next.js team and offers optimal performance.

#### Quick Deploy

1. **Connect Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm install -g vercel

   # Login to Vercel
   vercel login
   ```

2. **Import Project**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository
   - Choose the `frontend` directory as the root

3. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Root Directory: `frontend`

4. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables from the [Environment Variables](#environment-variables) section
   - Set variables for Production, Preview, and Development environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Vercel CLI Deployment

```bash
# Navigate to frontend directory
cd frontend

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

#### Custom Domain on Vercel

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate to provision (automatic)

### Netlify

Netlify is an alternative serverless platform with excellent Next.js support.

#### Deploy via Netlify UI

1. **Connect Repository**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git provider and select repository

2. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add netlify.toml Configuration**
   Create `frontend/netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
     base = "frontend"

   [build.environment]
     NODE_VERSION = "18"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

4. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all required variables from the [Environment Variables](#environment-variables) section

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://your-site.netlify.app`

#### Netlify CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
cd frontend
netlify init

# Deploy to production
netlify deploy --prod

# Deploy to preview
netlify deploy
```

### Docker Deployment

Deploy using Docker containers for maximum portability.

#### Docker Setup

1. **Create Dockerfile** (see `frontend/Dockerfile`)

2. **Create .dockerignore**
   ```
   node_modules
   .next
   .git
   .env.local
   npm-debug.log
   ```

3. **Build Docker Image**
   ```bash
   cd frontend
   docker build -t zali-frontend:latest .
   ```

4. **Run Container Locally**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUBGRAPH_URL=your_value \
     -e NEXT_PUBLIC_CONTRACT_ADDRESS=your_value \
     -e NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_value \
     zali-frontend:latest
   ```

5. **Push to Container Registry**
   ```bash
   # Tag for registry
   docker tag zali-frontend:latest your-registry.com/zali-frontend:latest

   # Push to registry
   docker push your-registry.com/zali-frontend:latest
   ```

#### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## Domain Setup

### DNS Configuration

Configure your domain's DNS records to point to your deployment:

#### For Vercel

1. Add domain in Vercel dashboard
2. Configure DNS records:
   ```
   Type: A
   Name: @ (or subdomain)
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### For Netlify

1. Add domain in Netlify dashboard
2. Configure DNS records:
   ```
   Type: A
   Name: @ (or subdomain)
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

#### For Custom Server

1. Point A record to your server IP:
   ```
   Type: A
   Name: @
   Value: your.server.ip.address
   ```

2. Add CNAME for www subdomain:
   ```
   Type: CNAME
   Name: www
   Value: yourdomain.com
   ```

### SSL/TLS Certificate

#### Automatic (Vercel/Netlify)
- SSL certificates are automatically provisioned and renewed
- No manual configuration required

#### Manual (Custom Server)

Use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificate files will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem

# Set up auto-renewal
sudo certbot renew --dry-run
```

### Testing Domain Configuration

```bash
# Test DNS propagation
nslookup yourdomain.com

# Test SSL certificate
curl -I https://yourdomain.com

# Check SSL certificate details
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## Monitoring Setup

### Sentry Error Tracking

Sentry is already integrated in the application for error monitoring.

#### Setup Steps

1. **Create Sentry Project**
   - Visit [sentry.io](https://sentry.io)
   - Create a new project
   - Select "Next.js" as the platform
   - Copy your DSN

2. **Configure Environment Variables**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
   SENTRY_ENVIRONMENT=production
   ```

3. **Verify Integration**
   - Deploy your application
   - Trigger a test error
   - Check Sentry dashboard for the error

#### Sentry Features to Enable

- **Performance Monitoring**: Track API response times and page load performance
- **Session Replay**: Record user sessions for debugging
- **Release Tracking**: Associate errors with specific deployments
- **Alerts**: Set up notifications for new errors or performance degradation

### Mixpanel Analytics

Track user behavior and engagement.

#### Setup Steps

1. **Create Mixpanel Project**
   - Visit [mixpanel.com](https://mixpanel.com)
   - Create new project
   - Copy your project token

2. **Configure Environment Variable**
   ```bash
   NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
   ```

3. **Key Events to Track**
   - Wallet connections
   - Transaction submissions
   - Game completions
   - Page views
   - Error occurrences

### Vercel Analytics

If deploying to Vercel, enable built-in analytics:

1. Go to your project dashboard
2. Navigate to Analytics tab
3. Enable Web Analytics
4. Enable Speed Insights

### Health Checks

Set up endpoint monitoring:

```bash
# Create a health check endpoint at /api/health
# Monitor with services like:
# - UptimeRobot (https://uptimerobot.com)
# - Pingdom (https://pingdom.com)
# - StatusCake (https://statuscake.com)
```

### Log Aggregation

For production logging:

1. **Vercel**: Logs are available in the deployment dashboard
2. **Custom Server**: Use services like:
   - Datadog
   - LogRocket
   - Better Stack (formerly Logtail)

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Build fails with "Module not found" errors

**Solution**:
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

**Issue**: TypeScript errors during build

**Solution**:
```bash
# Check TypeScript configuration
npm run lint
npx tsc --noEmit

# Fix type errors or temporarily bypass (not recommended for production)
# Add to next.config.ts:
# typescript: { ignoreBuildErrors: true }
```

#### Runtime Errors

**Issue**: "Cannot connect to WalletConnect"

**Solution**:
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
- Check WalletConnect dashboard for project status
- Ensure project ID matches the one from cloud.walletconnect.com

**Issue**: "Subgraph query failed"

**Solution**:
- Verify `NEXT_PUBLIC_SUBGRAPH_URL` is accessible
- Test subgraph endpoint with curl:
  ```bash
  curl -X POST -H "Content-Type: application/json" \
    -d '{"query": "{_meta{block{number}}}"}' \
    YOUR_SUBGRAPH_URL
  ```
- Check The Graph dashboard for subgraph status

**Issue**: "Contract interaction failed"

**Solution**:
- Verify contract addresses are correct for the network
- Check `NEXT_PUBLIC_CHAIN_ID` matches your target network (8453 for Base)
- Ensure RPC endpoint is responsive:
  ```bash
  curl -X POST -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    YOUR_RPC_URL
  ```

#### Performance Issues

**Issue**: Slow page load times

**Solution**:
- Enable image optimization
- Implement code splitting
- Use Vercel Analytics to identify bottlenecks
- Enable caching headers:
  ```javascript
  // In next.config.ts
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  }
  ```

**Issue**: High server costs

**Solution**:
- Use edge functions for static content
- Implement ISR (Incremental Static Regeneration)
- Enable caching at CDN level

#### Environment Variable Issues

**Issue**: Environment variables not loading

**Solution**:
- Verify variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Rebuild application after changing environment variables
- For Vercel/Netlify: Check that variables are set in the correct environment (Production/Preview)
- Clear build cache and redeploy

#### SSL/Domain Issues

**Issue**: SSL certificate not provisioning

**Solution**:
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correctly configured
- Check nameservers are pointing to deployment platform
- For custom domains, ensure domain is verified in platform dashboard

**Issue**: "Mixed content" warnings

**Solution**:
- Ensure all external resources use HTTPS
- Update RPC URLs to use HTTPS
- Check for hardcoded HTTP URLs in code

### Getting Help

If issues persist:

1. **Check Logs**
   - Vercel: View deployment logs in dashboard
   - Netlify: Check deploy logs and function logs
   - Custom Server: Check application logs

2. **Community Support**
   - Next.js Discord: [nextjs.org/discord](https://nextjs.org/discord)
   - Stack Overflow: Tag questions with `next.js`
   - GitHub Issues: Check project repository

3. **Platform Support**
   - Vercel: [vercel.com/support](https://vercel.com/support)
   - Netlify: [answers.netlify.com](https://answers.netlify.com)

## Rollback Procedures

### Vercel Rollback

#### Via Dashboard

1. Go to your project dashboard
2. Click on "Deployments" tab
3. Find the last known working deployment
4. Click the three dots menu
5. Select "Promote to Production"
6. Confirm the rollback

#### Via CLI

```bash
# List recent deployments
vercel ls

# Promote a specific deployment
vercel promote <deployment-url>

# Or alias a deployment to production
vercel alias <deployment-url> your-domain.com
```

### Netlify Rollback

#### Via Dashboard

1. Go to site dashboard
2. Navigate to "Deploys" tab
3. Find the last successful deployment
4. Click "Publish deploy"
5. Confirm publication

#### Via CLI

```bash
# List deployments
netlify deploy:list

# Restore a specific deployment
netlify api restoreSiteDeploy --deploy_id=<deploy-id>
```

### Docker Rollback

#### Tag-based Rollback

```bash
# List available tags
docker images zali-frontend

# Stop current container
docker stop zali-frontend-container

# Run previous version
docker run -d --name zali-frontend-container \
  -p 3000:3000 \
  zali-frontend:previous-tag

# Or use docker-compose with specific tag
docker-compose down
docker-compose up -d zali-frontend:previous-tag
```

### Git-based Rollback

If you need to rollback the code itself:

```bash
# Find the commit to rollback to
git log --oneline

# Create a new branch from that commit
git checkout -b rollback-branch <commit-hash>

# Push to trigger new deployment
git push origin rollback-branch

# Or revert the problematic commits
git revert <commit-hash>
git push origin main
```

### Emergency Rollback Checklist

When performing an emergency rollback:

- [ ] Identify the last known working deployment
- [ ] Document the issue that caused the rollback
- [ ] Execute rollback procedure for your platform
- [ ] Verify the rollback was successful
- [ ] Check monitoring tools (Sentry, analytics)
- [ ] Notify team members of the rollback
- [ ] Create incident report
- [ ] Plan fix for the issue
- [ ] Test fix in staging environment
- [ ] Deploy fix when ready

### Preventing the Need for Rollbacks

1. **Use Preview Deployments**
   - Test changes in preview/staging environment
   - Vercel and Netlify automatically create preview deployments for PRs

2. **Implement Feature Flags**
   - Roll out features gradually
   - Disable problematic features without redeployment

3. **Automated Testing**
   - Run E2E tests before deploying
   - Use GitHub Actions or similar CI/CD

4. **Monitoring and Alerts**
   - Set up error rate alerts in Sentry
   - Monitor performance metrics
   - Quick detection enables quick response

### Post-Rollback Actions

After successfully rolling back:

1. **Investigate Root Cause**
   - Review error logs
   - Check Sentry for error patterns
   - Analyze what went wrong

2. **Fix the Issue**
   - Create fix in development environment
   - Test thoroughly
   - Deploy to staging first

3. **Document Incident**
   - Record what happened
   - Document resolution steps
   - Update runbooks if needed

4. **Update Deployment Process**
   - Add checks to prevent similar issues
   - Improve testing coverage
   - Consider additional safeguards

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/frontend-deploy.yml`:

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, staging]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUBGRAPH_URL: ${{ secrets.NEXT_PUBLIC_SUBGRAPH_URL }}
          NEXT_PUBLIC_CONTRACT_ADDRESS: ${{ secrets.NEXT_PUBLIC_CONTRACT_ADDRESS }}
          NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }}

      - name: Run E2E tests
        run: npm run test:e2e:ci
        env:
          CI: true

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
image: node:18

stages:
  - test
  - build
  - deploy

cache:
  paths:
    - frontend/node_modules/

test:
  stage: test
  script:
    - cd frontend
    - npm ci
    - npm run lint
    - npm run test:ci
  only:
    - merge_requests
    - main

build:
  stage: build
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/.next
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  script:
    - cd frontend
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  only:
    - main
  environment:
    name: production
    url: https://your-app.vercel.app
```

### Required Secrets

Configure these secrets in your CI/CD platform:

#### For Vercel Deployment
- `VERCEL_TOKEN`: Personal access token from Vercel
- `VERCEL_ORG_ID`: Organization ID from Vercel
- `VERCEL_PROJECT_ID`: Project ID from Vercel

#### Environment Variables
- `NEXT_PUBLIC_SUBGRAPH_URL`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_USDC_ADDRESS`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_RPC_URL`

### Deployment Strategy

#### Branch-based Deployment

- `main` branch → Production environment
- `staging` branch → Staging environment
- Feature branches → Preview deployments

#### Pull Request Previews

Both Vercel and Netlify automatically create preview deployments for pull requests:

1. Open a pull request
2. Preview URL is automatically generated
3. Test changes in preview environment
4. Merge when ready to deploy to production

### Automated Testing in CI

Ensure all tests pass before deployment:

```yaml
# Example test script in package.json
"scripts": {
  "test:ci": "jest --ci --coverage --maxWorkers=2",
  "test:e2e:ci": "playwright test --reporter=github",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

## Security Best Practices

### Environment Variables Security

1. **Never Commit Secrets**
   - Add `.env*` files to `.gitignore`
   - Use `.env.example` for documentation only
   - Never expose private keys or sensitive data

2. **Rotate Credentials Regularly**
   - Update API keys periodically
   - Rotate WalletConnect Project IDs if compromised
   - Update Sentry DSN if exposed

3. **Use Environment-Specific Variables**
   ```bash
   # Development
   .env.local

   # Production (set in deployment platform)
   # Never commit production secrets to repository
   ```

### Content Security Policy

Add security headers in `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

### Web3 Security

1. **Verify Contract Addresses**
   - Double-check all contract addresses before deployment
   - Use checksummed addresses
   - Verify on block explorer

2. **RPC Endpoint Security**
   - Use reputable RPC providers (Alchemy, Infura, QuickNode)
   - Implement rate limiting
   - Monitor for unusual activity

3. **Transaction Security**
   - Validate all transaction parameters
   - Implement transaction simulation before signing
   - Show clear transaction details to users

### Dependency Security

```bash
# Audit dependencies regularly
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated

# Update dependencies safely
npm update
```

### API Route Protection

If using API routes, implement rate limiting and authentication:

```typescript
// Example middleware for API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export default limiter;
```

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // For above-the-fold images
/>
```

### Code Splitting

Implement dynamic imports for large components:

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable server-side rendering if needed
});
```

### Caching Strategy

Implement effective caching:

```typescript
// In next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,gif,ico,svg,webp}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Bundle Size Optimization

1. **Analyze Bundle**
   ```bash
   # Install bundle analyzer
   npm install @next/bundle-analyzer

   # Analyze bundle
   ANALYZE=true npm run build
   ```

2. **Tree Shaking**
   - Import only what you need
   ```typescript
   // Good
   import { useState } from 'react';

   // Bad
   import * as React from 'react';
   ```

3. **Remove Unused Dependencies**
   ```bash
   npx depcheck
   ```

### Web3 Performance

1. **Optimize RPC Calls**
   - Batch multiple calls together
   - Implement caching for blockchain data
   - Use multicall contracts

2. **Use The Graph**
   - Leverage subgraph for complex queries
   - Reduce direct RPC calls
   - Implement efficient GraphQL queries

### Monitoring Performance

Use Vercel Analytics or custom performance monitoring:

```typescript
// Example: Custom performance monitoring
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric); // Send to analytics
  }
}
```

### Lighthouse Score Optimization

Target scores:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+

Run lighthouse:
```bash
npx lighthouse https://your-domain.com --view
```

## Production Readiness Checklist

Before deploying to production, verify all items:

### Code Quality
- [ ] All tests passing (unit, integration, E2E)
- [ ] No TypeScript errors
- [ ] Linting passes with no errors
- [ ] Code reviewed and approved
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented

### Configuration
- [ ] All environment variables set correctly
- [ ] Production environment variables configured
- [ ] Database connections verified (if applicable)
- [ ] API endpoints pointing to production
- [ ] Contract addresses verified on block explorer

### Security
- [ ] No secrets committed to repository
- [ ] Security headers configured
- [ ] HTTPS enabled and enforced
- [ ] Content Security Policy configured
- [ ] Dependencies audited (no critical vulnerabilities)
- [ ] Rate limiting implemented on API routes
- [ ] CORS properly configured

### Performance
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Lazy loading implemented for heavy components
- [ ] Caching strategy implemented
- [ ] Lighthouse score meets targets (90+ performance)

### Monitoring
- [ ] Sentry error tracking configured
- [ ] Analytics tracking implemented (Mixpanel)
- [ ] Performance monitoring enabled
- [ ] Health check endpoint configured
- [ ] Alert notifications set up
- [ ] Log aggregation configured

### Blockchain Integration
- [ ] Contract addresses verified
- [ ] Network configuration correct (Base mainnet)
- [ ] RPC endpoints reliable and fast
- [ ] WalletConnect project ID valid
- [ ] Subgraph deployed and accessible
- [ ] Transaction error handling implemented

### User Experience
- [ ] All pages responsive on mobile/tablet/desktop
- [ ] Loading states implemented
- [ ] Error states handled gracefully
- [ ] Success messages clear and helpful
- [ ] Wallet connection flow tested
- [ ] Transaction flows tested end-to-end

### Documentation
- [ ] README updated with deployment info
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Runbook created for common operations

### Backup & Recovery
- [ ] Rollback procedure documented and tested
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Team trained on emergency procedures

### Legal & Compliance
- [ ] Privacy policy in place
- [ ] Terms of service updated
- [ ] Cookie consent implemented (if needed)
- [ ] GDPR compliance verified (if applicable)
- [ ] Analytics opt-out available

### Post-Deployment
- [ ] Production deployment verified
- [ ] All critical user flows tested in production
- [ ] Monitoring dashboards checked
- [ ] Error tracking confirmed working
- [ ] Performance metrics baseline recorded
- [ ] Team notified of deployment
- [ ] Changelog/release notes published

## Quick Reference

### Essential Commands

```bash
# Build and test locally
npm run build && npm run start

# Run all tests
npm run test:ci && npm run test:e2e

# Check for issues
npm run lint && npm audit

# Deploy to Vercel
vercel --prod

# View logs (Vercel)
vercel logs <deployment-url>

# Rollback (Vercel)
vercel promote <previous-deployment-url>
```

### Important URLs

- Vercel Dashboard: https://vercel.com/dashboard
- Netlify Dashboard: https://app.netlify.com
- WalletConnect Cloud: https://cloud.walletconnect.com
- Sentry Dashboard: https://sentry.io
- The Graph Studio: https://thegraph.com/studio
- Base Block Explorer: https://basescan.org

### Support Contacts

- Next.js Documentation: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
- WalletConnect Support: https://docs.walletconnect.com
- Base Network: https://docs.base.org

## Conclusion

This deployment guide covers all aspects of deploying the Zali frontend application to production. Key takeaways:

1. **Use Vercel for simplest deployment** - It's optimized for Next.js and requires minimal configuration

2. **Set all environment variables** - Double-check all required variables are configured correctly

3. **Monitor your application** - Use Sentry and analytics to catch issues early

4. **Test before deploying** - Always verify in preview/staging environments first

5. **Have a rollback plan** - Know how to quickly revert if something goes wrong

6. **Keep dependencies updated** - Regular updates prevent security vulnerabilities

7. **Optimize for performance** - Users expect fast load times, especially in Web3 applications

For questions or issues not covered in this guide, refer to the troubleshooting section or reach out to the development team.

---

**Last Updated**: 2026-01-29
**Version**: 1.0.0
**Maintained By**: Zali Development Team

# Bundle Size Monitoring & CI/CD Integration

Set up automated bundle size monitoring and performance alerts in CI/CD pipeline.

---

## 📊 Bundle Analyzer Setup

### Installation

```bash
cd frontend

# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer webpack-bundle-analyzer
```

### Usage

```bash
# Analyze bundle once
ANALYZE=true npm run build

# Then open the HTML report that appears
# Reports show in your browser automatically
```

---

## 🔧 CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/bundle-size.yml`:

```yaml
name: Bundle Size Check

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  bundle-analysis:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      
      - name: Build
        working-directory: frontend
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Analyze bundle
        working-directory: frontend
        run: |
          # Get total size of JavaScript chunks
          TOTAL_JS=$(find .next/static/chunks -name "*.js" -type f -exec stat -c%s {} + | awk '{s+=$1} END {print s}')
          TOTAL_JS_KB=$(echo "scale=2; $TOTAL_JS / 1024" | bc)
          
          # Get total size of CSS chunks
          TOTAL_CSS=$(find .next/static -name "*.css" -type f -exec stat -c%s {} + | awk '{s+=$1} END {print s}')
          TOTAL_CSS_KB=$(echo "scale=2; $TOTAL_CSS / 1024" | bc)
          
          echo "### Bundle Size Report" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Resource | Size | Status |" >> $GITHUB_STEP_SUMMARY
          echo "|----------|------|--------|" >> $GITHUB_STEP_SUMMARY
          echo "| Total JS | ${TOTAL_JS_KB} KB | $([ $(echo "$TOTAL_JS_KB < 200" | bc) -eq 1 ] && echo '✅' || echo '⚠️') |" >> $GITHUB_STEP_SUMMARY
          echo "| Total CSS | ${TOTAL_CSS_KB} KB | $([ $(echo "$TOTAL_CSS_KB < 50" | bc) -eq 1 ] && echo '✅' || echo '⚠️') |" >> $GITHUB_STEP_SUMMARY
          
          # Save metrics
          echo "TOTAL_JS=$TOTAL_JS" >> bundle-metrics.txt
          echo "TOTAL_CSS=$TOTAL_CSS" >> bundle-metrics.txt
          
          # Check limits
          if [ $(echo "$TOTAL_JS_KB > 220" | bc) -eq 1 ]; then
            echo "❌ JavaScript bundle exceeds 220KB limit: ${TOTAL_JS_KB}KB"
            exit 1
          fi
          
          if [ $(echo "$TOTAL_CSS_KB > 60" | bc) -eq 1 ]; then
            echo "❌ CSS bundle exceeds 60KB limit: ${TOTAL_CSS_KB}KB"
            exit 1
          fi
          
          echo "✅ Bundle sizes within limits"
      
      - name: Compare with base branch
        if: github.event_name == 'pull_request'
        working-directory: frontend
        run: |
          git fetch origin main
          
          # Build base branch
          git stash
          git checkout origin/main
          npm ci
          npm run build
          
          BASE_JS=$(find .next/static/chunks -name "*.js" -type f -exec stat -c%s {} + | awk '{s+=$1} END {print s}')
          
          # Restore PR changes
          git checkout -
          npm ci
          npm run build
          
          PR_JS=$(find .next/static/chunks -name "*.js" -type f -exec stat -c%s {} + | awk '{s+=$1} END {print s}')
          
          DIFF=$(echo "scale=2; ($PR_JS - $BASE_JS) / 1024" | bc)
          PERCENT=$(echo "scale=1; (($PR_JS - $BASE_JS) / $BASE_JS) * 100" | bc)
          
          echo "### Bundle Size Comparison" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Branch | Size | Change |" >> $GITHUB_STEP_SUMMARY
          echo "|--------|------|--------|" >> $GITHUB_STEP_SUMMARY
          echo "| main | $(echo "scale=2; $BASE_JS / 1024" | bc) KB | - |" >> $GITHUB_STEP_SUMMARY
          echo "| PR | $(echo "scale=2; $PR_JS / 1024" | bc) KB | ${DIFF}KB (${PERCENT}%) |" >> $GITHUB_STEP_SUMMARY
          
          if [ $(echo "$DIFF > 10" | bc) -eq 1 ]; then
            echo "⚠️ Bundle size increased by ${DIFF}KB (${PERCENT}%)"
          fi
      
      - name: Upload bundle report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: bundle-report
          path: frontend/.next/static/
          retention-days: 7
      
      - name: Comment on PR
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = require('path');
            
            // Read bundle metrics
            const metricsPath = 'frontend/bundle-metrics.txt';
            if (fs.existsSync(metricsPath)) {
              const metrics = fs.readFileSync(metricsPath, 'utf8');
              const comment = `
## 📦 Bundle Size Report

${metrics}

### ✅ Checks
- Bundle size within limits
- No significant regressions
              `;
              
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: comment,
              });
            }
```

---

## 📈 Manual Bundle Analysis Scripts

Create `scripts/analyze-bundle.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');

const CHUNKS_DIR = '.next/static/chunks';
const SIZE_BUDGETS = {
  js: 200 * 1024, // 200KB
  css: 50 * 1024, // 50KB
};

async function analyzeBundles() {
  console.log('\n📦 Bundle Size Analysis\n');
  
  const jsChunks = [];
  const cssChunks = [];
  let totalJs = 0;
  let totalCss = 0;
  
  // Analyze JS chunks
  const jsFiles = fs.readdirSync(CHUNKS_DIR)
    .filter(f => f.endsWith('.js'));
  
  for (const file of jsFiles) {
    const filePath = path.join(CHUNKS_DIR, file);
    const size = fs.statSync(filePath).size;
    const gzipped = await gzipSize.file(filePath);
    
    jsChunks.push({
      name: file,
      size,
      gzipped,
    });
    
    totalJs += size;
  }
  
  // Sort by size
  jsChunks.sort((a, b) => b.size - a.size);
  
  // Log results
  console.log('JavaScript Chunks:');
  console.log('─'.repeat(80));
  
  jsChunks.forEach((chunk, i) => {
    const status = chunk.gzipped > 100 * 1024 ? '⚠️' : '✅';
    console.log(
      `${status} ${i + 1}. ${chunk.name.padEnd(40)} ${(chunk.gzipped / 1024).toFixed(2)}KB`
    );
  });
  
  const totalJsGz = jsChunks.reduce((sum, c) => sum + c.gzipped, 0);
  const budgetStatus = totalJsGz > SIZE_BUDGETS.js ? '❌' : '✅';
  
  console.log('─'.repeat(80));
  console.log(
    `${budgetStatus} Total: ${(totalJsGz / 1024).toFixed(2)}KB / ${(SIZE_BUDGETS.js / 1024).toFixed(0)}KB`
  );
  
  // Check if exceeds budget
  if (totalJsGz > SIZE_BUDGETS.js) {
    console.error(
      `\n❌ Bundle size ${(totalJsGz / 1024).toFixed(2)}KB exceeds budget of ${(SIZE_BUDGETS.js / 1024).toFixed(0)}KB`
    );
    process.exit(1);
  }
  
  console.log('\n✅ Bundle size within budget!\n');
}

analyzeBundles().catch(console.error);
```

### Add to package.json:

```json
{
  "scripts": {
    "bundle:analyze": "node scripts/analyze-bundle.js",
    "bundle:check": "npm run build && npm run bundle:analyze"
  }
}
```

---

## 📊 Performance Dashboard

Create a simple dashboard to track metrics over time:

```typescript
// frontend/scripts/track-metrics.js
import fs from 'fs';
import path from 'path';

const METRICS_FILE = '.metrics-history.json';

function getMetrics() {
  const chunks = fs.readdirSync('.next/static/chunks');
  const jsSize = chunks
    .filter(f => f.endsWith('.js'))
    .reduce((sum, f) => {
      const stats = fs.statSync(path.join('.next/static/chunks', f));
      return sum + stats.size;
    }, 0);
  
  const cssSize = chunks
    .filter(f => f.endsWith('.css'))
    .reduce((sum, f) => {
      const stats = fs.statSync(path.join('.next/static/chunks', f));
      return sum + stats.size;
    }, 0);
  
  return {
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local',
    branch: process.env.GITHUB_REF_NAME || 'unknown',
    jsSize,
    cssSize,
    totalSize: jsSize + cssSize,
  };
}

function trackMetrics() {
  const metrics = getMetrics();
  
  let history = [];
  if (fs.existsSync(METRICS_FILE)) {
    history = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8'));
  }
  
  history.push(metrics);
  
  // Keep only last 100 measurements
  if (history.length > 100) {
    history = history.slice(-100);
  }
  
  fs.writeFileSync(METRICS_FILE, JSON.stringify(history, null, 2));
  
  console.log('📊 Metrics tracked:');
  console.log(`  JS: ${(metrics.jsSize / 1024).toFixed(2)}KB`);
  console.log(`  CSS: ${(metrics.cssSize / 1024).toFixed(2)}KB`);
  console.log(`  Total: ${(metrics.totalSize / 1024).toFixed(2)}KB`);
}

trackMetrics();
```

---

## 🚨 Performance Alerts

Configure alerts for bundle size regressions:

```yaml
# Create .lighthouse-ci.json for Lighthouse CI
{
  "ci": {
    "collect": {
      "staticDistDir": "./out",
      "numberOfRuns": 3
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "first-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

---

## 📈 Monitoring Strategy

### Daily

- Check build logs for warnings
- Monitor bundle size trends

### Weekly

- Run full performance audit
- Review metrics dashboard
- Check for regressions

### Monthly

- Full comprehensive audit
- Compare with competitors
- Plan optimizations

### On Every Deploy

- Run bundle analyzer
- Verify no regressions
- Check performance metrics

---

## 🔗 Integration with Services

### Grafana Dashboard

Export metrics to Prometheus:

```typescript
// Send metrics to monitoring service
async function reportMetrics() {
  const metrics = {
    bundle_js_size: jsSize,
    bundle_css_size: cssSize,
    lcp: largestContentfulPaint,
    fid: firstInputDelay,
    cls: cumulativeLayoutShift,
  };
  
  await fetch('https://metrics.example.com/api/metrics', {
    method: 'POST',
    body: JSON.stringify(metrics),
  });
}
```

### Datadog Integration

```yaml
# datadog.yml
monitors:
  - name: "Bundle Size Alert"
    type: "metric alert"
    query: "avg(last_5m):avg:bundle.js.size{} > 220000"
    thresholds:
      critical: 220000
      warning: 210000
```

---

## 📋 Monitoring Checklist

- [ ] GitHub Actions workflow configured
- [ ] Bundle analyzer installed
- [ ] Size budgets set
- [ ] CI/CD checks in place
- [ ] Alerts configured
- [ ] Monitoring dashboard created
- [ ] Team trained on process
- [ ] Regular review schedule set

---

## 🎯 Goals & Targets

### Q1 2026

- [ ] Reduce JS bundle to < 200KB
- [ ] Reduce CSS bundle to < 50KB
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] Setup monitoring

### Q2 2026

- [ ] Maintain bundle size
- [ ] Improve LCP to < 2s
- [ ] Add RUM monitoring
- [ ] Analyze user experience

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete

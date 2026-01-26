# Performance Metrics Dashboard & Tracking

Complete guide to setting up real-time performance monitoring and metrics tracking for the Zali application.

---

## 📊 Core Metrics to Track

### Bundle Size Metrics

```json
{
  "bundleSize": {
    "totalJs": "140KB",
    "totalCss": "35KB",
    "mainChunk": "80KB",
    "timestamp": "2026-01-26T10:00:00Z"
  },
  "chunks": {
    "main": "80KB",
    "web3": "90KB",
    "ui": "45KB",
    "animation": "25KB",
    "game": "35KB"
  },
  "gzipped": {
    "js": "45KB",
    "css": "8KB",
    "total": "53KB"
  }
}
```

### Performance Metrics

```json
{
  "vitals": {
    "lcp": 2.1,      // Largest Contentful Paint (seconds)
    "fid": 95,       // First Input Delay (milliseconds)
    "cls": 0.08,     // Cumulative Layout Shift
    "tti": 2.8,      // Time to Interactive (seconds)
    "ttfb": 0.3      // Time to First Byte (seconds)
  },
  "lighthouse": {
    "performance": 85,
    "accessibility": 92,
    "bestPractices": 88,
    "seo": 90
  }
}
```

---

## 🔧 Setting Up Web Vitals Tracking

### Installation & Configuration

```bash
cd frontend

# Install Web Vitals library
npm install web-vitals

# Install analytics provider (choose one):
npm install @google-analytics/data
# OR
npm install posthog
# OR
npm install segment
```

### Initialize Web Vitals

```typescript
// src/lib/web-vitals.ts

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface VitalsMetric {
  name: string;
  value: number;
  id: string;
  navigationType: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function initWebVitals() {
  getCLS((metric: VitalsMetric) => trackMetric(metric, 'CLS'));
  getFID((metric: VitalsMetric) => trackMetric(metric, 'FID'));
  getFCP((metric: VitalsMetric) => trackMetric(metric, 'FCP'));
  getLCP((metric: VitalsMetric) => trackMetric(metric, 'LCP'));
  getTTFB((metric: VitalsMetric) => trackMetric(metric, 'TTFB'));
}

function trackMetric(metric: VitalsMetric, name: string) {
  // Send to analytics provider
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      'engagement': {
        'metric_category': 'web_vitals',
        'metric_id': metric.id,
        'metric_value': Math.round(metric.value),
        'metric_delta': Math.round(metric.delta),
        'metric_rating': metric.rating,
      },
      'event_category': 'Web Vitals',
      'event_label': name,
      'non_interaction': true,
    });
  }

  // Send to custom analytics
  sendToAnalytics({
    metric: name,
    value: metric.value,
    rating: metric.rating,
    timestamp: new Date().toISOString(),
  });
}

async function sendToAnalytics(data: any) {
  try {
    await fetch('/api/analytics/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to track metric:', error);
  }
}
```

### Register in Layout

```typescript
// app/layout.tsx

import { initWebVitals } from '@/lib/web-vitals';

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initWebVitals();
    }
  }, []);

  return (
    <html>
      <body>{/* content */}</body>
    </html>
  );
}
```

---

## 📈 Bundle Size Tracking

### Create Bundle Metrics Collector

```typescript
// scripts/collect-bundle-metrics.ts

import fs from 'fs';
import path from 'path';
import gzipSize from 'gzip-size';

interface BundleMetrics {
  timestamp: string;
  totalJs: number;
  totalCss: number;
  gzippedJs: number;
  gzippedCss: number;
  chunks: Record<string, number>;
}

async function collectMetrics(): Promise<BundleMetrics> {
  const chunksDir = '.next/static/chunks';
  const metrics: BundleMetrics = {
    timestamp: new Date().toISOString(),
    totalJs: 0,
    totalCss: 0,
    gzippedJs: 0,
    gzippedCss: 0,
    chunks: {},
  };

  // Process JavaScript chunks
  const jsFiles = fs.readdirSync(chunksDir)
    .filter(f => f.endsWith('.js') && !f.endsWith('.map'));

  for (const file of jsFiles) {
    const filePath = path.join(chunksDir, file);
    const size = fs.statSync(filePath).size;
    const gzipped = await gzipSize.file(filePath);

    metrics.totalJs += size;
    metrics.gzippedJs += gzipped;
    metrics.chunks[file] = gzipped;
  }

  // Process CSS chunks
  const cssFiles = fs.readdirSync(chunksDir)
    .filter(f => f.endsWith('.css'));

  for (const file of cssFiles) {
    const filePath = path.join(chunksDir, file);
    const size = fs.statSync(filePath).size;
    const gzipped = await gzipSize.file(filePath);

    metrics.totalCss += size;
    metrics.gzippedCss += gzipped;
  }

  return metrics;
}

async function saveMetrics() {
  const metrics = await collectMetrics();
  const metricsFile = 'metrics-history.jsonl';

  // Append to JSONL file (one metric per line)
  fs.appendFileSync(
    metricsFile,
    JSON.stringify(metrics) + '\n'
  );

  // Keep only last 500 entries
  const lines = fs.readFileSync(metricsFile, 'utf8').split('\n');
  if (lines.length > 500) {
    fs.writeFileSync(
      metricsFile,
      lines.slice(-500).join('\n')
    );
  }

  console.log('Metrics saved:', JSON.stringify(metrics, null, 2));
}

collectMetrics().then(saveMetrics);
```

### Add to Package.json

```json
{
  "scripts": {
    "build": "next build && npm run collect:metrics",
    "collect:metrics": "ts-node scripts/collect-bundle-metrics.ts"
  }
}
```

---

## 📊 Dashboard Implementation

### Create Simple Dashboard Component

```typescript
// components/MetricsDashboard.tsx

'use client';

import { useEffect, useState } from 'react';

interface MetricsData {
  totalJs: number;
  gzippedJs: number;
  lcp: number;
  fid: number;
  cls: number;
  timestamp: string;
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [history, setHistory] = useState<MetricsData[]>([]);

  useEffect(() => {
    // Fetch current metrics
    fetch('/api/metrics/current')
      .then(r => r.json())
      .then(setMetrics);

    // Fetch metrics history
    fetch('/api/metrics/history?limit=30')
      .then(r => r.json())
      .then(setHistory);
  }, []);

  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="JS Size"
        value={`${(metrics.gzippedJs / 1024).toFixed(1)}KB`}
        status={metrics.gzippedJs < 50000 ? 'good' : 'warning'}
        target="< 50KB"
      />
      <MetricCard
        label="LCP"
        value={`${metrics.lcp.toFixed(2)}s`}
        status={metrics.lcp < 2.5 ? 'good' : 'warning'}
        target="< 2.5s"
      />
      <MetricCard
        label="FID"
        value={`${metrics.fid}ms`}
        status={metrics.fid < 100 ? 'good' : 'warning'}
        target="< 100ms"
      />
      <MetricCard
        label="CLS"
        value={metrics.cls.toFixed(3)}
        status={metrics.cls < 0.1 ? 'good' : 'warning'}
        target="< 0.1"
      />

      {/* Chart showing trends */}
      <div className="col-span-full">
        <MetricsTrendChart data={history} />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  status,
  target,
}: {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'poor';
  target: string;
}) {
  const statusColor = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    poor: 'text-red-600',
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`text-2xl font-bold ${statusColor[status]}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500">Target: {target}</div>
    </div>
  );
}

function MetricsTrendChart({ data }: { data: MetricsData[] }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-4">Metrics Trend (Last 30 days)</h3>
      {/* Use a charting library like recharts */}
      <div className="h-64 bg-gray-100 rounded" />
    </div>
  );
}
```

---

## 🔗 API Endpoints for Metrics

### Create Metrics API Routes

```typescript
// app/api/metrics/current/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    // Read latest metrics from metrics-history.jsonl
    const lines = fs
      .readFileSync('metrics-history.jsonl', 'utf8')
      .split('\n')
      .filter(Boolean);

    const latest = JSON.parse(lines[lines.length - 1]);

    return NextResponse.json(latest);
  } catch (error) {
    return NextResponse.json({ error: 'Metrics not available' }, { status: 500 });
  }
}
```

```typescript
// app/api/metrics/history/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30');

    const lines = fs
      .readFileSync('metrics-history.jsonl', 'utf8')
      .split('\n')
      .filter(Boolean)
      .slice(-limit);

    const metrics = lines.map(line => JSON.parse(line));

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
```

```typescript
// app/api/metrics/post/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Append to metrics file
    const metricsFile = 'metrics-history.jsonl';
    const entry = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    });

    fs.appendFileSync(metricsFile, entry + '\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save metrics' }, { status: 500 });
  }
}
```

---

## 🎯 Performance Budget

### Define Performance Budgets

```json
// performance-budget.json
{
  "bundles": [
    {
      "name": "javascript",
      "size": "50kb"
    },
    {
      "name": "css",
      "size": "15kb"
    }
  ],
  "metrics": [
    {
      "name": "LCP",
      "limit": "2.5s",
      "warn": "2.3s"
    },
    {
      "name": "FID",
      "limit": "100ms",
      "warn": "75ms"
    },
    {
      "name": "CLS",
      "limit": "0.1",
      "warn": "0.08"
    }
  ]
}
```

### Check Performance Budget

```typescript
// scripts/check-performance-budget.ts

import fs from 'fs';
import budgets from '../performance-budget.json';

function checkBudget() {
  const metricsFile = 'metrics-history.jsonl';
  const lines = fs.readFileSync(metricsFile, 'utf8').split('\n').filter(Boolean);
  const current = JSON.parse(lines[lines.length - 1]);

  let passed = true;

  // Check JS size
  const jsSize = current.gzippedJs;
  const jsLimit = 50 * 1024; // 50KB
  if (jsSize > jsLimit) {
    console.error(`❌ JS size ${jsSize}B exceeds limit ${jsLimit}B`);
    passed = false;
  } else {
    console.log(`✅ JS size ${jsSize}B within limit ${jsLimit}B`);
  }

  // Check LCP
  const lcp = current.lcp;
  if (lcp > 2.5) {
    console.error(`❌ LCP ${lcp}s exceeds limit 2.5s`);
    passed = false;
  } else {
    console.log(`✅ LCP ${lcp}s within limit`);
  }

  if (!passed) {
    process.exit(1);
  }
}

checkBudget();
```

---

## 📢 Alerts & Notifications

### Setup Slack Alerts

```typescript
// scripts/send-metrics-alert.ts

async function sendSlackAlert(metrics: any) {
  const threshold = {
    js: 55 * 1024,      // 55KB
    lcp: 2.8,           // 2.8s
    fid: 120,           // 120ms
  };

  const alert = [];

  if (metrics.gzippedJs > threshold.js) {
    alert.push(
      `⚠️ JS bundle size exceeds threshold: ${(metrics.gzippedJs / 1024).toFixed(1)}KB`
    );
  }

  if (metrics.lcp > threshold.lcp) {
    alert.push(`⚠️ LCP exceeds threshold: ${metrics.lcp.toFixed(2)}s`);
  }

  if (metrics.fid > threshold.fid) {
    alert.push(`⚠️ FID exceeds threshold: ${metrics.fid}ms`);
  }

  if (alert.length === 0) return;

  // Send to Slack
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Performance Alert',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: alert.join('\n'),
          },
        },
      ],
    }),
  });
}
```

### Setup Email Alerts

```typescript
// scripts/send-metrics-email.ts

import nodemailer from 'nodemailer';

async function sendMetricsEmail(metrics: any) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: 'metrics@example.com',
    to: 'team@example.com',
    subject: 'Daily Performance Metrics',
    html: `
      <h2>Daily Performance Report</h2>
      <table>
        <tr><td>JS Size (gzipped):</td><td>${(metrics.gzippedJs / 1024).toFixed(1)}KB</td></tr>
        <tr><td>LCP:</td><td>${metrics.lcp.toFixed(2)}s</td></tr>
        <tr><td>FID:</td><td>${metrics.fid}ms</td></tr>
        <tr><td>CLS:</td><td>${metrics.cls.toFixed(3)}</td></tr>
      </table>
    `,
  });
}
```

---

## 📈 Integration with Monitoring Tools

### Send to Datadog

```typescript
// scripts/send-to-datadog.ts

async function sendToDatadog(metrics: any) {
  const payload = {
    series: [
      {
        metric: 'zali.bundle.js_size',
        points: [[Date.now() / 1000, metrics.gzippedJs]],
        type: 'gauge',
        tags: ['env:production'],
      },
      {
        metric: 'zali.performance.lcp',
        points: [[Date.now() / 1000, metrics.lcp * 1000]],
        type: 'gauge',
        tags: ['env:production'],
      },
    ],
  };

  await fetch('https://api.datadoghq.com/api/v1/series', {
    method: 'POST',
    headers: {
      'DD-API-KEY': process.env.DATADOG_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
```

### Send to Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'zali-metrics'
    static_configs:
      - targets: ['localhost:9090']
```

---

## 📋 Monitoring Checklist

- [ ] Web Vitals tracking implemented
- [ ] Bundle metrics collection working
- [ ] Dashboard component created
- [ ] API endpoints working
- [ ] Performance budget defined
- [ ] Alerts configured
- [ ] Slack integration working
- [ ] Email alerts working
- [ ] Historical data collecting
- [ ] Team has access to dashboard

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete

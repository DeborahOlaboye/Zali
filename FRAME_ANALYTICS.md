# Farcaster Frame Analytics Strategy

## Overview

This document outlines the analytics strategy for tracking and optimizing the Zali Farcaster Frame.

## Key Metrics

### Engagement Metrics

#### 1. Frame Impressions
- **Definition**: Number of times the frame is displayed
- **Target**: 10,000+ impressions/day
- **Tracking**: Frame view events in Farcaster clients

#### 2. Click-Through Rate (CTR)
- **Definition**: % of impressions that result in button clicks
- **Target**: 15-25% CTR
- **Formula**: (Button Clicks / Impressions) × 100

#### 3. Answer Submission Rate
- **Definition**: % of users who submit an answer
- **Target**: 60-80% of users who start
- **Formula**: (Answers Submitted / "Play" Button Clicks) × 100

#### 4. Completion Rate
- **Definition**: % of users who finish a full game session
- **Target**: 40-60%
- **Formula**: (Sessions Completed / Sessions Started) × 100

### Performance Metrics

#### 1. Correct Answer Rate
- **Definition**: % of submitted answers that are correct
- **Target**: 50-70% (indicates good difficulty balance)
- **Formula**: (Correct Answers / Total Answers) × 100

#### 2. Average Time per Question
- **Definition**: How long users take to answer
- **Target**: 5-15 seconds
- **Impact**: Faster = more engaged, Slower = may indicate confusion

#### 3. Drop-off Rate
- **Definition**: % of users who stop at each step
- **Track**: Drop-off at each screen
- **Target**: < 20% per step

### Growth Metrics

#### 1. Share Rate
- **Definition**: % of users who share the frame
- **Target**: 10-20%
- **Formula**: (Shares / Sessions) × 100

#### 2. Viral Coefficient
- **Definition**: New users generated per existing user
- **Target**: > 1.0 (exponential growth)
- **Formula**: (Invites per User × Conversion Rate)

#### 3. User Retention
- **D1 Retention**: % who return next day (Target: 30-40%)
- **D7 Retention**: % who return in 7 days (Target: 15-25%)
- **D30 Retention**: % who return in 30 days (Target: 5-10%)

### Business Metrics

#### 1. Total USDC Distributed
- **Definition**: Total rewards paid to users
- **Track**: Cumulative and daily
- **Use**: Calculate CAC and ROI

#### 2. Average Earnings per User
- **Definition**: Mean USDC earned per user
- **Formula**: Total Distributed / Unique Users
- **Target**: $0.50 - $2.00 to encourage return

#### 3. Cost per Acquisition (CPA)
- **Definition**: Cost to acquire one new user
- **Formula**: Marketing Spend / New Users
- **Target**: < $5 per user

#### 4. Lifetime Value (LTV)
- **Definition**: Expected value from user over lifetime
- **Formula**: Average Session Value × Sessions per User × Lifespan
- **Target**: LTV > 3× CPA

## Funnel Analysis

### Conversion Funnel

```
Frame View (100%)
    ↓ (-30%)
Button Click (70%)
    ↓ (-15%)
Start Game (55%)
    ↓ (-20%)
Submit Answer (35%)
    ↓ (-10%)
Complete Session (25%)
    ↓ (-70%)
Share (7.5%)
```

**Key Drop-off Points to Optimize:**
1. Frame View → Button Click (30% drop)
2. Start Game → Submit Answer (20% drop)
3. Complete Session → Share (70% drop)

## Event Tracking

### Events to Track

#### User Actions
```typescript
// Frame viewed
{
  event: 'frame_viewed',
  fid: number,
  castId: string,
  timestamp: Date,
}

// Button clicked
{
  event: 'button_clicked',
  fid: number,
  buttonIndex: number,
  buttonLabel: string,
  screen: 'home' | 'game' | 'result',
  timestamp: Date,
}

// Answer submitted
{
  event: 'answer_submitted',
  fid: number,
  questionId: number,
  answer: number,
  isCorrect: boolean,
  timeToAnswer: number, // seconds
  timestamp: Date,
}

// Session completed
{
  event: 'session_completed',
  fid: number,
  totalQuestions: number,
  correctAnswers: number,
  totalRewards: string,
  duration: number, // seconds
  timestamp: Date,
}

// Frame shared
{
  event: 'frame_shared',
  fid: number,
  shareMethod: 'button' | 'manual',
  timestamp: Date,
}
```

## Analytics Integration

### Recommended Tools

#### 1. Mixpanel
**Best for:** Product analytics, funnels, retention

```typescript
// Example implementation
import mixpanel from 'mixpanel-browser';

mixpanel.track('frame_viewed', {
  fid: userFid,
  castId: castId,
});

mixpanel.track('answer_submitted', {
  fid: userFid,
  questionId: questionId,
  isCorrect: isCorrect,
  timeToAnswer: timeToAnswer,
});
```

#### 2. Amplitude
**Best for:** User behavior analysis, cohort analysis

```typescript
import * as amplitude from '@amplitude/analytics-browser';

amplitude.track('Frame Viewed', {
  fid: userFid,
  screen: 'home',
});
```

#### 3. PostHog
**Best for:** Open-source, feature flags, A/B testing

```typescript
import posthog from 'posthog-js';

posthog.capture('frame_viewed', {
  fid: userFid,
  castId: castId,
});
```

## Dashboard Design

### Real-Time Dashboard

**Metrics to Display:**
- Current active users
- Frames viewed (last hour)
- Button clicks (last hour)
- Answer submissions (last hour)
- Correct answer rate (rolling)
- Error rate

### Daily Dashboard

**Metrics to Display:**
- Total impressions
- Total unique users
- Click-through rate
- Answer submission rate
- Completion rate
- Share rate
- Total USDC distributed
- Top questions by engagement

### Weekly Dashboard

**Metrics to Display:**
- Week-over-week growth
- User retention (D1, D7)
- Funnel conversion rates
- Viral coefficient
- LTV estimates
- Top performers (leaderboard)

## A/B Testing Strategy

### Tests to Run

#### 1. Button Copy
**Variants:**
- "Play Trivia" vs "Win USDC" vs "Start Game"
- "Leaderboard" vs "Top Players" vs "Rankings"

**Measure:** Click-through rate

#### 2. Image Design
**Variants:**
- Gradient backgrounds vs solid colors
- Different emoji usage
- Text placement and sizing

**Measure:** Impression → Click rate

#### 3. Reward Display
**Variants:**
- "Earn 0.1 USDC" vs "Win Crypto" vs "Get Rewards"
- Showing total earned vs per-question amount

**Measure:** Completion rate

#### 4. Share Copy
**Variants:**
- Different call-to-actions
- With/without emoji
- Personal vs generic messaging

**Measure:** Share rate

## Optimization Playbook

### If CTR is Low (< 10%)
- Make buttons more prominent
- Improve image design
- Test different copy
- Add urgency (limited time, etc.)

### If Completion Rate is Low (< 30%)
- Simplify questions
- Reduce number of questions per session
- Add progress indicators
- Improve feedback on correct/incorrect

### If Share Rate is Low (< 5%)
- Make share button more prominent
- Improve share copy
- Add incentives for sharing
- Show social proof

### If Retention is Low
- Add daily streaks
- Implement push notifications (if possible)
- Increase rewards for returning users
- Add new questions regularly

## Reporting Cadence

### Daily
- Check real-time dashboard
- Monitor error rates
- Track engagement metrics
- Review top questions

### Weekly
- Full funnel analysis
- Retention cohort analysis
- A/B test results review
- Competitive analysis

### Monthly
- Executive summary
- Growth trends
- ROI analysis
- Strategic recommendations

## Data-Driven Decisions

### Framework

1. **Identify**: Find metrics that are underperforming
2. **Hypothesize**: Form theory about why
3. **Test**: Run A/B test to validate
4. **Analyze**: Review results statistically
5. **Implement**: Roll out winning variant
6. **Monitor**: Track long-term impact

### Example

**Problem**: Share rate only 3% (target: 10%)

**Hypothesis**: Share button not prominent enough

**Test**:
- Control: Current design
- Variant A: Larger share button
- Variant B: Share prompt after correct answer
- Variant C: Show "5 friends shared" social proof

**Measure**: Share rate per variant

**Result**: Variant C increases share rate to 12%

**Action**: Implement social proof permanently

## Privacy & Compliance

### Data Collection
- Only collect necessary data
- Anonymize where possible
- Comply with GDPR/CCPA
- Clear privacy policy

### User Consent
- Explain data usage
- Allow opt-out
- Respect user preferences
- Be transparent

## Tools Setup

### Implementation

```typescript
// analytics.ts
export class FrameAnalytics {
  track(event: string, properties: Record<string, any>) {
    // Send to multiple services
    mixpanel.track(event, properties);
    amplitude.track(event, properties);
    posthog.capture(event, properties);

    // Custom backend
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ event, properties }),
    });
  }
}
```

## Success Criteria

### 30-Day Goals
- 100,000+ frame impressions
- 15,000+ unique users
- 10% CTR
- 50% completion rate
- $5,000+ USDC distributed
- 10% share rate
- 30% D1 retention

### 90-Day Goals
- 1M+ frame impressions
- 150,000+ unique users
- Viral coefficient > 1.2
- LTV > $10
- Featured in Warpcast trending

## Resources

- [Mixpanel Documentation](https://docs.mixpanel.com/)
- [Amplitude Documentation](https://www.docs.developers.amplitude.com/)
- [PostHog Documentation](https://posthog.com/docs)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)

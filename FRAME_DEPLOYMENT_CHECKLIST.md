# Farcaster Frame Deployment Checklist

Use this checklist to deploy the Zali Farcaster Frame to production.

## Pre-Deployment

### Environment Setup
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Set `NEXT_PUBLIC_FRAME_URL` to `/frame` route
- [ ] Configure `NEXT_PUBLIC_CONTRACT_ADDRESS`
- [ ] Configure `NEXT_PUBLIC_USDC_ADDRESS`
- [ ] Set `FARCASTER_HUB_URL` (optional, for signature validation)
- [ ] Enable analytics in production environment

### Code Review
- [ ] All Frame API endpoints work correctly
- [ ] Image generation routes return proper dimensions (1200x630)
- [ ] Button actions route to correct handlers
- [ ] Error handling implemented for all endpoints
- [ ] Analytics tracking implemented
- [ ] Rate limiting configured

### Testing
- [ ] Test frame locally with curl/Postman
- [ ] Validate meta tags are correct
- [ ] Test all button interactions
- [ ] Verify image URLs are publicly accessible
- [ ] Test answer submission flow
- [ ] Check leaderboard data loads
- [ ] Verify profile stats display

## Deployment

### Build
- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] Bundle size acceptable

### Deploy to Hosting
- [ ] Deploy to Vercel/Netlify/other
- [ ] Verify deployment successful
- [ ] Check all environment variables set
- [ ] Verify custom domain configured (if applicable)

### Post-Deploy Verification
- [ ] Access `/frame` page loads
- [ ] Frame meta tags present in HTML
- [ ] All API endpoints accessible
- [ ] Images load correctly
- [ ] No 404/500 errors in logs

## Frame Testing

### Warpcast Testing
- [ ] Create test cast with frame URL
- [ ] Frame renders in Warpcast
- [ ] Home image displays correctly
- [ ] All 3 buttons visible and labeled correctly

### Interaction Testing
- [ ] Click "Play Trivia" button works
- [ ] Game screen loads with question
- [ ] Answer buttons (A, B, C, D) visible
- [ ] Submit answer works
- [ ] Correct answer shows green celebration
- [ ] Incorrect answer shows red feedback
- [ ] "Next Question" button works
- [ ] Leaderboard button shows top players
- [ ] Profile button shows user stats
- [ ] Share button creates cast with embed

### Cross-Client Testing
- [ ] Test in Warpcast mobile app (iOS)
- [ ] Test in Warpcast mobile app (Android)
- [ ] Test in Warpcast web
- [ ] Test in other Farcaster clients (if applicable)

## Analytics Setup

### Configure Tracking
- [ ] Frame view events tracked
- [ ] Button click events tracked
- [ ] Answer submission events tracked
- [ ] Share events tracked
- [ ] User FID captured correctly

### Dashboard Setup
- [ ] Create analytics dashboard
- [ ] Set up key metrics:
  - Total frame views
  - Button click rates
  - Answer submission rate
  - Correct answer rate
  - Share rate
  - User retention

## Security

### Validation
- [ ] Frame signature validation enabled in production
- [ ] Farcaster Hub connection working
- [ ] Invalid signatures rejected
- [ ] Proper error messages for invalid requests

### Rate Limiting
- [ ] Rate limits configured per FID
- [ ] Rate limit responses proper (429 status)
- [ ] Rate limit bypass for testing (if needed)

### Data Protection
- [ ] No sensitive data in frame images
- [ ] User data properly encrypted
- [ ] No PII exposed in logs
- [ ] GDPR compliance checked (if applicable)

## Performance

### Optimization
- [ ] Image generation optimized
- [ ] API response times < 200ms
- [ ] Caching implemented where appropriate
- [ ] Database queries optimized (if applicable)
- [ ] CDN configured for static assets

### Load Testing
- [ ] Test with 100 concurrent users
- [ ] Test with 1000 requests/minute
- [ ] No timeouts under load
- [ ] Error rate < 0.1%

## Monitoring

### Alerts Setup
- [ ] Error rate alerts configured
- [ ] Response time alerts configured
- [ ] Uptime monitoring enabled
- [ ] Analytics anomaly detection

### Logging
- [ ] Frame interactions logged
- [ ] Errors logged with context
- [ ] Performance metrics logged
- [ ] User actions tracked

## Marketing

### Launch Preparation
- [ ] Create launch cast ready
- [ ] Prepare social media posts
- [ ] Create tutorial/demo video
- [ ] Write blog post about frame

### Distribution
- [ ] Share in Farcaster channels
- [ ] Post in relevant communities
- [ ] Reach out to influencers
- [ ] Cross-promote on other channels

### Growth Features
- [ ] Share button prominent
- [ ] Compelling share copy
- [ ] Leaderboard encourages competition
- [ ] Profile stats encourage return visits
- [ ] Rewards clearly communicated

## Post-Launch

### Day 1
- [ ] Monitor error logs
- [ ] Check analytics dashboard
- [ ] Respond to user feedback
- [ ] Fix any critical bugs
- [ ] Track engagement metrics

### Week 1
- [ ] Analyze user behavior
- [ ] Identify drop-off points
- [ ] A/B test variations
- [ ] Optimize based on data
- [ ] Gather user testimonials

### Month 1
- [ ] Review all metrics
- [ ] Plan new features
- [ ] Optimize conversion funnel
- [ ] Scale infrastructure if needed
- [ ] Iterate based on feedback

## Troubleshooting

Common issues and solutions:

### Frame Not Rendering
1. Check meta tags in `/frame/page.tsx`
2. Verify image URL is accessible
3. Test with Frame Validator
4. Check button configuration

### Images Not Loading
1. Verify ImageResponse API working
2. Check dimensions are 1200x630
3. Ensure URLs are public
4. Check for CORS issues

### Slow Performance
1. Optimize image generation
2. Add caching layer
3. Use CDN for assets
4. Scale server resources

### Low Engagement
1. Improve copy/images
2. Make buttons more prominent
3. Add more share prompts
4. Increase rewards
5. Gamify more elements

## Rollback Plan

If issues arise:

1. **Minor Issues**
   - Hot fix and redeploy
   - Monitor closely
   - Document the fix

2. **Major Issues**
   - Revert to previous deployment
   - Disable frame temporarily
   - Fix in staging
   - Redeploy when stable

3. **Critical Issues**
   - Immediate rollback
   - Disable frame
   - Post status update
   - Fix and test thoroughly
   - Gradual re-enable

## Success Metrics

Track these KPIs:

### Engagement
- Frame views per day
- Click-through rate
- Answer submission rate
- Completion rate
- Share rate

### Growth
- New users per day
- Returning users
- Viral coefficient
- User retention (D1, D7, D30)

### Business
- Total USDC distributed
- Average earnings per user
- Cost per acquisition
- Lifetime value

## Notes

- Keep this checklist updated
- Document any issues encountered
- Share learnings with team
- Celebrate the launch! 🎉

## Sign-Off

Deployment completed by: __________________

Date: __________________

Verified by: __________________

Date: __________________

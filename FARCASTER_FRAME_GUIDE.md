# Farcaster Frame Integration Guide

This guide explains how to use and deploy the Zali Trivia Farcaster Frame.

## What is a Farcaster Frame?

Farcaster Frames are interactive applications that can be embedded directly in Farcaster feeds (like Warpcast). Users can interact with them without leaving their social feed.

## Features

Our Farcaster Frame includes:

- **🎮 Play Trivia**: Answer questions directly in the feed
- **🏆 View Leaderboard**: See top players
- **👤 View Profile**: Check your stats and earnings
- **💰 Earn Rewards**: Get USDC for correct answers
- **📤 Share**: Viral sharing mechanics to invite friends

## Architecture

### Endpoints

#### Frame Routes
- `GET/POST /api/frame` - Main frame handler
- `POST /api/frame/submit` - Answer submission handler

#### Image Routes (Open Graph)
- `GET /api/frame/image/home` - Home screen
- `GET /api/frame/image/game` - Question display
- `GET /api/frame/image/correct` - Correct answer feedback
- `GET /api/frame/image/incorrect` - Incorrect answer feedback
- `GET /api/frame/image/leaderboard` - Leaderboard display
- `GET /api/frame/image/profile` - Profile stats

### User Flow

```
┌─────────────┐
│  Home Frame │ ← User sees frame in Farcaster feed
└──────┬──────┘
       │ Click "Play Trivia"
       ↓
┌─────────────┐
│ Game Frame  │ ← Displays question with 4 options
└──────┬──────┘
       │ Click answer button
       ↓
┌─────────────┐
│Submit Answer│ ← Process answer, check if correct
└──────┬──────┘
       │
       ├─→ Correct → Show celebration + reward
       └─→ Incorrect → Show encouragement
```

## Setup

### 1. Environment Variables

Add to `.env.local`:

```bash
# Required
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Optional - Farcaster Hub for signature validation
FARCASTER_HUB_URL=https://hub.farcaster.xyz

# Optional - Frame-specific URL
NEXT_PUBLIC_FRAME_URL=https://yourdomain.com/frame
```

### 2. Deploy the Application

```bash
# Install dependencies
npm install

# Build
npm run build

# Deploy (example: Vercel)
vercel --prod
```

### 3. Test in Warpcast

1. Create a cast with your frame URL: `https://yourdomain.com/frame`
2. Warpcast will detect the frame meta tags
3. The frame will render with interactive buttons
4. Test all interactions:
   - Play button
   - Answer submissions
   - Leaderboard view
   - Profile view
   - Share functionality

## Frame Specification

### Meta Tags

The frame uses these meta tags (defined in `/frame/page.tsx`):

```html
<meta name="fc:frame" content="vNext" />
<meta name="fc:frame:image" content="https://yourdomain.com/api/frame/image/home" />
<meta name="fc:frame:button:1" content="Play Trivia" />
<meta name="fc:frame:button:2" content="Leaderboard" />
<meta name="fc:frame:button:3" content="My Profile" />
<meta name="fc:frame:post_url" content="https://yourdomain.com/api/frame" />
```

### Image Requirements

- **Dimensions**: 1200x630px (1.91:1 aspect ratio)
- **Format**: PNG or JPEG
- **Size**: < 1MB recommended
- **Content**: Clear, readable text at social media thumbnail sizes

## API Reference

### POST /api/frame

Main frame handler that routes button clicks.

**Request Body:**
```json
{
  "untrustedData": {
    "fid": 12345,
    "buttonIndex": 1,
    "castId": {
      "fid": 12345,
      "hash": "0x..."
    },
    "timestamp": 1234567890
  },
  "trustedData": {
    "messageBytes": "0x..."
  }
}
```

**Response:**
```json
{
  "image": "https://yourdomain.com/api/frame/image/game",
  "buttons": [
    { "label": "Answer A", "action": "post" },
    { "label": "Answer B", "action": "post" },
    { "label": "Answer C", "action": "post" },
    { "label": "Answer D", "action": "post" }
  ],
  "post_url": "https://yourdomain.com/api/frame/submit"
}
```

### POST /api/frame/submit

Answer submission handler.

**Request Body:** Same as POST /api/frame

**Response:** Frame response with correct/incorrect feedback

## Analytics

The frame tracks these events:

- **Views**: When frame is displayed
- **Button Clicks**: Which buttons users click
- **Answer Submissions**: User answers (correct/incorrect)
- **Shares**: When users share the frame

Tracked in `frameGameService.ts` - integrate with your analytics service.

## Security

### Signature Validation

In production, validate frame signatures:

```typescript
import { validateFrameMessage } from '@/lib/frameUtils';

const validation = await validateFrameMessage(trustedData);
if (!validation.valid) {
  return error response;
}
```

Uses Farcaster Hub to verify the message came from a real Farcaster user.

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
const RATE_LIMITS = {
  answersPerDay: 50,
  viewsPerHour: 100,
};
```

## Viral Growth Features

### Share Button

Encourage sharing with compelling copy:

```typescript
const shareUrl = generateShareUrl({
  text: 'I just earned 0.5 USDC answering trivia on Zali! 🎮💰 Can you beat my score?',
  embeds: ['https://yourdomain.com/frame'],
});
```

### Leaderboard

Display top players to encourage competition:
- Show top 5-10 players
- Display rewards earned
- Highlight user's rank

### Profile Stats

Show achievements to encourage continued play:
- Total score
- Correct answers
- USDC earned
- Current rank
- Accuracy percentage

## Customization

### Styling Images

Edit image routes in `/api/frame/image/*` to customize:
- Colors and gradients
- Fonts and sizes
- Layout and spacing
- Branding elements

### Questions

Update `frameGameService.ts` to:
- Fetch from smart contract
- Add more question categories
- Implement difficulty levels
- Rotate questions

### Rewards

Configure in `frame.config.ts`:
```typescript
rewards: {
  correctAnswer: '0.1', // USDC per answer
  currency: 'USDC',
  decimals: 6,
}
```

## Troubleshooting

### Frame Not Rendering

1. Check meta tags are properly set
2. Verify image URLs are accessible
3. Test with Farcaster Frame Validator
4. Check button configuration (max 4 buttons)

### Images Not Loading

1. Verify Next.js `ImageResponse` is working
2. Check image dimensions (1200x630)
3. Ensure URLs are publicly accessible
4. Verify no CORS issues

### Button Clicks Not Working

1. Check `post_url` is correct
2. Verify endpoint handles POST requests
3. Check button action types are valid
4. Ensure proper error handling

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test frame endpoints
curl -X POST http://localhost:3000/api/frame \
  -H "Content-Type: application/json" \
  -d '{"untrustedData":{"fid":12345,"buttonIndex":1}}'
```

### Frame Validator

Use Farcaster's frame validator:
- https://warpcast.com/~/developers/frames

### Production Testing

1. Deploy to staging
2. Create test casts
3. Verify all interactions
4. Check analytics tracking
5. Test on different Farcaster clients

## Best Practices

### Performance
- Optimize image generation
- Cache frequently accessed data
- Use CDN for static assets
- Minimize API calls

### User Experience
- Clear, concise copy
- Obvious call-to-actions
- Fast response times
- Helpful error messages

### Security
- Always validate signatures in production
- Implement rate limiting
- Sanitize user inputs
- Monitor for abuse

### Analytics
- Track all interactions
- Monitor conversion rates
- A/B test different copy
- Optimize based on data

## Resources

- [Farcaster Frames Specification](https://docs.farcaster.xyz/learn/what-is-farcaster/frames)
- [Warpcast Frame Validator](https://warpcast.com/~/developers/frames)
- [Farcaster Hub Documentation](https://docs.farcaster.xyz/reference/hubble/httpapi)
- [Next.js Image Response API](https://nextjs.org/docs/app/api-reference/functions/image-response)

## Support

For issues or questions:
- Create an issue on GitHub
- Join our Discord
- Contact: support@zali.app

## License

MIT

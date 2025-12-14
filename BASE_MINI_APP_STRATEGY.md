# Base Mini App Strategy - Earn Developer Rewards

## What are Base Mini Apps?

Base Mini Apps are lightweight applications that run inside platforms like Farcaster and Coinbase Wallet. Developers earn rewards based on usage.

## Mini App Developer Rewards Program

**Reward Structure:**
- Active users earn you points
- Points convert to ETH rewards monthly
- Top developers earn 0.05-0.10 ETH per month
- The more engagement, the higher your ranking

## Converting Zali to a Base Mini App

### 1. Choose Your Platform

**Option A: Farcaster Frame (RECOMMENDED)**
- Largest Base user base
- Built-in viral distribution
- Easy to build
- Great for games

**Option B: Coinbase Wallet Mini App**
- More complex
- Smaller reach initially
- Better for finance apps

**Choose Farcaster Frames** for your trivia game!

### 2. Implement Farcaster Frame

Create `app/frames/trivia/route.ts`:

```typescript
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Invalid frame', { status: 400 });
  }

  // Your game logic here
  const questionNumber = message.button || 1;

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/og/question${questionNumber}" />
        <meta property="fc:frame:button:1" content="Answer A" />
        <meta property="fc:frame:button:2" content="Answer B" />
        <meta property="fc:frame:button:3" content="Answer C" />
        <meta property="fc:frame:button:4" content="Answer D" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/frames/trivia" />
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

export async function GET(req: NextRequest) {
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/images/trivia-start.png" />
        <meta property="fc:frame:button:1" content="Start Playing" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/frames/trivia" />
      </head>
      <body>
        <h1>Play Base Trivia - Earn Prizes!</h1>
      </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
```

### 3. Install Required Dependencies

```bash
cd frontend
npm install @coinbase/onchainkit viem
npm install @farcaster/hub-web
npm install sharp  # for image generation
```

### 4. Create Dynamic OG Images

Create `app/api/og/[question]/route.tsx`:

```typescript
import { ImageResponse } from 'next/og';

export async function GET(request: Request, { params }: { params: { question: string } }) {
  const questions = {
    question1: {
      text: "What blockchain is Base built on?",
      options: ["Ethereum", "Solana", "Polygon", "Avalanche"]
    },
    // Add more questions
  };

  const q = questions[params.question as keyof typeof questions] || questions.question1;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0052FF',
          fontSize: 40,
          fontWeight: 600,
        }}
      >
        <div style={{ marginTop: 40, padding: 40, textAlign: 'center', color: 'white' }}>
          {q.text}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40 }}>
          {q.options.map((opt, i) => (
            <div key={i} style={{ color: 'white', fontSize: 30, margin: 10 }}>
              {String.fromCharCode(65 + i)}. {opt}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

### 5. Register Your Frame

1. Go to https://warpcast.com/~/developers
2. Create a new Frame
3. Enter your frame URL: `https://yourdomain.com/frames/trivia`
4. Verify and publish

### 6. Viral Distribution Strategy

**Post on Farcaster:**
```
🎮 Play Base Trivia & Win Prizes! 🏆

Test your Web3 knowledge and earn real rewards!
💰 Prize pool: $50 USDC
🎯 5 quick questions
⚡ Takes 2 minutes

[Your Frame Here]

#BuildOnBase #BasedGames
```

**Share in Channels:**
- /base
- /builders
- /onchain
- /crypto

### 7. Track Mini App Performance

Monitor at:
- Farcaster analytics: https://warpcast.com/~/developers/analytics
- Your own analytics:

```typescript
// Add tracking
import { Analytics } from '@vercel/analytics/react';

// Track game plays
await fetch('/api/analytics', {
  method: 'POST',
  body: JSON.stringify({
    event: 'game_play',
    user: message.interactor.fid,
    timestamp: Date.now()
  })
});
```

## Expected Impact on Ranking

**Current Mini App Rewards:** $0
**After Frame launch:** $5-15/month (if you get 100+ plays)
**With viral growth:** $50-100/month (1000+ plays)

**Ranking Impact:**
- Immediate: +10-15% activity score
- After 1 week with users: +25-35% activity score
- Viral success: +50%+ activity score

## Mini App Deployment Checklist

- [ ] Install OnchainKit and Frame dependencies
- [ ] Create Frame route handler
- [ ] Design engaging OG images
- [ ] Implement game logic in Frame
- [ ] Connect to mainnet contracts
- [ ] Test Frame in Warpcast
- [ ] Register Frame at warpcast.com/~/developers
- [ ] Create launch post for Farcaster
- [ ] Share in Base channels
- [ ] Monitor analytics daily
- [ ] Iterate based on user feedback

## Advanced: Multiple Frames

Create multiple frames for different game modes:
1. `/frames/trivia` - Quick 5-question trivia
2. `/frames/daily-challenge` - Daily leaderboard
3. `/frames/prediction` - Prediction market
4. `/frames/tournament` - Weekly tournaments

Each frame = more engagement = higher rewards

## Optimization Tips

1. **Fast Response Times**
   - Use edge functions
   - Cache images
   - Optimize database queries

2. **Engaging Content**
   - Colorful, bold images
   - Clear call-to-actions
   - Show prizes prominently

3. **Share-ability**
   - Show scores at end
   - Encourage sharing results
   - Add "Challenge Friends" button

4. **Retention**
   - Daily rewards
   - Streak bonuses
   - Leaderboards

## Resources

- OnchainKit Docs: https://onchainkit.xyz
- Frame Validator: https://warpcast.com/~/developers/frames
- Farcaster Docs: https://docs.farcaster.xyz
- Base Docs: https://docs.base.org

---

**Timeline:** Complete Mini App setup in 2-3 days for immediate reward eligibility.

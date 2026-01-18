import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            🎮 Zali Trivia
          </h1>
          <p
            style={{
              fontSize: '40px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '30px',
            }}
          >
            Answer trivia questions and earn USDC rewards!
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <span>🎯 Free to Play</span>
            <span>💰 Real Rewards</span>
            <span>⚡ On Base</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

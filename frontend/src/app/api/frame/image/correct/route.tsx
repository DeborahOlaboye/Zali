import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');

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
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '60px',
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
          <div style={{ fontSize: '150px', marginBottom: '30px' }}>✅</div>
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            Correct!
          </h1>
          <p
            style={{
              fontSize: '48px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '30px',
            }}
          >
            You earned 0.1 USDC
          </p>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '36px',
              color: 'white',
            }}
          >
            🎉 Keep going to earn more!
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

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Sample question for demo (in production, fetch from contract)
const SAMPLE_QUESTION = {
  text: 'What is the native token of the Celo blockchain?',
  options: ['CELO', 'ETH', 'BTC', 'USDC'],
  reward: '0.1 USDC',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '40px',
          }}
        >
          <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
            🎮 Zali Trivia
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px 20px',
              borderRadius: '10px',
              color: 'white',
              fontSize: '28px',
            }}
          >
            Reward: {SAMPLE_QUESTION.reward}
          </div>
        </div>

        {/* Question */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '50px',
          }}
        >
          <h2
            style={{
              fontSize: '48px',
              color: '#2d3748',
              marginBottom: '40px',
              lineHeight: 1.3,
            }}
          >
            {SAMPLE_QUESTION.text}
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {SAMPLE_QUESTION.options.map((option, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f7fafc',
                  padding: '20px 30px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  fontSize: '36px',
                  color: '#4a5568',
                }}
              >
                <span
                  style={{
                    marginRight: '20px',
                    fontWeight: 'bold',
                    color: '#667eea',
                  }}
                >
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '24px',
          }}
        >
          Select your answer below
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

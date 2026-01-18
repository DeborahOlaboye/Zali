import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Sample profile data (in production, fetch from subgraph)
const SAMPLE_PROFILE = {
  totalScore: 85,
  correctAnswers: 85,
  totalAnswers: 120,
  totalRewards: '8.5',
  rank: 12,
  accuracy: 71,
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
          padding: '50px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
            color: 'white',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
            }}
          >
            👤 Your Profile
          </h1>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '50px',
            gap: '30px',
          }}
        >
          {/* Main Stats */}
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'space-around' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: '#ede9fe',
                padding: '30px 40px',
                borderRadius: '16px',
              }}
            >
              <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#667eea' }}>
                {SAMPLE_PROFILE.totalScore}
              </div>
              <div style={{ fontSize: '28px', color: '#6b7280' }}>Total Score</div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: '#d1fae5',
                padding: '30px 40px',
                borderRadius: '16px',
              }}
            >
              <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#059669' }}>
                {SAMPLE_PROFILE.totalRewards}
              </div>
              <div style={{ fontSize: '28px', color: '#6b7280' }}>USDC Earned</div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: '#fef3c7',
                padding: '30px 40px',
                borderRadius: '16px',
              }}
            >
              <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#f59e0b' }}>
                #{SAMPLE_PROFILE.rank}
              </div>
              <div style={{ fontSize: '28px', color: '#6b7280' }}>Rank</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              gap: '30px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                color: '#4b5563',
              }}
            >
              ✅ {SAMPLE_PROFILE.correctAnswers} correct answers
            </div>
            <div
              style={{
                fontSize: '32px',
                color: '#4b5563',
              }}
            >
              📊 {SAMPLE_PROFILE.accuracy}% accuracy
            </div>
            <div
              style={{
                fontSize: '32px',
                color: '#4b5563',
              }}
            >
              🎯 {SAMPLE_PROFILE.totalAnswers} total answers
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '28px',
          }}
        >
          Keep playing to climb the leaderboard!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

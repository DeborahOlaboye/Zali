import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Sample leaderboard data (in production, fetch from subgraph)
const SAMPLE_LEADERBOARD = [
  { rank: 1, address: '0x1234...5678', score: 150, rewards: '15.0' },
  { rank: 2, address: '0xabcd...efgh', score: 125, rewards: '12.5' },
  { rank: 3, address: '0x9876...4321', score: 100, rewards: '10.0' },
  { rank: 4, address: '0x5555...6666', score: 85, rewards: '8.5' },
  { rank: 5, address: '0x7777...8888', score: 70, rewards: '7.0' },
];

export async function GET() {
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
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            🏆 Top Players
          </h1>
        </div>

        {/* Leaderboard */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '40px',
            gap: '15px',
          }}
        >
          {SAMPLE_LEADERBOARD.map((player) => (
            <div
              key={player.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: player.rank <= 3 ? '#fef3c7' : '#f7fafc',
                padding: '20px 30px',
                borderRadius: '12px',
                border: '2px solid ' + (player.rank <= 3 ? '#fbbf24' : '#e2e8f0'),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: player.rank <= 3 ? '#f59e0b' : '#667eea',
                  }}
                >
                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                </div>
                <div style={{ fontSize: '32px', color: '#4a5568' }}>
                  {player.address}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>
                  {player.score}
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    color: '#059669',
                    background: '#d1fae5',
                    padding: '8px 16px',
                    borderRadius: '8px',
                  }}
                >
                  {player.rewards} USDC
                </div>
              </div>
            </div>
          ))}
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
          Play now to join the leaderboard!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

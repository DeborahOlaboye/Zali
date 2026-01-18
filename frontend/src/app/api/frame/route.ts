import { NextRequest, NextResponse } from 'next/server';

const FRAME_VERSION = 'vNext';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'home';

  return NextResponse.json({
    version: FRAME_VERSION,
    action,
    message: 'Zali Trivia Frame API',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;

    const fid = untrustedData?.fid;
    const buttonIndex = untrustedData?.buttonIndex || 1;

    // Route to appropriate handler based on button clicked
    switch (buttonIndex) {
      case 1:
        return handleStartGame(fid);
      case 2:
        return handleViewLeaderboard(fid);
      case 3:
        return handleViewProfile(fid);
      default:
        return handleHome();
    }
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json(
      { error: 'Invalid frame request' },
      { status: 400 }
    );
  }
}

function handleHome() {
  return NextResponse.json({
    image: `${APP_URL}/api/frame/image/home`,
    buttons: [
      { label: 'Play Trivia', action: 'post' },
      { label: 'Leaderboard', action: 'post' },
      { label: 'My Profile', action: 'post' },
    ],
    post_url: `${APP_URL}/api/frame`,
  });
}

function handleStartGame(fid: string) {
  return NextResponse.json({
    image: `${APP_URL}/api/frame/image/game?fid=${fid}`,
    buttons: [
      { label: 'Answer A', action: 'post' },
      { label: 'Answer B', action: 'post' },
      { label: 'Answer C', action: 'post' },
      { label: 'Answer D', action: 'post' },
    ],
    post_url: `${APP_URL}/api/frame/submit`,
  });
}

function handleViewLeaderboard(fid: string) {
  return NextResponse.json({
    image: `${APP_URL}/api/frame/image/leaderboard`,
    buttons: [
      { label: 'Back to Home', action: 'post' },
      { label: 'Play Now', action: 'post' },
    ],
    post_url: `${APP_URL}/api/frame`,
  });
}

function handleViewProfile(fid: string) {
  return NextResponse.json({
    image: `${APP_URL}/api/frame/image/profile?fid=${fid}`,
    buttons: [
      { label: 'Back to Home', action: 'post' },
      { label: 'Play Again', action: 'post' },
    ],
    post_url: `${APP_URL}/api/frame`,
  });
}

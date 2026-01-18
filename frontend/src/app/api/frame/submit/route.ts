import { NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface FrameValidationData {
  fid: number;
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
  inputText?: string;
  state?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData, trustedData } = body;

    // Validate frame data
    const validation = await validateFrameData(trustedData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid frame signature' },
        { status: 400 }
      );
    }

    const fid = untrustedData?.fid;
    const buttonIndex = untrustedData?.buttonIndex;
    const castId = untrustedData?.castId;

    // Log analytics
    await logFrameInteraction({
      fid,
      buttonIndex,
      castId,
      action: 'answer_submitted',
    });

    // Process answer (in production, submit to contract)
    const isCorrect = buttonIndex === 1; // Demo: first option is always correct

    if (isCorrect) {
      return NextResponse.json({
        image: `${APP_URL}/api/frame/image/correct?fid=${fid}`,
        buttons: [
          { label: 'Next Question', action: 'post' },
          { label: 'View Profile', action: 'post' },
          { label: 'Share', action: 'link', target: `https://warpcast.com/~/compose?text=I%20just%20answered%20correctly%20on%20Zali%20Trivia!&embeds[]=${encodeURIComponent(APP_URL)}` },
        ],
        post_url: `${APP_URL}/api/frame`,
      });
    } else {
      return NextResponse.json({
        image: `${APP_URL}/api/frame/image/incorrect?fid=${fid}`,
        buttons: [
          { label: 'Try Again', action: 'post' },
          { label: 'View Leaderboard', action: 'post' },
        ],
        post_url: `${APP_URL}/api/frame`,
      });
    }
  } catch (error) {
    console.error('Frame submit error:', error);
    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    );
  }
}

async function validateFrameData(trustedData: any): Promise<{ valid: boolean }> {
  // In production, validate the frame signature using Farcaster Hub
  // For now, return valid for testing
  return { valid: true };
}

async function logFrameInteraction(data: {
  fid: number;
  buttonIndex: number;
  castId: any;
  action: string;
}) {
  // Log to analytics service
  console.log('Frame interaction:', data);

  // In production, send to analytics service
  // Example: await analytics.track('frame_interaction', data);
}

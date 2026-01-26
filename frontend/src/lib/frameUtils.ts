/**
 * Farcaster Frame utilities for validation and analytics
 */

export interface FrameMessage {
  fid: number;
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
  inputText?: string;
  state?: string;
  timestamp: number;
}

export interface FrameValidationResult {
  valid: boolean;
  message?: FrameMessage;
  error?: string;
}

/**
 * Validate frame message signature
 * In production, this should verify the signature against Farcaster Hub
 */
export async function validateFrameMessage(
  trustedData: any
): Promise<FrameValidationResult> {
  try {
    // For now, basic validation
    // In production, use @farcaster/hub-nodejs to verify signature
    if (!trustedData || typeof trustedData !== 'object') {
      return {
        valid: false,
        error: 'Invalid trusted data format',
      };
    }

    // SECURITY: Implement actual signature verification
    // See GitHub Issue #149 for full implementation
    // Required: Validate Farcaster frame signatures using hub-nodejs
    // const hubClient = getHubClient();
    // const result = await hubClient.validateMessage(trustedData);

    return {
      valid: true,
    };
  } catch (error) {
    console.error('Frame validation error:', error);
    return {
      valid: false,
      error: 'Validation failed',
    };
  }
}

/**
 * Track frame analytics
 */
export async function trackFrameEvent(event: {
  type: 'view' | 'button_click' | 'answer_submit' | 'share';
  fid?: number;
  castId?: string;
  buttonIndex?: number;
  metadata?: Record<string, any>;
}) {
  try {
    // Log to console for development
    console.log('Frame event:', event);

    // In production, send to analytics service
    // Example integrations:
    // - Mixpanel
    // - Amplitude
    // - PostHog
    // - Custom analytics endpoint

    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Get frame metadata for embedding
 */
export function getFrameMetadata(config: {
  title: string;
  imageUrl: string;
  buttons: Array<{ label: string; action?: string; target?: string }>;
  postUrl: string;
  inputText?: string;
}) {
  const metadata: Record<string, string> = {
    'fc:frame': 'vNext',
    'fc:frame:image': config.imageUrl,
    'fc:frame:post_url': config.postUrl,
  };

  // Add buttons
  config.buttons.forEach((button, index) => {
    const buttonNum = index + 1;
    metadata[`fc:frame:button:${buttonNum}`] = button.label;

    if (button.action) {
      metadata[`fc:frame:button:${buttonNum}:action`] = button.action;
    }

    if (button.target) {
      metadata[`fc:frame:button:${buttonNum}:target`] = button.target;
    }
  });

  // Add input text if provided
  if (config.inputText) {
    metadata['fc:frame:input:text'] = config.inputText;
  }

  return metadata;
}

/**
 * Generate share URL for Farcaster
 */
export function generateShareUrl(config: {
  text: string;
  embeds?: string[];
}): string {
  const params = new URLSearchParams();
  params.set('text', config.text);

  if (config.embeds) {
    config.embeds.forEach((embed) => {
      params.append('embeds[]', embed);
    });
  }

  return `https://warpcast.com/~/compose?${params.toString()}`;
}

/**
 * Format Farcaster user profile URL
 */
export function getFarcasterProfileUrl(fid: number): string {
  return `https://warpcast.com/~/profiles/${fid}`;
}

/**
 * Parse frame button action
 */
export function parseButtonAction(
  buttonIndex: number,
  state?: string
): {
  action: 'start_game' | 'submit_answer' | 'view_leaderboard' | 'view_profile' | 'next_question' | 'share';
  data?: any;
} {
  // Parse based on button index and optional state
  // This is a simple implementation, can be more sophisticated
  const actions = [
    'start_game',
    'view_leaderboard',
    'view_profile',
    'submit_answer',
  ];

  return {
    action: actions[buttonIndex - 1] as any || 'start_game',
    data: state ? JSON.parse(state) : undefined,
  };
}

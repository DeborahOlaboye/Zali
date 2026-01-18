import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const initAnalytics = () => {
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: !IS_PRODUCTION,
      track_pageview: true,
      persistence: 'localStorage',
    });
  } else if (!IS_PRODUCTION) {
    console.log('Mixpanel token is missing. Analytics is disabled.');
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (MIXPANEL_TOKEN) {
    mixpanel.track(eventName, properties);
  } else if (!IS_PRODUCTION) {
    console.log('[Analytics Event]:', eventName, properties);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (MIXPANEL_TOKEN) {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  } else if (!IS_PRODUCTION) {
    console.log('[Analytics Identify]:', userId, traits);
  }
};

export const ANALYTICS_EVENTS = {
  WALLET_CONNECTED: 'Wallet Connected',
  GAME_COMPLETED: 'Game Completed',
  QUESTION_ANSWERED: 'Question Answered',
  FAUCET_USED: 'Faucet Used',
  ERROR_OCCURRED: 'Error Occurred',
  PAGE_VIEW: 'Page View',
};

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

export const initPostHog = () => {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    if (typeof window !== 'undefined' && key && key !== 'phc_dummy_key_change_me_in_production') {
        posthog.init(key, {
            api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
            loaded: (ph) => {
                if (import.meta.env.DEV) ph.debug(false);
            },
            autocapture: true,
            capture_pageview: false // We will handle this manually in App.tsx due to React Router
        });
    } else {
        console.log('[Analytics] PostHog telemetry disabled (no valid key provided). Running in stealth mode.');
    }
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

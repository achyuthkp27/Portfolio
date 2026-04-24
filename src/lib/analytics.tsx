import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type posthog from "posthog-js";

type PostHogClient = typeof posthog;

const AnalyticsContext = createContext<PostHogClient | null>(null);

export const initPostHog = async (): Promise<PostHogClient | null> => {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    if (typeof window !== 'undefined' && key && key !== 'phc_dummy_key_change_me_in_production') {
        const { default: posthogClient } = await import("posthog-js");
        posthogClient.init(key, {
            api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
            loaded: (ph) => {
                if (import.meta.env.DEV) ph.debug(false);
            },
            autocapture: false,
            capture_pageview: false // We will handle this manually in App.tsx due to React Router
        });
        return posthogClient;
    } else {
        console.log('[Analytics] PostHog telemetry disabled (no valid key provided). Running in stealth mode.');
        return null;
    }
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const [client, setClient] = useState<PostHogClient | null>(null);

    useEffect(() => {
        let mounted = true;

        void initPostHog().then((posthogClient) => {
            if (mounted) setClient(posthogClient);
        });

        return () => {
            mounted = false;
        };
    }, []);

    const value = useMemo(() => client, [client]);

    return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export const useAnalytics = () => useContext(AnalyticsContext);

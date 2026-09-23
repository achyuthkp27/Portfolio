import { createContext, useContext } from "react";
import type posthog from "posthog-js";

export type PostHogClient = typeof posthog;

export const AnalyticsContext = createContext<PostHogClient | null>(null);

export const initPostHog = async (): Promise<PostHogClient | null> => {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (typeof window !== "undefined" && key && key !== "phc_dummy_key_change_me_in_production") {
    const { default: posthogClient } = await import("posthog-js");
    posthogClient.init(key, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
      loaded: (ph) => {
        if (import.meta.env.DEV) ph.debug(false);
      },
      autocapture: false,
      capture_pageview: false, // We will handle this manually in App.tsx due to React Router
    });
    return posthogClient;
  } else {
    if (import.meta.env.DEV) console.info("[Analytics] PostHog disabled: no VITE_POSTHOG_KEY set.");
    return null;
  }
};

export const useAnalytics = () => useContext(AnalyticsContext);

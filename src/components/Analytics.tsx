import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { initPostHog, useAnalytics } from "@/lib/analyticsClient";
import { createPageviewTracker } from "@/lib/analyticsPageviews";

/**
 * Starts PostHog and sends one pageview per route: the current route as soon as PostHog is ready
 * (even when that is a while after landing), then each HashRouter route change. Renders nothing.
 */
const Analytics = () => {
  const { pathname } = useLocation();
  const posthog = useAnalytics();
  const track = useMemo(() => (posthog ? createPageviewTracker(posthog) : null), [posthog]);

  useEffect(() => {
    void initPostHog();
  }, []);

  useEffect(() => {
    track?.(pathname);
  }, [track, pathname]);

  return null;
};

export default Analytics;

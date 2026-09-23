import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "@/lib/analyticsClient";

/** Sends a PostHog pageview per route. Renders nothing; PostHog stays off without a key. */
const Analytics = () => {
  const location = useLocation();
  const posthog = useAnalytics();

  useEffect(() => {
    if (!posthog) return;
    posthog.capture("$pageview", {
      $current_url: window.location.href,
      $pathname: location.pathname,
    });
  }, [location, posthog]);

  return null;
};

export default Analytics;

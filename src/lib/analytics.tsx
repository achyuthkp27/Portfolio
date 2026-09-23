import { useEffect, useMemo, useState } from "react";
import { AnalyticsContext, initPostHog, type PostHogClient } from "@/lib/analyticsClient";

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

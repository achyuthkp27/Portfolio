/**
 * Kept so the app shell's wrapper stays stable. It no longer starts PostHog: <Analytics />
 * (its own lazy chunk, mounted shortly after the splash) does, keeping it off the critical path.
 * Read the client with `useAnalytics` from "@/lib/analyticsClient".
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

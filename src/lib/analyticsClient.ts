import { useSyncExternalStore } from "react";
import type posthog from "posthog-js";

export type PostHogClient = typeof posthog;

/** Used when VITE_POSTHOG_HOST is unset or empty (e.g. the repository variable isn't defined). */
const DEFAULT_HOST = "https://app.posthog.com";

let client: PostHogClient | null = null;
let pending: Promise<PostHogClient | null> | null = null;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Loads and starts PostHog once; later calls share the same promise. Resolves to null without a
 * key, and then posthog-js is never fetched. Privacy: nothing is stored on the device (memory
 * persistence, so no cookie banner is needed), Do Not Track is honoured, and only manual
 * pageviews are sent: no autocapture, session recording, surveys, feature flags or extra scripts.
 */
export const initPostHog = (): Promise<PostHogClient | null> => {
  if (pending) return pending;
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (typeof window === "undefined" || !key || key === "phc_dummy_key_change_me_in_production") {
    if (import.meta.env.DEV) console.info("[Analytics] PostHog disabled: no VITE_POSTHOG_KEY set.");
    pending = Promise.resolve(null);
    return pending;
  }
  pending = import("posthog-js").then(({ default: posthogClient }) => {
    posthogClient.init(key, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || DEFAULT_HOST,
      persistence: "memory",
      respect_dnt: true,
      autocapture: false,
      capture_pageview: false, // sent per route by <Analytics />, since HashRouter changes don't reload
      capture_pageleave: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_external_dependency_loading: true,
      advanced_disable_flags: true,
      person_profiles: "identified_only",
      // A handful of pageviews per visit: send each at once rather than on a 3s batch timer
      request_batching: false,
    });
    client = posthogClient;
    listeners.forEach((listener) => listener());
    return posthogClient;
  });
  return pending;
};

/** The PostHog client once <Analytics /> has started it, otherwise null. */
export const useAnalytics = () =>
  useSyncExternalStore(
    subscribe,
    () => client,
    () => null,
  );

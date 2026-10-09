export interface PageviewClient {
  capture: (event: string, properties?: Record<string, unknown>) => unknown;
}

/**
 * Sends one `$pageview` per route. A route is its pathname: re-renders, React StrictMode's double
 * effects and in-page `replace` navigations that only change the query (e.g. the Open source
 * section clearing `?scrollTo=` after "Back to projects") don't count as a new page.
 */
export function createPageviewTracker(client: PageviewClient) {
  let lastPath: string | null = null;
  return (pathname: string, url: string = window.location.href) => {
    if (pathname === lastPath) return false;
    lastPath = pathname;
    client.capture("$pageview", { $current_url: url, $pathname: pathname });
    return true;
  };
}

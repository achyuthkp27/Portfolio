/**
 * Maps an old BrowserRouter-style path (e.g. `/Portfolio/project/VoxOs`) to its
 * HashRouter equivalent (`/Portfolio/#/project/VoxOs`). Mirrors `mapToHashRoute`
 * in public/404.html. Returns null when the URL needs no change.
 */
export const toHashRoute = (pathname: string, search: string, base: string): string | null => {
  const root = base.endsWith("/") ? base : `${base}/`;
  if (!pathname.startsWith(root)) return null;
  const rest = pathname.slice(root.length).replace(/^\/+|\/+$/g, "");
  if (!rest || rest === "index.html") return null;
  return `${root}#/${rest}${search || ""}`;
};

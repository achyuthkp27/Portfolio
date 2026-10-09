import { createRoot } from "react-dom/client";
import { initMotionPreference } from "@/lib/motionPreference";
import { initPerfMode } from "@/hooks/useLowEndDevice";
import App from "./App.tsx";
import "./assets/fonts.css";
import "./index.css";
import { AnalyticsProvider } from "@/lib/analytics";
import { registerPreloadErrorReload } from "@/components/ErrorBoundary";
import { toHashRoute } from "@/lib/legacyPath";

initMotionPreference();
initPerfMode();
registerPreloadErrorReload();

// Old BrowserRouter deep links (e.g. /Portfolio/project/VoxOs) reach the app via the
// service worker's navigation fallback; move them onto the hash route before render.
if (!window.location.hash.startsWith("#/")) {
  const target = toHashRoute(window.location.pathname, window.location.search, import.meta.env.BASE_URL);
  if (target) window.history.replaceState(null, "", target);
}

createRoot(document.getElementById("root")!).render(
  <AnalyticsProvider>
    <App />
  </AnalyticsProvider>,
);

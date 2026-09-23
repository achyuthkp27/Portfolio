import { createRoot } from "react-dom/client";
import { initMotionPreference } from "@/lib/motionPreference";
import App from "./App.tsx";
import "./index.css";
import { AnalyticsProvider } from "@/lib/analytics";

initMotionPreference();

createRoot(document.getElementById("root")!).render(
  <AnalyticsProvider>
    <App />
  </AnalyticsProvider>,
);

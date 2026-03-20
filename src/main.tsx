import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AnalyticsProvider, initPostHog } from "@/lib/analytics";

initPostHog();

createRoot(document.getElementById("root")!).render(
    <AnalyticsProvider>
        <App />
    </AnalyticsProvider>
);

import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests against the real production build, served the way GitHub Pages serves it.
 * Catches failures unit tests can't, like a bundle that builds but renders a blank page.
 */
const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}/Portfolio/`,
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/Portfolio/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

import { chromium } from "@playwright/test";
const out="/private/tmp/claude-501/-Users-achyuthkp-Projects-Portfolio/565f1245-3219-4cc6-ac0d-2982cfdbb306/scratchpad/shots3";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:8080/", { waitUntil: "networkidle" }); await page.waitForTimeout(5000);
const t = await page.evaluate(() => document.body.scrollHeight); for (let y = 0; y < t + 1000; y += 500) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(40); }
await page.evaluate(() => { const g = document.querySelector("#about .grid"); window.scrollTo(0, g.getBoundingClientRect().top + scrollY + 560); }); await page.waitForTimeout(2500);
await page.locator("#about .bg-emerald-400").last().screenshot({ path: `${out}/plus-a.png` });
await page.waitForTimeout(1800);
await page.locator("#about .bg-emerald-400").last().screenshot({ path: `${out}/plus-b.png` });
await browser.close();

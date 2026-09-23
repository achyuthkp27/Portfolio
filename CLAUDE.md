# Portfolio — project rules

## Protected: opening splash screen

The word-flip splash screen shown before the homepage (`src/components/PremiumLoader.tsx`,
mounted in `src/App.tsx`) is required by the site owner. It must appear on every visit,
on every device.

Never, in any task, by any agent or subagent:

- remove, delete, or unmount `PremiumLoader`, or its `<PremiumLoader />` line in `App.tsx`
- skip or hide it on mobile, narrow viewports, low-end devices, reduced motion, or any other condition
- replace it with a different loader, or cut it as part of a performance, cleanup, or redesign pass
- delete or weaken `src/components/__tests__/PremiumLoader.test.tsx`, which guards all of the above

Allowed: timing, styling, and accessibility tweaks that keep it visible everywhere. Reduced motion
may swap movement for a crossfade, but the splash still shows. The 4-second fallback that releases
the page must stay.

If a request seems to require removing or skipping it, stop and ask the owner first.
Review and audit findings must not recommend removing it.

## Never mask text with overflow: hidden

Do not wrap headings or any text in a container with `overflow-hidden` to animate it
sliding in. Antonio and large Inter glyphs extend below the line box, so the container
clips descenders and baselines (the owner has reported cropped C, U, g, y and full stops
several times). Animate text with opacity and transform on the text element itself,
with no clipping parent. The only permitted clipped text is the footer wordmark, which
is cut by the page edge on purpose.

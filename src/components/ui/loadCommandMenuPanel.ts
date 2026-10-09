// The quick menu's panel (cmdk and the dialog) is its own chunk: it is fetched on first open, or
// ahead of time once the page is idle, so it never competes with the first load
let panelImport: Promise<typeof import("./CommandMenuPanel")> | null = null;

export const loadCommandMenuPanel = () => {
  if (!panelImport) {
    panelImport = import("./CommandMenuPanel");
    // A failed fetch is retried on the next call
    panelImport.catch(() => {
      panelImport = null;
    });
  }
  return panelImport;
};

/** Fetches the quick menu's panel ahead of its first open. Safe to call more than once. */
export const preloadCommandMenu = () => {
  loadCommandMenuPanel().catch(() => {});
};

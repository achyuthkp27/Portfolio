import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommandMenu } from "../CommandMenu";
import { openCommandMenu } from "@/lib/shortcuts";

// The real panel pulls in cmdk; a stand-in with the same contract (autofocused input, a command)
// is enough to check the open state, focus return, and the command running after close
vi.mock("../CommandMenuPanel", () => ({
  default: ({ runCommand, onClose }: { runCommand: (c: () => void) => void; onClose: () => void }) => (
    <div role="dialog" aria-modal="true" data-command-menu>
      <input aria-label="Where to?" autoFocus />
      <button type="button" onClick={() => runCommand(() => document.body.setAttribute("data-ran", "yes"))}>
        Run
      </button>
      <button type="button" onClick={onClose}>
        Backdrop
      </button>
    </div>
  ),
}));

const pressMetaK = () => fireEvent.keyDown(document, { key: "k", metaKey: true });
const pressEscape = () => fireEvent.keyDown(document, { key: "Escape" });

describe("CommandMenu", () => {
  beforeEach(() => {
    document.body.removeAttribute("data-ran");
  });

  it("opens on the first ⌘K and returns focus to the element focused before it on Escape", async () => {
    render(
      <>
        <button type="button">About</button>
        <CommandMenu />
      </>,
    );
    const about = screen.getByRole("button", { name: "About" });
    about.focus();

    act(() => pressMetaK());
    const input = await screen.findByLabelText("Where to?");
    expect(document.activeElement).toBe(input);

    act(() => pressEscape());
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(about);
  });

  it("falls back to the nav's ⌘K button when the opener is gone", async () => {
    const page = (withOpener: boolean) => (
      <>
        <button type="button" aria-label="Open quick menu (Command K)" />
        {withOpener && <button type="button">Temporary</button>}
        <CommandMenu />
      </>
    );
    const { rerender } = render(page(true));
    screen.getByRole("button", { name: "Temporary" }).focus();
    act(() => openCommandMenu());
    await screen.findByLabelText("Where to?");

    rerender(page(false));
    act(() => pressEscape());
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Open quick menu/ }));
  });

  it("runs a chosen command only after the menu has closed", async () => {
    render(<CommandMenu />);
    act(() => pressMetaK());
    const run = await screen.findByRole("button", { name: "Run" });
    act(() => fireEvent.click(run));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.getAttribute("data-ran")).toBe("yes");
  });
});

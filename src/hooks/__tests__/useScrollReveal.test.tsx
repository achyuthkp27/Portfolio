import { useRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { useScrollReveal } from "../useScrollReveal";

const Page = ({ children }: { children: React.ReactNode }) => {
  const root = useRef<HTMLDivElement>(null);
  useScrollReveal(root);
  return <div ref={root}>{children}</div>;
};

const LONG =
  "The card, payment, and alerting systems I have built at a bank, then AI shipped there and on my own time.";

describe("useScrollReveal", () => {
  afterEach(() => {
    window.localStorage.removeItem("motion");
  });

  it("hides the split units from screen readers and keeps one readable copy", () => {
    const { container } = render(
      <Page>
        <p data-testid="short">Years in engineering</p>
        <p data-testid="long">{LONG}</p>
      </Page>,
    );

    for (const id of ["short", "long"]) {
      const el = container.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
      const original = id === "short" ? "Years in engineering" : LONG;
      expect(el.classList.contains("reveal-split")).toBe(true);
      expect(el.hasAttribute("aria-label")).toBe(false);

      const hidden = el.querySelectorAll("[aria-hidden='true']");
      expect(hidden).toHaveLength(1);
      expect(hidden[0].tagName).toBe("SPAN");
      expect(hidden[0].parentElement).toBe(el);
      // Every animated unit lives inside the hidden wrapper
      expect(el.querySelectorAll(".rv-u").length).toBeGreaterThan(0);
      expect(hidden[0].querySelectorAll(".rv-u")).toHaveLength(el.querySelectorAll(".rv-u").length);

      const copies = el.querySelectorAll(".sr-only");
      expect(copies).toHaveLength(1);
      expect(copies[0].parentElement).toBe(el);
      expect(copies[0].textContent).toBe(original);
      // The visible units spell the same text as the copy
      expect(hidden[0].textContent).toBe(copies[0].textContent);
    }

    const short = container.querySelector('[data-testid="short"]')!;
    expect(short.querySelectorAll(".rv-u")).toHaveLength("Yearsinengineering".length);
  });

  it("leaves links, mixed content and data-no-split text untouched", () => {
    const { container } = render(
      <Page>
        <p data-testid="mixed">
          Read <a href="#x">the case study</a> now
        </p>
        <a href="#y" data-testid="link">
          Open
        </a>
        <p data-testid="nosplit" data-no-split>
          Static words
        </p>
      </Page>,
    );
    for (const id of ["mixed", "link", "nosplit"]) {
      const el = container.querySelector(`[data-testid="${id}"]`)!;
      expect(el.querySelector(".rv-u, .sr-only, [aria-hidden]")).toBeNull();
    }
    expect(container.querySelector('[data-testid="mixed"] a')?.textContent).toBe("the case study");
  });

  it("does not split anything when motion is off", () => {
    window.localStorage.setItem("motion", "off");
    const { container } = render(
      <Page>
        <p data-testid="p">Who I am</p>
      </Page>,
    );
    const el = container.querySelector('[data-testid="p"]')!;
    expect(el.innerHTML).toBe("Who I am");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });
});

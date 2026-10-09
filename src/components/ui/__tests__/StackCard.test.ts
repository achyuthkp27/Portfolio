import { describe, expect, it } from "vitest";
import { uncoveredScroll } from "../StackCard";

// A 900px viewport; a card in flow at 10000 pinning at 76, the next card in flow at 10900
const base = { viewport: 900, cardTop: 10000, pin: 76, nextTop: 10900 };

describe("uncoveredScroll", () => {
  it("leaves a control that is already clear where it is", () => {
    // Pinned control 700..740 in the card shows at 776..816; the next card reaches it after scrollY 10076
    expect(uncoveredScroll({ ...base, current: 9950, focusTop: 10700, focusBottom: 10740 })).toBe(9950);
  });

  it("scrolls back to the last position where the next card has not reached the control", () => {
    const y = uncoveredScroll({ ...base, current: 10300, focusTop: 10700, focusBottom: 10740 });
    // Next card's screen top is 10900 - y; the control's bottom on screen is 76 + 740 = 816, plus the gap
    expect(y).toBe(10900 - 76 - 740 - 8);
  });

  it("scrolls forward when the control is below the viewport", () => {
    expect(uncoveredScroll({ ...base, current: 9000, focusTop: 10700, focusBottom: 10740 })).toBe(10740 + 8 - 900);
  });

  it("keeps a control near the top of a tall card below the nav", () => {
    // A card taller than the viewport pins higher, so its top rows leave the screen once pinned
    const y = uncoveredScroll({
      ...base,
      pin: -300,
      nextTop: 11300,
      current: 10600,
      focusTop: 10100,
      focusBottom: 10140,
    });
    expect(y).toBe(10100 - 76 - 8);
  });

  it("works for the last card", () => {
    expect(uncoveredScroll({ ...base, nextTop: Infinity, current: 20000, focusTop: 10700, focusBottom: 10740 })).toBe(
      20000,
    );
  });
});

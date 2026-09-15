import { describe, expect, it } from "vitest";
import { webcrypto } from "node:crypto";
import { counterFor, generateTotp } from "../totp";

// RFC 6238 Appendix B test vectors (SHA-1, secret "12345678901234567890")
const SECRET = new TextEncoder().encode("12345678901234567890");
const VECTORS: [number, string][] = [
  [59, "94287082"],
  [1111111109, "07081804"],
  [1111111111, "14050471"],
  [1234567890, "89005924"],
  [2000000000, "69279037"],
  [20000000000, "65353130"],
];

describe("generateTotp", () => {
  if (!globalThis.crypto?.subtle) {
    Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
  }

  it.each(VECTORS)("matches the RFC 6238 vector at T=%i", async (seconds, expected) => {
    await expect(generateTotp(SECRET, counterFor(seconds * 1000), 8)).resolves.toBe(expected);
  });

  it("pads six-digit codes with leading zeros", async () => {
    const code = await generateTotp(SECRET, counterFor(1111111109 * 1000), 6);
    expect(code).toBe("081804");
  });
});

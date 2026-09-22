/**
 * RFC 6238 TOTP (HMAC-SHA1, 30 s step, 6 digits) using Web Crypto.
 * Used by the case-study demo; the secret is a public demo value.
 */
export const TOTP_STEP_SECONDS = 30;

export const counterFor = (unixMs: number) => Math.floor(unixMs / 1000 / TOTP_STEP_SECONDS);

export async function generateTotp(secret: Uint8Array, counter: number, digits = 6): Promise<string> {
  const message = new ArrayBuffer(8);
  const view = new DataView(message);
  // 64-bit big-endian counter; high word stays zero for any realistic date
  view.setUint32(0, Math.floor(counter / 2 ** 32));
  view.setUint32(4, counter >>> 0);

  // Copy into a plain ArrayBuffer-backed view, which is what Web Crypto's types require
  const keyBytes = Uint8Array.from(secret);
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, message));

  // RFC 4226 dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];

  return String(binary % 10 ** digits).padStart(digits, "0");
}

export const isTotpSupported = () => typeof crypto !== "undefined" && typeof crypto.subtle?.importKey === "function";

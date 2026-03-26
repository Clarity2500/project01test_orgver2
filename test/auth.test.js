const { describe, expect, it } = require("vitest");
const {
  clearSessionCookie,
  hashPassword,
  parseCookies,
  sessionCookie,
  verifyPassword
} = require("../src/auth");

describe("auth helpers", () => {
  it("hashes and verifies passwords", () => {
    const hash = hashPassword("super-secret");
    expect(verifyPassword("super-secret", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("parses cookie headers", () => {
    const cookies = parseCookies("session_token=abc123; theme=light");
    expect(cookies.session_token).toBe("abc123");
    expect(cookies.theme).toBe("light");
  });

  it("creates and clears session cookie strings", () => {
    expect(sessionCookie("abc")).toContain("session_token=abc");
    expect(clearSessionCookie()).toContain("Max-Age=0");
  });
});
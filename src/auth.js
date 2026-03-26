const crypto = require("node:crypto");

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, expectedHash] = storedHash.split(":");
  const actualHash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = Buffer.from(actualHash, "hex");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function createSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

function parseCookies(cookieHeader) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce((acc, pair) => {
    const [rawKey, ...rawValueParts] = pair.split("=");
    if (!rawKey) {
      return acc;
    }

    const key = rawKey.trim();
    const value = rawValueParts.join("=").trim();
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function buildCookie(name, value, maxAgeSeconds) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function sessionCookie(token) {
  return buildCookie("session_token", token, 60 * 60 * 24 * 7);
}

function clearSessionCookie() {
  return buildCookie("session_token", "", 0);
}

module.exports = {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  normalizeEmail,
  parseCookies,
  sessionCookie,
  verifyPassword
};

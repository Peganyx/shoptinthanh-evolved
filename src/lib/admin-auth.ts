import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "stt_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours
const SESSION_NAMESPACE = "shoptinthanh-admin-session:v1";

function configuredSecret() {
  const raw = process.env.ADMIN_SECRET?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function secureCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

function sessionToken(secret: string) {
  return createHash("sha256")
    .update(`${SESSION_NAMESPACE}:${secret}`)
    .digest("hex");
}

function requestUsesHttps(req: NextRequest) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedProto?.toLowerCase().includes("https")) {
    return true;
  }
  return req.nextUrl.protocol === "https:";
}

export function adminSecretIsValid(input: string) {
  const secret = configuredSecret();
  if (!secret || !input) {
    return false;
  }
  return secureCompare(secret, input);
}

export function isAdminAuthorized(req: NextRequest) {
  const secret = configuredSecret();
  if (!secret) {
    return false;
  }

  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookie && secureCompare(cookie, sessionToken(secret))) {
    return true;
  }

  const header = req.headers.get("x-admin-secret");
  if (header && secureCompare(header, secret)) {
    return true;
  }

  return false;
}

export function requireAdmin(req: NextRequest) {
  if (isAdminAuthorized(req)) {
    return null;
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function setAdminSession(response: NextResponse, req: NextRequest) {
  const secret = configuredSecret();
  if (!secret) {
    return;
  }

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken(secret),
    httpOnly: true,
    sameSite: "lax",
    secure: requestUsesHttps(req),
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });
}

export function clearAdminSession(response: NextResponse, req: NextRequest) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: requestUsesHttps(req),
    maxAge: 0,
    path: "/",
  });
}

export function hasAdminSecretConfigured() {
  return Boolean(configuredSecret());
}

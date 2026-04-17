export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  adminSecretIsValid,
  clearAdminSession,
  hasAdminSecretConfigured,
  isAdminAuthorized,
  setAdminSession,
} from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: isAdminAuthorized(req) });
}

export async function POST(req: NextRequest) {
  if (!hasAdminSecretConfigured()) {
    return NextResponse.json({ error: "ADMIN_SECRET is not configured" }, { status: 500 });
  }

  let secret = "";
  try {
    const body = await req.json();
    if (typeof body?.secret === "string") {
      secret = body.secret;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!adminSecretIsValid(secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  setAdminSession(response, req);
  return response;
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearAdminSession(response, req);
  return response;
}

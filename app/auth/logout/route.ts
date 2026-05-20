import { NextResponse } from "next/server";

import { revokeSession } from "@/lib/api/auth";
import { env } from "@/lib/env";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (session.refreshToken) {
    try {
      await revokeSession(session.refreshToken);
    } catch {
      // Best-effort revocation
    }
  }

  session.destroy();

  return NextResponse.redirect(new URL("/", env.MARKETING_URL));
}

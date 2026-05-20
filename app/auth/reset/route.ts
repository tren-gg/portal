import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getPkceSession, getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  session.destroy();

  const pkce = await getPkceSession();
  pkce.destroy();

  return NextResponse.redirect(
    new URL("/auth/sign-in?error=Session+expired.+Please+sign+in+again.", env.APP_URL),
  );
}

import { NextRequest, NextResponse } from "next/server";

import { exchangeCode } from "@/lib/api/auth";
import { getMe } from "@/lib/api/me";
import { env } from "@/lib/env";
import { getSafeNextPath, getSafePlan } from "@/lib/redirects";
import { getPkceSession, getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=Missing+authorization+code", env.APP_URL),
    );
  }

  const pkce = await getPkceSession();

  if (!pkce.verifier || pkce.state !== state) {
    pkce.destroy();
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=Invalid+state+parameter", env.APP_URL),
    );
  }

  const verifier = pkce.verifier;
  const next = getSafeNextPath(pkce.next);
  const plan = getSafePlan(pkce.plan);
  pkce.destroy();

  let tokens;
  try {
    tokens = await exchangeCode(code, verifier);
  } catch {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=Sign-in+failed.+Please+try+again.", env.APP_URL),
    );
  }

  const session = await getSession();
  session.accessToken = tokens.access_token;
  session.refreshToken = tokens.refresh_token;
  session.accessExpiresAt = tokens.access_expires_at;
  session.refreshExpiresAt = tokens.refresh_expires_at;

  try {
    const me = await getMe();
    session.userId = me.user.id;
    session.email = me.user.email;
  } catch {
    session.userId = "";
    session.email = "";
  }

  await session.save();

  if (next === "/subscribe" && plan) {
    return NextResponse.redirect(new URL(`/subscribe?plan=${encodeURIComponent(plan)}`, env.APP_URL));
  }

  return NextResponse.redirect(new URL(next ?? "/dashboard", env.APP_URL));
}

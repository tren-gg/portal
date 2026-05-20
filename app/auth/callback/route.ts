import { NextRequest, NextResponse } from "next/server";

import { exchangeCode } from "@/lib/api/auth";
import type { MeResponse } from "@/lib/api/types";
import { env } from "@/lib/env";
import { getSafeNextPath, getSafePlan } from "@/lib/redirects";
import { getPkceSession, getSession } from "@/lib/session";

async function getMeWithAccessToken(accessToken: string): Promise<MeResponse> {
  const res = await fetch(`${env.API_URL}/v1/me`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Profile lookup failed with ${res.status}`);
  }

  return res.json();
}

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
  let me;
  try {
    tokens = await exchangeCode(code, verifier);
    me = await getMeWithAccessToken(tokens.access_token);
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
  session.userId = me.user.id;
  session.email = me.user.email;
  await session.save();

  if (next === "/subscribe" && plan) {
    return NextResponse.redirect(new URL(`/subscribe?plan=${encodeURIComponent(plan)}`, env.APP_URL));
  }

  return NextResponse.redirect(new URL(next ?? "/dashboard", env.APP_URL));
}

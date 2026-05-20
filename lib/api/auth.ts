import { env } from "@/lib/env";
import type { EmailStartRequest, EmailStartResponse, TokenResponse } from "./types";

export async function startEmailFlow(email: string, params: {
  codeChallenge: string;
  state: string;
}): Promise<EmailStartResponse> {
  const body: EmailStartRequest = {
    response_type: "code",
    client_id: env.CLIENT_ID,
    redirect_uri: `${env.APP_URL}/auth/callback`,
    code_challenge: params.codeChallenge,
    code_challenge_method: "S256",
    state: params.state,
    scope: "openid profile email",
    email,
  };

  const res = await fetch(`${env.API_URL}/oauth/email/start`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? `Email start failed with ${res.status}`);
  }

  return res.json();
}

export async function exchangeCode(code: string, codeVerifier: string): Promise<TokenResponse> {
  const res = await fetch(`${env.API_URL}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: env.CLIENT_ID,
      redirect_uri: `${env.APP_URL}/auth/callback`,
      code_verifier: codeVerifier,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? `Token exchange failed with ${res.status}`);
  }

  return res.json();
}

export async function revokeSession(refreshToken: string): Promise<void> {
  await fetch(`${env.API_URL}/oauth/logout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });
}

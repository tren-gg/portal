import { env } from "@/lib/env";
import { getSession, type SessionData } from "@/lib/session";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: { error: string; message: string; details?: Record<string, string[]> } | null,
  ) {
    super(body?.message ?? `API responded with ${status}`);
    this.name = "ApiError";
  }
}

async function refreshTokens(session: SessionData): Promise<boolean> {
  const res = await fetch(`${env.API_URL}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: session.refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) return false;

  const data = await res.json();
  const sess = await getSession();
  sess.accessToken = data.access_token;
  sess.refreshToken = data.refresh_token;
  sess.accessExpiresAt = data.access_expires_at;
  sess.refreshExpiresAt = data.refresh_expires_at;
  await sess.save();
  return true;
}

function isTokenExpiringSoon(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() - Date.now() < 60_000;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const session = await getSession();
  const hasSession = !!session.accessToken;

  if (hasSession && isTokenExpiringSoon(session.accessExpiresAt)) {
    await refreshTokens(session);
  }

  const currentSession = hasSession ? await getSession() : null;

  const headers = new Headers(init?.headers);
  if (currentSession?.accessToken) {
    headers.set("authorization", `Bearer ${currentSession.accessToken}`);
  }
  headers.set("content-type", "application/json");

  let res = await fetch(`${env.API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (res.status === 401 && currentSession?.refreshToken) {
    const refreshed = await refreshTokens(currentSession);
    if (refreshed) {
      const retrySession = await getSession();
      const retryHeaders = new Headers(init?.headers);
      retryHeaders.set("authorization", `Bearer ${retrySession.accessToken}`);
      retryHeaders.set("content-type", "application/json");

      res = await fetch(`${env.API_URL}${path}`, {
        ...init,
        headers: retryHeaders,
        cache: "no-store",
      });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

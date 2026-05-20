import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

import { env } from "./env";

export type SessionData = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
  userId: string;
  email: string;
};

export type PkceData = {
  verifier: string;
  state: string;
  next: string | null;
  plan: string | null;
};

export function hasCompleteSession(session: Partial<SessionData>): session is SessionData {
  return (
    typeof session.accessToken === "string" &&
    session.accessToken.length > 0 &&
    typeof session.refreshToken === "string" &&
    session.refreshToken.length > 0 &&
    typeof session.accessExpiresAt === "string" &&
    session.accessExpiresAt.length > 0 &&
    typeof session.refreshExpiresAt === "string" &&
    session.refreshExpiresAt.length > 0 &&
    typeof session.userId === "string" &&
    session.userId.length > 0 &&
    typeof session.email === "string" &&
    session.email.length > 0
  );
}

const sessionOptions: SessionOptions = {
  password: env.SESSION_PASSWORD,
  cookieName: env.SESSION_COOKIE_NAME,
  cookieOptions: {
    secure: env.APP_URL.startsWith("https"),
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

const pkceOptions: SessionOptions = {
  password: env.SESSION_PASSWORD,
  cookieName: "tren_pkce",
  cookieOptions: {
    secure: env.APP_URL.startsWith("https"),
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 15 * 60,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getPkceSession() {
  const cookieStore = await cookies();
  return getIronSession<PkceData>(cookieStore, pkceOptions);
}
